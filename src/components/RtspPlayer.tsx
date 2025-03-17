
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface RtspPlayerProps {
  rtspUrl: string;
  autoPlay?: boolean;
}

const RtspPlayer: React.FC<RtspPlayerProps> = ({ rtspUrl, autoPlay = true }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  
  // This would be your backend RTSP-to-HLS conversion service URL
  const convertRtspToHls = (rtspUrl: string): string => {
    // In a real implementation, this would point to your backend service
    // that converts RTSP to HLS for browser playback
    
    // Example: return `https://your-streaming-service.com/convert?rtsp=${encodeURIComponent(rtspUrl)}`;
    
    // For now, we'll use a direct approach - this won't work in browsers without a proper backend
    return rtspUrl;
  };
  
  const initializeStream = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert RTSP to a format browsers can handle
      const url = convertRtspToHls(rtspUrl);
      setStreamUrl(url);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to initialize stream conversion');
      setIsLoading(false);
    }
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
  
  if (error || !streamUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="text-center max-w-md p-6">
          <AlertCircle className="h-12 w-12 text-scanner-danger mx-auto mb-4" />
          <p className="text-scanner-danger font-medium mb-2">Stream Error</p>
          <p className="text-gray-400 text-sm">{error || 'Failed to connect to RTSP stream'}</p>
          <p className="text-gray-500 text-xs mt-2">
            RTSP streams require a specialized player or proxy service to be viewed in browsers.
          </p>
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
      {/* Use an iframe with VLC browser plugin approach - may require proper CORS configuration */}
      <iframe 
        src={`https://camerastream.io/play?url=${encodeURIComponent(rtspUrl)}`}
        width="100%" 
        height="100%" 
        allow="autoplay; encrypted-media; picture-in-picture"
        style={{ border: 'none' }}
        title="RTSP Stream"
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 flex justify-between items-center text-xs text-gray-400">
        <div className="font-mono truncate">
          <span>{rtspUrl}</span>
        </div>
      </div>
    </div>
  );
};

export default RtspPlayer;
