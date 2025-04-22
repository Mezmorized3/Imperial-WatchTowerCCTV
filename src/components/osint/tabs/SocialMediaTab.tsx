
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UsernameSearchTool from '@/components/surveillance/search-tools/UsernameSearchTool';
import TwitterSearchTool from '@/components/surveillance/search-tools/TwitterSearchTool';
import OSINTTool from '@/components/surveillance/search-tools/OSINTTool';
import ONVIFSearchTool from '@/components/surveillance/search-tools/ONVIFSearchTool';
import AdvancedNetworkTools from '@/components/surveillance/search-tools/AdvancedNetworkTools';
import ComputerVisionTool from '@/components/surveillance/search-tools/ComputerVisionTool';
import { Users, Twitter, Globe, Network, Lock, Camera } from 'lucide-react';

const SocialMediaTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Tabs defaultValue="username" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="username" className="text-xs sm:text-sm">
            <Users className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Username</span>
          </TabsTrigger>
          <TabsTrigger value="twitter" className="text-xs sm:text-sm">
            <Twitter className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Twitter</span>
          </TabsTrigger>
          <TabsTrigger value="osint" className="text-xs sm:text-sm">
            <Globe className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">OSINT</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="username">
          <UsernameSearchTool />
        </TabsContent>
        <TabsContent value="twitter">
          <TwitterSearchTool />
        </TabsContent>
        <TabsContent value="osint">
          <OSINTTool />
        </TabsContent>
      </Tabs>

      <Tabs defaultValue="onvif" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="onvif" className="text-xs sm:text-sm">
            <Network className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">ONVIF</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs sm:text-sm">
            <Lock className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Network</span>
          </TabsTrigger>
          <TabsTrigger value="vision" className="text-xs sm:text-sm">
            <Camera className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Vision</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="onvif">
          <ONVIFSearchTool />
        </TabsContent>
        <TabsContent value="advanced">
          <AdvancedNetworkTools />
        </TabsContent>
        <TabsContent value="vision">
          <ComputerVisionTool />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialMediaTab;
