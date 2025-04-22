
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdvancedNetworkTools from '../network/AdvancedNetworkTools';
import { Globe, Search, Server } from 'lucide-react';

const NetworkReconTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('onvif');
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Globe className="mr-2 text-blue-500" />
          Network Reconnaissance Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="onvif">
              <Search className="h-4 w-4 mr-2" />
              ONVIF Tools
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Server className="h-4 w-4 mr-2" />
              Advanced Tools
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="onvif" className="mt-4">
            <div className="text-center p-8">
              <Search className="h-10 w-10 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold mb-2">ONVIF Discovery</h3>
              <p className="text-gray-500 mb-4">
                Scan your network for ONVIF-compatible devices and cameras.
              </p>
              <p className="text-xs text-gray-400">
                This tab is in development. Advanced network tools are available in the next tab.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-4">
            <AdvancedNetworkTools />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NetworkReconTools;
