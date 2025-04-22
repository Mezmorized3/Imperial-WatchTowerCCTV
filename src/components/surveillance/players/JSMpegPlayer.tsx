
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface JSMpegPlayerProps {
  wsUrl: string;
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  onError?: (error: any) => void;
  onPlaying?: () => void;
}

const JSMpegPlayer: React.FC<JSMpegPlayerProps> = ({
  wsUrl,
  autoplay = true,
  loop = false,
  controls = true,
  width = '100%',
  height = 'auto',
  onError,
  onPlaying
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Check if window is defined (to avoid SSR issues)
    if (typeof window !== 'undefined') {
      // Check if the JSMpeg script is already loaded
      if (!(window as any).JSMpeg) {
        // Load JSMpeg script
        const scriptSrc = 'https://cdn.jsdelivr.net/npm/jsmpeg-player@3.0.3/lib/jsmpeg.min.js';
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.async = true;
        script.onload = () => {
          if (isMounted) {
            initPlayer();
          }
        };
        script.onerror = (err) => {
          console.error('Failed to load JSMpeg script:', err);
          if (isMounted) {
            setError('Failed to load streaming component');
            setIsLoading(false);
            if (onError) onError(err);
          }
        };
        document.head.appendChild(script);
      } else {
        // Script already loaded, initialize player
        initPlayer();
      }
    }

    return () => {
      isMounted = false;
      destroyPlayer();
    };
  }, [wsUrl]);

  const initPlayer = () => {
    if (!canvasRef.current || !window || !(window as any).JSMpeg) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Clean up any existing player
      destroyPlayer();
      
      // Create new player
      const options = {
        canvas: canvasRef.current,
        autoplay,
        loop,
        audio: false,
        video: true,
        pauseWhenHidden: false,
        progressive: true,
        onPlay: () => {
          setIsLoading(false);
          setError(null);
          if (onPlaying) onPlaying();
        },
        onError: (err: any) => {
          console.error('JSMpeg player error:', err);
          setError(`Streaming error: ${err.message || 'Connection failed'}`);
          setIsLoading(false);
          if (onError) onError(err);
        }
      };
      
      playerRef.current = new (window as any).JSMpeg.Player(wsUrl, options);
      
    } catch (err) {
      console.error('Error initializing JSMpeg player:', err);
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
          {isLoading ? 'Connecting to stream...' : error ? 'Stream Error' : 'MPEG Stream'}
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
          <canvas
            ref={canvasRef}
            style={{ width, height, display: 'block' }}
            className="bg-black aspect-video"
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        {controls && playerRef.current && (
          <div className="p-2 flex justify-center space-x-2 bg-gray-900">
            <button 
              className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
              onClick={() => playerRef.current.play()}
            >
              Play
            </button>
            <button 
              className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
              onClick={() => playerRef.current.pause()}
            >
              Pause
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JSMpegPlayer;
