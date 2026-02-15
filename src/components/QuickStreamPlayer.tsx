import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Volume2, Maximize2, Download, Save, RotateCcw, Settings } from 'lucide-react';
import RtspPlayer from '@/components/RtspPlayer';
import { useToast } from '@/hooks/use-toast';
import { imperialServerService } from '@/utils/imperialServerService';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getProperStreamUrl, testRtspConnection } from '@/utils/rtspUtils';
import { safeJsonParse, sanitizeUrl, isValidStreamUrl } from '@/utils/safeStorage';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface QuickStreamPlayerProps {
  className?: string;
}

const QuickStreamPlayer: React.FC<QuickStreamPlayerProps> = ({ className }) => {
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingId, setRecordingId] = useState<string>('');
  const [saveToImperial, setSaveToImperial] = useState<boolean>(true);
  const [recentStreams, setRecentStreams] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentStreams');
    return safeJsonParse<string[]>(saved, []);
  });
  const [go2rtcUrl, setGo2rtcUrl] = useState<string>(() => localStorage.getItem('go2rtcUrl') || '');
  const [preferredEngine, setPreferredEngine] = useState<'native' | 'hlsjs' | 'videojs' | 'go2rtc'>(() => 
    localStorage.getItem('preferredStreamEngine') as any || 'hlsjs'
  );
  
  const { toast } = useToast();
  const playerRef = useRef<HTMLDivElement>(null);

  const isValidUrl = (url: string): boolean => {
    if (!url) return false;
    
    try {
      new URL(url);
      
      if (url.includes('youtube.com/watch') || 
          url.includes('youtu.be/') ||
          url.includes('youtube.com/embed')) {
        return true;
      }
      
      return true;
    } catch (e) {
      return url.match(/\.(mp4|webm|ogg|mov|avi|flv|wmv|m3u8|mpd)$/i) !== null || 
             url.startsWith('rtsp://') || 
             url.startsWith('rtmp://') ||
             url.startsWith('/');
    }
  };

  const handlePlayStream = () => {
    if (streamUrl && isValidUrl(streamUrl)) {
      setIsPlaying(true);
      
      if (!recentStreams.includes(streamUrl)) {
        const updatedStreams = [streamUrl, ...recentStreams].slice(0, 5);
        setRecentStreams(updatedStreams);
        localStorage.setItem('recentStreams', JSON.stringify(updatedStreams));
      }
      
      if (saveToImperial) {
        imperialServerService.logStreamAccess({
          url: streamUrl,
          timestamp: new Date().toISOString(),
          source: 'quick-stream'
        }).catch(err => console.error('Failed to log stream to Imperial chest:', err));
      }
    } else {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid stream URL",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStreamUrl(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePlayStream();
    }
  };
  
  const handleStartRecording = async () => {
    try {
      setIsLoading(true);
      
      if (!streamUrl) {
        toast({
          title: "Stream URL Required",
          description: "Please enter a stream URL first",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Starting Recording",
        description: "Saving stream to Imperial chest...",
      });
      
      const result = await imperialServerService.startRecording(streamUrl, 3600); // 1 hour max
      
      if (result.success) {
        setIsRecording(true);
        setRecordingId(result.recordingId);
        toast({
          title: "Recording Started",
          description: saveToImperial 
            ? "Stream is being recorded to Imperial chest" 
            : "Stream is being recorded locally",
        });
      } else {
        toast({
          title: "Recording Failed",
          description: result.error || "Could not start recording",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Recording Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStopRecording = async () => {
    try {
      setIsLoading(true);
      
      if (!recordingId) {
        setIsRecording(false);
        setIsLoading(false);
        return;
      }
      
      const result = await imperialServerService.stopRecording(recordingId);
      
      if (result.success) {
        toast({
          title: "Recording Stopped",
          description: `Recording saved to Imperial chest: ${result.filename || recordingId}`,
        });
        setIsRecording(false);
        setRecordingId('');
      } else {
        toast({
          title: "Stop Recording Failed",
          description: result.error || "Could not stop recording",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      toast({
        title: "Recording Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectRecentStream = (url: string) => {
    setStreamUrl(url);
    setIsPlaying(true);
  };

  const handleEngineChange = (engine: 'native' | 'hlsjs' | 'videojs' | 'go2rtc') => {
    setPreferredEngine(engine);
    localStorage.setItem('preferredStreamEngine', engine);
    
    toast({
      title: "Stream Engine Changed",
      description: `Using ${engine.toUpperCase()} for stream playback`,
    });
    
    if (isPlaying) {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }
  };

  const saveGo2rtcSettings = () => {
    localStorage.setItem('go2rtcUrl', go2rtcUrl);
    
    toast({
      title: "Settings Saved",
      description: "go2rtc server settings have been saved",
    });
    
    if (isPlaying && preferredEngine === 'go2rtc') {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }
  };

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <div className="text-sm text-gray-400 mb-2 flex justify-between items-center">
        <span>Preview and control any type of video stream</span>
        <div className="flex items-center space-x-2">
          <Label htmlFor="imperial-save" className="text-xs">Save to Imperial</Label>
          <Switch 
            id="imperial-save" 
            checked={saveToImperial}
            onCheckedChange={setSaveToImperial}
            className="data-[state=checked]:bg-scanner-primary"
          />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Stream Settings</h4>
                <div className="space-y-2">
                  <Label htmlFor="engine-select">Preferred Engine</Label>
                  <Select 
                    value={preferredEngine} 
                    onValueChange={(val) => handleEngineChange(val as any)}
                  >
                    <SelectTrigger id="engine-select">
                      <SelectValue placeholder="Select an engine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="native">Native (Browser)</SelectItem>
                      <SelectItem value="hlsjs">HLS.js</SelectItem>
                      <SelectItem value="videojs">Video.js</SelectItem>
                      <SelectItem value="go2rtc">go2rtc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {preferredEngine === 'go2rtc' && (
                  <div className="space-y-2">
                    <Label htmlFor="go2rtc-url">go2rtc Server URL</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="go2rtc-url"
                        placeholder="http://localhost:8554" 
                        value={go2rtcUrl}
                        onChange={(e) => setGo2rtcUrl(e.target.value)}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={saveGo2rtcSettings}
                      >
                        Save
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">
                      Address of your go2rtc server for efficient stream conversion
                    </p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="w-full aspect-video bg-black rounded-md overflow-hidden mb-4 flex items-center justify-center" ref={playerRef}>
        {isPlaying ? (
          <RtspPlayer 
            rtspUrl={streamUrl} 
            autoPlay={true}
            preferredEngine={preferredEngine}
            onError={() => {
              setIsPlaying(false);
              toast({
                title: "Stream Error",
                description: "Failed to connect to the stream",
                variant: "destructive",
              });
            }}
          />
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
            <span className="text-lg mb-4">No stream playing</span>
            <span className="text-sm opacity-60">Enter a stream URL below and click Play</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <Input
            type="text"
            placeholder="Enter any video stream URL (RTSP, HTTP, HLS, DASH, etc)..."
            value={streamUrl}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button 
            onClick={handlePlayStream}
            disabled={!streamUrl || isLoading}
            className="bg-scanner-primary hover:bg-scanner-primary/80"
          >
            <Play className="h-4 w-4 mr-2" />
            Play
          </Button>
        </div>
        
        <div className="flex gap-2 mt-2 justify-between">
          <div>
            {!isRecording ? (
              <Button 
                variant="outline" 
                onClick={handleStartRecording}
                disabled={!streamUrl || isLoading}
                className="text-red-500 border-red-500 hover:bg-red-500/10"
              >
                <div className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                Start Recording
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleStopRecording}
                disabled={isLoading}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Stop Recording
              </Button>
            )}
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => {
              if (playerRef.current && document.fullscreenElement !== playerRef.current) {
                playerRef.current.requestFullscreen().catch(err => {
                  console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
              }
            }}
            disabled={!isPlaying}
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
        </div>
        
        {recentStreams.length > 0 && (
          <Card className="mt-4 bg-scanner-dark/50 border-gray-700">
            <CardContent className="p-4">
              <Label className="text-xs text-gray-400 mb-2 block">Recent Streams</Label>
              <div className="flex flex-wrap gap-2">
                {recentStreams.map((url, index) => (
                  <Button 
                    key={index} 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs truncate max-w-[220px]"
                    onClick={() => handleSelectRecentStream(url)}
                  >
                    {url}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuickStreamPlayer;
