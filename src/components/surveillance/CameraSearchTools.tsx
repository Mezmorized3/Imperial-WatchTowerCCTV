
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CamerattackTool from './search-tools/CamerattackTool';
import { BotExploitsTool } from './search-tools/BotExploitsTool';
import { WebHackTool } from './search-tools/WebHackTool';
import { ComprehensiveCCTVScanner } from './search-tools/ComprehensiveCCTVScanner';
import { TorBotTool } from './search-tools/TorBotTool';
import HackCCTVTool from './search-tools/HackCCTVTool';

const CameraSearchTools: React.FC = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="camera-attack" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 mb-4 bg-scanner-dark-alt w-full">
          <TabsTrigger value="camera-attack" className="data-[state=active]:bg-scanner-info/20">
            CamerAttack
          </TabsTrigger>
          <TabsTrigger value="cctv-scanner" className="data-[state=active]:bg-scanner-info/20">
            CCTV Scanner
          </TabsTrigger>
          <TabsTrigger value="web-hack" className="data-[state=active]:bg-scanner-info/20">
            Web Hack
          </TabsTrigger>
          <TabsTrigger value="tor-bot" className="data-[state=active]:bg-scanner-info/20">
            TorBot
          </TabsTrigger>
          <TabsTrigger value="bot-exploits" className="data-[state=active]:bg-scanner-info/20">
            Bot Exploits
          </TabsTrigger>
          <TabsTrigger value="hack-cctv" className="data-[state=active]:bg-scanner-info/20">
            Hack CCTV
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="camera-attack">
          <CamerattackTool />
        </TabsContent>
        
        <TabsContent value="cctv-scanner">
          <ComprehensiveCCTVScanner />
        </TabsContent>
        
        <TabsContent value="web-hack">
          <WebHackTool />
        </TabsContent>
        
        <TabsContent value="tor-bot">
          <TorBotTool />
        </TabsContent>
        
        <TabsContent value="bot-exploits">
          <BotExploitsTool />
        </TabsContent>
        
        <TabsContent value="hack-cctv">
          <HackCCTVTool />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CameraSearchTools;
