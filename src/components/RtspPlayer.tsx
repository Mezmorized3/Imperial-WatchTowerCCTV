
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Maximize2, Volume2, VolumeX } from 'lucide-react';
import ReactHlsPlayer from 'react-hls-player';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
  const playerRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Function to connect to a real RTSP stream - updated to handle proxy issues
  const convertRtspToHls = (rtspUrl: string): string => {
    // For demo purposes - use a public HLS demo stream as fallback
    // In production, this should point to your actual streaming proxy service
    
    // Check if this is a test/demo URL that should use the fallback
    if (rtspUrl.includes('camera.example') || rtspUrl.includes('test-camera')) {
      return 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    }
    
    // For real RTSP streams, we would convert via a proxy service
    // This is a placeholder for your actual production streaming service
    // Note: Using client-side only for demo, in production use your secure backend
    try {
      const encodedUrl = encodeURIComponent(rtspUrl);
      return `https://demo-stream-proxy.example.com/stream?url=${encodedUrl}&format=hls`;
    } catch (err) {
      console.error("Error encoding RTSP URL:", err);
      return 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'; // Fallback to demo stream
    }
  };
  
  const initializeStream = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (rtspUrl.startsWith('rtsp://')) {
        // For RTSP streams, we need a proxy
        const url = convertRtspToHls(rtspUrl);
        setStreamUrl(url);
      } else if (rtspUrl.startsWith('http')) {
        // Direct HTTP(S) streams (HLS, DASH, etc.)
        setStreamUrl(rtspUrl);
      } else {
        // Unknown protocol - use demo stream as fallback
        console.warn("Unsupported protocol, using fallback stream");
        setStreamUrl('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize stream';
      setError(errorMessage);
      if (onError) onError(errorMessage);
      
      // Auto-fallback to demo stream after errors
      console.warn("Stream error, using fallback stream");
      setStreamUrl('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
    } finally {
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
    const errorMsg = 'Failed to load video stream. The proxy may be unavailable or refused to connect.';
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
                The streaming proxy refused to connect or is unavailable. This could be due to network restrictions or an invalid RTSP URL.
              </p>
            </AlertDescription>
          </Alert>
          <Button className="mt-4" variant="outline" size="sm" onClick={handleRetry}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Try Again ({retryCount})
          </Button>
          <div className="mt-4 text-xs text-gray-500">
            <p>RTSP URL: {rtspUrl}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-full aspect-video bg-black relative"
    >
      {/* Use ReactHlsPlayer for HLS streams when available */}
      {streamUrl.includes('.m3u8') ? (
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
      ) : (
        // Fallback to direct iframe for other proxy methods
        <iframe 
          src={streamUrl}
          width="100%" 
          height="100%" 
          allow="autoplay; encrypted-media; picture-in-picture"
          style={{ border: 'none' }}
          title="Camera Stream"
        />
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 flex justify-between items-center">
        <div className="font-mono truncate text-xs text-gray-400 max-w-sm">
          <span>{rtspUrl}</span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RtspPlayer;
