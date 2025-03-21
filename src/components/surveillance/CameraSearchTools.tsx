
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from "@/components/ui/button";
import { Camera, Cpu, Globe, Search, Shield, Webhook, Map, User, Scan, Globe2, Flag, Tv, Bot, Link, Zap, FileWarning } from 'lucide-react';
import { SearchCamTool } from './search-tools/SearchCamTool';
import { IPCamSearchTool } from './search-tools/IPCamSearchTool';
import { CameradarTool } from './search-tools/CameradarTool';
import { InsecamTool } from './search-tools/InsecamTool';
import { UsernameSearchTool } from './search-tools/UsernameSearchTool';
import { WebCheckTool } from './search-tools/WebCheckTool';
import { CCTVMapTool } from './search-tools/CCTVMapTool';
import { TorBotTool } from './search-tools/TorBotTool';
import { PhotonTool } from './search-tools/PhotonTool';
import { TwintTool } from './search-tools/TwintTool';
import { WebHackTool } from './search-tools/WebHackTool';
import { BotExploitsTool } from './search-tools/BotExploitsTool';
import { SpeedCameraTool } from './search-tools/SpeedCameraTool';
import { CCTVTool } from './search-tools/CCTVTool';
import { CamerattackTool } from './search-tools/CamerattackTool';
import { OSINTTool } from './search-tools/OSINTTool';
import { ShieldAITool } from './search-tools/ShieldAITool';
import { BackHackTool } from './search-tools/BackHackTool';

// Search methods definitions with all tools
const SEARCH_METHODS = [
  { id: 'searchcam', name: 'SearchCAM', description: 'Google dorks to find camera streams', icon: <Search className="h-4 w-4" /> },
  { id: 'ipcamsearch', name: 'IPCam Protocol', description: 'Search using camera discovery protocols', icon: <Webhook className="h-4 w-4" /> },
  { id: 'cameradar', name: 'Cameradar', description: 'RTSP streams discovery and access', icon: <Shield className="h-4 w-4" /> },
  { id: 'insecam', name: 'InsecamOrg', description: 'Country-based camera search', icon: <Flag className="h-4 w-4" /> },
  { id: 'username', name: 'Username Search', description: 'Find accounts across platforms', icon: <User className="h-4 w-4" /> },
  { id: 'webcheck', name: 'Web Check', description: 'Analyze website security', icon: <Globe2 className="h-4 w-4" /> },
  { id: 'cctvmap', name: 'CCTV Mapper', description: 'Geolocation mapping of cameras', icon: <Map className="h-4 w-4" /> },
  { id: 'cctv', name: 'CCTV Tools', description: 'Common CCTV hacking techniques', icon: <Tv className="h-4 w-4" /> },
  { id: 'speedcamera', name: 'Speed Camera', description: 'Motion-based camera detection', icon: <Zap className="h-4 w-4" /> },
  { id: 'torbot', name: 'TorBot', description: 'Dark web OSINT tool', icon: <Globe className="h-4 w-4" /> },
  { id: 'photon', name: 'Photon', description: 'Web crawler and information gatherer', icon: <Link className="h-4 w-4" /> },
  { id: 'twint', name: 'Twint', description: 'Twitter intelligence tool', icon: <Scan className="h-4 w-4" /> },
  { id: 'webhack', name: 'WebHack', description: 'Web application scanner', icon: <Cpu className="h-4 w-4" /> },
  { id: 'botexploits', name: 'BotExploits', description: 'IoT device discovery & analysis', icon: <Bot className="h-4 w-4" /> },
  { id: 'camerattack', name: 'CamerAttack', description: 'Camera specific attacks', icon: <Shield className="h-4 w-4" /> },
  { id: 'osint', name: 'OSINT Suite', description: 'Comprehensive OSINT collection', icon: <Search className="h-4 w-4" /> },
  { id: 'shieldai', name: 'Shield AI', description: 'AI-powered security analysis', icon: <Shield className="h-4 w-4" /> },
  { id: 'backhack', name: 'BackHack', description: 'Backend system analysis', icon: <FileWarning className="h-4 w-4" /> }
];

const CameraSearchTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('searchcam');
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(SEARCH_METHODS.length / ITEMS_PER_PAGE);
  
  const currentPageMethods = SEARCH_METHODS.slice(
    currentPage * ITEMS_PER_PAGE, 
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Camera className="mr-2" /> Advanced Camera &amp; OSINT Tools
        </CardTitle>
        <CardDescription>
          Multiple methods to discover cameras and gather intelligence
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="searchcam" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col space-y-4">
            <TabsList className="grid grid-cols-6 mb-2">
              {currentPageMethods.map(method => (
                <TabsTrigger key={method.id} value={method.id} className="flex items-center">
                  {method.icon}
                  <span className="ml-1 hidden sm:inline">{method.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mb-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <Button 
                    key={index}
                    variant={currentPage === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(index)}
                    className="w-8 h-8 p-0"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          {SEARCH_METHODS.map(method => (
            <TabsContent key={method.id} value={method.id} className="space-y-4">
              <Alert>
                {method.icon}
                <AlertTitle>{method.name}</AlertTitle>
                <AlertDescription>{method.description}</AlertDescription>
              </Alert>
              
              {/* Render the appropriate tool component based on the active tab */}
              {method.id === 'searchcam' && <SearchCamTool />}
              {method.id === 'ipcamsearch' && <IPCamSearchTool />}
              {method.id === 'cameradar' && <CameradarTool />}
              {method.id === 'insecam' && <InsecamTool />}
              {method.id === 'username' && <UsernameSearchTool />}
              {method.id === 'webcheck' && <WebCheckTool />}
              {method.id === 'cctvmap' && <CCTVMapTool />}
              {method.id === 'torbot' && <TorBotTool />}
              {method.id === 'photon' && <PhotonTool />}
              {method.id === 'twint' && <TwintTool />}
              {method.id === 'webhack' && <WebHackTool />}
              {method.id === 'botexploits' && <BotExploitsTool />}
              {method.id === 'speedcamera' && <SpeedCameraTool />}
              {method.id === 'cctv' && <CCTVTool />}
              {method.id === 'camerattack' && <CamerattackTool />}
              {method.id === 'osint' && <OSINTTool />}
              {method.id === 'shieldai' && <ShieldAITool />}
              {method.id === 'backhack' && <BackHackTool />}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t border-gray-700">
        <span className="text-xs text-gray-500">
          OSINT tools should be used responsibly and ethically. Always respect privacy and legal regulations.
        </span>
      </CardFooter>
    </Card>
  );
};

export default CameraSearchTools;
