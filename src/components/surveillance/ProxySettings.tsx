
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Network, RefreshCw, Lock } from 'lucide-react';
import { ProxyConfig } from '@/utils/types/baseTypes';
import { toast } from '@/components/ui/use-toast';

interface ProxySettingsProps {
  initialConfig: ProxyConfig;
  onProxyChange?: (newConfig: ProxyConfig) => void;
}

// Simulate testing proxy connection
const testProxyConnection = async (config: ProxyConfig) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const success = Math.random() > 0.3; // 70% chance of success
  
  return {
    success,
    latency: success ? Math.floor(Math.random() * 200) + 50 : 0,
    error: success ? undefined : 'Connection timed out',
    externalIp: success ? `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` : undefined
  };
};

const ProxySettings: React.FC<ProxySettingsProps> = ({ initialConfig, onProxyChange }) => {
  const [config, setConfig] = useState<ProxyConfig>(initialConfig || {
    type: 'http',
    enabled: false,
    host: '',
    port: 8080,
    useTor: false
  });
  
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latency?: number;
    error?: string;
    externalIp?: string;
  } | null>(null);
  
  const handleToggleProxy = (enabled: boolean) => {
    const newConfig = { ...config, enabled };
    setConfig(newConfig);
    if (onProxyChange) onProxyChange(newConfig);
  };
  
  const handleToggleTor = (useTor: boolean) => {
    const newConfig = { ...config, useTor };
    setConfig(newConfig);
    if (onProxyChange) onProxyChange(newConfig);
  };
  
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testProxyConnection(config);
      setTestResult(result);
      
      if (result.success) {
        toast({
          title: "Connection Successful",
          description: result.externalIp ? `Your external IP: ${result.externalIp}` : "Proxy connection established successfully",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: result.error || "Failed to connect to proxy",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Proxy test error:', error);
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      });
      
      toast({
        title: "Connection Test Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  return (
    <Card className="border-gray-700 bg-scanner-dark shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-scanner-primary" />
          Proxy Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="proxy-enabled" className="text-sm flex items-center cursor-pointer">
            <Network className="h-4 w-4 mr-2" />
            Enable Proxy
          </Label>
          <Switch
            id="proxy-enabled"
            checked={config.enabled}
            onCheckedChange={handleToggleProxy}
          />
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="proxy-type">Proxy Type</Label>
            <Select
              value={config.type}
              onValueChange={(value) => {
                const newConfig = { ...config, type: value as ProxyConfig['type'] };
                setConfig(newConfig);
                if (onProxyChange) onProxyChange(newConfig);
              }}
              disabled={!config.enabled}
            >
              <SelectTrigger id="proxy-type" className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select proxy type" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="http">HTTP</SelectItem>
                <SelectItem value="socks4">SOCKS4</SelectItem>
                <SelectItem value="socks5">SOCKS5</SelectItem>
                <SelectItem value="tor">Tor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {config.type !== 'tor' && (
            <>
              <div>
                <Label htmlFor="proxy-host">Proxy Host</Label>
                <Input
                  id="proxy-host"
                  value={config.host || ''}
                  onChange={(e) => {
                    const newConfig = { ...config, host: e.target.value };
                    setConfig(newConfig);
                    if (onProxyChange) onProxyChange(newConfig);
                  }}
                  placeholder="127.0.0.1"
                  className="bg-scanner-dark-alt border-gray-700"
                  disabled={!config.enabled}
                />
              </div>
              
              <div>
                <Label htmlFor="proxy-port">Proxy Port</Label>
                <Input
                  id="proxy-port"
                  value={config.port !== undefined ? config.port.toString() : ''}
                  onChange={(e) => {
                    const newConfig = { ...config, port: parseInt(e.target.value) || 0 };
                    setConfig(newConfig);
                    if (onProxyChange) onProxyChange(newConfig);
                  }}
                  placeholder="8080"
                  className="bg-scanner-dark-alt border-gray-700"
                  disabled={!config.enabled}
                />
              </div>
            </>
          )}
          
          {config.type === 'tor' && (
            <div className="flex items-center justify-between">
              <Label htmlFor="use-tor" className="text-sm flex items-center cursor-pointer">
                <Lock className="h-4 w-4 mr-2" />
                Use Tor Network
              </Label>
              <Switch
                id="use-tor"
                checked={config.useTor}
                onCheckedChange={handleToggleTor}
                disabled={!config.enabled}
              />
            </div>
          )}
        </div>
        
        {testResult && (
          <div className={`p-3 rounded-md text-sm ${
            testResult.success 
              ? 'bg-green-900/20 text-green-400 border border-green-900' 
              : 'bg-red-900/20 text-red-400 border border-red-900'
          }`}>
            {testResult.success ? (
              <div className="flex flex-col space-y-1">
                <span>Connected successfully!</span>
                {testResult.externalIp && <span>External IP: {testResult.externalIp}</span>}
                {testResult.latency && <span>Latency: {testResult.latency}ms</span>}
              </div>
            ) : (
              <div>Connection failed: {testResult.error}</div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleTestConnection}
          disabled={isTesting || !config.enabled}
          variant="default"
          className="w-full"
        >
          {isTesting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <Network className="h-4 w-4 mr-2" />
              Test Connection
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProxySettings;
