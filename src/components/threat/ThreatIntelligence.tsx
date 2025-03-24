
import React from 'react';
import { CameraResult } from '@/utils/osintToolTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, HardDrive, Server } from 'lucide-react';
import ThreatReputation from './ThreatReputation';
import FirmwareDetails from './FirmwareDetails';
import ServerStatus from '../ServerStatus';

export interface ThreatIntelligenceProps {
  camera: CameraResult | null;
}

const ThreatIntelligence: React.FC<ThreatIntelligenceProps> = ({ camera }) => {
  if (!camera) {
    return <div className="p-4 text-muted-foreground">Select a camera to view threat intelligence.</div>;
  }

  const { threatIntel, ip } = camera;

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
          <ThreatReputation threatIntel={threatIntel} />
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
            {camera.firmware?.version 
              ? `Analysis of firmware version ${camera.firmware.version}`
              : 'No firmware version detected'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FirmwareDetails camera={camera} />
        </CardContent>
      </Card>

      {/* Imperial Server Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Server className="mr-2 h-5 w-5" />
            Imperial Server
          </CardTitle>
          <CardDescription>
            Status of the Imperial Server and its services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServerStatus />
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreatIntelligence;
