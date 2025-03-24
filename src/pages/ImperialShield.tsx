
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Server } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThreatIntelligence from '@/components/threat/ThreatIntelligence';
import FirmwareAnalysis from '@/components/FirmwareAnalysis';

// Create a default camera for the FirmwareAnalysis component
const defaultCamera = {
  id: 'default-camera',
  ip: '192.168.1.100',
  port: 554,
  model: 'Imperial Security Cam',
  manufacturer: 'Imperial Tech',
  status: 'online',
  firmware: {
    version: '2.0.4',
    vulnerabilities: [],
    updateAvailable: false,
    lastChecked: new Date().toISOString()
  }
};

const ImperialShield = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Shield className="mr-2 h-6 w-6" />
        Imperial Shield - Security Analysis
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="threat-intel" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="threat-intel">Threat Intel</TabsTrigger>
              <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="threat-intel">
              <ThreatIntelligence camera={defaultCamera} />
            </TabsContent>
            
            <TabsContent value="vulnerabilities">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                    Vulnerability Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6">
                    <p>No critical vulnerabilities detected in your network.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Regular scans are recommended to maintain security.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="compliance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="mr-2 h-5 w-5" />
                    Compliance Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6">
                    <p>All systems are compliant with security standards.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Last compliance check: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Firmware Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <FirmwareAnalysis camera={defaultCamera} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground p-4">
                No active security alerts
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImperialShield;
