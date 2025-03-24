
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CameraResult } from '@/types/scanner';
import ThreatIntelligence from './ThreatIntelligence';
import FirmwareAnalysis from './FirmwareAnalysis';
import VulnerabilityAssessment from './VulnerabilityAssessment';
import { AlertTriangle, Shield, Activity } from 'lucide-react';

interface ThreatData {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  vulnCount: number;
  detectedMalware: string[];
  securityScore: number;
}

interface ThreatAnalysisDashboardProps {
  camera?: CameraResult;
}

const getThreatData = (camera: CameraResult): ThreatData => {
  // This would be replaced with actual threat analysis
  const vulnCount = camera.vulnerabilities?.length || 0;
  const malwareCount = camera.threatIntel?.associatedMalware?.length || 0;
  
  let threatLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (vulnCount > 2 || malwareCount > 1) {
    threatLevel = 'critical';
  } else if (vulnCount > 0 || malwareCount > 0) {
    threatLevel = 'high';
  } else if (camera.status === 'vulnerable') {
    threatLevel = 'medium';
  }
  
  const securityScore = threatLevel === 'low' ? 90 :
                        threatLevel === 'medium' ? 70 :
                        threatLevel === 'high' ? 40 : 20;
  
  return {
    threatLevel,
    vulnCount,
    detectedMalware: camera.threatIntel?.associatedMalware || [],
    securityScore
  };
};

const ThreatAnalysisDashboard: React.FC<ThreatAnalysisDashboardProps> = ({ camera }) => {
  if (!camera) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Threat Analysis</CardTitle>
          <CardDescription>
            Select a camera to view threat analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-12 text-center text-gray-500">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p>No camera selected for threat analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const threatData = getThreatData(camera);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Threat Analysis: {camera.ip}
          </CardTitle>
          <CardDescription>
            Comprehensive security analysis for the selected device
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-medium text-gray-500">Threat Level</h3>
              <div className="mt-1 flex items-center">
                <span className={`text-xl font-bold mr-2 
                  ${threatData.threatLevel === 'low' ? 'text-green-500' : 
                    threatData.threatLevel === 'medium' ? 'text-yellow-500' :
                    threatData.threatLevel === 'high' ? 'text-orange-500' : 'text-red-500'}`}>
                  {threatData.threatLevel.toUpperCase()}
                </span>
                <Activity className={`h-5 w-5 
                  ${threatData.threatLevel === 'low' ? 'text-green-500' : 
                    threatData.threatLevel === 'medium' ? 'text-yellow-500' :
                    threatData.threatLevel === 'high' ? 'text-orange-500' : 'text-red-500'}`} />
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-medium text-gray-500">Vulnerabilities</h3>
              <div className="mt-1 flex items-center">
                <span className={`text-xl font-bold mr-2 
                  ${threatData.vulnCount === 0 ? 'text-green-500' : 
                    threatData.vulnCount <= 2 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {threatData.vulnCount}
                </span>
                <span className="text-gray-500">detected</span>
              </div>
            </div>
            
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-medium text-gray-500">Security Score</h3>
              <div className="mt-1 flex items-center">
                <span className={`text-xl font-bold mr-2 
                  ${threatData.securityScore >= 80 ? 'text-green-500' : 
                    threatData.securityScore >= 60 ? 'text-yellow-500' :
                    threatData.securityScore >= 40 ? 'text-orange-500' : 'text-red-500'}`}>
                  {threatData.securityScore}/100
                </span>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="intelligence">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="intelligence">Threat Intelligence</TabsTrigger>
              <TabsTrigger value="firmware">Firmware Analysis</TabsTrigger>
              <TabsTrigger value="vulnerabilities">Vulnerability Assessment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="intelligence">
              <div className="py-4">
                <ThreatIntelligence />
              </div>
            </TabsContent>
            
            <TabsContent value="firmware">
              <div className="py-4">
                <FirmwareAnalysis />
              </div>
            </TabsContent>
            
            <TabsContent value="vulnerabilities">
              <div className="py-4">
                <VulnerabilityAssessment />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreatAnalysisDashboard;
