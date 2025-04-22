
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface StreamedianPlayerProps {
  rtspUrl: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  width?: string | number;
  height?: string | number;
  transport?: 'tcp' | 'udp';
  onError?: (error: any) => void;
  onConnected?: () => void;
}

const StreamedianPlayer: React.FC<StreamedianPlayerProps> = ({
  rtspUrl,
  autoplay = true,
  controls = true,
  muted = false,
  width = '100%',
  height = 'auto',
  transport = 'tcp',
  onError,
  onConnected
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Check if window is defined (to avoid SSR issues)
    if (typeof window !== 'undefined') {
      // Check if the Streamedian script is already loaded
      if (!(window as any).Streamedian) {
        // Use imperialAuthService to check proxy status
        const proxyUrlBase = 'https://cdn.jsdelivr.net/npm/streamedian@latest/dist/';
        
        // Load required scripts
        Promise.all([
          loadScript(`${proxyUrlBase}streamedian.min.js`),
          loadScript(`${proxyUrlBase}streamedian-webrtc-shim.min.js`)
        ]).then(() => {
          if (isMounted) {
            initPlayer();
          }
        }).catch((err) => {
          console.error('Failed to load Streamedian scripts:', err);
          if (isMounted) {
            setError('Failed to load streaming component');
            setIsLoading(false);
            if (onError) onError(err);
          }
        });
      } else {
        // Scripts already loaded, initialize player
        initPlayer();
      }
    }

    return () => {
      isMounted = false;
      destroyPlayer();
    };
  }, [rtspUrl, transport]);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  };

  const initPlayer = () => {
    if (!videoRef.current || !window || !(window as any).Streamedian) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Clean up any existing player
      destroyPlayer();
      
      // Create new player
      const StreamedianPlayer = (window as any).Streamedian.player;
      
      playerRef.current = new StreamedianPlayer(videoRef.current, {
        url: rtspUrl,
        transport: transport,
        rtsp: {
          reconnect: true,
          reconnectInterval: 5,
          reconnectMaxRetries: 3
        },
        ws: {
          // Proxy server configuration
          protocol: 'ws',
          port: 8080,
          endpoint: '/ws'
        }
      });
      
      playerRef.current.on('error', (err: any) => {
        console.error('Streamedian player error:', err);
        setError(`Streaming error: ${err.message || 'Unknown error'}`);
        setIsLoading(false);
        if (onError) onError(err);
      });
      
      playerRef.current.on('connected', () => {
        setIsLoading(false);
        setError(null);
        if (onConnected) onConnected();
      });
      
    } catch (err) {
      console.error('Error initializing Streamedian player:', err);
      setError('Failed to initialize player');
      setIsLoading(false);
      if (onError) onError(err);
    }
  };

  const destroyPlayer = () => {
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (err) {
        console.error('Error destroying player:', err);
      }
      playerRef.current = null;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-3">
        <CardTitle className="text-sm flex items-center">
          {isLoading ? 'Connecting to stream...' : error ? 'Stream Error' : 'Live Stream'}
          {isLoading && (
            <div className="ml-2 h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative">
        {error && (
          <Alert variant="destructive" className="m-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        <div className={`relative ${error ? 'opacity-50' : ''}`}>
          <video
            ref={videoRef}
            controls={controls}
            autoPlay={autoplay}
            muted={muted}
            style={{ width, height, display: 'block' }}
            className="bg-black aspect-video"
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreamedianPlayer;
