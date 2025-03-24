
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Link, AlertCircle, GitBranch } from 'lucide-react';
import { CameraData } from './threat/ThreatIntelligence';

export interface FirmwareAnalysisProps {
  camera: CameraData;
}

const FirmwareAnalysis: React.FC<FirmwareAnalysisProps> = ({ camera }) => {
  // Helper function to format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!camera.firmware) {
    return (
      <div className="flex flex-col items-center justify-center h-48 space-y-2">
        <p className="text-muted-foreground">No firmware information available for this device.</p>
        <Badge variant="outline">Firmware data unavailable</Badge>
      </div>
    );
  }

  return (
    <ScrollArea className="h-48 rounded-md">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge 
            variant={camera.firmware.updateAvailable ? 'destructive' : 'secondary'}
          >
            {camera.firmware.updateAvailable ? 'Update Available' : 'Up to date'}
          </Badge>
        </div>
        
        {camera.firmware.lastChecked && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Checked:</span>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(camera.firmware.lastChecked)}
            </div>
          </div>
        )}
        
        {camera.firmware.version && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Version:</span>
            <div className="flex items-center">
              <GitBranch className="h-4 w-4 mr-1" />
              {camera.firmware.version}
            </div>
          </div>
        )}
        
        {camera.firmware.vulnerabilities && camera.firmware.vulnerabilities.length > 0 ? (
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Known Vulnerabilities:</span>
            <div className="flex flex-col space-y-2">
              {camera.firmware.vulnerabilities.map((vuln, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">{vuln}</span>
                  <Link 
                    className="h-3 w-3 ml-auto cursor-pointer text-blue-500" 
                    onClick={() => window.open(`https://nvd.nist.gov/vuln/detail/${vuln}`, '_blank')}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground mt-2">
            No known vulnerabilities found in this firmware version.
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default FirmwareAnalysis;
