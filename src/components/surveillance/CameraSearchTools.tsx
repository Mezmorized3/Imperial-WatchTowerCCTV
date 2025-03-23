
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { CameradarTool } from './search-tools/CameradarTool';
import { IPCamSearchTool } from './search-tools/IPCamSearchTool';
import CCTVExplorerTool from './search-tools/CCTVExplorerTool';
import { SpeedCameraTool } from './search-tools/SpeedCameraTool';
import { CamerattackTool } from './search-tools/CamerattackTool';
import { InsecamTool } from './search-tools/InsecamTool';
import HackCCTVTool from './search-tools/HackCCTVTool';
import AdvancedWebHackTool from './search-tools/AdvancedWebHackTool';
import RapidPayloadTool from './search-tools/RapidPayloadTool';
import HackingToolTool from './search-tools/HackingToolTool';
import SecurityToolsTabs from './search-tools/SecurityToolsTabs';

const CameraSearchTools: React.FC = () => {
  return (
    <Card className="border-gray-700 bg-scanner-dark">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Camera & Security Tools</CardTitle>
        <CardDescription>
          Tools for discovering, analyzing, and testing security of CCTV and IP cameras
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cameradar" className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="flex min-w-max w-full mb-6 bg-scanner-dark-alt border border-gray-700">
              <TabsTrigger value="cameradar" className="flex-1 whitespace-nowrap">Cameradar</TabsTrigger>
              <TabsTrigger value="ipcamsearch" className="flex-1 whitespace-nowrap">IPCam Search</TabsTrigger>
              <TabsTrigger value="cctv" className="flex-1 whitespace-nowrap">CCTV Explorer</TabsTrigger>
              <TabsTrigger value="hackcctv" className="flex-1 whitespace-nowrap">HackCCTV</TabsTrigger>
              <TabsTrigger value="speedcamera" className="flex-1 whitespace-nowrap">Speed Camera</TabsTrigger>
              <TabsTrigger value="camerattack" className="flex-1 whitespace-nowrap">Camerattack</TabsTrigger>
              <TabsTrigger value="insecam" className="flex-1 whitespace-nowrap">Insecam</TabsTrigger>
              <TabsTrigger value="webhack" className="flex-1 whitespace-nowrap">Web Hack</TabsTrigger>
              <TabsTrigger value="securitytools" className="flex-1 whitespace-nowrap">Security Tools</TabsTrigger>
              <TabsTrigger value="payload" className="flex-1 whitespace-nowrap">Payload Gen</TabsTrigger>
              <TabsTrigger value="hackingtools" className="flex-1 whitespace-nowrap">Hacking Tools</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="cameradar">
            <CameradarTool />
          </TabsContent>
          
          <TabsContent value="ipcamsearch">
            <IPCamSearchTool />
          </TabsContent>
          
          <TabsContent value="cctv">
            <CCTVExplorerTool />
          </TabsContent>
          
          <TabsContent value="hackcctv">
            <HackCCTVTool />
          </TabsContent>
          
          <TabsContent value="speedcamera">
            <SpeedCameraTool />
          </TabsContent>
          
          <TabsContent value="camerattack">
            <CamerattackTool />
          </TabsContent>
          
          <TabsContent value="insecam">
            <InsecamTool />
          </TabsContent>

          <TabsContent value="webhack">
            <AdvancedWebHackTool />
          </TabsContent>

          <TabsContent value="securitytools">
            <SecurityToolsTabs />
          </TabsContent>

          <TabsContent value="payload">
            <RapidPayloadTool />
          </TabsContent>

          <TabsContent value="hackingtools">
            <HackingToolTool />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CameraSearchTools;
