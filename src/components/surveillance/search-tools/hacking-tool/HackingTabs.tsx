
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Terminal, Tools } from 'lucide-react';

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
    <Tabs
      defaultValue={selectedTab}
      value={selectedTab}
      onValueChange={setSelectedTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 bg-scanner-dark-alt">
        <TabsTrigger 
          value="tools"
          className="flex items-center justify-center gap-2 data-[state=active]:bg-scanner-primary data-[state=active]:text-black"
        >
          <Tools className="h-4 w-4" />
          Tool Selection
        </TabsTrigger>
        <TabsTrigger 
          value="custom"
          className="flex items-center justify-center gap-2 data-[state=active]:bg-scanner-primary data-[state=active]:text-black"
        >
          <Terminal className="h-4 w-4" />
          Custom Command
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="tools" className="mt-4 space-y-4">
        {toolsTabContent}
      </TabsContent>
      
      <TabsContent value="custom" className="mt-4 space-y-4">
        {customTabContent}
      </TabsContent>
    </Tabs>
  );
};
