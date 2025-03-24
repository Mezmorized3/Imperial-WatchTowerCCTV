
import React from 'react';
import { useRealTime } from '@/contexts/RealTimeContext';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Wifi, WifiOff } from 'lucide-react';

const RealTimeStatus: React.FC = () => {
  const { isConnected, connectionState, serverStatus, connect } = useRealTime();
  
  const getStatusColor = () => {
    if (!isConnected) return 'bg-gray-500';
    
    switch (serverStatus.status) {
      case 'online': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusText = () => {
    if (connectionState === 'connecting') return 'Connecting...';
    if (!isConnected) return 'Disconnected';
    
    switch (serverStatus.status) {
      case 'online': return 'Connected';
      case 'degraded': return 'Degraded';
      case 'offline': return 'Server Offline';
      default: return 'Unknown';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            <Badge 
              variant="outline" 
              className={`px-2 py-1 ${getStatusColor()} text-white cursor-pointer hover:opacity-80`}
              onClick={() => {
                if (!isConnected) connect();
              }}
            >
              {isConnected ? (
                <Wifi className="w-3.5 h-3.5 mr-1" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 mr-1" />
              )}
              <span className="text-xs">{getStatusText()}</span>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isConnected
              ? `Real-time connection active. Server status: ${serverStatus.status}`
              : 'Click to connect to real-time updates'}
          </p>
          {serverStatus.message && <p className="text-xs mt-1">{serverStatus.message}</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RealTimeStatus;
