
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Terminal, Folder } from 'lucide-react';

interface HackingTabsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  toolsTabContent: React.ReactNode;
  customTabContent: React.ReactNode;
}

export const HackingTabs: React.FC<HackingTabsProps> = ({
  selectedTab,
  setSelectedTab,
  toolsTabContent,
  customTabContent
}) => {
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
      <TabsList className="grid grid-cols-2 mb-4 bg-scanner-dark border border-gray-700">
        <TabsTrigger 
          value="tools" 
          className="data-[state=active]:bg-scanner-primary/30 data-[state=active]:text-white text-gray-300"
        >
          <Folder className="h-4 w-4 mr-2" />
          Tool Selection
        </TabsTrigger>
        <TabsTrigger 
          value="custom" 
          className="data-[state=active]:bg-scanner-primary/30 data-[state=active]:text-white text-gray-300"
        >
          <Terminal className="h-4 w-4 mr-2" />
          Custom Command
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="tools" className="space-y-4 text-white">
        {toolsTabContent}
      </TabsContent>
      
      <TabsContent value="custom" className="space-y-4 text-white">
        {customTabContent}
      </TabsContent>
    </Tabs>
  );
};
