import React from 'react';
import { CameraResult } from '@/types/scanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import ThreatIntelligence from './ThreatIntelligence';
import FirmwareAnalysis from './FirmwareAnalysis';

interface ThreatAnalysisDashboardProps {
  camera: CameraResult;
}

const ThreatAnalysisDashboard: React.FC<ThreatAnalysisDashboardProps> = ({ camera }) => {
  const calculateOverallRisk = () => {
    let risk = 0;

    if (camera.vulnerabilities && camera.vulnerabilities.length > 0) {
      risk += camera.vulnerabilities.filter(v => v.severity === 'critical').length * 50;
      risk += camera.vulnerabilities.filter(v => v.severity === 'high').length * 30;
      risk += camera.vulnerabilities.filter(v => v.severity === 'medium').length * 20;
      risk += camera.vulnerabilities.filter(v => v.severity === 'low').length * 10;
    }

    if (camera.threatIntel && camera.threatIntel.associatedMalware && camera.threatIntel.associatedMalware.length > 0) {
      risk += 40;
    }

    if (camera.firmware && camera.firmware.updateAvailable) {
      risk += 25;
    }

    return Math.min(risk, 100);
  };

  const overallRisk = calculateOverallRisk();
  const riskColor = overallRisk > 70 ? 'red' : overallRisk > 40 ? 'yellow' : 'green';

  return (
    <div className="space-y-4">
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-4 w-4" /> Threat Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Overall Risk:</div>
            <div className="text-sm font-medium text-right">{overallRisk}%</div>
          </div>
          <Progress value={overallRisk} className="h-2" indicatorClassName={`bg-${riskColor}-500`} />
          <div className="text-xs text-gray-400">
            {overallRisk > 70 && "Critical risk detected. Immediate action required."}
            {overallRisk <= 70 && overallRisk > 40 && "Elevated risk. Review and apply recommendations."}
            {overallRisk <= 40 && "Low risk. Monitor for changes."}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" /> Vulnerabilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {camera.vulnerabilities && camera.vulnerabilities.length > 0 ? (
              <ul className="list-none space-y-1">
                {camera.vulnerabilities.map((vuln, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium">{vuln.name}</span> - <span className="text-gray-400">{vuln.description}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-400">No known vulnerabilities</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" /> Security Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Accessible:</span> {camera.accessible ? 'Yes' : 'No'}
            </div>
            {camera.credentials && (
              <div className="text-sm">
                <span className="font-medium">Default Credentials:</span> {camera.credentials ? 'Yes' : 'No'}
              </div>
            )}
            {camera.rtspUrl && (
              <div className="text-sm">
                <span className="font-medium">RTSP URL:</span> {camera.rtspUrl}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-4 w-4" /> Threat Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ThreatIntelligence camera={camera} />
          </CardContent>
        </Card>

        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-4 w-4" /> Firmware Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FirmwareAnalysis camera={camera} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThreatAnalysisDashboard;
