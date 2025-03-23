
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
    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="tools">
          <Folder className="h-4 w-4 mr-2" />
          Tool Selection
        </TabsTrigger>
        <TabsTrigger value="custom">
          <Terminal className="h-4 w-4 mr-2" />
          Custom Command
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="tools" className="space-y-4">
        {toolsTabContent}
      </TabsContent>
      
      <TabsContent value="custom" className="space-y-4">
        {customTabContent}
      </TabsContent>
    </Tabs>
  );
};
