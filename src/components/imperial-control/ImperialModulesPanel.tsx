
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Bot, Server, Eye } from 'lucide-react';
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
            <Eye className="mr-2 h-4 w-4" />
            Imperial Shinobi
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="shield">
          <ImperialShieldMatrix />
        </TabsContent>
        
        <TabsContent value="shinobi">
          <div className="p-4 bg-scanner-dark rounded-md border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Eye className="mr-2 text-red-500" /> Imperial Shinobi
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Access the dedicated Imperial Shinobi page for advanced CCTV monitoring and exploitation tools.
            </p>
            <Button asChild className="w-full bg-scanner-primary hover:bg-scanner-primary/80">
              <Link to="/imperial-shinobi">
                <Eye className="mr-2 h-4 w-4" />
                Launch Imperial Shinobi
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ImperialModulesPanel;
