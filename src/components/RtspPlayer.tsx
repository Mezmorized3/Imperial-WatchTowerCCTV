
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Maximize2, Volume2, VolumeX, VideoOff, Video, Info } from 'lucide-react';
import ReactHlsPlayer from 'react-hls-player';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface RtspPlayerProps {
  rtspUrl: string;
  autoPlay?: boolean;
  onError?: (error: string) => void;
  onStreamReady?: () => void;
  preferredEngine?: 'native' | 'hlsjs' | 'videojs' | 'go2rtc';
}

const RtspPlayer: React.FC<RtspPlayerProps> = ({ 
  rtspUrl, 
  autoPlay = true,
  onError,
  onStreamReady,
  preferredEngine = 'hlsjs'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [videoType, setVideoType] = useState<'hls' | 'dash' | 'direct' | 'iframe' | 'youtube' | 'rtsp'>('direct');
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const playerRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    // Mock functionality - in a real app this would handle protocol conversion
    if (rtspUrl) {
      setStreamUrl(rtspUrl);
      setIsLoading(false);
    }
  }, [rtspUrl]);

  const handleError = () => {
    setError("Failed to load stream");
    if (onError) onError("Failed to load stream");
  };

  const toggleMute = () => {
    if (playerRef.current) {
      playerRef.current.muted = !playerRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const enterFullscreen = () => {
    if (containerRef.current && !document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    }
  };

  if (error) {
    return (
      <div ref={containerRef} className="flex items-center justify-center bg-black w-full h-full min-h-[200px]">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setError(null);
                setRetryCount(prev => prev + 1);
              }}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div ref={containerRef} className="flex items-center justify-center bg-black w-full h-full min-h-[200px]">
        <RefreshCw className="animate-spin h-8 w-8 text-white opacity-70" />
      </div>
    );
  }

  if (!streamUrl) {
    return (
      <div ref={containerRef} className="flex items-center justify-center bg-black w-full h-full min-h-[200px]">
        <div className="text-white opacity-70">No stream URL provided</div>
      </div>
    );
  }

  // Render the appropriate player based on video type
  return (
    <div 
      ref={containerRef} 
      className="relative w-full aspect-video bg-black overflow-hidden"
    >
      {videoType === 'hls' ? (
        <ReactHlsPlayer
          src={streamUrl}
          autoPlay={autoPlay}
          controls
          width="100%"
          height="auto"
          playerRef={playerRef as any}
          onError={handleError}
          onLoadStart={() => setIsLoading(true)}
          onCanPlay={() => {
            setIsLoading(false);
            if (onStreamReady) onStreamReady();
          }}
        />
      ) : (
        <video
          ref={playerRef}
          src={streamUrl}
          className="w-full h-full"
          autoPlay={autoPlay}
          controls
          playsInline
          muted={isMuted}
          onError={handleError}
          onLoadStart={() => setIsLoading(true)}
          onCanPlay={() => {
            setIsLoading(false);
            if (onStreamReady) onStreamReady();
          }}
        />
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity">
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={toggleMute}
          className="h-8 w-8 text-white"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={enterFullscreen}
          className="h-8 w-8 text-white"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default RtspPlayer;
