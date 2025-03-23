
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

const CameraSearchTools: React.FC = () => {
  return (
    <Card className="border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Camera Search Tools</CardTitle>
        <CardDescription>
          Tools for discovering and analyzing CCTV and IP cameras
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
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CameraSearchTools;
