
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Server, Radio, Video, Shield, Database } from 'lucide-react';
import {
  executeGstRTSPServer,
  executeGortsplib,
  executeRtspSimpleServer,
  executeAgentDVR
} from '@/utils/osintImplementations';

const RTSPServerTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('gstreamer');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // gst-rtsp-server state
  const [gstPort, setGstPort] = useState('8554');
  const [gstMediaPath, setGstMediaPath] = useState('test');
  const [gstAuth, setGstAuth] = useState(false);
  
  // gortsplib state
  const [gortspMode, setGortspMode] = useState('server');
  const [gortspPort, setGortspPort] = useState('8554');
  const [gortspProtocol, setGortspProtocol] = useState('tcp');
  
  // rtsp-simple-server state
  const [rtspPort, setRtspPort] = useState('8554');
  const [rtspSourcePath, setRtspSourcePath] = useState('stream');
  const [rtspHlsEnabled, setRtspHlsEnabled] = useState(true);
  
  // Agent DVR state
  const [agentAction, setAgentAction] = useState('discover');
  const [agentTarget, setAgentTarget] = useState('192.168.1.0/24');

  const handleExecute = async () => {
    setLoading(true);
    setResults(null);
    
    try {
      let result;
      
      switch (activeTab) {
        case 'gstreamer':
          result = await executeGstRTSPServer({
            listenPort: parseInt(gstPort),
            mediaPath: gstMediaPath,
            auth: gstAuth,
            credentials: gstAuth ? { username: 'admin', password: 'admin' } : undefined
          });
          break;
          
        case 'gortsplib':
          result = await executeGortsplib({
            mode: gortspMode as any,
            listenPort: parseInt(gortspPort),
            protocols: [gortspProtocol as any]
          });
          break;
          
        case 'rtspsimple':
          result = await executeRtspSimpleServer({
            listenPort: parseInt(rtspPort),
            sourcePath: rtspSourcePath,
            hlsEnabled: rtspHlsEnabled
          });
          break;
          
        case 'agentdvr':
          result = await executeAgentDVR({
            action: agentAction as any,
            target: agentTarget
          });
          break;
      }
      
      if (result && result.success) {
        setResults(result.data);
        toast.success('Tool executed successfully');
      } else {
        toast.error('Error executing tool');
      }
    } catch (error) {
      console.error('Error executing tool:', error);
      toast.error('Error executing tool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">RTSP Streaming Server Tools</CardTitle>
        <CardDescription>
          Tools for setting up and managing RTSP streaming servers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-6">
            <TabsTrigger value="gstreamer">
              <Video className="h-4 w-4 mr-2" />
              GStreamer RTSP
            </TabsTrigger>
            <TabsTrigger value="gortsplib">
              <Server className="h-4 w-4 mr-2" />
              Go RTSP Lib
            </TabsTrigger>
            <TabsTrigger value="rtspsimple">
              <Radio className="h-4 w-4 mr-2" />
              RTSP Simple
            </TabsTrigger>
            <TabsTrigger value="agentdvr">
              <Database className="h-4 w-4 mr-2" />
              Agent DVR (iSpy)
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gstreamer">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gstPort">Listen Port</Label>
                  <Input
                    id="gstPort"
                    placeholder="8554"
                    value={gstPort}
                    onChange={(e) => setGstPort(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstMediaPath">Media Path</Label>
                  <Input
                    id="gstMediaPath"
                    placeholder="test"
                    value={gstMediaPath}
                    onChange={(e) => setGstMediaPath(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="gstAuth"
                  checked={gstAuth}
                  onCheckedChange={setGstAuth}
                />
                <Label htmlFor="gstAuth">Enable Authentication</Label>
              </div>
              <Button onClick={handleExecute} disabled={loading} className="w-full">
                {loading ? 'Starting server...' : 'Start GStreamer RTSP Server'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="gortsplib">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gortspMode">Mode</Label>
                  <Select value={gortspMode} onValueChange={setGortspMode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="server">Server</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gortspPort">Listen Port</Label>
                  <Input
                    id="gortspPort"
                    placeholder="8554"
                    value={gortspPort}
                    onChange={(e) => setGortspPort(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gortspProtocol">Protocol</Label>
                <Select value={gortspProtocol} onValueChange={setGortspProtocol}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tcp">TCP</SelectItem>
                    <SelectItem value="udp">UDP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleExecute} disabled={loading} className="w-full">
                {loading ? 'Executing...' : 'Execute Go RTSP Lib'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="rtspsimple">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rtspPort">Listen Port</Label>
                  <Input
                    id="rtspPort"
                    placeholder="8554"
                    value={rtspPort}
                    onChange={(e) => setRtspPort(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rtspSourcePath">Source Path</Label>
                  <Input
                    id="rtspSourcePath"
                    placeholder="stream"
                    value={rtspSourcePath}
                    onChange={(e) => setRtspSourcePath(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="rtspHlsEnabled"
                  checked={rtspHlsEnabled}
                  onCheckedChange={setRtspHlsEnabled}
                />
                <Label htmlFor="rtspHlsEnabled">Enable HLS</Label>
              </div>
              <Button onClick={handleExecute} disabled={loading} className="w-full">
                {loading ? 'Starting server...' : 'Start RTSP Simple Server'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="agentdvr">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agentAction">Action</Label>
                  <Select value={agentAction} onValueChange={setAgentAction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discover">Discover Cameras</SelectItem>
                      <SelectItem value="add-camera">Add Camera</SelectItem>
                      <SelectItem value="get-settings">Get Settings</SelectItem>
                      <SelectItem value="start">Start Agent</SelectItem>
                      <SelectItem value="stop">Stop Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agentTarget">Target Network/IP</Label>
                  <Input
                    id="agentTarget"
                    placeholder="192.168.1.0/24"
                    value={agentTarget}
                    onChange={(e) => setAgentTarget(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleExecute} disabled={loading} className="w-full">
                {loading ? 'Executing...' : 'Execute Agent DVR'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {results && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-2">Results</h3>
            <pre className="text-xs overflow-auto max-h-96 p-2 bg-white dark:bg-gray-900 rounded">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RTSPServerTools;
