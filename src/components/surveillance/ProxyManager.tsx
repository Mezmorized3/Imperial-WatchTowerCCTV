
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import ProxySettings from './ProxySettings';
import { ProxyConfig } from '@/utils/osintToolTypes';
import { testProxy } from '@/utils/proxyUtils';

interface ProxyManagerProps {
  onProxyChange?: (proxy: ProxyConfig) => void;
}

const ProxyManager: React.FC<ProxyManagerProps> = ({ onProxyChange }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [proxyConfig, setProxyConfig] = useState<ProxyConfig>({
    enabled: false,
    type: 'http',
    host: '127.0.0.1',
    port: 8080,
    rotation: false
  });

  // Load proxy from localStorage when component mounts
  useEffect(() => {
    const storedProxy = localStorage.getItem('osint-proxy-config');
    if (storedProxy) {
      try {
        const parsedProxy = JSON.parse(storedProxy) as ProxyConfig;
        setProxyConfig(parsedProxy);
        // Notify parent component if callback exists
        if (onProxyChange) {
          onProxyChange(parsedProxy);
        }
      } catch (error) {
        console.error('Error parsing stored proxy:', error);
      }
    }
  }, [onProxyChange]);

  const handleProxyChange = (proxy: ProxyConfig) => {
    setProxyConfig(proxy);
    
    // Save to localStorage for persistence
    localStorage.setItem('osint-proxy-config', JSON.stringify(proxy));
    
    // Notify parent component if callback exists
    if (onProxyChange) {
      onProxyChange(proxy);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const getProxyStatusText = () => {
    if (!proxyConfig.enabled) {
      return 'Direct Connection';
    }
    return `${proxyConfig.type.toUpperCase()}: ${proxyConfig.host}:${proxyConfig.port}`;
  };

  const getProxyStatusVariant = () => {
    if (!proxyConfig.enabled) {
      return 'secondary';
    }
    return 'default';
  };

  const testCurrentProxy = async () => {
    if (!proxyConfig.enabled) {
      toast({
        title: "No Proxy Enabled",
        description: "Enable a proxy before testing",
        variant: "default",
      });
      return;
    }

    toast({
      title: "Testing Proxy",
      description: `Checking connection to ${proxyConfig.host}:${proxyConfig.port}...`,
      variant: "default",
    });

    try {
      const result = await testProxy(proxyConfig);
      
      toast({
        title: result ? "Proxy Working" : "Proxy Failed",
        description: result 
          ? `Successfully connected through ${proxyConfig.type.toUpperCase()} proxy`
          : `Failed to connect through ${proxyConfig.type.toUpperCase()} proxy`,
        variant: result ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Test Error",
        description: "An error occurred while testing the proxy",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-gray-500" />
              <div>
                <div className="text-sm font-medium">Network Proxy</div>
                <div className="text-xs text-gray-500">{getProxyStatusText()}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={getProxyStatusVariant()}>
                {proxyConfig.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
              <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Configure</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Network Proxy Configuration</DialogTitle>
                    <DialogDescription>
                      Configure proxy settings for all network operations
                    </DialogDescription>
                  </DialogHeader>
                  <ProxySettings 
                    proxyConfig={proxyConfig} 
                    onProxyChange={handleProxyChange} 
                  />
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="icon" onClick={testCurrentProxy}>
                <Shield className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProxyManager;
