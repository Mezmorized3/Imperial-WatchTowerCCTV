import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Link, AlertCircle, GitBranch } from 'lucide-react';
import { CameraData } from './ThreatIntelligence';

interface FirmwareDetailsProps {
  camera: CameraData;
}

const FirmwareDetails: React.FC<FirmwareDetailsProps> = ({ camera }) => {
  const firmwareVersion = camera.firmware?.version;
  const firmwareAnalysis = {
    outdated: camera.firmware?.updateAvailable || false,
    lastUpdate: camera.firmware?.lastChecked,
    recommendedVersion: camera.firmware?.version ? `${parseFloat(camera.firmware.version) + 0.1}` : undefined,
    knownVulnerabilities: camera.firmware?.vulnerabilities || []
  };

  // Helper function to format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!firmwareAnalysis) {
    return (
      <div className="flex flex-col items-center justify-center h-48 space-y-2">
        <p className="text-muted-foreground">No firmware analysis available for this device.</p>
        <Badge variant="outline">
          {firmwareVersion ? 'Analysis not available' : 'No firmware detected'}
        </Badge>
      </div>
    );
  }

  return (
    <ScrollArea className="h-48 rounded-md">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge 
            variant={firmwareAnalysis.outdated ? 'destructive' : 'secondary'}
          >
            {firmwareAnalysis.outdated ? 'Outdated' : 'Up to date'}
          </Badge>
        </div>
        
        {firmwareAnalysis.lastUpdate && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Update:</span>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(firmwareAnalysis.lastUpdate)}
            </div>
          </div>
        )}
        
        {firmwareAnalysis.recommendedVersion && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Recommended Version:</span>
            <div className="flex items-center">
              <GitBranch className="h-4 w-4 mr-1" />
              {firmwareAnalysis.recommendedVersion}
            </div>
          </div>
        )}
        
        {firmwareAnalysis.knownVulnerabilities && firmwareAnalysis.knownVulnerabilities.length > 0 ? (
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Known Vulnerabilities:</span>
            <div className="flex flex-col space-y-2">
              {firmwareAnalysis.knownVulnerabilities.map((cve, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-sm">{cve}</span>
                  <Link 
                    className="h-3 w-3 ml-auto cursor-pointer text-blue-500" 
                    onClick={() => window.open(`https://nvd.nist.gov/vuln/detail/${cve}`, '_blank')}
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

export default FirmwareDetails;
