
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Volume2, Maximize2, Download, Save, RotateCcw } from 'lucide-react';
import RtspPlayer from '@/components/RtspPlayer';
import { useToast } from '@/hooks/use-toast';
import { imperialServerService } from '@/utils/imperialServerService';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getProperStreamUrl, testRtspConnection } from '@/utils/rtspUtils';

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
    return saved ? JSON.parse(saved) : [];
  });
  const { toast } = useToast();
  const playerRef = useRef<HTMLDivElement>(null);

  const isValidUrl = (url: string): boolean => {
    if (!url) return false;
    
    // Check if it's a valid URL format
    try {
      new URL(url);
      return true;
    } catch (e) {
      // If not a valid URL, check if it might be a local video file path
      // or another format that could be played
      return url.match(/\.(mp4|webm|ogg|mov|avi|flv|wmv|m3u8|mpd)$/i) !== null || 
             url.startsWith('rtsp://') || 
             url.startsWith('rtmp://') ||
             url.startsWith('/');
    }
  };

  const handlePlayStream = () => {
    if (streamUrl && isValidUrl(streamUrl)) {
      setIsPlaying(true);
      
      // Add to recent streams if not already there
      if (!recentStreams.includes(streamUrl)) {
        const updatedStreams = [streamUrl, ...recentStreams].slice(0, 5);
        setRecentStreams(updatedStreams);
        localStorage.setItem('recentStreams', JSON.stringify(updatedStreams));
      }
      
      if (saveToImperial) {
        // Log the stream to Imperial chest
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
        </div>
      </div>
      
      <div className="w-full aspect-video bg-black rounded-md overflow-hidden mb-4 flex items-center justify-center" ref={playerRef}>
        {isPlaying ? (
          <RtspPlayer 
            rtspUrl={streamUrl} 
            autoPlay={true}
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
