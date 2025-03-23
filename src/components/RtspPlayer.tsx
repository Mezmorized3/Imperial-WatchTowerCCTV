import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Maximize2, Volume2, VolumeX, VideoOff, Video, Info } from 'lucide-react';
import ReactHlsPlayer from 'react-hls-player';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  getProperStreamUrl, 
  convertRtspToHls, 
  startRecording, 
  stopRecording, 
  normalizeStreamUrl,
  getStreamUrlForEngine
} from '@/utils/rtspUtils';
import { useToast } from '@/hooks/use-toast';
import { extractYouTubeId, sanitizeStreamUrl, formatAuthHeaders, requiresCorsHandling, addDebugInfo } from '@/utils/videoUtils';

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
  const { toast } = useToast();
  
  const streamId = btoa(rtspUrl).replace(/[/+=]/g, '').substring(0, 12);
  
  const detectStreamType = (url: string): 'hls' | 'dash' | 'direct' | 'iframe' | 'youtube' | 'rtsp' => {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('youtube.com/watch') || 
        lowerUrl.includes('youtu.be/') ||
        lowerUrl.includes('youtube.com/embed')) {
      return 'youtube';
    }
    
    if (lowerUrl.includes('.m3u8')) {
      return 'hls';
    } else if (lowerUrl.includes('.mpd')) {
      return 'dash';
    } else if (lowerUrl.startsWith('rtsp://')) {
      return 'rtsp'; // RTSP needs conversion or iframe
    } else if (/\.(mp4|webm|ogg|mov)$/i.test(lowerUrl)) {
      return 'direct'; // Direct video files
    } else if (lowerUrl.startsWith('http') || lowerUrl.startsWith('https')) {
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
      console.log(`Initializing stream: ${rtspUrl} with engine: ${preferredEngine}`);
      const normalizedUrl = normalizeStreamUrl(rtspUrl);
      console.log(`Normalized URL: ${normalizedUrl}`);
      
      const sanitizedUrl = sanitizeStreamUrl(normalizedUrl);
      console.log(`Sanitized URL: ${sanitizedUrl}`);
      
      const type = detectStreamType(sanitizedUrl);
      setVideoType(type);
      
      if (type === 'youtube') {
        const videoId = extractYouTubeId(sanitizedUrl);
        if (videoId) {
          setStreamUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`);
        } else {
          throw new Error('Invalid YouTube URL');
        }
      } else if (type === 'hls') {
        console.log('Detected HLS stream');
        
        if (preferredEngine === 'videojs') {
          const authHeaders = formatAuthHeaders(sanitizedUrl);
          const hasCors = requiresCorsHandling(sanitizedUrl);
          const debugEnabled = localStorage.getItem('debugStreaming') === 'true';
          
          const playerUrl = `/player.html?url=${encodeURIComponent(sanitizedUrl)}&engine=videojs&cors=${hasCors ? '1' : '0'}&debug=${debugEnabled ? '1' : '0'}`;
          console.log(`Using Video.js player via iframe: ${playerUrl}`);
          setStreamUrl(playerUrl);
          setVideoType('iframe');
        } 
        else if (preferredEngine === 'go2rtc') {
          const go2rtcUrl = localStorage.getItem('go2rtcUrl');
          if (go2rtcUrl) {
            const finalUrl = `${go2rtcUrl}/api/stream?src=${encodeURIComponent(sanitizedUrl)}`;
            console.log(`Using go2rtc for HLS: ${finalUrl}`);
            setStreamUrl(finalUrl);
          } else {
            console.log(`Using direct HLS URL: ${sanitizedUrl}`);
            setStreamUrl(sanitizedUrl);
          }
        } 
        else {
          console.log(`Using direct HLS with ${preferredEngine}: ${sanitizedUrl}`);
          
          const useImperialProxy = localStorage.getItem('rtspProxyEnabled') !== 'false';
          const imperialProxyUrl = localStorage.getItem('rtspProxyUrl');
          
          if (useImperialProxy && imperialProxyUrl) {
            console.log('Using Imperial proxy for CORS handling');
            const streamId = btoa(sanitizedUrl).replace(/[/+=]/g, '').substring(0, 12);
            setStreamUrl(`${imperialProxyUrl}/stream/${streamId}/index.m3u8`);
          } else {
            setStreamUrl(sanitizedUrl);
          }
        }
      } else if (type === 'direct') {
        console.log('Detected direct video stream');
        setStreamUrl(sanitizedUrl);
      } else if (type === 'rtsp') {
        console.log('Detected RTSP stream, needs conversion');
        const convertedUrl = await convertRtspToHls(sanitizedUrl);
        console.log(`Converted RTSP to HLS: ${convertedUrl}`);
        setStreamUrl(convertedUrl);
        setVideoType('hls');
      } else if (type === 'iframe') {
        console.log('Using iframe for player');
        if (sanitizedUrl.startsWith('rtsp://')) {
          const convertedUrl = await convertRtspToHls(sanitizedUrl);
          console.log(`Converted RTSP to HLS for iframe: ${convertedUrl}`);
          setStreamUrl(convertedUrl);
          setVideoType('hls');
        } else {
          setStreamUrl(sanitizedUrl);
        }
      }
      
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize stream';
      console.error(`Stream initialization error: ${errorMessage}`);
      setError(errorMessage);
      if (onError) onError(errorMessage);
      setIsLoading(false);
    }
  };
  
  const toggleMute = () => {
    if (playerRef.current) {
      playerRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.postMessage({
          action: 'toggleMute'
        }, '*');
      } catch (e) {
        console.error('Error toggling mute in iframe:', e);
      }
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
  
  const toggleDebugInfo = () => {
    setShowDebugInfo(!showDebugInfo);
  };
  
  useEffect(() => {
    initializeStream();
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'stream-error') {
        console.error(`Player error: ${event.data.message}`);
        setError(event.data.message);
        if (onError) onError(event.data.message);
      }
      
      if (event.data && event.data.type === 'stream-ready') {
        console.log('Stream is ready from iframe');
        if (onStreamReady) onStreamReady();
      }
    };
    
    window.addEventListener('message', handleIframeMessage);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('message', handleIframeMessage);
    };
  }, [rtspUrl, preferredEngine]);
  
  const handleVideoError = () => {
    const errorMsg = 'Failed to load video stream.';
    console.error(errorMsg);
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
                The stream could not be accessed. This could be due to network restrictions, authentication issues, or an invalid URL.
              </p>
            </AlertDescription>
          </Alert>
          <Button className="mt-4" variant="outline" size="sm" onClick={handleRetry}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Try Again ({retryCount})
          </Button>
          <div className="mt-4 text-xs text-gray-500">
            <p>Original URL: {rtspUrl}</p>
            <p>Engine: {preferredEngine}</p>
            <p>Type: {videoType}</p>
            <p>Normalized URL: {streamUrl || ''}</p>
          </div>
        </div>
      </div>
    );
  }
  
  const renderPlayer = () => {
    if (videoType === 'youtube' || (videoType === 'iframe' || preferredEngine === 'videojs')) {
      let iframeUrl = streamUrl;
      
      if (preferredEngine === 'videojs' && !streamUrl.includes('player.html')) {
        const debugEnabled = localStorage.getItem('debugStreaming') === 'true';
        const hasCors = requiresCorsHandling(streamUrl);
        iframeUrl = `/player.html?url=${encodeURIComponent(streamUrl)}&engine=videojs&cors=${hasCors ? '1' : '0'}&debug=${debugEnabled ? '1' : '0'}`;
      }
      
      return (
        <iframe 
          ref={iframeRef}
          src={iframeUrl}
          width="100%" 
          height="100%" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 'none' }}
          title={videoType === 'youtube' ? "YouTube Video" : "Video Stream"}
          onError={() => {
            console.error("Iframe loading error");
            handleVideoError();
          }}
        />
      );
    } else if (videoType === 'hls') {
      if (preferredEngine === 'native') {
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
            crossOrigin="anonymous"
          />
        );
      }
      
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
            xhrSetup: (xhr: XMLHttpRequest) => {
              xhr.withCredentials = true;
            },
          }}
          onError={handleVideoError}
          onCanPlay={handleStreamReady}
          muted={isMuted}
          crossOrigin="anonymous"
        />
      );
    } else if (videoType === 'direct') {
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
          crossOrigin="anonymous"
        />
      );
    } else {
      return (
        <iframe 
          ref={iframeRef}
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
      
      {showDebugInfo && (
        <div className="absolute top-0 right-0 p-2 bg-black/70 text-green-500 text-xs font-mono m-2 rounded z-50">
          <div>URL: {rtspUrl}</div>
          <div>Stream URL: {streamUrl}</div>
          <div>Type: {videoType}</div>
          <div>Engine: {preferredEngine}</div>
          <div>Muted: {isMuted ? 'Yes' : 'No'}</div>
          {playerRef.current && (
            <>
              <div>Resolution: {playerRef.current.videoWidth}x{playerRef.current.videoHeight}</div>
              <div>Duration: {Math.round(playerRef.current.duration * 100) / 100}s</div>
              <div>Current Time: {Math.round(playerRef.current.currentTime * 100) / 100}s</div>
              <div>Network State: {playerRef.current.networkState}</div>
              <div>Ready State: {playerRef.current.readyState}</div>
            </>
          )}
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/70 flex justify-between items-center">
        <div className="font-mono truncate text-xs text-gray-400 max-w-sm">
          <span>{rtspUrl}</span>
        </div>
        <div className="flex gap-2">
          {videoType !== 'youtube' && (
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
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
            onClick={toggleDebugInfo}
            title="Debug Info"
          >
            <Info className="h-4 w-4" />
          </Button>
          {videoType !== 'youtube' && playerRef.current && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70"
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          )}
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
