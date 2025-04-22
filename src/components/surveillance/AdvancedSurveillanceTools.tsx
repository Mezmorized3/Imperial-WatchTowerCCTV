
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import TapoPoCTool from './security/TapoPoCTool';
import NetworkReconTools from './recon/NetworkReconTools';
import NetworkPenetrationTools from './security/NetworkPenetrationTools';
import ComputerVisionTools from './vision/ComputerVisionTools';
import StreamingTools from './streaming/StreamingTools';
import { Bug, Globe, Shield, Eye, Video } from 'lucide-react';

const AdvancedSurveillanceTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('network-recon');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Advanced Surveillance Toolkit</CardTitle>
        <CardDescription>
          Comprehensive tools for network reconnaissance, RTSP streaming, computer vision, and security testing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="network-recon" className="data-[state=active]:bg-blue-500/20">
              <Globe className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Network Recon</span>
              <span className="inline md:hidden">Recon</span>
            </TabsTrigger>
            <TabsTrigger value="network-pentest" className="data-[state=active]:bg-yellow-500/20">
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Network Testing</span>
              <span className="inline md:hidden">Testing</span>
            </TabsTrigger>
            <TabsTrigger value="computer-vision" className="data-[state=active]:bg-purple-500/20">
              <Eye className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Computer Vision</span>
              <span className="inline md:hidden">Vision</span>
            </TabsTrigger>
            <TabsTrigger value="streaming" className="data-[state=active]:bg-green-500/20">
              <Video className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Streaming Tools</span>
              <span className="inline md:hidden">Streaming</span>
            </TabsTrigger>
            <TabsTrigger value="tapo-poc" className="data-[state=active]:bg-red-500/20">
              <Bug className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Tapo Camera PoC</span>
              <span className="inline md:hidden">Tapo PoC</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="network-recon">
            <NetworkReconTools />
          </TabsContent>
          
          <TabsContent value="network-pentest">
            <NetworkPenetrationTools />
          </TabsContent>
          
          <TabsContent value="computer-vision">
            <ComputerVisionTools />
          </TabsContent>
          
          <TabsContent value="streaming">
            <StreamingTools />
          </TabsContent>
          
          <TabsContent value="tapo-poc">
            <TapoPoCTool />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedSurveillanceTools;
