
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Key, Eye, AlertTriangle } from 'lucide-react';
import ImperialNavigation from '@/components/common/ImperialNavigation';
import ImperialShieldMatrix from '@/components/imperial-control/ImperialShieldMatrix';
import VulnerabilityAssessment from '@/components/VulnerabilityAssessment';
import FirmwareAnalysis from '@/components/FirmwareAnalysis';
import ThreatIntelligence from '@/components/ThreatIntelligence';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

const ImperialShield = () => {
  const [activeTab, setActiveTab] = useState('shield-matrix');
  const { toast } = useToast();
  const location = useLocation();
  
  const shieldBanner = `
██╗███╗   ███╗██████╗ ███████╗██████╗ ██╗ █████╗ ██╗         ███████╗██╗  ██╗██╗███████╗██╗     ██████╗ 
██║████╗ ████║██╔══██╗██╔════╝██╔══██╗██║██╔══██╗██║         ██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗
██║██╔████╔██║██████╔╝█████╗  ██████╔╝██║███████║██║         ███████╗███████║██║█████╗  ██║     ██║  ██║
██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗██║██╔══██║██║         ╚════██║██╔══██║██║██╔══╝  ██║     ██║  ██║
██║██║ ╚═╝ ██║██║     ███████╗██║  ██║██║██║  ██║███████╗    ███████║██║  ██║██║███████╗███████╗██████╔╝
╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝    ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝ 
  `;

  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <header className="bg-scanner-dark-alt border-b border-gray-800">
        <ImperialNavigation />
        
        <div className="container mx-auto flex flex-col py-4 px-6">
          <div className="flex items-center w-full">
            <div className="w-full">
              <pre className="text-xs md:text-sm text-red-500 font-mono">
                {shieldBanner}
              </pre>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 flex items-center">
            <Shield className="mr-2 text-red-500" /> Imperial Shield Security Center
          </h1>
          <p className="text-gray-400">
            Advanced security modules for surveillance systems protection and vulnerability assessment
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-scanner-dark-alt w-full justify-start overflow-x-auto">
            <TabsTrigger value="shield-matrix" className="data-[state=active]:bg-scanner-info/20">
              <Shield className="h-4 w-4 mr-2" />
              Shield Matrix
            </TabsTrigger>
            <TabsTrigger value="vulnerability" className="data-[state=active]:bg-scanner-info/20">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Vulnerability Assessment
            </TabsTrigger>
            <TabsTrigger value="firmware" className="data-[state=active]:bg-scanner-info/20">
              <Lock className="h-4 w-4 mr-2" />
              Firmware Analysis
            </TabsTrigger>
            <TabsTrigger value="threat" className="data-[state=active]:bg-scanner-info/20">
              <Key className="h-4 w-4 mr-2" />
              Threat Intelligence
            </TabsTrigger>
            <TabsTrigger value="security-config" className="data-[state=active]:bg-scanner-info/20">
              <Eye className="h-4 w-4 mr-2" />
              Security Configuration
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="shield-matrix">
            <Card className="bg-scanner-dark-alt border-gray-700">
              <CardContent className="pt-6">
                <ImperialShieldMatrix />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vulnerability">
            <VulnerabilityAssessment />
          </TabsContent>
          
          <TabsContent value="firmware">
            <FirmwareAnalysis />
          </TabsContent>
          
          <TabsContent value="threat">
            <ThreatIntelligence />
          </TabsContent>
          
          <TabsContent value="security-config">
            <Card className="bg-scanner-dark-alt border-gray-700">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Security Configuration</h2>
                  <p className="text-gray-400">Configure security settings for your surveillance infrastructure</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-scanner-dark p-4 rounded-md border border-gray-700">
                      <h3 className="text-lg font-medium mb-2">Authentication Settings</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Configure authentication methods and access controls
                      </p>
                      <button 
                        className="bg-scanner-info/20 text-scanner-info hover:bg-scanner-info/30 px-4 py-2 rounded-md w-full"
                        onClick={() => {
                          toast({
                            title: "Feature in Development",
                            description: "This feature is currently being implemented",
                          });
                        }}
                      >
                        Configure Authentication
                      </button>
                    </div>
                    
                    <div className="bg-scanner-dark p-4 rounded-md border border-gray-700">
                      <h3 className="text-lg font-medium mb-2">Encryption Settings</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Manage encryption protocols and certificates
                      </p>
                      <button 
                        className="bg-scanner-info/20 text-scanner-info hover:bg-scanner-info/30 px-4 py-2 rounded-md w-full"
                        onClick={() => {
                          toast({
                            title: "Feature in Development",
                            description: "This feature is currently being implemented",
                          });
                        }}
                      >
                        Configure Encryption
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ImperialShield;
