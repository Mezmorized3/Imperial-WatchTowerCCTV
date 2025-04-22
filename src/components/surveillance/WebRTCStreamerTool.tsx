
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Video, Play, Pause, RotateCcw, Copy, Download, ExternalLink, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { executeWebRTCStreamer } from '@/utils/osintImplementations/onvifFuzzerTools';

const WebRTCStreamerTool: React.FC = () => {
  const [rtspUrl, setRtspUrl] = useState('');
  const [webrtcPort, setWebrtcPort] = useState('8889');
  const [iceServers, setIceServers] = useState('stun:stun.l.google.com:19302');
  const [autoplay, setAutoplay] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [streamStatus, setStreamStatus] = useState<'stopped' | 'starting' | 'streaming' | 'error'>('stopped');
  const [streamInfo, setStreamInfo] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [latency, setLatency] = useState(0);
  const [bandwidth, setBandwidth] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const latencyIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  // Clear any existing peer connection
  const cleanupWebRTC = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    
    if (latencyIntervalRef.current) {
      window.clearInterval(latencyIntervalRef.current);
      latencyIntervalRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupWebRTC();
    };
  }, []);
  
  const handleStartStream = async () => {
    if (!rtspUrl) {
      toast({
        title: "Missing RTSP URL",
        description: "Please enter an RTSP URL to stream",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setStreamStatus('starting');
    setErrorMessage('');
    cleanupWebRTC();
    
    try {
      const result = await executeWebRTCStreamer({
        rtspUrl,
        webrtcPort: parseInt(webrtcPort),
        iceServers: iceServers.split(',')
      });
      
      if (result.success) {
        setStreamInfo(result.data);
        
        // Set up WebRTC connection (simulated in this demo environment)
        try {
          toast({
            title: "Stream Available",
            description: "WebRTC stream is ready to play"
          });
          
          if (autoplay) {
            simulateWebRTCStream();
          }
        } catch (err) {
          console.error("Error setting up WebRTC:", err);
          setStreamStatus('error');
          setErrorMessage(`Error setting up WebRTC: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      } else {
        setStreamStatus('error');
        setErrorMessage(result.error || "Failed to start WebRTC streamer");
        toast({
          title: "Stream Failed",
          description: result.error || "Failed to start WebRTC streamer",
          variant: "destructive"
        });
      }
    } catch (error) {
      setStreamStatus('error');
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
      toast({
        title: "Stream Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // This function simulates a WebRTC stream since we can't actually create one in this environment
  const simulateWebRTCStream = () => {
    setStreamStatus('streaming');
    startTimeRef.current = Date.now();
    
    // Simulate changing bandwidth and latency
    latencyIntervalRef.current = window.setInterval(() => {
      // Simulate latency between 30ms and 150ms
      setLatency(Math.floor(Math.random() * 120) + 30);
      
      // Simulate bandwidth between 1 and 5 Mbps
      setBandwidth(Math.floor(Math.random() * 4000) + 1000);
    }, 2000);
  };
  
  const handleStopStream = () => {
    cleanupWebRTC();
    setStreamStatus('stopped');
    setStreamInfo(null);
    toast({
      title: "Stream Stopped",
      description: "WebRTC stream has been stopped"
    });
  };
  
  const handleCopyStreamUrl = () => {
    if (streamInfo?.webrtcUrl) {
      navigator.clipboard.writeText(streamInfo.webrtcUrl);
      toast({
        description: "Stream URL copied to clipboard"
      });
    }
  };
  
  const getDemoStreamUrl = () => {
    const demoStreams = [
      'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4',
      'rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media.amp?profile=profile_1_h264&sessiontimeout=60&streamtype=unicast',
      'rtsp://demo:demo@demo.dyndns.org:5541/test'
    ];
    
    setRtspUrl(demoStreams[Math.floor(Math.random() * demoStreams.length)]);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          WebRTC Streamer
        </CardTitle>
        <CardDescription>
          Convert RTSP camera streams to low-latency WebRTC for browser viewing
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="stream">
        <TabsList className="grid grid-cols-2 mx-6">
          <TabsTrigger value="stream">Stream</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stream" className="space-y-4">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="rtsp-url">RTSP URL</Label>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs"
                  onClick={getDemoStreamUrl}
                >
                  Use Demo Stream
                </Button>
              </div>
              <div className="flex space-x-2">
                <Input
                  id="rtsp-url"
                  placeholder="rtsp://username:password@camera-ip:port/stream"
                  value={rtspUrl}
                  onChange={(e) => setRtspUrl(e.target.value)}
                  disabled={streamStatus === 'streaming' || isLoading}
                  className="flex-1"
                />
                {streamStatus === 'stopped' || streamStatus === 'error' ? (
                  <Button 
                    onClick={handleStartStream}
                    disabled={isLoading || !rtspUrl}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button 
                    onClick={handleStopStream}
                    variant="outline"
                    disabled={isLoading}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                )}
              </div>
            </div>
            
            <div className="aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center relative">
              {streamStatus === 'streaming' ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full"
                    poster="https://via.placeholder.com/640x360?text=WebRTC+Stream"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Badge className="bg-green-500">Live</Badge>
                    <Badge variant="outline" className="bg-black/50 backdrop-blur-sm">
                      {latency}ms
                    </Badge>
                    <Badge variant="outline" className="bg-black/50 backdrop-blur-sm">
                      {(bandwidth / 1000).toFixed(1)} Mbps
                    </Badge>
                  </div>
                </>
              ) : streamStatus === 'starting' ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white text-sm">Starting WebRTC stream...</p>
                </div>
              ) : streamStatus === 'error' ? (
                <div className="text-center p-4">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                  <p className="text-white text-sm mb-2">Failed to start stream</p>
                  <p className="text-red-400 text-xs">{errorMessage}</p>
                </div>
              ) : (
                <div className="text-center p-4">
                  <Video className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Enter an RTSP URL and click Start</p>
                </div>
              )}
            </div>
            
            {streamInfo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2 border rounded-md p-3">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Stream Info</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-gray-500 text-xs">Status</p>
                      <p className="capitalize">{streamStatus}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Server Port</p>
                      <p>{webrtcPort}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Stream URL</p>
                      <div className="flex items-center">
                        <p className="truncate">{streamInfo.webrtcUrl}</p>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={handleCopyStreamUrl}
                          className="h-6 w-6 ml-1"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 border rounded-md p-3">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">WebRTC Stats</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-gray-500 text-xs">Latency</p>
                      <p>{latency} ms</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Bandwidth</p>
                      <p>{(bandwidth / 1000).toFixed(1)} Mbps</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Connection</p>
                      <p>{streamStatus === 'streaming' ? 'Connected' : 'Disconnected'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Duration</p>
                      <p>{startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0}s</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {streamStatus === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errorMessage || "Failed to start WebRTC stream. Check console for details."}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="settings">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webrtc-port">WebRTC Server Port</Label>
              <Input
                id="webrtc-port"
                type="number"
                placeholder="8889"
                value={webrtcPort}
                onChange={(e) => setWebrtcPort(e.target.value)}
                disabled={streamStatus === 'streaming' || isLoading}
              />
              <p className="text-xs text-gray-500">
                Port where the WebRTC server is running
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ice-servers">ICE Servers</Label>
              <Input
                id="ice-servers"
                placeholder="stun:stun.l.google.com:19302"
                value={iceServers}
                onChange={(e) => setIceServers(e.target.value)}
                disabled={streamStatus === 'streaming' || isLoading}
              />
              <p className="text-xs text-gray-500">
                Comma-separated list of STUN/TURN servers for WebRTC
              </p>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="autoplay"
                checked={autoplay}
                onCheckedChange={setAutoplay}
                disabled={streamStatus === 'streaming' || isLoading}
              />
              <Label htmlFor="autoplay">Auto-play stream when connected</Label>
            </div>
            
            <div className="pt-4">
              <h3 className="text-sm font-medium mb-2">Advanced Settings</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="video-bitrate">Video Bitrate</Label>
                    <span className="text-xs text-gray-500">2000 kbps</span>
                  </div>
                  <Slider
                    id="video-bitrate"
                    min={100}
                    max={8000}
                    step={100}
                    defaultValue={[2000]}
                    disabled={streamStatus === 'streaming' || isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="frame-rate">Frame Rate</Label>
                    <span className="text-xs text-gray-500">30 fps</span>
                  </div>
                  <Slider
                    id="frame-rate"
                    min={1}
                    max={60}
                    step={1}
                    defaultValue={[30]}
                    disabled={streamStatus === 'streaming' || isLoading}
                  />
                </div>
              </div>
            </div>
            
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                WebRTC streaming requires a server-side component to convert RTSP to WebRTC.
                In a production environment, install webrtc-streamer on your server.
              </AlertDescription>
            </Alert>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.open('https://github.com/mpromonet/webrtc-streamer', '_blank')}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Documentation
        </Button>
        
        {streamStatus === 'streaming' && (
          <Button variant="outline" onClick={handleStopStream}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WebRTCStreamerTool;
