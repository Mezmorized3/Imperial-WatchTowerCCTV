
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, HardDrive, Server } from 'lucide-react';
import ThreatReputation from './ThreatReputation';
import FirmwareDetails from './FirmwareDetails';
import ServerStatus from '../ServerStatus';
import { ThreatIntelData } from '@/utils/osintToolTypes';

export interface ThreatIntelligenceProps {
  camera: {
    id: string;
    ip: string;
    model?: string;
    manufacturer?: string;
    threatIntelligence?: ThreatIntelData;
    threatIntel?: ThreatIntelData;
    firmware?: {
      version?: string;
      vulnerabilities?: string[];
      updateAvailable?: boolean;
      lastChecked?: string;
    }
  } | null;
}

const ThreatIntelligence: React.FC<ThreatIntelligenceProps> = ({ camera }) => {
  if (!camera) {
    return <div className="p-4 text-muted-foreground">Select a camera to view threat intelligence.</div>;
  }

  // Create default ThreatIntelData if missing
  const threatIntel: ThreatIntelData = camera.threatIntelligence || camera.threatIntel || {
    ipReputation: 50,
    confidenceScore: 50,
    source: 'default',
    associatedMalware: [],
    lastUpdated: new Date().toISOString()
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
