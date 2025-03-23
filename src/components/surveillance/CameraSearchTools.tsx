
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
    <Card className="border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Camera & Security Tools</CardTitle>
        <CardDescription>
          Tools for discovering, analyzing, and testing security of CCTV and IP cameras
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cameradar" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-6">
            <TabsTrigger value="cameradar">Cameradar</TabsTrigger>
            <TabsTrigger value="ipcamsearch">IPCam Search</TabsTrigger>
            <TabsTrigger value="cctv">CCTV Explorer</TabsTrigger>
            <TabsTrigger value="hackcctv">HackCCTV</TabsTrigger>
            <TabsTrigger value="speedcamera">Speed Camera</TabsTrigger>
            <TabsTrigger value="camerattack">Camerattack</TabsTrigger>
            <TabsTrigger value="insecam">Insecam</TabsTrigger>
            <TabsTrigger value="webhack">Web Hack</TabsTrigger>
            <TabsTrigger value="securitytools">Security Tools</TabsTrigger>
            <TabsTrigger value="payload">Payload Gen</TabsTrigger>
            <TabsTrigger value="hackingtools">Hacking Tools</TabsTrigger>
          </TabsList>
          
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
