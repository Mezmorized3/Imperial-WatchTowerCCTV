
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Wifi, Shield, WifiOff, Globe } from "lucide-react";

export interface ProxyConfig {
  enabled: boolean;
  type: 'http' | 'socks4' | 'socks5' | 'tor';
  host: string;
  port: number;
  username?: string;
  password?: string;
  country?: string;
}

export interface ProxyResult {
  success: boolean;
  latency?: number;
  error?: string;
  externalIp?: string;
}

export interface ProxySettingsProps {
  initialConfig?: ProxyConfig;
  onProxyChange?: (config: ProxyConfig) => void;
}

const ProxySettings: React.FC<ProxySettingsProps> = ({ 
  initialConfig = {
    enabled: false,
    type: 'http',
    host: '',
    port: 8080,
    username: '',
    password: '',
    country: ''
  },
  onProxyChange
}) => {
  const [config, setConfig] = useState<ProxyConfig>(initialConfig);
  const [testResult, setTestResult] = useState<ProxyResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleChange = (field: keyof ProxyConfig, value: any) => {
    const updatedConfig = { ...config, [field]: value };
    setConfig(updatedConfig);
    if (onProxyChange) {
      onProxyChange(updatedConfig);
    }
  };

  const testProxy = async () => {
    if (!config.host || !config.port) {
      toast({
        title: "Missing Configuration",
        description: "Please provide proxy host and port",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      // Simulate proxy test
      await new Promise(resolve => setTimeout(resolve, 1500));
      const successful = Math.random() > 0.3;
      
      const result: ProxyResult = successful 
        ? { 
            success: true, 
            latency: Math.floor(Math.random() * 200) + 50,
            externalIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
          }
        : { 
            success: false, 
            error: "Connection timed out", 
            externalIp: undefined
          };
          
      setTestResult(result);
      
      if (result.success) {
        toast({
          title: "Proxy Test Successful",
          description: result.externalIp ? `Connected via IP: ${result.externalIp}` : "Connection established",
          variant: "default"
        });
      } else {
        toast({
          title: "Proxy Test Failed",
          description: result.error || "Unknown error",
          variant: "destructive"
        });
      }
    } catch (error) {
      setTestResult({ success: false, error: error instanceof Error ? error.message : "Unknown error" });
      toast({
        title: "Proxy Test Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-scanner-primary" />
            Proxy Settings
          </CardTitle>
          <Switch 
            checked={config.enabled}
            onCheckedChange={(checked) => handleChange('enabled', checked)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="proxy-type">Proxy Type</Label>
              <Select 
                value={config.type} 
                onValueChange={(value) => handleChange('type', value)}
                disabled={!config.enabled}
              >
                <SelectTrigger id="proxy-type" className="bg-scanner-dark border-gray-700">
                  <SelectValue placeholder="Select proxy type" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark border-gray-700">
                  <SelectItem value="http">HTTP</SelectItem>
                  <SelectItem value="socks4">SOCKS4</SelectItem>
                  <SelectItem value="socks5">SOCKS5</SelectItem>
                  <SelectItem value="tor">TOR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="proxy-country">Country (Optional)</Label>
              <Input 
                id="proxy-country"
                placeholder="Any country"
                className="bg-scanner-dark border-gray-700"
                value={config.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                disabled={!config.enabled}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="proxy-host">Host</Label>
              <Input 
                id="proxy-host"
                placeholder="proxy.example.com"
                className="bg-scanner-dark border-gray-700"
                value={config.host}
                onChange={(e) => handleChange('host', e.target.value)}
                disabled={!config.enabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proxy-port">Port</Label>
              <Input 
                id="proxy-port"
                placeholder="8080"
                type="number"
                className="bg-scanner-dark border-gray-700"
                value={config.port}
                onChange={(e) => handleChange('port', parseInt(e.target.value) || 0)}
                disabled={!config.enabled}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="proxy-username">Username (Optional)</Label>
              <Input 
                id="proxy-username"
                placeholder="Username"
                className="bg-scanner-dark border-gray-700"
                value={config.username || ''}
                onChange={(e) => handleChange('username', e.target.value)}
                disabled={!config.enabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proxy-password">Password (Optional)</Label>
              <Input 
                id="proxy-password"
                placeholder="Password"
                type="password"
                className="bg-scanner-dark border-gray-700"
                value={config.password || ''}
                onChange={(e) => handleChange('password', e.target.value)}
                disabled={!config.enabled}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div>
              {testResult && (
                <div className="flex items-center gap-2">
                  {testResult.success ? (
                    <>
                      <Wifi className="h-4 w-4 text-green-500" />
                      <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
                        Connected ({testResult.latency}ms)
                      </Badge>
                      <Globe className="h-4 w-4 text-blue-500" />
                      <span className="text-xs text-gray-400">{testResult.externalIp || 'Unknown IP'}</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-4 w-4 text-red-500" />
                      <Badge variant="outline" className="bg-red-900/20 text-red-400 border-red-800">
                        Failed
                      </Badge>
                      <span className="text-xs text-gray-400">{testResult.error}</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-scanner-dark-alt border-gray-700 hover:bg-scanner-dark-light"
              onClick={testProxy}
              disabled={!config.enabled || isTesting || !config.host}
            >
              {isTesting ? "Testing..." : "Test Connection"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProxySettings;
