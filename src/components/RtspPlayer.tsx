
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Maximize2, Volume2, VolumeX, VideoOff, Video, DownloadCloud, Info } from 'lucide-react';
import ReactHlsPlayer from 'react-hls-player';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { getProperStreamUrl, convertRtspToHls, startRecording, stopRecording } from '@/utils/rtspUtils';
import { useToast } from '@/hooks/use-toast';

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
  
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
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
      const type = detectStreamType(rtspUrl);
      setVideoType(type);
      
      if (type === 'youtube') {
        const videoId = extractYouTubeId(rtspUrl);
        if (videoId) {
          setStreamUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`);
        } else {
          throw new Error('Invalid YouTube URL');
        }
      } else if (type === 'hls') {
        console.log('Detected HLS stream');
        // For HLS, check if go2rtc is enabled as the preferred engine
        if (preferredEngine === 'go2rtc') {
          // Try to use go2rtc gateway if available
          const go2rtcUrl = localStorage.getItem('go2rtcUrl');
          if (go2rtcUrl) {
            // Format: http://[go2rtc-ip]:8554/api/stream?src=[stream-url]
            const finalUrl = `${go2rtcUrl}/api/stream?src=${encodeURIComponent(rtspUrl)}`;
            console.log(`Using go2rtc for HLS: ${finalUrl}`);
            setStreamUrl(finalUrl);
          } else {
            console.log(`Using direct HLS URL: ${rtspUrl}`);
            setStreamUrl(rtspUrl);
          }
        } else if (preferredEngine === 'videojs') {
          // When using Video.js, we'll pass the URL to the iframe player
          setStreamUrl(`/player.html?url=${encodeURIComponent(rtspUrl)}&engine=videojs`);
          setVideoType('iframe');
        } else {
          // Direct HLS playback with HLS.js or native
          console.log(`Using direct HLS with ${preferredEngine}: ${rtspUrl}`);
          setStreamUrl(rtspUrl);
        }
      } else if (type === 'direct') {
        console.log('Detected direct video stream');
        setStreamUrl(rtspUrl);
      } else if (type === 'rtsp') {
        console.log('Detected RTSP stream, needs conversion');
        if (preferredEngine === 'go2rtc') {
          // Try to use go2rtc gateway if available
          const go2rtcUrl = localStorage.getItem('go2rtcUrl');
          if (go2rtcUrl) {
            const finalUrl = `${go2rtcUrl}/api/stream?src=${encodeURIComponent(rtspUrl)}`;
            console.log(`Using go2rtc for RTSP: ${finalUrl}`);
            setStreamUrl(finalUrl);
            setVideoType('hls');
          } else {
            console.log('No go2rtc available, falling back to convertRtspToHls');
            const hlsUrl = await convertRtspToHls(rtspUrl);
            console.log(`Converted RTSP to HLS: ${hlsUrl}`);
            setStreamUrl(hlsUrl);
            setVideoType('hls');
          }
        } else {
          console.log('Using convertRtspToHls for RTSP');
          const hlsUrl = await convertRtspToHls(rtspUrl);
          console.log(`Converted RTSP to HLS: ${hlsUrl}`);
          setStreamUrl(hlsUrl);
          setVideoType('hls');
        }
      } else if (type === 'iframe') {
        console.log('Defaulting to iframe for unknown content type');
        if (rtspUrl.startsWith('rtsp://')) {
          console.log('Converting RTSP for iframe');
          const hlsUrl = await convertRtspToHls(rtspUrl);
          console.log(`Converted RTSP to HLS for iframe: ${hlsUrl}`);
          setStreamUrl(hlsUrl);
          setVideoType('hls');
        } else {
          setStreamUrl(rtspUrl);
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
      // For iframes, we need to send a message to the iframe
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
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
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
            <p>Engine: {preferredEngine}</p>
            <p>Type: {videoType}</p>
          </div>
        </div>
      </div>
    );
  }
  
  const renderPlayer = () => {
    if (videoType === 'youtube' || (videoType === 'iframe' || preferredEngine === 'videojs')) {
      let iframeUrl = streamUrl;
      
      // For videojs, use our player.html as a wrapper
      if (preferredEngine === 'videojs' && !streamUrl.includes('player.html')) {
        iframeUrl = `/player.html?url=${encodeURIComponent(streamUrl)}&engine=videojs`;
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
        />
      );
    } else if (videoType === 'hls') {
      if (preferredEngine === 'native') {
        // Use native HLS playback for browsers that support it
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
      }
      
      // Default to ReactHlsPlayer for HLS streams
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
