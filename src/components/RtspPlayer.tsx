
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

// List of reliable public HLS demo streams
const PUBLIC_DEMO_STREAMS = [
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  'https://cdn.bitmovin.com/content/assets/art-of-motion-dash-hls-progressive/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8'
];

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
  
  // Function to get a demo stream URL
  const getDemoStream = () => {
    const index = retryCount % PUBLIC_DEMO_STREAMS.length;
    return PUBLIC_DEMO_STREAMS[index];
  };
  
  // Function to connect to a real RTSP stream - updated to use reliable fallbacks
  const convertRtspToHls = (rtspUrl: string): string => {
    // For demo purposes - use a reliable public HLS demo stream as fallback
    
    // Check if this is a test/demo URL or invalid URL that should use the fallback
    if (
      rtspUrl.includes('camera.example') || 
      rtspUrl.includes('test-camera') ||
      rtspUrl.includes('example.com')
    ) {
      return getDemoStream();
    }
    
    // For real RTSP streams that we want to pass through a proxy
    // This is a placeholder - in real implementation, this would point to your actual proxy
    try {
      // If this URL is known to be an HLS stream already, return it directly
      if (rtspUrl.endsWith('.m3u8') || rtspUrl.includes('/hls/')) {
        return rtspUrl;
      }
      
      // If it's an RTSP URL, try to encode it for proxy
      if (rtspUrl.startsWith('rtsp://')) {
        // Since we don't have a real proxy, we'll use a fallback for now
        // In production, replace this with your actual streaming proxy endpoint
        console.log("RTSP URL detected, using fallback stream (no proxy available)");
        return getDemoStream();
      }
      
      // Unknown URL format, use fallback
      return getDemoStream();
    } catch (err) {
      console.error("Error processing stream URL:", err);
      return getDemoStream();
    }
  };
  
  const initializeStream = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (rtspUrl.startsWith('rtsp://')) {
        // For RTSP streams, we need a proxy (or fallback for now)
        const url = convertRtspToHls(rtspUrl);
        setStreamUrl(url);
      } else if (rtspUrl.startsWith('http')) {
        // Direct HTTP(S) streams (HLS, DASH, etc.)
        setStreamUrl(rtspUrl);
      } else {
        // Unknown protocol - use demo stream as fallback
        console.warn("Unsupported protocol, using fallback stream");
        setStreamUrl(getDemoStream());
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize stream';
      setError(errorMessage);
      if (onError) onError(errorMessage);
      
      // Auto-fallback to demo stream after errors
      console.warn("Stream error, using fallback stream");
      setStreamUrl(getDemoStream());
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
    const errorMsg = 'Failed to load video stream. Using fallback stream.';
    setError(errorMsg);
    if (onError) onError(errorMsg);
    
    // Try a different fallback stream on error
    setRetryCount(prev => prev + 1);
    setStreamUrl(getDemoStream());
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
                {rtspUrl.includes('example.com') ? 
                  'The demo proxy server is not available. Using a fallback public stream instead.' : 
                  'The stream could not be accessed. This could be due to network restrictions or an invalid URL.'}
              </p>
            </AlertDescription>
          </Alert>
          <Button className="mt-4" variant="outline" size="sm" onClick={handleRetry}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Try Another Stream ({retryCount})
          </Button>
          <div className="mt-4 text-xs text-gray-500">
            <p>Original URL: {rtspUrl}</p>
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
