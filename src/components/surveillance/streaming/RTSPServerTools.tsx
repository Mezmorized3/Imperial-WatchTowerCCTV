
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { AlertCircle, Play, Server, Video } from 'lucide-react';
import { executeRtspServer } from '@/utils/osintImplementations';

const RTSPServerTools: React.FC = () => {
  const [listenIp, setListenIp] = useState('0.0.0.0');
  const [listenPort, setListenPort] = useState(8554);
  const [sourcePath, setSourcePath] = useState('');
  const [recordPath, setRecordPath] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [enableTls, setEnableTls] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');

  const handleStartServer = async () => {
    setIsLoading(true);
    try {
      const credentials = username && password ? { username, password } : undefined;
      
      const result = await executeRtspServer({
        listenIp,
        listenPort,
        sourcePath: sourcePath || undefined,
        recordPath: recordPath || undefined,
        credentials,
        enableTls
      });
      
      if (result && result.success) {
        setIsRunning(true);
        setStreamUrl(result.streamUrl || `rtsp://${listenIp}:${listenPort}/live`);
        toast.success('RTSP server started successfully');
      } else {
        toast.error(result?.error || 'Failed to start RTSP server');
      }
    } catch (error) {
      console.error('Error starting RTSP server:', error);
      toast.error('Error starting RTSP server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopServer = () => {
    setIsRunning(false);
    setStreamUrl('');
    toast.info('RTSP server stopped');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Server className="mr-2 h-5 w-5" />
          RTSP Server Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="listenIp">Listen IP</Label>
              <Input
                id="listenIp"
                placeholder="0.0.0.0"
                value={listenIp}
                onChange={(e) => setListenIp(e.target.value)}
                disabled={isRunning || isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="listenPort">Listen Port</Label>
              <Input
                id="listenPort"
                type="number"
                placeholder="8554"
                value={listenPort}
                onChange={(e) => setListenPort(parseInt(e.target.value))}
                disabled={isRunning || isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourcePath">Source Path (Optional)</Label>
            <Input
              id="sourcePath"
              placeholder="rtsp://source.example.com/stream"
              value={sourcePath}
              onChange={(e) => setSourcePath(e.target.value)}
              disabled={isRunning || isLoading}
            />
            <p className="text-xs text-gray-500">
              If provided, the server will act as a proxy for this source stream
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recordPath">Recording Path (Optional)</Label>
            <Input
              id="recordPath"
              placeholder="/recordings"
              value={recordPath}
              onChange={(e) => setRecordPath(e.target.value)}
              disabled={isRunning || isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Authentication (Optional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isRunning || isLoading}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isRunning || isLoading}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enableTls"
              checked={enableTls}
              onCheckedChange={setEnableTls}
              disabled={isRunning || isLoading}
            />
            <Label htmlFor="enableTls">Enable TLS</Label>
          </div>

          <Button
            className="w-full"
            onClick={isRunning ? handleStopServer : handleStartServer}
            disabled={isLoading}
            variant={isRunning ? "destructive" : "default"}
          >
            {isLoading ? (
              'Starting server...'
            ) : isRunning ? (
              <>
                <AlertCircle className="mr-2 h-4 w-4" />
                Stop Server
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start RTSP Server
              </>
            )}
          </Button>

          {isRunning && streamUrl && (
            <div className="p-4 border rounded-md mt-4 bg-black/5 dark:bg-white/5">
              <p className="text-sm font-medium mb-2">Stream URL</p>
              <div className="flex items-center space-x-2">
                <code className="px-2 py-1 bg-black/10 dark:bg-white/10 rounded text-sm overflow-auto flex-grow">
                  {streamUrl}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(streamUrl);
                    toast.info('Stream URL copied to clipboard');
                  }}
                >
                  Copy
                </Button>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm">Stream Preview</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    window.open(`/viewer?url=${encodeURIComponent(streamUrl)}`, '_blank');
                  }}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Open in Viewer
                </Button>
              </div>
              <div className="h-40 bg-black/20 dark:bg-white/5 rounded-md mt-2 flex items-center justify-center">
                <p className="text-sm text-gray-500">
                  Preview not available - open in viewer to watch stream
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RTSPServerTools;
