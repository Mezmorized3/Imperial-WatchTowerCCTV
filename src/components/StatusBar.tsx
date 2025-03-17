
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScanProgress } from '@/types/scanner';
import { Clock, Search, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  progress: ScanProgress;
}

const StatusBar: React.FC<StatusBarProps> = ({ progress }) => {
  const { status, targetsScanned, targetsTotal, camerasFound, startTime, endTime, error } = progress;
  
  const getStatusColor = () => {
    switch (status) {
      case 'running': return 'bg-scanner-info text-white';
      case 'completed': return 'bg-scanner-success text-white';
      case 'failed': return 'bg-scanner-danger text-white';
      default: return 'bg-gray-700 text-white';
    }
  };
  
  const getStatusLabel = () => {
    switch (status) {
      case 'idle': return 'Ready';
      case 'running': return 'Scanning';
      case 'completed': return 'Completed';
      case 'failed': return 'Failed';
    }
  };
  
  const calculateElapsedTime = () => {
    if (!startTime) return '00:00';
    
    const end = endTime || new Date();
    const elapsed = Math.floor((end.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    
    return `${minutes}:${seconds}`;
  };
  
  const percentComplete = status === 'idle' ? 0 : 
                         status === 'completed' ? 100 : 
                         targetsTotal > 0 ? Math.min(100, Math.round((targetsScanned / targetsTotal) * 100)) : 0;
  
  return (
    <div className="bg-scanner-dark border border-gray-800 rounded-md p-4 shadow-md">
      <div className="flex flex-wrap items-center gap-4 mb-3">
        <Badge className={getStatusColor()}>
          {getStatusLabel()}
        </Badge>
        
        {status === 'running' && (
          <div className="flex items-center text-gray-300 text-sm">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{calculateElapsedTime()}</span>
          </div>
        )}
        
        {status !== 'idle' && (
          <div className="flex items-center text-gray-300 text-sm">
            <Search className="h-3.5 w-3.5 mr-1" />
            <span>
              {targetsScanned} / {targetsTotal} targets
            </span>
          </div>
        )}
        
        {camerasFound > 0 && (
          <div className="flex items-center text-scanner-success text-sm">
            <Camera className="h-3.5 w-3.5 mr-1" />
            <span>
              {camerasFound} {camerasFound === 1 ? 'camera' : 'cameras'} found
            </span>
          </div>
        )}
        
        {error && (
          <div className="text-scanner-danger text-sm ml-auto">
            {error}
          </div>
        )}
      </div>
      
      <Progress 
        value={percentComplete} 
        className={cn("h-2 bg-gray-800", "before:bg-scanner-primary")} 
      />
    </div>
  );
};

export default StatusBar;
