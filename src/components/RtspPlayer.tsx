
import React, { useState, useEffect } from 'react';
import ReactHlsPlayer from 'react-hls-player';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface RtspPlayerProps {
  rtspUrl: string;
  autoPlay?: boolean;
}

const RtspPlayer: React.FC<RtspPlayerProps> = ({ rtspUrl, autoPlay = true }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hlsUrl, setHlsUrl] = useState<string | null>(null);
  
  // In a real-world scenario, this would be your backend service endpoint
  // that handles RTSP to HLS conversion
  const getHlsStreamUrl = (rtspUrl: string): string => {
    // This is a simulated URL that in real implementation would point to your streaming server
    // For example: `https://your-streaming-service.com/stream?url=${encodeURIComponent(rtspUrl)}`
    
    // For demo purposes, we're using a sample HLS stream
    return 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
  };
  
  const initializeStream = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would make an API call to start the stream conversion
      setTimeout(() => {
        // For demonstration, we'll use a publicly available HLS test stream
        // In production, this would be the result of your RTSP-to-HLS conversion
        const streamUrl = getHlsStreamUrl(rtspUrl);
        setHlsUrl(streamUrl);
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setError('Failed to initialize stream conversion');
      setIsLoading(false);
    }
  };
  
  const handlePlayerError = () => {
    setError('Failed to load video stream. The stream may be offline or inaccessible.');
  };
  
  useEffect(() => {
    initializeStream();
  }, [rtspUrl]);
  
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-scanner-primary mb-4"></div>
          <p className="text-gray-400">Connecting to stream...</p>
          <p className="text-gray-500 text-sm mt-2 font-mono">{rtspUrl}</p>
        </div>
      </div>
    );
  }
  
  if (error || !hlsUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center max-w-md p-6">
          <AlertCircle className="h-12 w-12 text-scanner-danger mx-auto mb-4" />
          <p className="text-scanner-danger font-medium mb-2">Stream Error</p>
          <p className="text-gray-400 text-sm">{error || 'Failed to convert RTSP stream'}</p>
          <Button className="mt-4" variant="outline" size="sm" onClick={initializeStream}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full aspect-video bg-black relative">
      <ReactHlsPlayer
        src={hlsUrl}
        autoPlay={autoPlay}
        controls={true}
        width="100%"
        height="100%"
        className="absolute inset-0"
        onError={handlePlayerError}
        playerRef={undefined}
      />
      <div className="absolute bottom-0 left-0 p-2 bg-black/50 text-xs text-gray-400">
        <span className="font-mono">Original RTSP: {rtspUrl}</span>
      </div>
    </div>
  );
};

export default RtspPlayer;
