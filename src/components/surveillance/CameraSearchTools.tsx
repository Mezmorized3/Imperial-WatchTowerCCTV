import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Globe, Network, Search, Video } from 'lucide-react';
import CountrySelector from '../inputs/CountrySelector';
import IPCameraSearch from './search-tools/IPCameraSearch';
import CCTVExplorer from './search-tools/CCTVExplorer';
import SpeedCamera from './search-tools/SpeedCamera';
import CamerattackTool from './search-tools/CamerattackTool'; // Fixed import
import WebHackTool from './search-tools/WebHackTool';
import BackHackTool from './search-tools/BackHackTool';
import TorBotTool from './search-tools/TorBotTool';
import FFmpegTool from './search-tools/FFmpegTool';
import PhotonTool from './search-tools/PhotonTool';
import BotExploitsTool from './search-tools/BotExploitsTool';
import EasternEuropeCCTVTools from './search-tools/EasternEuropeCCTVTools';
import ComprehensiveCCTVScanner from './search-tools/ComprehensiveCCTVScanner';
import RapidPayloadTool from './search-tools/RapidPayloadTool';
import ImperialOculusTool from './search-tools/ImperialOculusTool';
import { Button } from '@/components/ui/button';

const CameraSearchTools = () => {
  const [activeTab, setActiveTab] = useState('ip-camera');

  return (
    <Card className="border-gray-700 bg-scanner-dark shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="h-5 w-5 text-scanner-success mr-2" />
          Camera Search Tools
        </CardTitle>
        <CardDescription className="text-gray-400">
          Explore various tools for discovering and analyzing IP cameras
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ip-camera" className="w-full">
          <TabsList className="bg-scanner-dark-alt w-full justify-start">
            <TabsTrigger value="ip-camera" className="data-[state=active]:bg-scanner-info/20">
              <Search className="h-4 w-4 mr-2" />
              IP Camera Search
            </TabsTrigger>
            <TabsTrigger value="cctv-explorer" className="data-[state=active]:bg-scanner-info/20">
              <Globe className="h-4 w-4 mr-2" />
              CCTV Explorer
            </TabsTrigger>
            <TabsTrigger value="speed-camera" className="data-[state=active]:bg-scanner-info/20">
              <Video className="h-4 w-4 mr-2" />
              Speed Camera
            </TabsTrigger>
            <TabsTrigger value="camerattack" className="data-[state=active]:bg-scanner-info/20">
              <Network className="h-4 w-4 mr-2" />
              Camerattack
            </TabsTrigger>
            <TabsTrigger value="web-hack" className="data-[state=active]:bg-scanner-info/20">
              <Globe className="h-4 w-4 mr-2" />
              Web Hack
            </TabsTrigger>
            <TabsTrigger value="back-hack" className="data-[state=active]:bg-scanner-info/20">
              <Camera className="h-4 w-4 mr-2" />
              Back Hack
            </TabsTrigger>
            <TabsTrigger value="tor-bot" className="data-[state=active]:bg-scanner-info/20">
              <Globe className="h-4 w-4 mr-2" />
              Tor Bot
            </TabsTrigger>
            <TabsTrigger value="ffmpeg" className="data-[state=active]:bg-scanner-info/20">
              <Video className="h-4 w-4 mr-2" />
              FFmpeg
            </TabsTrigger>
            <TabsTrigger value="photon" className="data-[state=active]:bg-scanner-info/20">
              <Globe className="h-4 w-4 mr-2" />
              Photon
            </TabsTrigger>
            <TabsTrigger value="bot-exploits" className="data-[state=active]:bg-scanner-info/20">
              <Network className="h-4 w-4 mr-2" />
              Bot Exploits
            </TabsTrigger>
            <TabsTrigger value="eastern-europe" className="data-[state=active]:bg-scanner-info/20">
              <Globe className="h-4 w-4 mr-2" />
              Eastern Europe CCTV
            </TabsTrigger>
            <TabsTrigger value="comprehensive-cctv" className="data-[state=active]:bg-scanner-info/20">
              <Camera className="h-4 w-4 mr-2" />
              Comprehensive CCTV
            </TabsTrigger>
            <TabsTrigger value="rapid-payload" className="data-[state=active]:bg-scanner-info/20">
              <Network className="h-4 w-4 mr-2" />
              Rapid Payload
            </TabsTrigger>
            <TabsTrigger value="imperial-oculus" className="data-[state=active]:bg-scanner-info/20">
              <Globe className="h-4 w-4 mr-2" />
              Imperial Oculus
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ip-camera">
            <IPCameraSearch />
          </TabsContent>
          <TabsContent value="cctv-explorer">
            <CCTVExplorer />
          </TabsContent>
          <TabsContent value="speed-camera">
            <SpeedCamera />
          </TabsContent>
          <TabsContent value="camerattack">
            <CamerattackTool />
          </TabsContent>
          <TabsContent value="web-hack">
            <WebHackTool />
          </TabsContent>
          <TabsContent value="back-hack">
            <BackHackTool />
          </TabsContent>
          <TabsContent value="tor-bot">
            <TorBotTool />
          </TabsContent>
          <TabsContent value="ffmpeg">
            <FFmpegTool />
          </TabsContent>
          <TabsContent value="photon">
            <PhotonTool />
          </TabsContent>
          <TabsContent value="bot-exploits">
            <BotExploitsTool />
          </TabsContent>
          <TabsContent value="eastern-europe">
            <EasternEuropeCCTVTools />
          </TabsContent>
          <TabsContent value="comprehensive-cctv">
            <ComprehensiveCCTVScanner />
          </TabsContent>
          <TabsContent value="rapid-payload">
            <RapidPayloadTool />
          </TabsContent>
          <TabsContent value="imperial-oculus">
            <ImperialOculusTool />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CameraSearchTools;
