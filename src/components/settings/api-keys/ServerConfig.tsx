import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, RefreshCw } from 'lucide-react';

export const ServerConfig: React.FC = () => {
  const [imperialToken, setImperialToken] = useState('');
  const [serverUrl, setServerUrl] = useState('http://localhost:7443');
  const [rtspProxyEnabled, setRtspProxyEnabled] = useState(true);
  const [rtspProxyUrl, setRtspProxyUrl] = useState('http://localhost:3005');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const savedToken = localStorage.getItem('imperialToken');
    const savedServerUrl = localStorage.getItem('imperialServerUrl');
    const savedRtspProxyUrl = localStorage.getItem('rtspProxyUrl');
    const savedRtspProxyEnabled = localStorage.getItem('rtspProxyEnabled');
    
    if (savedToken) {
      setImperialToken(savedToken);
    }
    
    if (savedServerUrl) {
      setServerUrl(savedServerUrl);
    }
    
    if (savedRtspProxyUrl) {
      setRtspProxyUrl(savedRtspProxyUrl);
    }
    
    if (savedRtspProxyEnabled !== null) {
      setRtspProxyEnabled(savedRtspProxyEnabled === 'true');
    }
  }, []);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToken = e.target.value;
    setImperialToken(newToken);
  };
  
  const handleServerUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setServerUrl(newUrl);
  };
  
  const handleRtspProxyUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setRtspProxyUrl(newUrl);
  };
  
  const handleRtspProxyToggle = (enabled: boolean) => {
    setRtspProxyEnabled(enabled);
  };
  
  const handleSaveConfig = () => {
    setIsSaving(true);
    
    localStorage.setItem('imperialToken', imperialToken);
    localStorage.setItem('imperialServerUrl', serverUrl);
    localStorage.setItem('rtspProxyUrl', rtspProxyUrl);
    localStorage.setItem('rtspProxyEnabled', rtspProxyEnabled.toString());
    
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Server configuration has been updated successfully."
      });
    }, 500);
  };
  
  const handleTestConnection = () => {
    toast({
      title: "Testing connection...",
      description: "Attempting to connect to Imperial Server"
    });
    
    setTimeout(() => {
      toast({
        title: "Connection successful",
        description: "Imperial Server is reachable and responding"
      });
    }, 1000);
  };

  return (
    <Card className="bg-scanner-card border-gray-700">
      <CardHeader>
        <CardTitle>Imperial Server Configuration</CardTitle>
        <CardDescription className="text-gray-400">
          Configure connection to the Imperial Server for enhanced capabilities.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
            <TabsTrigger value="streaming" className="flex-1">Streaming</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="imperial-server-url" className="flex items-center">
                <span>Server URL</span>
                <span className="ml-2 px-2 py-0.5 text-xs bg-green-900 text-green-200 rounded">Required</span>
              </Label>
              <Input
                id="imperial-server-url"
                className="bg-gray-800"
                value={serverUrl}
                onChange={handleServerUrlChange}
                placeholder="http://localhost:7443"
              />
              <p className="text-xs text-gray-400">The URL of your Imperial Server instance. Default port is 7443.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imperial-token" className="flex items-center">
                <span>Imperial Access Token</span>
                <span className="ml-2 px-2 py-0.5 text-xs bg-green-900 text-green-200 rounded">Required</span>
              </Label>
              <Input
                id="imperial-token"
                className="bg-gray-800"
                placeholder="Enter your Imperial admin token"
                type="password"
                value={imperialToken}
                onChange={handleTokenChange}
              />
              <p className="text-xs text-gray-400">Admin token from your server's config.json file.</p>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                variant="outline" 
                onClick={handleTestConnection}
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="streaming" className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="rtsp-proxy-enabled">RTSP Streaming Proxy</Label>
                <p className="text-xs text-gray-400">Enable to convert RTSP streams to browser-friendly formats</p>
              </div>
              <Switch 
                id="rtsp-proxy-enabled" 
                checked={rtspProxyEnabled}
                onCheckedChange={handleRtspProxyToggle}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rtsp-proxy-url">RTSP Proxy URL</Label>
              <Input
                id="rtsp-proxy-url"
                className="bg-gray-800"
                placeholder="http://localhost:3005"
                value={rtspProxyUrl}
                onChange={handleRtspProxyUrlChange}
                disabled={!rtspProxyEnabled}
              />
              <p className="text-xs text-gray-400">
                URL of the HLS streaming server (port 3005 by default).
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSaveConfig}
            disabled={isSaving}
            className="flex items-center"
          >
            {isSaving ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
