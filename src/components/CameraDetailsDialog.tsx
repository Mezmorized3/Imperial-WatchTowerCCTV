
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CameraResult } from '@/types/scanner';
import { Camera, MapPin, Shield, Clock, Server, Lock } from 'lucide-react';

interface CameraDetailsDialogProps {
  camera: CameraResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CameraDetailsDialog: React.FC<CameraDetailsDialogProps> = ({
  camera,
  open,
  onOpenChange,
}) => {
  if (!camera) return null;

  // Helper function to format location data
  const formatLocation = () => {
    if (!camera.location) return 'Unknown';
    
    if (typeof camera.location === 'string') {
      return camera.location;
    }
    
    const parts = [];
    if (camera.location.city) parts.push(camera.location.city);
    if (camera.location.country) parts.push(camera.location.country);
    
    return parts.length > 0 ? parts.join(', ') : 'Unknown';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-scanner-dark-alt border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Camera className="mr-2 text-scanner-info" />
            Camera Details
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Detailed information about the selected camera
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{camera.ip}:{camera.port || 'N/A'}</h3>
              <p className="text-gray-400">{camera.manufacturer || 'Unknown'} {camera.model || ''}</p>
            </div>
            
            <Badge 
              variant="outline" 
              className={`
                ${camera.status === 'online' ? 'bg-green-500/20 text-green-400 border-green-500' : 
                  camera.status === 'vulnerable' ? 'bg-red-500/20 text-red-400 border-red-500' : 
                  'bg-gray-500/20 text-gray-400 border-gray-500'}
              `}
            >
              {camera.status || 'Unknown'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-gray-400">
                <MapPin className="h-4 w-4 mr-2 text-scanner-info" />
                <span>Location</span>
              </div>
              <p>{formatLocation()}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-gray-400">
                <Shield className="h-4 w-4 mr-2 text-scanner-info" />
                <span>Access Level</span>
              </div>
              <p>{camera.accessLevel || 'Unknown'}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-gray-400">
                <Clock className="h-4 w-4 mr-2 text-scanner-info" />
                <span>Last Seen</span>
              </div>
              <p>{camera.lastSeen ? new Date(camera.lastSeen).toLocaleString() : 'Unknown'}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-gray-400">
                <Server className="h-4 w-4 mr-2 text-scanner-info" />
                <span>Firmware</span>
              </div>
              <p>{camera.firmwareVersion || 'Unknown'}</p>
            </div>
          </div>

          {camera.credentials && (
            <div className="mt-4 p-3 border border-yellow-500/30 bg-yellow-500/10 rounded">
              <div className="flex items-center mb-2">
                <Lock className="h-4 w-4 mr-2 text-yellow-500" />
                <h4 className="font-medium text-yellow-500">Credentials Found</h4>
              </div>
              <p className="font-mono text-sm">
                {camera.credentials.username}:{camera.credentials.password}
              </p>
            </div>
          )}

          {camera.vulnerabilities && camera.vulnerabilities.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2 text-scanner-info">Vulnerabilities</h4>
              <div className="space-y-2">
                {camera.vulnerabilities.map((vuln, index) => (
                  <div key={index} className="p-2 bg-scanner-dark border border-red-500/30 rounded">
                    <div className="flex justify-between">
                      <span className="font-medium">{vuln.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${vuln.severity === 'critical' ? 'bg-red-900/30 text-red-400 border-red-500' : 
                            vuln.severity === 'high' ? 'bg-orange-900/30 text-orange-400 border-orange-500' :
                            vuln.severity === 'medium' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500' :
                            'bg-blue-900/30 text-blue-400 border-blue-500'}
                        `}
                      >
                        {vuln.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{vuln.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {camera.url && (
            <Button>
              <a 
                href={camera.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Open Stream
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CameraDetailsDialog;
