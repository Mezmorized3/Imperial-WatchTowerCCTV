
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CameradarTool } from './search-tools/CameradarTool';
import CCTVTool from './search-tools/CCTVTool';
import { SpeedCameraTool } from './search-tools/SpeedCameraTool';
import CamerattackTool from './search-tools/CamerattackTool';
import HackCCTVTool from './search-tools/HackCCTVTool';
import CamDumperTool from './search-tools/CamDumperTool';
import CCTVHackedTool from './search-tools/CCTVHackedTool';
import ONVIFSearchTool from './search-tools/ONVIFSearchTool';
import AdvancedNetworkTools from './search-tools/AdvancedNetworkTools';
import ComputerVisionTool from './search-tools/ComputerVisionTool';
import { Card, CardContent } from '@/components/ui/card';
import { Grid3X3, Shield, Camera, Search, Lock, Network, Globe, FileSearch, Webcam } from 'lucide-react';

const CameraSearchTools = () => {
  const [activeTabLeft, setActiveTabLeft] = useState('cameradar');
  const [activeTabRight, setActiveTabRight] = useState('hackCCTV');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Tabs value={activeTabLeft} onValueChange={setActiveTabLeft} className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4">
            <TabsTrigger value="cameradar" className="text-xs md:text-sm">
              <Search className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Cameradar</span>
            </TabsTrigger>
            <TabsTrigger value="cctv" className="text-xs md:text-sm">
              <Camera className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">CCTV</span>
            </TabsTrigger>
            <TabsTrigger value="speedcam" className="text-xs md:text-sm">
              <Grid3X3 className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Speed Cam</span>
            </TabsTrigger>
            <TabsTrigger value="onvif" className="text-xs md:text-sm">
              <Network className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">ONVIF</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="cameradar">
            <CameradarTool />
          </TabsContent>
          
          <TabsContent value="cctv">
            <CCTVTool />
          </TabsContent>
          
          <TabsContent value="speedcam">
            <SpeedCameraTool />
          </TabsContent>
          
          <TabsContent value="onvif">
            <ONVIFSearchTool />
          </TabsContent>
        </Tabs>
      </div>
      
      <div>
        <Tabs value={activeTabRight} onValueChange={setActiveTabRight} className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-4">
            <TabsTrigger value="hackCCTV" className="text-xs md:text-sm">
              <Shield className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Hack CCTV</span>
            </TabsTrigger>
            <TabsTrigger value="camerattack" className="text-xs md:text-sm">
              <Lock className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Camerattack</span>
            </TabsTrigger>
            <TabsTrigger value="camDumper" className="text-xs md:text-sm">
              <Globe className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Cam Dumper</span>
            </TabsTrigger>
            <TabsTrigger value="vision" className="text-xs md:text-sm">
              <Webcam className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Vision</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hackCCTV">
            <HackCCTVTool />
          </TabsContent>
          
          <TabsContent value="camerattack">
            <CamerattackTool />
          </TabsContent>
          
          <TabsContent value="camDumper">
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="cam-dumper" className="w-full">
                  <TabsList className="grid grid-cols-2 w-full rounded-t-lg rounded-b-none border-b border-gray-800">
                    <TabsTrigger value="cam-dumper" className="text-xs sm:text-sm">Cam Dumper</TabsTrigger>
                    <TabsTrigger value="cctv-hacked" className="text-xs sm:text-sm">CCTV Hacked</TabsTrigger>
                  </TabsList>
                  <TabsContent value="cam-dumper" className="m-0">
                    <CamDumperTool />
                  </TabsContent>
                  <TabsContent value="cctv-hacked" className="m-0">
                    <CCTVHackedTool />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vision">
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="vision" className="w-full">
                  <TabsList className="grid grid-cols-2 w-full rounded-t-lg rounded-b-none border-b border-gray-800">
                    <TabsTrigger value="vision" className="text-xs sm:text-sm">Computer Vision</TabsTrigger>
                    <TabsTrigger value="network" className="text-xs sm:text-sm">Network Tools</TabsTrigger>
                  </TabsList>
                  <TabsContent value="vision" className="m-0">
                    <ComputerVisionTool />
                  </TabsContent>
                  <TabsContent value="network" className="m-0">
                    <AdvancedNetworkTools />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CameraSearchTools;
