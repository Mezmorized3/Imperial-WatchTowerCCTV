
import React from 'react';
import { CameraResult } from '@/types/scanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HardDrive, AlertTriangle, Check, BarChart } from 'lucide-react';

interface FirmwareAnalysisProps {
  camera: CameraResult | null;
}

const FirmwareAnalysis: React.FC<FirmwareAnalysisProps> = ({ camera }) => {
  if (!camera) {
    return <div className="p-4 text-muted-foreground">Select a camera to view firmware analysis.</div>;
  }

  const { firmwareVersion, firmwareAnalysis, brand, model } = camera;

  // Calculate vulnerability score
  const calculateVulnerabilityScore = () => {
    if (!firmwareAnalysis) return 0;
    
    let score = 0;
    if (firmwareAnalysis.outdated) score += 30;
    score += firmwareAnalysis.knownVulnerabilities.length * 20;
    
    // Calculate last update score (newer is better)
    if (firmwareAnalysis.lastUpdate) {
      const lastUpdateDate = new Date(firmwareAnalysis.lastUpdate);
      const now = new Date();
      const monthsAgo = (now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      
      if (monthsAgo > 12) score += 20;
      else if (monthsAgo > 6) score += 10;
    } else {
      score += 20; // Unknown update date is bad
    }
    
    return Math.min(score, 100);
  };

  const vulnerabilityScore = calculateVulnerabilityScore();
  
  const getScoreColor = (score: number) => {
    if (score < 30) return 'bg-green-500';
    if (score < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <HardDrive className="mr-2 h-5 w-5" />
          Firmware Analysis
        </CardTitle>
        <CardDescription>
          {firmwareVersion
            ? `${brand} ${model} - Firmware v${firmwareVersion}`
            : 'No firmware version detected'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {firmwareAnalysis ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Vulnerability Risk</span>
                <span className="text-sm font-medium">{vulnerabilityScore}%</span>
              </div>
              <Progress 
                value={vulnerabilityScore} 
                className={`h-2 ${getScoreColor(vulnerabilityScore)}`} 
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center">
                  {firmwareAnalysis.outdated ? (
                    <>
                      <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                      Outdated Firmware
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1 text-green-500" />
                      Firmware Up-to-date
                    </>
                  )}
                </span>
                
                {firmwareAnalysis.recommendedVersion && firmwareAnalysis.outdated && (
                  <Badge variant="outline" className="ml-2">
                    Recommended: v{firmwareAnalysis.recommendedVersion}
                  </Badge>
                )}
              </div>
              
              <div className="pt-2">
                <div className="text-sm font-medium mb-2 flex items-center">
                  <BarChart className="h-4 w-4 mr-1" />
                  Technical Analysis
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-muted rounded-md p-2">
                    <div className="text-xs text-muted-foreground">Last Updated</div>
                    <div className="text-sm">
                      {firmwareAnalysis.lastUpdate 
                        ? new Date(firmwareAnalysis.lastUpdate).toLocaleDateString() 
                        : 'Unknown'}
                    </div>
                  </div>
                  
                  <div className="bg-muted rounded-md p-2">
                    <div className="text-xs text-muted-foreground">Vulnerabilities</div>
                    <div className="text-sm">
                      {firmwareAnalysis.knownVulnerabilities.length} found
                    </div>
                  </div>
                </div>
                
                {firmwareAnalysis.knownVulnerabilities.length > 0 && (
                  <ScrollArea className="h-32 rounded-md border p-2">
                    <div className="space-y-2">
                      {firmwareAnalysis.knownVulnerabilities.map((cve, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm font-mono">{cve}</span>
                          <Badge 
                            variant="outline" 
                            className="cursor-pointer hover:bg-accent"
                            onClick={() => window.open(`https://nvd.nist.gov/vuln/detail/${cve}`, '_blank')}
                          >
                            Details
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 space-y-2">
            <AlertTriangle className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No firmware analysis available</p>
            {firmwareVersion ? (
              <Badge variant="outline">Analysis unavailable for this firmware</Badge>
            ) : (
              <Badge variant="outline">Firmware version unknown</Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FirmwareAnalysis;
