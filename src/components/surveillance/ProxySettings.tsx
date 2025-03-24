import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProxyConfig } from "@/utils/types/baseTypes";
import { useToast } from "@/components/ui/use-toast";
import { testProxyConnection } from "@/utils/networkScanner";

interface ProxySettingsProps {
  onProxyChange: (config: ProxyConfig) => void;
  initialConfig: ProxyConfig;
}

const ProxySettings: React.FC<ProxySettingsProps> = ({ onProxyChange, initialConfig }) => {
  const [proxyConfig, setProxyConfig] = useState<ProxyConfig>(initialConfig);
  const { toast } = useToast();

  useEffect(() => {
    setProxyConfig(initialConfig);
  }, [initialConfig]);

  useEffect(() => {
    localStorage.setItem('proxyConfig', JSON.stringify(proxyConfig));
    onProxyChange(proxyConfig);
  }, [proxyConfig, onProxyChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setProxyConfig(prevConfig => ({
      ...prevConfig,
      [name]: newValue,
    }));
  };

  const handleProxyListChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const proxyList = e.target.value.split('\n').map(proxy => proxy.trim()).filter(proxy => proxy !== '');
      setProxyConfig(prevConfig => ({
        ...prevConfig,
        proxyList: proxyList,
      }));
    } catch (error) {
      console.error("Error parsing proxy list:", error);
      toast({
        title: "Error Parsing Proxy List",
        description: "Please ensure each proxy is on a new line.",
        variant: "destructive",
      });
    }
  };

  return (
    <CardContent className="space-y-4">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="proxy-enabled" className="text-sm">Enable Proxy</Label>
          <Switch
            id="proxy-enabled"
            name="enabled"
            checked={proxyConfig.enabled || false}
            onCheckedChange={(checked) => handleInputChange({ target: { name: 'enabled', value: checked, type: 'checkbox' } } as any)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="proxy-type">Proxy Type</Label>
            <Select
              id="proxy-type"
              value={proxyConfig.type}
              onValueChange={(value) => handleInputChange({ target: { name: 'type', value: value, type: 'text' } } as any)}
            >
              <SelectTrigger className="bg-scanner-dark">
                <SelectValue placeholder="Select proxy type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="http">HTTP</SelectItem>
                <SelectItem value="socks4">SOCKS4</SelectItem>
                <SelectItem value="socks5">SOCKS5</SelectItem>
                <SelectItem value="tor">Tor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="proxy-host">Host</Label>
            <Input
              type="text"
              id="proxy-host"
              name="host"
              value={proxyConfig.host || ''}
              onChange={handleInputChange}
              className="bg-scanner-dark"
            />
          </div>

          <div>
            <Label htmlFor="proxy-port">Port</Label>
            <Input
              type="number"
              id="proxy-port"
              name="port"
              value={proxyConfig.port || 8080}
              onChange={handleInputChange}
              className="bg-scanner-dark"
            />
          </div>

          <div>
            <Label htmlFor="proxy-auth">Authentication</Label>
            <Switch
              id="proxy-auth"
              name="useAuthentication"
              checked={proxyConfig.useAuthentication || false}
              onCheckedChange={(checked) => handleInputChange({ target: { name: 'useAuthentication', value: checked, type: 'checkbox' } } as any)}
            />
          </div>
        </div>

        {proxyConfig.useAuthentication && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="proxy-username">Username</Label>
              <Input
                type="text"
                id="proxy-username"
                name="username"
                value={proxyConfig.username || ''}
                onChange={handleInputChange}
                className="bg-scanner-dark"
              />
            </div>

            <div>
              <Label htmlFor="proxy-password">Password</Label>
              <Input
                type="password"
                id="proxy-password"
                name="password"
                value={proxyConfig.password || ''}
                onChange={handleInputChange}
                className="bg-scanner-dark"
              />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="proxy-rotation">Auto-Rotation</Label>
          <Switch
            id="proxy-rotation"
            name="rotationEnabled"
            checked={proxyConfig.rotationEnabled || false}
            onCheckedChange={(checked) => handleInputChange({ target: { name: 'rotationEnabled', value: checked, type: 'checkbox' } } as any)}
          />
        </div>

        {proxyConfig.rotationEnabled && (
          <>
            <div>
              <Label htmlFor="proxy-rotation-interval">Rotation Interval (seconds)</Label>
              <Input
                type="number"
                id="proxy-rotation-interval"
                name="rotationInterval"
                value={proxyConfig.rotationInterval || 300}
                onChange={handleInputChange}
                className="bg-scanner-dark"
              />
            </div>

            <div>
              <Label htmlFor="proxy-list">Proxy List (one per line)</Label>
              <Textarea
                id="proxy-list"
                name="proxyList"
                value={(proxyConfig.proxyList || []).join('\n')}
                onChange={handleProxyListChange}
                className="bg-scanner-dark"
              />
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dns-protection">DNS Leak Protection</Label>
            <Switch
              id="dns-protection"
              name="dnsProtection"
              checked={proxyConfig.dnsProtection || false}
              onCheckedChange={(checked) => handleInputChange({ target: { name: 'dnsProtection', value: checked, type: 'checkbox' } } as any)}
            />
          </div>

          <div>
            <Label htmlFor="force-tls">Force TLS Encryption</Label>
            <Switch
              id="force-tls"
              name="forceTls"
              checked={proxyConfig.forceTls || false}
              onCheckedChange={(checked) => handleInputChange({ target: { name: 'forceTls', value: checked, type: 'checkbox' } } as any)}
            />
          </div>

          <div>
            <Label htmlFor="auto-reconnect">Auto Reconnect</Label>
            <Switch
              id="auto-reconnect"
              name="autoReconnect"
              checked={proxyConfig.autoReconnect || false}
              onCheckedChange={(checked) => handleInputChange({ target: { name: 'autoReconnect', value: checked, type: 'checkbox' } } as any)}
            />
          </div>
        </div>
      </div>
    </CardContent>
  );
};

export default ProxySettings;
