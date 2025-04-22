
import React, { useState } from 'react';
import { TabsList, TabsTrigger, TabsContent, Tabs } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Camera, Video, RefreshCw, Play } from 'lucide-react';
import { StreamedianPlayer } from './index';
import JSMpegPlayer from './players/JSMpegPlayer';
import WebRTCPlayer from './players/WebRTCPlayer';
import { getDemoStreamUrls, rtspToWebsocket } from '@/utils/streamingUtils';

const PlayerComparisonDemo = () => {
  const [activeTab, setActiveTab] = useState('streamedian');
  const [customUrl, setCustomUrl] = useState('');
  const [selectedDemo, setSelectedDemo] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const demoStreams = getDemoStreamUrls();
  
  const handlePlay = () => {
    const url = selectedDemo || customUrl;
    if (url) {
      setCurrentUrl(url);
      setIsPlaying(true);
    }
  };
  
  const handleSelectDemo = (value: string) => {
    setSelectedDemo(value);
    setCustomUrl('');
  };
  
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentUrl('');
    setSelectedDemo('');
    setCustomUrl('');
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Video className="mr-2 h-5 w-5" />
          Streaming Player Comparison
        </CardTitle>
        <CardDescription>
          Compare different streaming technologies for camera feeds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="demo-stream">Demo Streams</Label>
            <Select value={selectedDemo} onValueChange={handleSelectDemo}>
              <SelectTrigger id="demo-stream">
                <SelectValue placeholder="Select a demo stream" />
              </SelectTrigger>
              <SelectContent>
                {demoStreams.map((stream) => (
                  <SelectItem key={stream.url} value={stream.url}>
                    {stream.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="custom-url">Custom RTSP URL</Label>
            <div className="flex gap-2">
              <Input
                id="custom-url"
                placeholder="rtsp://username:password@camera-ip:port/stream"
                value={customUrl}
                onChange={(e) => {
                  setCustomUrl(e.target.value);
                  setSelectedDemo('');
                }}
              />
              <Button variant="outline" onClick={handlePlay} disabled={!customUrl && !selectedDemo}>
                <Play className="h-4 w-4 mr-1" />
                Play
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {isPlaying && currentUrl ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="streamedian">Streamedian (RTSP)</TabsTrigger>
              <TabsTrigger value="jsmpeg">JSMpeg (WebSocket)</TabsTrigger>
              <TabsTrigger value="webrtc">WebRTC</TabsTrigger>
            </TabsList>
            
            <TabsContent value="streamedian" className="mt-4">
              <h3 className="text-lg font-medium mb-2">Streamedian Player</h3>
              <p className="text-sm text-gray-500 mb-4">
                HTML5 RTSP player that uses WebSockets for browser compatibility.
                Good balance of quality and compatibility.
              </p>
              <StreamedianPlayer
                rtspUrl={currentUrl}
                autoplay={true}
                muted={true}
                transport="tcp"
                onError={(err) => console.error('Streamedian error:', err)}
              />
            </TabsContent>
            
            <TabsContent value="jsmpeg" className="mt-4">
              <h3 className="text-lg font-medium mb-2">JSMpeg Player</h3>
              <p className="text-sm text-gray-500 mb-4">
                JavaScript MPEG-1 decoder that works over WebSockets.
                Lower quality but excellent compatibility and low latency.
              </p>
              <JSMpegPlayer
                wsUrl={rtspToWebsocket(currentUrl)}
                autoplay={true}
                loop={false}
                onError={(err) => console.error('JSMpeg error:', err)}
              />
              <p className="text-xs text-gray-400 mt-2">
                Note: In a real implementation, a WebSocket proxy server would convert RTSP to MPEG-1 over WebSockets.
              </p>
            </TabsContent>
            
            <TabsContent value="webrtc" className="mt-4">
              <h3 className="text-lg font-medium mb-2">WebRTC Player</h3>
              <p className="text-sm text-gray-500 mb-4">
                Peer-to-peer connection with the lowest latency and highest quality.
                Requires a WebRTC server to handle the RTSP-to-WebRTC conversion.
              </p>
              <WebRTCPlayer
                rtspUrl={currentUrl}
                autoplay={true}
                muted={true}
                onError={(err) => console.error('WebRTC error:', err)}
              />
              <p className="text-xs text-gray-400 mt-2">
                Note: This demo requires a WebRTC server (like webrtc-streamer) running locally or on a server.
              </p>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="p-8 text-center border border-dashed rounded-lg">
            <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
            <h3 className="text-lg font-medium">No Stream Selected</h3>
            <p className="text-sm text-gray-500 mt-1">
              Select a demo stream or enter a custom RTSP URL and press Play
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerComparisonDemo;
