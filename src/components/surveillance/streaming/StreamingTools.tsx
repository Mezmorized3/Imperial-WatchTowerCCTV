
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import {
  Video, Play, Server, Eye, Loader2, Monitor, Camera, FileVideo
} from 'lucide-react';
import { 
  executeRtspServer, 
  executeWebRTCStreamer,
  executeZoneMinder,
  ffmpegConvertRtspToHls,
  ffmpegRecordStream
} from '@/utils/osintTools';

const StreamingTools: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('rtsp-server');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // RTSP Server state
  const [rtspListenIp, setRtspListenIp] = useState('0.0.0.0');
  const [rtspListenPort, setRtspListenPort] = useState('8554');
  const [rtspSourcePath, setRtspSourcePath] = useState('');
  const [rtspRecordPath, setRtspRecordPath] = useState('');
  const [rtspUsername, setRtspUsername] = useState('');
  const [rtspPassword, setRtspPassword] = useState('');
  const [rtspEnableTls, setRtspEnableTls] = useState(false);
  
  // WebRTC Streamer state
  const [webrtcRtspUrl, setWebrtcRtspUrl] = useState('');
  const [webrtcPort, setWebrtcPort] = useState('8000');
  const [webrtcIceServers, setWebrtcIceServers] = useState('stun:stun.l.google.com:19302');
  const [webrtcAllowedOrigins, setWebrtcAllowedOrigins] = useState('*');
  const [webrtcVideoCodec, setWebrtcVideoCodec] = useState<'h264' | 'vp8' | 'vp9'>('h264');
  const [webrtcAudioCodec, setWebrtcAudioCodec] = useState<'opus' | 'pcmu' | 'none'>('opus');
  const [webrtcEnableTls, setWebrtcEnableTls] = useState(false);
  
  // ZoneMinder state
  const [zmAction, setZmAction] = useState<'monitor' | 'event' | 'frame' | 'status'>('monitor');
  const [zmMonitorId, setZmMonitorId] = useState('');
  const [zmEventId, setZmEventId] = useState('');
  const [zmFrameId, setZmFrameId] = useState('');
  const [zmEnableRecording, setZmEnableRecording] = useState(true);
  const [zmStreamType, setZmStreamType] = useState<'jpeg' | 'mjpeg' | 'h264'>('mjpeg');
  
  // FFmpeg HLS Converter state
  const [hlsRtspUrl, setHlsRtspUrl] = useState('');
  const [hlsSegmentDuration, setHlsSegmentDuration] = useState('2');
  const [hlsPlaylistSize, setHlsPlaylistSize] = useState('5');
  const [hlsOutputPath, setHlsOutputPath] = useState('/tmp/hls');
  
  // FFmpeg Record state
  const [recordStreamUrl, setRecordStreamUrl] = useState('');
  const [recordDuration, setRecordDuration] = useState('60');
  const [recordFormat, setRecordFormat] = useState<'mp4' | 'mkv' | 'avi'>('mp4');
  const [recordOutputPath, setRecordOutputPath] = useState('/tmp/recordings');
  
  const handleExecute = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      let result;
      
      switch(activeTab) {
        case 'rtsp-server':
          if (!rtspListenPort) {
            throw new Error('Please specify a listen port');
          }
          
          const credentials = rtspUsername && rtspPassword 
            ? { username: rtspUsername, password: rtspPassword } 
            : undefined;
          
          result = await executeRtspServer({
            listenIp: rtspListenIp,
            listenPort: parseInt(rtspListenPort),
            sourcePath: rtspSourcePath || undefined,
            recordPath: rtspRecordPath || undefined,
            credentials,
            enableTls: rtspEnableTls
          });
          
          if (result.success) {
            toast({
              title: "RTSP Server Started",
              description: `Server is running on ${rtspListenIp}:${rtspListenPort}`
            });
          }
          break;
          
        case 'webrtc-streamer':
          if (!webrtcRtspUrl) {
            throw new Error('Please enter an RTSP URL');
          }
          
          result = await executeWebRTCStreamer({
            rtspUrl: webrtcRtspUrl,
            webrtcPort: parseInt(webrtcPort),
            iceServers: webrtcIceServers.split(','),
            allowedOrigins: webrtcAllowedOrigins.split(','),
            videoCodec: webrtcVideoCodec,
            audioCodec: webrtcAudioCodec,
            enableTLS: webrtcEnableTls
          });
          
          if (result.success) {
            toast({
              title: "WebRTC Streamer Started",
              description: `Stream available at ${result.data.webrtcUrl}`
            });
          }
          break;
          
        case 'zoneminder':
          if (zmAction === 'monitor' && !zmMonitorId) {
            throw new Error('Please enter a Monitor ID');
          }
          
          result = await executeZoneMinder({
            action: zmAction,
            monitorId: zmMonitorId ? parseInt(zmMonitorId) : undefined,
            eventId: zmEventId ? parseInt(zmEventId) : undefined,
            frameId: zmFrameId ? parseInt(zmFrameId) : undefined,
            enableRecording: zmEnableRecording,
            streamType: zmStreamType
          });
          
          if (result.success) {
            toast({
              title: "ZoneMinder Action Complete",
              description: `Action '${zmAction}' completed successfully`
            });
          }
          break;
          
        case 'ffmpeg-hls':
          if (!hlsRtspUrl) {
            throw new Error('Please enter an RTSP URL');
          }
          
          result = await ffmpegConvertRtspToHls({
            input: hlsRtspUrl, // Fixed: changed inputUrl to input
            segmentDuration: parseInt(hlsSegmentDuration),
            playlistSize: parseInt(hlsPlaylistSize),
            outputPath: hlsOutputPath
          });
          
          if (result.success) {
            toast({
              title: "HLS Conversion Started",
              description: `Stream available at ${result.data.hlsUrl}`
            });
          }
          break;
          
        case 'ffmpeg-record':
          if (!recordStreamUrl) {
            throw new Error('Please enter a stream URL');
          }
          
          result = await ffmpegRecordStream({
            streamUrl: recordStreamUrl,
            duration: recordDuration, // Fixed: Changed int to string for duration
            format: recordFormat,
            outputPath: recordOutputPath
          });
          
          if (result.success) {
            toast({
              title: "Recording Started",
              description: `Recording to ${result.data.outputFile}`
            });
          }
          break;
      }
      
      if (result && result.success) {
        setResults(result.data);
      } else if (result) {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error(`Error during ${activeTab} execution:`, error);
      toast({
        title: `${activeTab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Error`,
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderRtspServerForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rtsp-listen-ip">Listen IP</Label>
          <Input
            id="rtsp-listen-ip"
            placeholder="0.0.0.0"
            value={rtspListenIp}
            onChange={(e) => setRtspListenIp(e.target.value)}
          />
          <p className="text-xs text-gray-500">0.0.0.0 to listen on all interfaces</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rtsp-listen-port">Listen Port</Label>
          <Input
            id="rtsp-listen-port"
            placeholder="8554"
            value={rtspListenPort}
            onChange={(e) => setRtspListenPort(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="rtsp-source-path">Source Path (optional)</Label>
        <Input
          id="rtsp-source-path"
          placeholder="rtsp://source.example.com/stream"
          value={rtspSourcePath}
          onChange={(e) => setRtspSourcePath(e.target.value)}
        />
        <p className="text-xs text-gray-500">RTSP source to proxy (leave empty for direct publishing)</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="rtsp-record-path">Recording Path (optional)</Label>
        <Input
          id="rtsp-record-path"
          placeholder="/tmp/recordings"
          value={rtspRecordPath}
          onChange={(e) => setRtspRecordPath(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Authentication (optional)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Username"
            value={rtspUsername}
            onChange={(e) => setRtspUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={rtspPassword}
            onChange={(e) => setRtspPassword(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="rtsp-enable-tls"
          checked={rtspEnableTls}
          onCheckedChange={(checked) => setRtspEnableTls(!!checked)}
        />
        <Label htmlFor="rtsp-enable-tls">Enable TLS</Label>
      </div>
    </div>
  );
  
  const renderWebRTCStreamerForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="webrtc-rtsp-url">RTSP URL</Label>
        <Input
          id="webrtc-rtsp-url"
          placeholder="rtsp://camera.example.com/stream"
          value={webrtcRtspUrl}
          onChange={(e) => setWebrtcRtspUrl(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="webrtc-port">WebRTC Port</Label>
          <Input
            id="webrtc-port"
            placeholder="8000"
            value={webrtcPort}
            onChange={(e) => setWebrtcPort(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="webrtc-video-codec">Video Codec</Label>
          <Select value={webrtcVideoCodec} onValueChange={(value: any) => setWebrtcVideoCodec(value)}>
            <SelectTrigger id="webrtc-video-codec">
              <SelectValue placeholder="Select video codec" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="h264">H.264</SelectItem>
              <SelectItem value="vp8">VP8</SelectItem>
              <SelectItem value="vp9">VP9</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="webrtc-audio-codec">Audio Codec</Label>
        <Select value={webrtcAudioCodec} onValueChange={(value: any) => setWebrtcAudioCodec(value)}>
          <SelectTrigger id="webrtc-audio-codec">
            <SelectValue placeholder="Select audio codec" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="opus">Opus</SelectItem>
            <SelectItem value="pcmu">PCMU</SelectItem>
            <SelectItem value="none">None (No Audio)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="webrtc-ice-servers">ICE Servers (comma-separated)</Label>
        <Input
          id="webrtc-ice-servers"
          placeholder="stun:stun.l.google.com:19302"
          value={webrtcIceServers}
          onChange={(e) => setWebrtcIceServers(e.target.value)}
        />
        <p className="text-xs text-gray-500">STUN/TURN servers for NAT traversal</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="webrtc-allowed-origins">Allowed Origins (comma-separated)</Label>
        <Input
          id="webrtc-allowed-origins"
          placeholder="*"
          value={webrtcAllowedOrigins}
          onChange={(e) => setWebrtcAllowedOrigins(e.target.value)}
        />
        <p className="text-xs text-gray-500">* for any origin, or specific domains</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="webrtc-enable-tls"
          checked={webrtcEnableTls}
          onCheckedChange={(checked) => setWebrtcEnableTls(!!checked)}
        />
        <Label htmlFor="webrtc-enable-tls">Enable TLS</Label>
      </div>
    </div>
  );
  
  const renderZoneMinderForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="zm-action">Action</Label>
        <Select value={zmAction} onValueChange={(value: any) => setZmAction(value)}>
          <SelectTrigger id="zm-action">
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monitor">Monitor Operations</SelectItem>
            <SelectItem value="event">Event Operations</SelectItem>
            <SelectItem value="frame">Frame Operations</SelectItem>
            <SelectItem value="status">System Status</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {zmAction === 'monitor' && (
        <div className="space-y-2">
          <Label htmlFor="zm-monitor-id">Monitor ID</Label>
          <Input
            id="zm-monitor-id"
            placeholder="1"
            value={zmMonitorId}
            onChange={(e) => setZmMonitorId(e.target.value)}
          />
        </div>
      )}
      
      {zmAction === 'event' && (
        <div className="space-y-2">
          <Label htmlFor="zm-event-id">Event ID</Label>
          <Input
            id="zm-event-id"
            placeholder="1000"
            value={zmEventId}
            onChange={(e) => setZmEventId(e.target.value)}
          />
        </div>
      )}
      
      {zmAction === 'frame' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zm-event-id-for-frame">Event ID</Label>
            <Input
              id="zm-event-id-for-frame"
              placeholder="1000"
              value={zmEventId}
              onChange={(e) => setZmEventId(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zm-frame-id">Frame ID</Label>
            <Input
              id="zm-frame-id"
              placeholder="1"
              value={zmFrameId}
              onChange={(e) => setZmFrameId(e.target.value)}
            />
          </div>
        </div>
      )}
      
      {zmAction === 'monitor' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="zm-stream-type">Stream Type</Label>
            <Select value={zmStreamType} onValueChange={(value: any) => setZmStreamType(value)}>
              <SelectTrigger id="zm-stream-type">
                <SelectValue placeholder="Select stream type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="mjpeg">MJPEG</SelectItem>
                <SelectItem value="h264">H.264</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="zm-enable-recording"
              checked={zmEnableRecording}
              onCheckedChange={(checked) => setZmEnableRecording(!!checked)}
            />
            <Label htmlFor="zm-enable-recording">Enable Recording</Label>
          </div>
        </>
      )}
    </div>
  );
  
  const renderFfmpegHlsForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="hls-rtsp-url">RTSP URL</Label>
        <Input
          id="hls-rtsp-url"
          placeholder="rtsp://camera.example.com/stream"
          value={hlsRtspUrl}
          onChange={(e) => setHlsRtspUrl(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hls-segment-duration">Segment Duration (seconds)</Label>
          <Input
            id="hls-segment-duration"
            placeholder="2"
            value={hlsSegmentDuration}
            onChange={(e) => setHlsSegmentDuration(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hls-playlist-size">Playlist Size</Label>
          <Input
            id="hls-playlist-size"
            placeholder="5"
            value={hlsPlaylistSize}
            onChange={(e) => setHlsPlaylistSize(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hls-output-path">Output Path</Label>
        <Input
          id="hls-output-path"
          placeholder="/tmp/hls"
          value={hlsOutputPath}
          onChange={(e) => setHlsOutputPath(e.target.value)}
        />
      </div>
    </div>
  );
  
  const renderFfmpegRecordForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="record-stream-url">Stream URL</Label>
        <Input
          id="record-stream-url"
          placeholder="rtsp://camera.example.com/stream"
          value={recordStreamUrl}
          onChange={(e) => setRecordStreamUrl(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="record-duration">Duration (seconds)</Label>
          <Input
            id="record-duration"
            placeholder="60"
            value={recordDuration}
            onChange={(e) => setRecordDuration(e.target.value)}
          />
          <p className="text-xs text-gray-500">0 for continuous recording</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="record-format">Output Format</Label>
          <Select value={recordFormat} onValueChange={(value: any) => setRecordFormat(value)}>
            <SelectTrigger id="record-format">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp4">MP4</SelectItem>
              <SelectItem value="mkv">MKV</SelectItem>
              <SelectItem value="avi">AVI</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="record-output-path">Output Path</Label>
        <Input
          id="record-output-path"
          placeholder="/tmp/recordings"
          value={recordOutputPath}
          onChange={(e) => setRecordOutputPath(e.target.value)}
        />
      </div>
    </div>
  );
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Streaming Tools
        </CardTitle>
        <CardDescription>
          Tools for working with RTSP streams, converting formats, and recording
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full mb-4">
            <TabsTrigger value="rtsp-server">
              <Server className="h-4 w-4 mr-2 hidden md:inline" />
              RTSP Server
            </TabsTrigger>
            <TabsTrigger value="webrtc-streamer">
              <Play className="h-4 w-4 mr-2 hidden md:inline" />
              WebRTC
            </TabsTrigger>
            <TabsTrigger value="zoneminder">
              <Monitor className="h-4 w-4 mr-2 hidden md:inline" />
              ZoneMinder
            </TabsTrigger>
            <TabsTrigger value="ffmpeg-hls">
              <Video className="h-4 w-4 mr-2 hidden md:inline" />
              HLS Converter
            </TabsTrigger>
            <TabsTrigger value="ffmpeg-record">
              <FileVideo className="h-4 w-4 mr-2 hidden md:inline" />
              Recorder
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rtsp-server">{renderRtspServerForm()}</TabsContent>
          <TabsContent value="webrtc-streamer">{renderWebRTCStreamerForm()}</TabsContent>
          <TabsContent value="zoneminder">{renderZoneMinderForm()}</TabsContent>
          <TabsContent value="ffmpeg-hls">{renderFfmpegHlsForm()}</TabsContent>
          <TabsContent value="ffmpeg-record">{renderFfmpegRecordForm()}</TabsContent>
        </Tabs>
        
        {results && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Results
            </h3>
            
            {activeTab === 'rtsp-server' && results.serverUrl && (
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">RTSP URL:</span> {results.serverUrl}
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span> {results.status || 'Running'}
                  </div>
                  {results.recordingPath && (
                    <div>
                      <span className="font-semibold">Recording To:</span> {results.recordingPath}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'webrtc-streamer' && results.webrtcUrl && (
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">WebRTC URL:</span> {results.webrtcUrl}
                    </div>
                    <div>
                      <span className="font-semibold">RTSP Source:</span> {results.rtspUrl}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">HTML Embed Code</h4>
                  <Textarea
                    readOnly
                    className="font-mono text-xs h-24"
                    value={results.embedCode || `<video id="video" autoplay playsinline controls></video>
<script src="${results.webrtcUrl.replace('ws://', 'http://').replace('wss://', 'https://')}/webrtc.js"></script>
<script>
  const webrtc = new WebRTCStreamer("video", "${results.webrtcUrl}");
  webrtc.connect("${results.rtspUrl}");
</script>`}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'zoneminder' && (
              <Textarea
                readOnly
                value={JSON.stringify(results, null, 2)}
                className="min-h-48 font-mono text-sm"
              />
            )}
            
            {activeTab === 'ffmpeg-hls' && results.hlsUrl && (
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">HLS URL:</span> {results.hlsUrl}
                    </div>
                    <div>
                      <span className="font-semibold">Source:</span> {results.sourceUrl}
                    </div>
                    {results.status && (
                      <div>
                        <span className="font-semibold">Status:</span> {results.status}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">HTML5 Video Player Code</h4>
                  <Textarea
                    readOnly
                    className="font-mono text-xs h-24"
                    value={`<video id="video" controls autoplay>
  <source src="${results.hlsUrl}" type="application/x-mpegURL">
</video>
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script>
  const video = document.getElementById('video');
  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource('${results.hlsUrl}');
    hls.attachMedia(video);
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = '${results.hlsUrl}';
  }
</script>`}
                  />
                </div>
              </div>
            )}
            
            {activeTab === 'ffmpeg-record' && results.outputFile && (
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="font-semibold">Recording To:</span> {results.outputFile}
                  </div>
                  <div>
                    <span className="font-semibold">Source:</span> {results.sourceUrl}
                  </div>
                  <div>
                    <span className="font-semibold">Duration:</span> {results.duration} seconds
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span> {results.status || 'Recording'}
                  </div>
                </div>
              </div>
            )}
            
            {!results.serverUrl && !results.webrtcUrl && !results.hlsUrl && !results.outputFile && (
              <Textarea
                readOnly
                value={JSON.stringify(results, null, 2)}
                className="min-h-48 font-mono text-sm"
              />
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleExecute}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {activeTab === 'rtsp-server' && (
                <>
                  <Server className="h-4 w-4 mr-2" />
                  Start RTSP Server
                </>
              )}
              {activeTab === 'webrtc-streamer' && (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start WebRTC Streamer
                </>
              )}
              {activeTab === 'zoneminder' && (
                <>
                  <Monitor className="h-4 w-4 mr-2" />
                  Execute ZoneMinder Action
                </>
              )}
              {activeTab === 'ffmpeg-hls' && (
                <>
                  <Video className="h-4 w-4 mr-2" />
                  Convert to HLS
                </>
              )}
              {activeTab === 'ffmpeg-record' && (
                <>
                  <FileVideo className="h-4 w-4 mr-2" />
                  Start Recording
                </>
              )}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StreamingTools;
