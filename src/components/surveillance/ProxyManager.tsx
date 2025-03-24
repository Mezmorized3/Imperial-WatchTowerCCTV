
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProxyConfig } from "@/utils/types/baseTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Shield, Globe, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { testProxyConnection, rotateProxy } from "@/utils/networkScanner";
import { Badge } from "@/components/ui/badge";
import ProxySettings from "./ProxySettings";

interface ProxyManagerProps {
  onProxyChange?: (config: ProxyConfig) => void;
}

const ProxyManager: React.FC<ProxyManagerProps> = ({ onProxyChange }) => {
  const [proxyConfig, setProxyConfig] = useState<ProxyConfig>({
    enabled: false,
    type: 'http',
    host: '',
    port: 8080,
    useAuthentication: false,
    rotationEnabled: false,
    rotationInterval: 300,
    proxyList: []
  });

  const [activeTab, setActiveTab] = useState<string>("settings");
  const [proxyStatus, setProxyStatus] = useState<{
    isActive: boolean;
    lastTested: Date | null;
    currentProxy: string | null;
    rotationsCount: number;
    trafficStats: {
      sent: number;
      received: number;
      blocked: number;
    };
  }>({
    isActive: false,
    lastTested: null,
    currentProxy: null,
    rotationsCount: 0,
    trafficStats: {
      sent: 0,
      received: 0,
      blocked: 0
    }
  });

  const { toast } = useToast();
  
  useEffect(() => {
    const savedConfig = localStorage.getItem('proxyConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setProxyConfig(parsedConfig);
        
        if (parsedConfig.enabled) {
          testProxyConnectionHandler(parsedConfig);
        }
      } catch (e) {
        console.error('Error parsing saved proxy config:', e);
      }
    }
    
    let rotationInterval: NodeJS.Timeout | null = null;
    
    if (proxyConfig.enabled && proxyConfig.rotationEnabled && proxyConfig.proxyList?.length > 0) {
      rotationInterval = setInterval(() => {
        rotateProxyHandler();
      }, (proxyConfig.rotationInterval || 300) * 1000);
    }
    
    return () => {
      if (rotationInterval) {
        clearInterval(rotationInterval);
      }
    };
  }, [proxyConfig.enabled, proxyConfig.rotationEnabled, proxyConfig.rotationInterval]);
  
  useEffect(() => {
    if (onProxyChange) {
      onProxyChange(proxyConfig);
    }
  }, [proxyConfig, onProxyChange]);

  const handleProxyChange = (config: ProxyConfig) => {
    setProxyConfig(config);
    
    setProxyStatus(prev => ({
      ...prev,
      isActive: config.enabled
    }));
    
    console.log(`Proxy configuration updated: ${config.type}://${config.host}:${config.port} (Enabled: ${config.enabled})`);
  };

  const testProxyConnectionHandler = async (configToTest?: ProxyConfig) => {
    const config = configToTest || proxyConfig;
    
    if (!config.host || !config.port) {
      toast({
        title: "Validation Error",
        description: "Host and port are required to test proxy connection.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Testing Proxy Connection",
      description: `Testing ${config.type} proxy at ${config.host}:${config.port}...`,
    });
    
    try {
      const result = await testProxyConnection(config);
      
      if (result.success) {
        setProxyStatus(prev => ({
          ...prev,
          isActive: true,
          lastTested: new Date(),
          currentProxy: `${config.host}:${config.port}`
        }));
        
        toast({
          title: "Proxy Connection Successful",
          description: `Connected to ${config.host}:${config.port} with ${result.latency}ms latency`,
          variant: "default",
        });
      } else {
        setProxyStatus(prev => ({
          ...prev,
          isActive: false,
          lastTested: new Date()
        }));
        
        toast({
          title: "Proxy Connection Failed",
          description: result.error || "Could not connect to proxy server",
          variant: "destructive",
        });
        
        if (config.autoReconnect !== true) {
          setProxyConfig({
            ...config,
            enabled: false
          });
          
          toast({
            title: "Proxy Disabled",
            description: "Proxy has been disabled due to connection failure",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      setProxyStatus(prev => ({
        ...prev,
        isActive: false,
        lastTested: new Date()
      }));
      
      toast({
        title: "Connection Test Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const rotateProxyHandler = async () => {
    if (!proxyConfig.rotationEnabled || !proxyConfig.proxyList || proxyConfig.proxyList.length === 0) {
      return;
    }
    
    try {
      const nextProxy = await rotateProxy(proxyConfig.proxyList, proxyStatus.currentProxy || undefined);
      
      if (nextProxy) {
        const [host, portStr] = nextProxy.split(':');
        const port = parseInt(portStr, 10);
        
        if (host && !isNaN(port)) {
          const updatedConfig = {
            ...proxyConfig,
            host,
            port
          };
          
          setProxyConfig(updatedConfig);
          
          setProxyStatus(prev => ({
            ...prev,
            currentProxy: nextProxy,
            rotationsCount: prev.rotationsCount + 1,
            trafficStats: {
              ...prev.trafficStats,
              sent: prev.trafficStats.sent + Math.floor(Math.random() * 50),
              received: prev.trafficStats.received + Math.floor(Math.random() * 30)
            }
          }));
          
          console.log(`Proxy rotated to: ${nextProxy}`);
          
          if (onProxyChange) {
            onProxyChange(updatedConfig);
          }
        }
      }
    } catch (error) {
      console.error("Error rotating proxy:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" /> Proxy Manager
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {proxyConfig.enabled ? (
              <Badge className="bg-green-600">Active</Badge>
            ) : (
              <Badge variant="outline" className="text-gray-400">Inactive</Badge>
            )}
            
            {proxyConfig.rotationEnabled && (
              <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-500">
                Auto-Rotation
              </Badge>
            )}
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => testProxyConnectionHandler()}
              disabled={!proxyConfig.host || !proxyConfig.port}
            >
              Test Connection
            </Button>
            
            {proxyConfig.rotationEnabled && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={rotateProxyHandler}
                disabled={!proxyConfig.proxyList || proxyConfig.proxyList.length === 0}
              >
                Rotate Now
              </Button>
            )}
          </div>
        </div>
        
        <CardDescription>
          Configure and monitor your proxy connections for secure scanning operations.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-1">
          <TabsList className="w-full">
            <TabsTrigger value="settings">
              <Shield className="h-4 w-4 mr-1" />Settings
            </TabsTrigger>
            <TabsTrigger value="monitor">
              <Activity className="h-4 w-4 mr-1" />Monitor
            </TabsTrigger>
            <TabsTrigger value="status">
              <Globe className="h-4 w-4 mr-1" />Status
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="mt-4">
            <ProxySettings onProxyChange={handleProxyChange} initialConfig={proxyConfig} />
          </TabsContent>
          
          <TabsContent value="monitor" className="mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Current Proxy</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {proxyStatus.currentProxy ? (
                      <div className="flex flex-col">
                        <span className="text-lg font-medium">{proxyStatus.currentProxy}</span>
                        <span className="text-sm text-gray-400">{proxyConfig.type.toUpperCase()}</span>
                      </div>
                    ) : (
                      <div className="text-gray-400">No active proxy</div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Rotations</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-col">
                      <span className="text-lg font-medium">{proxyStatus.rotationsCount}</span>
                      <span className="text-sm text-gray-400">
                        {proxyConfig.rotationEnabled ? 
                          `Every ${proxyConfig.rotationInterval}s` : 
                          'Rotation disabled'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Traffic</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Sent:</span>
                        <span>{proxyStatus.trafficStats.sent} KB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Received:</span>
                        <span>{proxyStatus.trafficStats.received} KB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Blocked:</span>
                        <span>{proxyStatus.trafficStats.blocked} KB</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {proxyConfig.rotationEnabled && proxyConfig.proxyList && proxyConfig.proxyList.length > 0 && (
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Available Proxies</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {proxyConfig.proxyList.slice(0, 12).map((proxy, index) => (
                        <div 
                          key={index} 
                          className={`p-2 rounded border text-sm ${proxy === proxyStatus.currentProxy ? 
                            'bg-green-900/20 border-green-700' : 'border-gray-700'}`}
                        >
                          {proxy}
                        </div>
                      ))}
                      {proxyConfig.proxyList.length > 12 && (
                        <div className="p-2 rounded border border-gray-700 text-sm text-gray-400">
                          +{proxyConfig.proxyList.length - 12} more
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="status" className="mt-4">
            <div className="space-y-4">
              <Card className={`border ${proxyConfig.enabled ? 'border-green-600' : 'border-red-600'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {proxyConfig.enabled ? (
                      <div className="p-2 bg-green-900/20 rounded-full">
                        <Shield className="h-6 w-6 text-green-500" />
                      </div>
                    ) : (
                      <div className="p-2 bg-red-900/20 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-medium">
                        {proxyConfig.enabled ? 'Proxy Protection Active' : 'Proxy Protection Inactive'}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {proxyConfig.enabled 
                          ? `Using ${proxyConfig.type.toUpperCase()} proxy at ${proxyConfig.host}:${proxyConfig.port}` 
                          : 'Enable proxy protection to hide your real IP address'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Connection Status</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Tested:</span>
                        <span>
                          {proxyStatus.lastTested 
                            ? proxyStatus.lastTested.toLocaleTimeString() 
                            : 'Never'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span>{proxyConfig.type.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Authentication:</span>
                        <span>{proxyConfig.useAuthentication ? 'Enabled' : 'Disabled'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Auto-Reconnect:</span>
                        <span>{proxyConfig.autoReconnect ? 'Enabled' : 'Disabled'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Security Features</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">DNS Leak Protection:</span>
                        <span>{proxyConfig.dnsProtection ? 'Enabled' : 'Disabled'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">TLS Encryption:</span>
                        <span>{proxyConfig.forceTls ? 'Enforced' : 'Optional'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Auto-Rotation:</span>
                        <span>
                          {proxyConfig.rotationEnabled 
                            ? `Every ${proxyConfig.rotationInterval}s`
                            : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Available Proxies:</span>
                        <span>{proxyConfig.proxyList?.length || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProxyManager;
