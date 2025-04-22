
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Play, Video } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import StreamedianPlayer from './players/StreamedianPlayer';
import JSMpegPlayer from './players/JSMpegPlayer';

const StreamPlayerDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('streamedian');
  const [rtspUrl, setRtspUrl] = useState('rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media.amp?profile=profile_1_h264&sessiontimeout=60&streamtype=unicast');
  const [wsUrl, setWsUrl] = useState('wss://example.com/stream');
  const [transport, setTransport] = useState<'tcp' | 'udp'>('tcp');
  const [autoplay, setAutoplay] = useState(true);
  const [controls, setControls] = useState(true);
  const [muted, setMuted] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleConnect = () => {
    setError(null);
    setIsPlaying(false);
    
    // Validation
    if (activeTab === 'streamedian' && !rtspUrl.startsWith('rtsp://')) {
      setError('RTSP URL must start with rtsp://');
      return;
    }
    
    if (activeTab === 'jsmpeg' && !wsUrl.startsWith('ws://') && !wsUrl.startsWith('wss://')) {
      setError('WebSocket URL must start with ws:// or wss://');
      return;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="streamedian">
            <Video className="mr-2 h-4 w-4" />
            Streamedian (RTSP)
          </TabsTrigger>
          <TabsTrigger value="jsmpeg">
            <Play className="mr-2 h-4 w-4" />
            JSMpeg (WebSocket)
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="streamedian" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Streamedian RTSP Player</CardTitle>
              <CardDescription>
                Stream RTSP camera feeds directly in your browser
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rtsp-url">RTSP URL</Label>
                  <Input
                    id="rtsp-url"
                    placeholder="rtsp://username:password@camera-ip:port/path"
                    value={rtspUrl}
                    onChange={(e) => setRtspUrl(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transport">Transport Protocol</Label>
                    <Select value={transport} onValueChange={(v) => setTransport(v as 'tcp' | 'udp')}>
                      <SelectTrigger id="transport">
                        <SelectValue placeholder="Select transport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tcp">TCP (more reliable)</SelectItem>
                        <SelectItem value="udp">UDP (lower latency)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col space-y-2 justify-end">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="autoplay"
                        checked={autoplay}
                        onCheckedChange={setAutoplay}
                      />
                      <Label htmlFor="autoplay">Autoplay</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="controls"
                        checked={controls}
                        onCheckedChange={setControls}
                      />
                      <Label htmlFor="controls">Show Controls</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="muted"
                        checked={muted}
                        onCheckedChange={setMuted}
                      />
                      <Label htmlFor="muted">Muted</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleConnect} className="w-full">
                Connect to Stream
              </Button>
            </CardFooter>
          </Card>
          
          <StreamedianPlayer
            rtspUrl={rtspUrl}
            transport={transport}
            autoplay={autoplay}
            controls={controls}
            muted={muted}
            onError={(err) => setError(err.message || 'Connection failed')}
            onConnected={() => {
              setIsPlaying(true);
              setError(null);
            }}
          />
        </TabsContent>
        
        <TabsContent value="jsmpeg" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>JSMpeg WebSocket Player</CardTitle>
              <CardDescription>
                Low-latency camera streaming over WebSockets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ws-url">WebSocket URL</Label>
                  <Input
                    id="ws-url"
                    placeholder="ws://server:port/path"
                    value={wsUrl}
                    onChange={(e) => setWsUrl(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ws-autoplay"
                      checked={autoplay}
                      onCheckedChange={setAutoplay}
                    />
                    <Label htmlFor="ws-autoplay">Autoplay</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ws-controls"
                      checked={controls}
                      onCheckedChange={setControls}
                    />
                    <Label htmlFor="ws-controls">Show Controls</Label>
                  </div>
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleConnect} className="w-full">
                Connect to Stream
              </Button>
            </CardFooter>
          </Card>
          
          <JSMpegPlayer
            wsUrl={wsUrl}
            autoplay={autoplay}
            controls={controls}
            onError={(err) => setError(err.message || 'Connection failed')}
            onPlaying={() => {
              setIsPlaying(true);
              setError(null);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StreamPlayerDemo;
