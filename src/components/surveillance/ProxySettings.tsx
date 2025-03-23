
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCcw, Shield, Globe, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { ProxyConfig } from '@/utils/osintToolTypes';
import { PROXY_PRESETS, testProxy, getAvailableProxies } from '@/utils/proxyUtils';
import { useToast } from '@/components/ui/use-toast';

interface ProxySettingsProps {
  proxyConfig: ProxyConfig | undefined;
  onProxyChange: (proxy: ProxyConfig) => void;
  compact?: boolean;
}

const ProxySettings: React.FC<ProxySettingsProps> = ({ 
  proxyConfig, 
  onProxyChange,
  compact = false
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("manual");
  const [availableProxies, setAvailableProxies] = useState<ProxyConfig[]>([]);
  const [isLoadingProxies, setIsLoadingProxies] = useState<boolean>(false);
  const [isTestingProxy, setIsTestingProxy] = useState<boolean>(false);
  const [proxyTestResult, setProxyTestResult] = useState<boolean | null>(null);

  // Default proxy config if none provided
  const defaultProxy: ProxyConfig = {
    enabled: false,
    type: 'http',
    host: '127.0.0.1',
    port: 8080,
    rotation: false
  };

  // Use the provided proxy config or default
  const [proxy, setProxy] = useState<ProxyConfig>(proxyConfig || defaultProxy);

  // Update internal state when prop changes
  useEffect(() => {
    if (proxyConfig) {
      setProxy(proxyConfig);
    }
  }, [proxyConfig]);

  // Load available proxies when the component mounts
  useEffect(() => {
    if (activeTab === 'list') {
      fetchAvailableProxies();
    }
  }, [activeTab]);

  const fetchAvailableProxies = async () => {
    setIsLoadingProxies(true);
    try {
      const proxies = await getAvailableProxies();
      setAvailableProxies(proxies);
    } catch (error) {
      console.error('Error fetching proxies:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available proxies",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProxies(false);
    }
  };

  const handleProxyToggle = (enabled: boolean) => {
    const updatedProxy = { ...proxy, enabled };
    setProxy(updatedProxy);
    onProxyChange(updatedProxy);
    
    toast({
      title: enabled ? "Proxy Enabled" : "Proxy Disabled",
      description: enabled ? 
        `Using ${proxy.type.toUpperCase()} proxy at ${proxy.host}:${proxy.port}` : 
        "Tools will connect directly without a proxy",
      duration: 3000,
    });
  };

  const handleProxyChange = (field: keyof ProxyConfig, value: any) => {
    const updatedProxy = { ...proxy, [field]: value };
    setProxy(updatedProxy);
    onProxyChange(updatedProxy);
    
    // Reset test result when configuration changes
    setProxyTestResult(null);
  };

  const handleProxyTypeChange = (type: string) => {
    handleProxyChange('type', type);
  };

  const handleRotationToggle = (enabled: boolean) => {
    handleProxyChange('rotation', enabled);
    
    if (enabled && !proxy.rotationInterval) {
      handleProxyChange('rotationInterval', 60);
    }
  };

  const handlePresetSelection = (presetKey: keyof typeof PROXY_PRESETS) => {
    const presetProxy = PROXY_PRESETS[presetKey];
    setProxy({ ...presetProxy, enabled: true });
    onProxyChange({ ...presetProxy, enabled: true });
    
    toast({
      title: `${presetKey} Proxy Selected`,
      description: `Using ${presetProxy.type.toUpperCase()} proxy at ${presetProxy.host}:${presetProxy.port}`,
      duration: 3000,
    });
  };

  const handleSelectProxy = (index: number) => {
    if (index >= 0 && index < availableProxies.length) {
      const selectedProxy = availableProxies[index];
      setProxy({ ...selectedProxy, enabled: true });
      onProxyChange({ ...selectedProxy, enabled: true });
      
      toast({
        title: "Proxy Selected",
        description: `Using ${selectedProxy.type.toUpperCase()} proxy at ${selectedProxy.host}:${selectedProxy.port}`,
        duration: 3000,
      });
    }
  };

  const handleTestProxy = async () => {
    setIsTestingProxy(true);
    setProxyTestResult(null);
    
    try {
      const result = await testProxy(proxy);
      setProxyTestResult(result);
      
      toast({
        title: result ? "Proxy Working" : "Proxy Failed",
        description: result ? 
          `Successfully connected to ${proxy.host}:${proxy.port}` : 
          `Could not connect to ${proxy.host}:${proxy.port}`,
        variant: result ? "default" : "destructive",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error testing proxy:', error);
      setProxyTestResult(false);
      
      toast({
        title: "Test Error",
        description: "An error occurred while testing the proxy",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsTestingProxy(false);
    }
  };

  // Compact view just shows a toggle and minimal info
  if (compact) {
    return (
      <div className="flex items-center space-x-4 p-2 border rounded-md">
        <div className="flex items-center space-x-2">
          <Switch 
            id="proxy-toggle-compact"
            checked={proxy.enabled}
            onCheckedChange={handleProxyToggle}
          />
          <Label htmlFor="proxy-toggle-compact">Proxy</Label>
        </div>
        
        {proxy.enabled && (
          <Badge variant={proxyTestResult === true ? "success" : proxyTestResult === false ? "destructive" : "outline"}>
            {proxy.type.toUpperCase()}: {proxy.host}:{proxy.port}
          </Badge>
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleTestProxy}
                disabled={!proxy.enabled || isTestingProxy}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Test proxy connection</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  // Full view with all options
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="mr-2 h-5 w-5" />
          Proxy Settings
        </CardTitle>
        <CardDescription>
          Configure proxy servers for anonymity and routing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center space-x-2">
          <Switch 
            id="proxy-toggle"
            checked={proxy.enabled}
            onCheckedChange={handleProxyToggle}
          />
          <Label htmlFor="proxy-toggle">Enable Proxy</Label>
          
          {proxyTestResult !== null && (
            <Badge variant={proxyTestResult ? "success" : "destructive"} className="ml-auto">
              {proxyTestResult ? (
                <span className="flex items-center">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Working
                </span>
              ) : (
                <span className="flex items-center">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Failed
                </span>
              )}
            </Badge>
          )}
        </div>
        
        {proxy.enabled && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="manual" className="flex-1">Manual Configuration</TabsTrigger>
              <TabsTrigger value="presets" className="flex-1">Presets</TabsTrigger>
              <TabsTrigger value="list" className="flex-1">Proxy List</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <Label htmlFor="proxy-type">Type</Label>
                    <Select 
                      value={proxy.type} 
                      onValueChange={handleProxyTypeChange}
                    >
                      <SelectTrigger id="proxy-type">
                        <SelectValue placeholder="Proxy Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="http">HTTP</SelectItem>
                        <SelectItem value="https">HTTPS</SelectItem>
                        <SelectItem value="socks4">SOCKS4</SelectItem>
                        <SelectItem value="socks5">SOCKS5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="proxy-host">Host</Label>
                    <Input
                      id="proxy-host"
                      value={proxy.host}
                      onChange={(e) => handleProxyChange('host', e.target.value)}
                      placeholder="Proxy hostname or IP"
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <Label htmlFor="proxy-port">Port</Label>
                    <Input
                      id="proxy-port"
                      type="number"
                      value={proxy.port}
                      onChange={(e) => handleProxyChange('port', parseInt(e.target.value) || 0)}
                      placeholder="Port"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="proxy-username">Username (Optional)</Label>
                    <Input
                      id="proxy-username"
                      value={proxy.username || ''}
                      onChange={(e) => handleProxyChange('username', e.target.value)}
                      placeholder="Username"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="proxy-password">Password (Optional)</Label>
                    <Input
                      id="proxy-password"
                      type="password"
                      value={proxy.password || ''}
                      onChange={(e) => handleProxyChange('password', e.target.value)}
                      placeholder="Password"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="proxy-rotation"
                    checked={proxy.rotation || false}
                    onCheckedChange={handleRotationToggle}
                  />
                  <Label htmlFor="proxy-rotation">Enable Proxy Rotation</Label>
                </div>
                
                {proxy.rotation && (
                  <div>
                    <Label htmlFor="rotation-interval">Rotation Interval (seconds)</Label>
                    <Input
                      id="rotation-interval"
                      type="number"
                      value={proxy.rotationInterval || 60}
                      onChange={(e) => handleProxyChange('rotationInterval', parseInt(e.target.value) || 60)}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="presets">
              <div className="grid grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => handlePresetSelection('TOR')}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">TOR Network</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-gray-500">SOCKS5 127.0.0.1:9050</p>
                    <Badge className="mt-2">Anonymous</Badge>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => handlePresetSelection('PRIVOXY')}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Privoxy</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-gray-500">HTTP 127.0.0.1:8118</p>
                    <Badge className="mt-2">Content Filter</Badge>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => handlePresetSelection('BURP')}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Burp Suite</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-gray-500">HTTP 127.0.0.1:8080</p>
                    <Badge className="mt-2">Intercept</Badge>
                  </CardContent>
                </Card>
              </div>
              
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Make sure the selected proxy service is running on your system.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="list">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Available Proxies</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchAvailableProxies}
                    disabled={isLoadingProxies}
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
                
                {isLoadingProxies ? (
                  <div className="text-center py-4">Loading available proxies...</div>
                ) : availableProxies.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableProxies.map((availableProxy, index) => (
                      <div 
                        key={`${availableProxy.host}:${availableProxy.port}`} 
                        className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleSelectProxy(index)}
                      >
                        <div>
                          <p className="font-medium">{availableProxy.host}:{availableProxy.port}</p>
                          <p className="text-xs text-gray-500">{availableProxy.type.toUpperCase()}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Select
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">No proxies available</div>
                )}
                
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Using public proxies may reduce your anonymity. Consider using your own proxies for sensitive operations.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        {proxy.enabled && (
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              onClick={handleTestProxy}
              disabled={isTestingProxy}
            >
              {isTestingProxy ? "Testing..." : "Test Connection"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProxySettings;
