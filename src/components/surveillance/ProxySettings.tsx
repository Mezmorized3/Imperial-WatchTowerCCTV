
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { testProxyConnection } from '@/utils/networkScanner';
import { useToast } from '@/components/ui/use-toast';
import { ProxyConfig } from '@/utils/types/baseTypes';

interface ProxySettingsProps {
  proxyConfig: ProxyConfig;
  onProxyConfigChange: (config: ProxyConfig) => void;
}

const ProxySettings: React.FC<ProxySettingsProps> = ({ proxyConfig, onProxyConfigChange }) => {
  const { toast } = useToast();
  const [localConfig, setLocalConfig] = useState<ProxyConfig>(proxyConfig);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setLocalConfig(proxyConfig);
  }, [proxyConfig]);

  const handleEnableChange = (checked: boolean) => {
    setLocalConfig(prev => ({ ...prev, enabled: checked }));
  };

  const handleTypeChange = (value: string) => {
    setLocalConfig(prev => ({ ...prev, type: value as 'http' | 'socks4' | 'socks5' | 'tor' }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setLocalConfig(prev => ({ ...prev, [name]: parseInt(value) }));
    } else if (type === 'checkbox') {
      setLocalConfig(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setLocalConfig(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = () => {
    onProxyConfigChange(localConfig);
    toast({
      title: "Proxy Settings Updated",
      description: `Proxy ${localConfig.enabled ? 'enabled' : 'disabled'}`,
    });
  };

  const handleTest = async () => {
    setTesting(true);
    
    try {
      const result = await testProxyConnection(localConfig);
      
      if (result.success) {
        toast({
          title: "Proxy Connection Successful",
          description: `Connected via ${localConfig.type.toUpperCase()} - ${result.externalIp}`,
        });
        
        // Update the last known external IP
        setLocalConfig(prev => ({ 
          ...prev, 
          lastKnownExternalIp: result.externalIp,
        }));
      } else {
        toast({
          title: "Proxy Connection Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error testing proxy:', error);
      toast({
        title: "Proxy Test Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full bg-scanner-dark border-gray-700">
      <CardHeader>
        <CardTitle className="text-scanner-info">Proxy Settings</CardTitle>
        <CardDescription>Configure proxy settings for anonymous scanning</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            checked={localConfig.enabled} 
            onCheckedChange={handleEnableChange}
            id="enable-proxy"
          />
          <Label htmlFor="enable-proxy" className="cursor-pointer">
            Enable Proxy
          </Label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="proxy-type">Proxy Type</Label>
            <Select 
              value={localConfig.type} 
              onValueChange={handleTypeChange}
            >
              <SelectTrigger className="bg-scanner-dark-alt border-gray-700 w-full">
                <SelectValue placeholder="Select Proxy Type" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="http">HTTP</SelectItem>
                <SelectItem value="socks4">SOCKS4</SelectItem>
                <SelectItem value="socks5">SOCKS5</SelectItem>
                <SelectItem value="tor">TOR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {localConfig.type !== 'tor' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="host">Host</Label>
                <Input
                  id="host"
                  name="host"
                  value={localConfig.host || ''}
                  onChange={handleInputChange}
                  placeholder="proxy.example.com"
                  className="bg-scanner-dark-alt border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  name="port"
                  type="number"
                  value={localConfig.port || ''}
                  onChange={handleInputChange}
                  placeholder="8080"
                  className="bg-scanner-dark-alt border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Switch 
                    checked={localConfig.useAuthentication || false} 
                    onCheckedChange={(checked) => setLocalConfig(prev => ({ ...prev, useAuthentication: checked }))}
                    id="use-auth"
                  />
                  <Label htmlFor="use-auth" className="cursor-pointer">
                    Use Authentication
                  </Label>
                </div>
                
                {localConfig.useAuthentication && (
                  <div className="space-y-2">
                    <Input
                      name="username"
                      value={localConfig.username || ''}
                      onChange={handleInputChange}
                      placeholder="Username"
                      className="bg-scanner-dark-alt border-gray-700 mb-2"
                    />
                    <Input
                      name="password"
                      type="password"
                      value={localConfig.password || ''}
                      onChange={handleInputChange}
                      placeholder="Password"
                      className="bg-scanner-dark-alt border-gray-700"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            variant="outline" 
            onClick={handleTest} 
            disabled={testing || !localConfig.enabled}
            className="border-scanner-info text-scanner-info"
          >
            {testing ? "Testing..." : "Test Connection"}
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-scanner-info hover:bg-scanner-info/80 text-black"
          >
            Save Settings
          </Button>
        </div>
        
        {localConfig.lastKnownExternalIp && (
          <div className="mt-4 p-2 rounded bg-scanner-dark-alt border border-gray-700">
            <p className="text-sm">
              Last detected external IP: <span className="font-mono">{localConfig.lastKnownExternalIp}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProxySettings;
