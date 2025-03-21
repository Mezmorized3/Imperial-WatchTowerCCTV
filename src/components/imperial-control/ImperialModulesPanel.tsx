
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Shield, Bot, Server } from 'lucide-react';
import ImperialShinobi from './ImperialShinobi';
import ImperialShieldMatrix from './ImperialShieldMatrix';

const ImperialModulesPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('shield');

  return (
    <Card className="p-4 border-none bg-transparent">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="shield" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Imperial Shield
          </TabsTrigger>
          <TabsTrigger value="shinobi" className="flex items-center">
            <Bot className="mr-2 h-4 w-4" />
            Imperial Shinobi
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="shield">
          <ImperialShieldMatrix />
        </TabsContent>
        
        <TabsContent value="shinobi">
          <ImperialShinobi />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ImperialModulesPanel;
