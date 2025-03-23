
import React, { useState, useCallback } from 'react';
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
import ImperialOculusTool from './search-tools/ImperialOculusTool';
import FFmpegTool from './search-tools/FFmpegTool';
import RapidPayloadTool from './search-tools/RapidPayloadTool';
import HackingToolTool from './search-tools/HackingToolTool';
import SecurityAdminTool from './search-tools/SecurityAdminTool';
import ScrapyTool from './search-tools/ScrapyTool';
import WebhackAdvancedTool from './search-tools/WebhackAdvancedTool';
import HackToolsTool from './search-tools/HackToolsTool';
import HackCCTVTool from './search-tools/HackCCTVTool';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProxyManager from './ProxyManager';
import { ProxyConfig } from '@/utils/osintToolTypes';

export const CameraSearchTools = () => {
  const [activeTab, setActiveTab] = useState("cameradar");
  const [proxyConfig, setProxyConfig] = useState<ProxyConfig | undefined>(undefined);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };

  const handleProxyChange = useCallback((proxy: ProxyConfig) => {
    setProxyConfig(proxy);
    console.log("Global proxy configuration updated:", proxy);
  }, []);

  // Define our tool groups for better organization
  const toolGroups = [
    // Row 1: Camera tools
    [
      { id: "cameradar", label: "Cameradar" },
      { id: "ipcam", label: "IP Cam Search" },
      { id: "cctv", label: "CCTV" },
      { id: "camerattack", label: "Camerattack" },
      { id: "imperial-oculus", label: "Imperial Oculus" },
      { id: "hack-cctv", label: "HackCCTV" },
    ],
    // Row 2: Media & Web tools
    [
      { id: "ffmpeg", label: "FFmpeg" },
      { id: "webcheck", label: "Web Check" },
      { id: "webhack", label: "WebHack" },
      { id: "webhack-adv", label: "WebHack Adv" },
      { id: "photon", label: "Photon" },
      { id: "torbot", label: "TorBot" },
    ],
    // Row 3: Social & OSINT tools
    [
      { id: "username", label: "Username Search" },
      { id: "twint", label: "Twint" },
      { id: "osint", label: "OSINT" },
      { id: "shield-ai", label: "Shield AI" },
      { id: "botexploits", label: "Bot Exploits" },
      { id: "scrapy", label: "Scrapy" },
    ],
    // Row 4: Hacking tools
    [
      { id: "backhack", label: "BackHack" },
      { id: "security-admin", label: "Security Admin" },
      { id: "rapid-payload", label: "RapidPayload" },
      { id: "hacking-tool", label: "Hacking Tool" },
      { id: "hack-tools", label: "HackTools" },
    ]
  ];

  return (
    <div className="p-4">
      {/* Add the proxy manager at the top */}
      <ProxyManager onProxyChange={handleProxyChange} />
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="space-y-2">
          {toolGroups.map((group, index) => (
            <TabsList key={index} className="w-full flex flex-wrap justify-start mb-1">
              {group.map((tool) => (
                <TabsTrigger 
                  key={tool.id} 
                  value={tool.id}
                  className="flex-grow max-w-[180px]"
                >
                  {tool.label}
                </TabsTrigger>
              ))}
            </TabsList>
          ))}
        </div>

        <ScrollArea className="h-[calc(100vh-340px)] mt-4">
          <TabsContent value="cameradar" className="mt-0">
            <CameradarTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="ipcam" className="mt-0">
            <IPCamSearchTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="cctv" className="mt-0">
            <CCTVTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="username" className="mt-0">
            <UsernameSearchTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="webcheck" className="mt-0">
            <WebCheckTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="torbot" className="mt-0">
            <TorBotTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="webhack" className="mt-0">
            <WebHackTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="photon" className="mt-0">
            <PhotonTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="twint" className="mt-0">
            <TwintTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="osint" className="mt-0">
            <OSINTTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="shield-ai" className="mt-0">
            <ShieldAITool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="botexploits" className="mt-0">
            <BotExploitsTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="camerattack" className="mt-0">
            <CamerattackTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="backhack" className="mt-0">
            <BackHackTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="imperial-oculus" className="mt-0">
            <ImperialOculusTool proxyConfig={proxyConfig} />
          </TabsContent>
          
          {/* Tool tabs */}
          <TabsContent value="ffmpeg" className="mt-0">
            <FFmpegTool />
          </TabsContent>
          <TabsContent value="rapid-payload" className="mt-0">
            <RapidPayloadTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="hacking-tool" className="mt-0">
            <HackingToolTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="security-admin" className="mt-0">
            <SecurityAdminTool proxyConfig={proxyConfig} />
          </TabsContent>
          
          {/* Scrapy tool tab */}
          <TabsContent value="scrapy" className="mt-0">
            <ScrapyTool proxyConfig={proxyConfig} />
          </TabsContent>
          
          {/* New tool tabs */}
          <TabsContent value="webhack-adv" className="mt-0">
            <WebhackAdvancedTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="hack-tools" className="mt-0">
            <HackToolsTool proxyConfig={proxyConfig} />
          </TabsContent>
          <TabsContent value="hack-cctv" className="mt-0">
            <HackCCTVTool proxyConfig={proxyConfig} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default CameraSearchTools;
