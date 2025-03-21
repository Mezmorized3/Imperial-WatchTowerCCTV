
import React from 'react';
import { ThreatIntelData } from '@/types/scanner';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, AlertCircle, Calendar, Link } from 'lucide-react';

interface ThreatReputationProps {
  threatIntel: ThreatIntelData | undefined;
}

const ThreatReputation: React.FC<ThreatReputationProps> = ({ threatIntel }) => {
  // Helper function to format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get badge variant based on reputation score
  const getReputationBadgeVariant = (score?: number) => {
    if (score === undefined) return 'outline';
    if (score < 30) return 'destructive';
    if (score < 60) return 'secondary';
    return 'secondary';
  };

  if (!threatIntel) {
    return (
      <div className="flex flex-col items-center justify-center h-48 space-y-2">
        <p className="text-muted-foreground">No threat intelligence data available for this IP.</p>
        <Badge variant="outline" className="text-green-500">
          No reported threats
        </Badge>
      </div>
    );
  }

  return (
    <ScrollArea className="h-64 rounded-md">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Reputation Score:</span>
          <Badge variant={getReputationBadgeVariant(threatIntel.ipReputation)}>
            {threatIntel.ipReputation !== undefined ? `${threatIntel.ipReputation}/100` : 'No Data'}
          </Badge>
        </div>
        
        {threatIntel.lastReportedMalicious && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Last Reported:</span>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(threatIntel.lastReportedMalicious)}
            </div>
          </div>
        )}
        
        {threatIntel.firstSeen && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">First Seen:</span>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(threatIntel.firstSeen)}
            </div>
          </div>
        )}
        
        {threatIntel.confidenceScore !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Confidence Score:</span>
            <Badge variant="outline">{threatIntel.confidenceScore}%</Badge>
          </div>
        )}
        
        {threatIntel.source && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Data Source:</span>
            <Badge variant="secondary">{threatIntel.source}</Badge>
          </div>
        )}
        
        {threatIntel.reportedBy && threatIntel.reportedBy.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Reported By:</span>
            <div className="flex flex-wrap gap-2">
              {threatIntel.reportedBy.map((reporter, index) => (
                <Badge key={index} variant="outline">{reporter}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {threatIntel.associatedMalware && threatIntel.associatedMalware.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Associated Malware:</span>
            <div className="flex flex-wrap gap-2">
              {threatIntel.associatedMalware.map((malware, index) => (
                <Badge key={index} variant="destructive">{malware}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {threatIntel.tags && threatIntel.tags.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">Tags:</span>
            <div className="flex flex-wrap gap-2">
              {threatIntel.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ThreatReputation;
