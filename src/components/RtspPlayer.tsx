
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Maximize2, Volume2, VolumeX, VideoOff, Video, DownloadCloud } from 'lucide-react';
import ReactHlsPlayer from 'react-hls-player';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { getProperStreamUrl, convertRtspToHls, startRecording, stopRecording } from '@/utils/rtspUtils';
import { useToast } from '@/hooks/use-toast';

interface RtspPlayerProps {
  rtspUrl: string;
  autoPlay?: boolean;
  onError?: (error: string) => void;
  onStreamReady?: () => void;
}

const RtspPlayer: React.FC<RtspPlayerProps> = ({ 
  rtspUrl, 
  autoPlay = true,
  onError,
  onStreamReady
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [videoType, setVideoType] = useState<'hls' | 'dash' | 'direct' | 'iframe'>('direct');
  const playerRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Generate a stable stream ID from the URL
  const streamId = btoa(rtspUrl).replace(/[/+=]/g, '').substring(0, 12);
  
  const detectStreamType = (url: string): 'hls' | 'dash' | 'direct' | 'iframe' => {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('.m3u8')) {
      return 'hls';
    } else if (lowerUrl.includes('.mpd')) {
      return 'dash';
    } else if (lowerUrl.startsWith('rtsp://')) {
      return 'iframe'; // RTSP needs conversion or iframe
    } else if (/\.(mp4|webm|ogg|mov)$/i.test(lowerUrl)) {
      return 'direct'; // Direct video files
    } else if (lowerUrl.startsWith('http') || lowerUrl.startsWith('https')) {
      // For HTTP URLs, check if they point to known video formats
      if (/\.(mp4|webm|ogg|mov|m3u8|mpd)$/i.test(lowerUrl)) {
        if (lowerUrl.includes('.m3u8')) return 'hls';
        if (lowerUrl.includes('.mpd')) return 'dash';
        return 'direct';
      }
      return 'iframe'; // Default to iframe for unknown HTTP content
    }
    
    return 'iframe'; // Default fallback
  };
  
  const initializeStream = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const type = detectStreamType(rtspUrl);
      setVideoType(type);
      
      if (type === 'hls' || type === 'direct') {
        // For HLS or direct video, use the URL directly
        setStreamUrl(rtspUrl);
      } else if (type === 'iframe') {
        // For RTSP or unknown formats that need conversion
        if (rtspUrl.startsWith('rtsp://')) {
          // Convert RTSP to HLS if needed
          const hlsUrl = await convertRtspToHls(rtspUrl);
          setStreamUrl(hlsUrl);
          setVideoType('hls');
        } else {
          // Use iframe for other formats
          setStreamUrl(rtspUrl);
        }
      }
      
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize stream';
      setError(errorMessage);
      if (onError) onError(errorMessage);
      setIsLoading(false);
    }
  };
  
  const toggleMute = () => {
    if (playerRef.current) {
      playerRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    initializeStream();
  };
  
  const toggleRecording = async () => {
    try {
      if (isRecording) {
        const success = await stopRecording(streamId);
        if (success) {
          setIsRecording(false);
          toast({
            title: "Recording stopped",
            description: "Video recording has been saved"
          });
        } else {
          throw new Error("Failed to stop recording");
        }
      } else {
        const success = await startRecording(streamId);
        if (success) {
          setIsRecording(true);
          toast({
            title: "Recording started",
            description: "Video is now being recorded"
          });
        } else {
          throw new Error("Failed to start recording");
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Recording operation failed';
      toast({
        title: "Recording Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };
  
  useEffect(() => {
    initializeStream();
    
    // Handle fullscreen change
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [rtspUrl]);
  
  // Handle video events
  const handleVideoError = () => {
    const errorMsg = 'Failed to load video stream.';
    setError(errorMsg);
    if (onError) onError(errorMsg);
  };
  
  const handleStreamReady = () => {
    if (onStreamReady) onStreamReady();
  };
  
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-scanner-primary mb-4"></div>
          <p className="text-gray-400">Connecting to stream...</p>
          <p className="text-gray-500 text-sm mt-2 font-mono truncate max-w-md">{rtspUrl}</p>
        </div>
      </div>
    );
  }
  
  if (error || !streamUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center max-w-md p-6">
          <AlertCircle className="h-12 w-12 text-scanner-danger mx-auto mb-4" />
          <Alert variant="destructive">
            <AlertTitle>Stream Error</AlertTitle>
            <AlertDescription>
              {error || 'Failed to connect to stream'}
              <p className="text-gray-500 text-xs mt-2">
                The stream could not be accessed. This could be due to network restrictions or an invalid URL.
              </p>
            </AlertDescription>
          </Alert>
          <Button className="mt-4" variant="outline" size="sm" onClick={handleRetry}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Try Again ({retryCount})
          </Button>
          <div className="mt-4 text-xs text-gray-500">
            <p>Original URL: {rtspUrl}</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Render the appropriate player based on video type
  const renderPlayer = () => {
    if (videoType === 'hls') {
      return (
        <ReactHlsPlayer
          src={streamUrl}
          autoPlay={autoPlay}
          controls={true}
          width="100%"
          height="100%"
          playerRef={playerRef}
          hlsConfig={{
            maxBufferLength: 30,
            maxMaxBufferLength: 60,
            liveSyncDurationCount: 3,
            debug: false,
          }}
          onError={handleVideoError}
          onCanPlay={handleStreamReady}
          muted={isMuted}
        />
      );
    } else if (videoType === 'direct') {
      // For direct video files (MP4, WebM, etc.)
      return (
        <video 
          ref={playerRef}
          src={streamUrl}
          autoPlay={autoPlay}
          controls={true}
          width="100%"
          height="100%"
          onError={handleVideoError}
          onCanPlay={handleStreamReady}
          muted={isMuted}
        />
      );
    } else {
      // Fallback to iframe for other formats
      return (
        <iframe 
          src={streamUrl}
          width="100%" 
          height="100%" 
          allow="autoplay; encrypted-media; picture-in-picture"
          style={{ border: 'none' }}
          title="Video Stream"
        />
      );
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-full aspect-video bg-black relative"
    >
      {renderPlayer()}
      
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 flex justify-between items-center">
        <div className="font-mono truncate text-xs text-gray-400 max-w-sm">
          <span>{rtspUrl}</span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
            onClick={toggleRecording}
            title={isRecording ? "Stop Recording" : "Start Recording"}
          >
            {isRecording ? 
              <VideoOff className="h-4 w-4 text-red-500" /> : 
              <Video className="h-4 w-4" />
            }
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
            onClick={toggleFullscreen}
            title="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RtspPlayer;
