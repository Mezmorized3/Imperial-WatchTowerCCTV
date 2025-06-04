
import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, Globe, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ProxyConfig } from '@/utils/types/osintToolTypes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ProxySettings from './ProxySettings';

interface ProxyIndicatorProps {
  proxyConfig: ProxyConfig;
  onProxyChange?: (config: ProxyConfig) => void;
  variant?: 'minimal' | 'full';
}

const ProxyIndicator: React.FC<ProxyIndicatorProps> = ({
  proxyConfig,
  onProxyChange,
  variant = 'minimal'
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rotationTimestamp, setRotationTimestamp] = useState<number>(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (proxyConfig.enabled && proxyConfig.rotationEnabled) {
      interval = setInterval(() => {
        setRotationTimestamp(Date.now());
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [proxyConfig.enabled, proxyConfig.rotationEnabled]);
  
  const getNextRotationTime = (): string => {
    if (!proxyConfig.rotationEnabled || !proxyConfig.rotationInterval) {
      return 'N/A';
    }
    
    const interval = proxyConfig.rotationInterval;
    const now = Math.floor(Date.now() / 1000);
    const secondsElapsed = now % interval;
    const secondsUntilNext = interval - secondsElapsed;
    
    if (secondsUntilNext < 60) {
      return `${secondsUntilNext}s`;
    } else {
      return `${Math.floor(secondsUntilNext / 60)}m ${secondsUntilNext % 60}s`;
    }
  };
  
  const handleProxyToggle = () => {
    if (onProxyChange) {
      onProxyChange({
        ...proxyConfig,
        enabled: !proxyConfig.enabled
      });
    }
  };
  
  if (variant === 'minimal') {
    return (
      <TooltipProvider>
        <Tooltip>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`relative ${proxyConfig.enabled ? 'text-green-500' : 'text-gray-500'}`}
                  onClick={() => setDialogOpen(true)}
                >
                  <Shield className="h-5 w-5" />
                  {proxyConfig.enabled && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </Button>
              </TooltipTrigger>
            </DialogTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p className="font-medium">
                  {proxyConfig.enabled ? 'Proxy Enabled' : 'Proxy Disabled'}
                </p>
                {proxyConfig.enabled && (
                  <p className="text-xs text-gray-400">
                    {proxyConfig.type.toUpperCase()} {proxyConfig.host}:{proxyConfig.port}
                  </p>
                )}
                <p className="text-xs">Click to configure proxy settings</p>
              </div>
            </TooltipContent>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Proxy Settings</DialogTitle>
              </DialogHeader>
              <ProxySettings 
                onProxyChange={(config: any) => {
                  if (onProxyChange) {
                    onProxyChange(config);
                  }
                }}
                onClearProxies={() => {}}
                onTestProxy={async () => true}
                onFetchProxies={async () => []}
                proxies={[]}
                setProxies={() => {}}
              />
            </DialogContent>
          </Dialog>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Proxy Settings</DialogTitle>
        </DialogHeader>
        <ProxySettings 
          onProxyChange={(config: any) => {
            if (onProxyChange) {
              onProxyChange(config);
            }
          }}
          onClearProxies={() => {}}
          onTestProxy={async () => true}
          onFetchProxies={async () => []}
          proxies={[]}
          setProxies={() => {}}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProxyIndicator;
