
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, Cpu, Globe, Search, Shield, Webhook, Map, User, Scan, Globe2, Flag } from 'lucide-react';
import { SearchCamTool } from './search-tools/SearchCamTool';
import { IPCamSearchTool } from './search-tools/IPCamSearchTool';
import { CameradarTool } from './search-tools/CameradarTool';
import { InsecamTool } from './search-tools/InsecamTool';
import { UsernameSearchTool } from './search-tools/UsernameSearchTool';
import { WebCheckTool } from './search-tools/WebCheckTool';
import { CCTVMapTool } from './search-tools/CCTVMapTool';

// Search methods definitions
const SEARCH_METHODS = [
  { id: 'searchcam', name: 'SearchCAM', description: 'Google dorks to find camera streams', icon: <Search className="h-4 w-4" /> },
  { id: 'ipcamsearch', name: 'IPCam Protocol', description: 'Search using camera discovery protocols', icon: <Webhook className="h-4 w-4" /> },
  { id: 'cameradar', name: 'Cameradar', description: 'RTSP streams discovery and access', icon: <Shield className="h-4 w-4" /> },
  { id: 'insecam', name: 'InsecamOrg', description: 'Country-based camera search', icon: <Flag className="h-4 w-4" /> },
  { id: 'username', name: 'Username Search', description: 'Find accounts across platforms', icon: <User className="h-4 w-4" /> },
  { id: 'webcheck', name: 'Web Check', description: 'Analyze website security', icon: <Globe2 className="h-4 w-4" /> },
  { id: 'cctvmap', name: 'CCTV Mapper', description: 'Geolocation mapping of cameras', icon: <Map className="h-4 w-4" /> }
];

const CameraSearchTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('searchcam');

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Camera className="mr-2" /> Advanced Camera & OSINT Tools
        </CardTitle>
        <CardDescription>
          Multiple methods to discover cameras and gather intelligence
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="searchcam" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-7 mb-6">
            {SEARCH_METHODS.map(method => (
              <TabsTrigger key={method.id} value={method.id} className="flex items-center">
                {method.icon}
                <span className="ml-1 hidden sm:inline">{method.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
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
