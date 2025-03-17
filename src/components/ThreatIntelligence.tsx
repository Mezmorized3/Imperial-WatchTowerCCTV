
import React from 'react';
import { CameraResult } from '@/types/scanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, AlertCircle, Calendar, Link, HardDrive, GitBranch } from 'lucide-react';

interface ThreatIntelligenceProps {
  camera: CameraResult | null;
}

const ThreatIntelligence: React.FC<ThreatIntelligenceProps> = ({ camera }) => {
  if (!camera) {
    return <div className="p-4 text-muted-foreground">Select a camera to view threat intelligence.</div>;
  }

  const { threatIntel, firmwareAnalysis } = camera;

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
    if (score < 60) return 'secondary'; // Changed from 'warning' to 'secondary'
    return 'secondary';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Threat Intelligence
          </CardTitle>
          <CardDescription>
            IP reputation and threat data for {camera.ip}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {threatIntel ? (
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
          ) : (
            <div className="flex flex-col items-center justify-center h-48 space-y-2">
              <p className="text-muted-foreground">No threat intelligence data available for this IP.</p>
              <Badge variant="outline" className="text-green-500">
                No reported threats
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Firmware Analysis Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <HardDrive className="mr-2 h-5 w-5" />
            Firmware Analysis
          </CardTitle>
          <CardDescription>
            {camera.firmwareVersion 
              ? `Analysis of firmware version ${camera.firmwareVersion}`
              : 'No firmware version detected'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {firmwareAnalysis ? (
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
          ) : (
            <div className="flex flex-col items-center justify-center h-48 space-y-2">
              <p className="text-muted-foreground">No firmware analysis available for this device.</p>
              <Badge variant="outline">
                {camera.firmwareVersion ? 'Analysis not available' : 'No firmware detected'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreatIntelligence;
