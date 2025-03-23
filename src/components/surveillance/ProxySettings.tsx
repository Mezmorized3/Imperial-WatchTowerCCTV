import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ProxyConfig } from "@/utils/osintToolTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Shield, RefreshCw, Globe, Server, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { testProxyConnection } from "@/utils/networkScanner";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProxySettingsProps {
  onProxyChange: (config: ProxyConfig) => void;
  initialConfig?: ProxyConfig;
}

const defaultProxyConfig: ProxyConfig = {
  enabled: false,
  type: 'http',
  host: '',
  port: 8080,
  username: '',
  password: '',
  useAuthentication: false,
  rotationEnabled: false,
  rotationInterval: 300,
  proxyList: []
};

const ProxySettings: React.FC<ProxySettingsProps> = ({ onProxyChange, initialConfig }) => {
  const [proxyConfig, setProxyConfig] = useState<ProxyConfig>(initialConfig || defaultProxyConfig);
  const [activeTab, setActiveTab] = useState<string>("custom");
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [proxyListInput, setProxyListInput] = useState<string>('');
  const [testDetails, setTestDetails] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedConfig = localStorage.getItem('proxyConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setProxyConfig(parsedConfig);
        
        if (parsedConfig.proxyList && parsedConfig.proxyList.length > 0) {
          setProxyListInput(parsedConfig.proxyList.join('\n'));
        }
      } catch (e) {
        console.error('Error parsing saved proxy config:', e);
      }
    }
  }, []);

  useEffect(() => {
    onProxyChange(proxyConfig);
    localStorage.setItem('proxyConfig', JSON.stringify(proxyConfig));
  }, [proxyConfig, onProxyChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setProxyConfig({
        ...proxyConfig,
        [name]: parseInt(value, 10)
      });
    } else {
      setProxyConfig({
        ...proxyConfig,
        [name]: value
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setProxyConfig({
      ...proxyConfig,
      [name]: checked
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setProxyConfig({
      ...proxyConfig,
      [name]: value
    });
  };

  const applyPreset = (preset: Partial<ProxyConfig>) => {
    setProxyConfig({
      ...proxyConfig,
      ...preset
    });
    setActiveTab("custom");
    
    toast({
      title: "Proxy Preset Applied",
      description: `Applied preset configuration. Don't forget to enable the proxy.`,
    });
  };

  const testProxyConnectionHandler = async () => {
    if (!proxyConfig.host || !proxyConfig.port) {
      toast({
        title: "Validation Error",
        description: "Host and port are required to test proxy connection.",
        variant: "destructive",
      });
      return;
    }
    
    setTestStatus('testing');
    setTestDetails(null);
    
    try {
      const result = await testProxyConnection(proxyConfig);
      
      if (result.success) {
        setTestStatus('success');
        setTestDetails(result.details);
        
        toast({
          title: "Proxy Connection Successful",
          description: `Connected to ${proxyConfig.host}:${proxyConfig.port} with ${result.latency}ms latency`,
          variant: "default",
        });
      } else {
        setTestStatus('failed');
        
        toast({
          title: "Proxy Connection Failed",
          description: result.error || "Could not connect to proxy server",
          variant: "destructive",
        });
      }
    } catch (error) {
      setTestStatus('failed');
      
      toast({
        title: "Connection Test Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleProxyListChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProxyListInput(e.target.value);
  };

  const updateProxyList = () => {
    if (!proxyListInput.trim()) {
      toast({
        title: "Empty Proxy List",
        description: "Please enter at least one proxy in the format host:port.",
        variant: "destructive",
      });
      return;
    }
    
    const proxyList = proxyListInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    setProxyConfig({
      ...proxyConfig,
      proxyList,
      rotationEnabled: proxyList.length > 0
    });
    
    toast({
      title: "Proxy List Updated",
      description: `Added ${proxyList.length} proxies to rotation list.`,
    });
  };

  const importProxyList = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        const content = evt.target.result.toString();
        setProxyListInput(content);
        
        toast({
          title: "Proxy List Imported",
          description: "Please review and click 'Update Proxy List' to save changes.",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" /> Advanced Proxy Settings
        </CardTitle>
        <CardDescription>
          Configure proxy settings to hide your real IP address during scanning operations and enhance your OPSEC.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="proxyEnabled" className="font-medium">Enable Proxy</Label>
            {proxyConfig.enabled && (
              <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-500 text-xs">
                Active
              </Badge>
            )}
          </div>
          <Switch
            id="proxyEnabled"
            checked={proxyConfig.enabled}
            onCheckedChange={(checked) => handleSwitchChange('enabled', checked)}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="custom"><Server className="h-4 w-4 mr-1" />Custom Proxy</TabsTrigger>
            <TabsTrigger value="presets"><Globe className="h-4 w-4 mr-1" />Presets</TabsTrigger>
            <TabsTrigger value="rotation"><RefreshCw className="h-4 w-4 mr-1" />Proxy Rotation</TabsTrigger>
            <TabsTrigger value="advanced"><Lock className="h-4 w-4 mr-1" />Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="custom" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proxyType">Proxy Type</Label>
                <Select 
                  value={proxyConfig.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger id="proxyType">
                    <SelectValue placeholder="Select proxy type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="http">HTTP</SelectItem>
                    <SelectItem value="https">HTTPS</SelectItem>
                    <SelectItem value="socks4">SOCKS4</SelectItem>
                    <SelectItem value="socks5">SOCKS5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="proxyPort">Port</Label>
                <Input
                  id="proxyPort"
                  name="port"
                  type="number"
                  value={proxyConfig.port}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proxyHost">Host</Label>
              <Input
                id="proxyHost"
                name="host"
                value={proxyConfig.host}
                onChange={handleInputChange}
                placeholder="e.g., 127.0.0.1 or proxy.example.com"
              />
            </div>
            
            <div className="flex justify-between items-center my-4">
              <Label htmlFor="useAuthentication" className="font-medium">Authentication</Label>
              <Switch
                id="useAuthentication"
                checked={proxyConfig.useAuthentication}
                onCheckedChange={(checked) => handleSwitchChange('useAuthentication', checked)}
              />
            </div>
            
            {proxyConfig.useAuthentication && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proxyUsername">Username</Label>
                  <Input
                    id="proxyUsername"
                    name="username"
                    value={proxyConfig.username}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="proxyPassword">Password</Label>
                  <Input
                    id="proxyPassword"
                    name="password"
                    type="password"
                    value={proxyConfig.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={testProxyConnectionHandler}
                disabled={testStatus === 'testing' || !proxyConfig.host}
              >
                {testStatus === 'testing' ? "Testing..." : "Test Connection"}
              </Button>
              
              {testStatus === 'success' && (
                <div className="flex items-center text-green-500">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>Connected</span>
                </div>
              )}
              
              {testStatus === 'failed' && (
                <div className="flex items-center text-red-500">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>Failed</span>
                </div>
              )}
            </div>
            
            {testStatus === 'testing' && (
              <Progress value={50} className="h-2 animate-pulse" />
            )}
            
            {testDetails && (
              <div className="mt-4 p-3 border rounded bg-gray-800 border-gray-700 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">External IP:</span>
                  <span>{testDetails.externalIp}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Location:</span>
                  <span>{testDetails.location?.city}, {testDetails.location?.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Provider:</span>
                  <span>{testDetails.provider}</span>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="presets" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => applyPreset({
                type: 'socks5',
                host: '127.0.0.1',
                port: 9050,
                useAuthentication: false
              })}>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">TOR Network</CardTitle>
                  <CardDescription>Use the TOR network via local proxy</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm">SOCKS5 - 127.0.0.1:9050</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="mt-2"
                  >
                    Apply
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => applyPreset({
                type: 'http',
                host: '127.0.0.1',
                port: 8118,
                useAuthentication: false
              })}>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Privoxy</CardTitle>
                  <CardDescription>Local HTTP proxy with good filtering</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm">HTTP - 127.0.0.1:8118</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="mt-2"
                  >
                    Apply
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => applyPreset({
                type: 'http',
                host: '127.0.0.1',
                port: 8080,
                useAuthentication: false
              })}>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Burp Suite</CardTitle>
                  <CardDescription>Local proxy for security testing</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm">HTTP - 127.0.0.1:8080</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="mt-2"
                  >
                    Apply
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => applyPreset({
                type: 'socks5',
                host: '127.0.0.1',
                port: 1080,
                useAuthentication: false
              })}>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">SSH Tunnel</CardTitle>
                  <CardDescription>Dynamic SSH tunnel proxy</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm">SOCKS5 - 127.0.0.1:1080</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="mt-2"
                  >
                    Apply
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => applyPreset({
                type: 'http',
                host: 'localhost',
                port: 8888,
                useAuthentication: false
              })}>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">Charles Proxy</CardTitle>
                  <CardDescription>HTTP debugging proxy application</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm">HTTP - localhost:8888</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="mt-2"
                  >
                    Apply
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => applyPreset({
                type: 'http',
                host: 'localhost',
                port: 8082,
                useAuthentication: false
              })}>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">ZAP Proxy</CardTitle>
                  <CardDescription>OWASP Zed Attack Proxy</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm">HTTP - localhost:8082</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="mt-2"
                  >
                    Apply
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="rotation" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="rotationEnabled" className="font-medium">Enable Proxy Rotation</Label>
              <Switch
                id="rotationEnabled"
                checked={proxyConfig.rotationEnabled}
                onCheckedChange={(checked) => handleSwitchChange('rotationEnabled', checked)}
              />
            </div>
            
            {proxyConfig.rotationEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="rotationInterval">Rotation Interval (seconds)</Label>
                  <Input
                    id="rotationInterval"
                    name="rotationInterval"
                    type="number"
                    value={proxyConfig.rotationInterval}
                    onChange={handleInputChange}
                    min={5}
                  />
                  <p className="text-xs text-gray-500">Minimum 5 seconds recommended</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="proxyList">Proxy List (one per line, format: host:port)</Label>
                    <input
                      type="file"
                      id="proxyListFile"
                      onChange={importProxyList}
                      className="hidden"
                      accept=".txt,.csv,.list"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => document.getElementById('proxyListFile')?.click()}
                    >
                      Import File
                    </Button>
                  </div>
                  <textarea
                    id="proxyList"
                    className="w-full h-32 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="127.0.0.1:8080
proxy1.example.com:3128
proxy2.example.com:8080"
                    value={proxyListInput}
                    onChange={handleProxyListChange}
                  />
                </div>
                
                <Button 
                  onClick={updateProxyList}
                  variant="default"
                >
                  Update Proxy List
                </Button>
                
                {proxyConfig.proxyList && proxyConfig.proxyList.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Current List: {proxyConfig.proxyList.length} proxies</p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="connectionTimeout">Connection Timeout (ms)</Label>
                <Input
                  id="connectionTimeout"
                  name="connectionTimeout"
                  type="number"
                  value={proxyConfig.connectionTimeout || 30000}
                  onChange={(e) => setProxyConfig({
                    ...proxyConfig, 
                    connectionTimeout: parseInt(e.target.value, 10)
                  })}
                  placeholder="30000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxRetries">Maximum Retries</Label>
                <Input
                  id="maxRetries"
                  name="maxRetries"
                  type="number"
                  value={proxyConfig.maxRetries || 3}
                  onChange={(e) => setProxyConfig({
                    ...proxyConfig, 
                    maxRetries: parseInt(e.target.value, 10)
                  })}
                  placeholder="3"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="dnsFallback">DNS Leak Protection</Label>
                <Switch
                  id="dnsFallback"
                  checked={proxyConfig.dnsProtection || false}
                  onCheckedChange={(checked) => setProxyConfig({
                    ...proxyConfig,
                    dnsProtection: checked
                  })}
                />
              </div>
              <p className="text-xs text-gray-500">
                Prevents DNS requests from bypassing the proxy and revealing your real IP address.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="forceTls">Force TLS Encryption</Label>
                <Switch
                  id="forceTls"
                  checked={proxyConfig.forceTls || false}
                  onCheckedChange={(checked) => setProxyConfig({
                    ...proxyConfig,
                    forceTls: checked
                  })}
                />
              </div>
              <p className="text-xs text-gray-500">
                Enforces TLS encryption for proxy communication when possible.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="autoReconnect">Auto Reconnect</Label>
                <Switch
                  id="autoReconnect"
                  checked={proxyConfig.autoReconnect || false}
                  onCheckedChange={(checked) => setProxyConfig({
                    ...proxyConfig,
                    autoReconnect: checked
                  })}
                />
              </div>
              <p className="text-xs text-gray-500">
                Automatically attempts to reconnect if the proxy connection drops.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProxySettings;
