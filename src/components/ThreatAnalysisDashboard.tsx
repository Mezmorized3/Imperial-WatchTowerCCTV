
import React, { useState } from 'react';
import { CameraResult } from '@/types/scanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThreatIntelligence from './threat/ThreatIntelligence';
import FirmwareAnalysis from './FirmwareAnalysis';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Shield, Cpu, Server } from 'lucide-react';
import ServerStatus from './ServerStatus';

interface ThreatAnalysisDashboardProps {
  selectedCamera: CameraResult | null;
}

const ThreatAnalysisDashboard: React.FC<ThreatAnalysisDashboardProps> = ({ selectedCamera }) => {
  const [activeTab, setActiveTab] = useState('threatIntel');

  // Determine if we should show alerts based on threat data
  const shouldShowAlert = selectedCamera && 
    ((selectedCamera.threatIntel && selectedCamera.threatIntel.ipReputation < 50) || 
     (selectedCamera.firmwareAnalysis && 
      (selectedCamera.firmwareAnalysis.outdated || 
       selectedCamera.firmwareAnalysis.knownVulnerabilities.length > 0)));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Threat Analysis Dashboard</h2>
      
      {shouldShowAlert && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Security Risk Detected</AlertTitle>
          <AlertDescription>
            This camera has {selectedCamera.threatIntel && selectedCamera.threatIntel.ipReputation < 50 ? 'known threats' : ''} 
            {selectedCamera.threatIntel && selectedCamera.threatIntel.ipReputation < 50 && 
             selectedCamera.firmwareAnalysis && 
             (selectedCamera.firmwareAnalysis.outdated || 
              selectedCamera.firmwareAnalysis.knownVulnerabilities.length > 0) ? ' and ' : ''}
            {selectedCamera.firmwareAnalysis && 
             (selectedCamera.firmwareAnalysis.outdated || 
              selectedCamera.firmwareAnalysis.knownVulnerabilities.length > 0) ? 'firmware vulnerabilities' : ''}
            . Please review the analysis below.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="threatIntel" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Threat Intelligence
          </TabsTrigger>
          <TabsTrigger value="firmwareAnalysis" className="flex items-center">
            <Cpu className="mr-2 h-4 w-4" />
            Firmware Analysis
          </TabsTrigger>
          <TabsTrigger value="serverStatus" className="flex items-center">
            <Server className="mr-2 h-4 w-4" />
            Imperial Server
          </TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-[calc(100vh-300px)] mt-4">
          <TabsContent value="threatIntel" className="mt-0">
            <ThreatIntelligence camera={selectedCamera} />
          </TabsContent>
          
          <TabsContent value="firmwareAnalysis" className="mt-0">
            <FirmwareAnalysis camera={selectedCamera} />
          </TabsContent>

          <TabsContent value="serverStatus" className="mt-0">
            <ServerStatus />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default ThreatAnalysisDashboard;
