
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsernameSearchTool } from './search-tools/UsernameSearchTool';
import { CameradarTool } from './search-tools/CameradarTool';
import { IPCamSearchTool } from './search-tools/IPCamSearchTool';
import { WebCheckTool } from './search-tools/WebCheckTool';
import { CCTVTool } from './search-tools/CCTVTool';
import { TorBotTool } from './search-tools/TorBotTool';
import { WebHackTool } from './search-tools/WebHackTool';
import { PhotonTool } from './search-tools/PhotonTool';
import { TwintTool } from './search-tools/TwintTool';
import { OSINTTool } from './search-tools/OSINTTool';
import { ShieldAITool } from './search-tools/ShieldAITool';
import { BotExploitsTool } from './search-tools/BotExploitsTool';
import { CamerattackTool } from './search-tools/CamerattackTool';
import { BackHackTool } from './search-tools/BackHackTool';
import { ImperialOculusTool } from './search-tools/ImperialOculusTool';

export const CameraSearchTools = () => {
  const [activeTab, setActiveTab] = useState("cameradar");

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };

  return (
    <div className="p-4">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-5 gap-2 mb-4 overflow-x-auto">
          <TabsTrigger value="cameradar">Cameradar</TabsTrigger>
          <TabsTrigger value="ipcam">IP Cam Search</TabsTrigger>
          <TabsTrigger value="cctv">CCTV</TabsTrigger>
          <TabsTrigger value="camerattack">Camerattack</TabsTrigger>
          <TabsTrigger value="imperial-oculus">Imperial Oculus</TabsTrigger>
          <TabsTrigger value="username">Username Search</TabsTrigger>
          <TabsTrigger value="webcheck">Web Check</TabsTrigger>
          <TabsTrigger value="torbot">TorBot</TabsTrigger>
          <TabsTrigger value="webhack">WebHack</TabsTrigger>
          <TabsTrigger value="photon">Photon</TabsTrigger>
          <TabsTrigger value="twint">Twint</TabsTrigger>
          <TabsTrigger value="osint">OSINT</TabsTrigger>
          <TabsTrigger value="shield-ai">Shield AI</TabsTrigger>
          <TabsTrigger value="botexploits">Bot Exploits</TabsTrigger>
          <TabsTrigger value="backhack">BackHack</TabsTrigger>
        </TabsList>

        <div className="p-0">
          <TabsContent value="cameradar" className="mt-0">
            <CameradarTool />
          </TabsContent>
          <TabsContent value="ipcam" className="mt-0">
            <IPCamSearchTool />
          </TabsContent>
          <TabsContent value="cctv" className="mt-0">
            <CCTVTool />
          </TabsContent>
          <TabsContent value="username" className="mt-0">
            <UsernameSearchTool />
          </TabsContent>
          <TabsContent value="webcheck" className="mt-0">
            <WebCheckTool />
          </TabsContent>
          <TabsContent value="torbot" className="mt-0">
            <TorBotTool />
          </TabsContent>
          <TabsContent value="webhack" className="mt-0">
            <WebHackTool />
          </TabsContent>
          <TabsContent value="photon" className="mt-0">
            <PhotonTool />
          </TabsContent>
          <TabsContent value="twint" className="mt-0">
            <TwintTool />
          </TabsContent>
          <TabsContent value="osint" className="mt-0">
            <OSINTTool />
          </TabsContent>
          <TabsContent value="shield-ai" className="mt-0">
            <ShieldAITool />
          </TabsContent>
          <TabsContent value="botexploits" className="mt-0">
            <BotExploitsTool />
          </TabsContent>
          <TabsContent value="camerattack" className="mt-0">
            <CamerattackTool />
          </TabsContent>
          <TabsContent value="backhack" className="mt-0">
            <BackHackTool />
          </TabsContent>
          <TabsContent value="imperial-oculus" className="mt-0">
            <ImperialOculusTool />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CameraSearchTools;
