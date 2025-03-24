import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Network, RefreshCw, Lock, Plus, Trash2 } from 'lucide-react';
import { ProxyConfig } from '@/utils/types/baseTypes';
import { toast } from '@/components/ui/use-toast';

// Add this utility function to convert proxy objects to strings
const proxyListToString = (proxies: { host: string; port: number; country?: string }[]): string[] => {
  return proxies.map(proxy => `${proxy.host}:${proxy.port}`);
};

interface ProxyManagerProps {
  initialProxies?: { host: string; port: number; country?: string }[];
  onProxiesChange?: (proxies: { host: string; port: number; country?: string }[]) => void;
}

const ProxyManager: React.FC<ProxyManagerProps> = ({ initialProxies = [], onProxiesChange }) => {
  const [proxies, setProxies] = useState<{ host: string; port: number; country?: string }[]>(initialProxies);
  const [newProxy, setNewProxy] = useState<{ host: string; port: number; country?: string }>({ host: '', port: 8080, country: '' });
  const [selectedProxies, setSelectedProxies] = useState<{ host: string; port: number; country?: string }[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latency?: number;
    error?: string;
    externalIp?: string;
  } | null>(null);

  const handleAddProxy = () => {
    if (newProxy.host && newProxy.port) {
      setProxies([...proxies, newProxy]);
      setNewProxy({ host: '', port: 8080, country: '' });
      if (onProxiesChange) onProxiesChange([...proxies, newProxy]);
    } else {
      toast({
        title: "Missing Information",
        description: "Please provide proxy host and port",
        variant: "destructive"
      });
    }
  };

  const handleRemoveProxy = (proxyToRemove: { host: string; port: number; country?: string }) => {
    const updatedProxies = proxies.filter(proxy => !(proxy.host === proxyToRemove.host && proxy.port === proxyToRemove.port));
    setProxies(updatedProxies);
    setSelectedProxies(selectedProxies.filter(proxy => !(proxy.host === proxyToRemove.host && proxy.port === proxyToRemove.port)));
    if (onProxiesChange) onProxiesChange(updatedProxies);
  };

  const handleSelectProxy = (proxyToSelect: { host: string; port: number; country?: string }) => {
    if (selectedProxies.some(p => p.host === proxyToSelect.host && p.port === proxyToSelect.port)) {
      setSelectedProxies(selectedProxies.filter(proxy => !(proxy.host === proxyToSelect.host && proxy.port === proxyToSelect.port)));
    } else {
      setSelectedProxies([...selectedProxies, proxyToSelect]);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Simulate testing proxy connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      const successful = Math.random() > 0.3;

      const result = successful
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
    if (initialProxies) {
      setProxies(initialProxies);
    }
  }, [initialProxies]);

  return (
    <Card className="border-gray-700 bg-scanner-dark shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-scanner-primary" />
          Proxy Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="proxy-host">Proxy Host</Label>
              <Input
                id="proxy-host"
                value={newProxy.host}
                onChange={(e) => setNewProxy({ ...newProxy, host: e.target.value })}
                placeholder="127.0.0.1"
                className="bg-scanner-dark-alt border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="proxy-port">Proxy Port</Label>
              <Input
                id="proxy-port"
                value={newProxy.port !== undefined ? newProxy.port.toString() : ''}
                onChange={(e) => setNewProxy({ ...newProxy, port: parseInt(e.target.value) || 0 })}
                placeholder="8080"
                className="bg-scanner-dark-alt border-gray-700"
                type="number"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="proxy-country">Country (Optional)</Label>
            <Input
              id="proxy-country"
              value={newProxy.country || ''}
              onChange={(e) => setNewProxy({ ...newProxy, country: e.target.value })}
              placeholder="Any country"
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>
          <Button
            onClick={handleAddProxy}
            variant="default"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Proxy
          </Button>
        </div>

        <div className="space-y-3">
          <Label>Available Proxies</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {proxies.length > 0 ? (
              proxies.map((proxy, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md border border-gray-700 bg-scanner-dark-alt flex items-center justify-between ${selectedProxies.some(p => p.host === proxy.host && p.port === proxy.port) ? 'border-scanner-primary' : ''}`}
                >
                  <div>{`${proxy.host}:${proxy.port}`}{proxy.country ? ` (${proxy.country})` : ''}</div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`proxy-${index}`}
                      checked={selectedProxies.some(p => p.host === proxy.host && p.port === proxy.port)}
                      onCheckedChange={() => handleSelectProxy(proxy)}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-700 hover:bg-scanner-dark-light"
                      onClick={() => handleRemoveProxy(proxy)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400">No proxies added yet.</div>
            )}
          </div>
        </div>

        {testResult && (
          <div className={`p-3 rounded-md text-sm ${testResult.success
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
      <Button
        onClick={handleTestConnection}
        disabled={isTesting || selectedProxies.length === 0}
        variant="default"
        className="w-full m-4"
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
    </Card>
  );
};

export default ProxyManager;
