
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Camera, Map, BarChart } from 'lucide-react';
import ViewerOverview from './ViewerOverview';
import CameraMap from '@/components/CameraMap';
import ResultsTable from '@/components/ResultsTable';
import { CameraResult } from '@/types/scanner';

type ViewerTabsProps = {
  activeTab: string;
  setActiveTab: (value: string) => void;
  cameras: CameraResult[];
};

const ViewerTabs: React.FC<ViewerTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  cameras 
}) => {
  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="bg-scanner-dark-alt w-full justify-start">
        <TabsTrigger value="overview" className="data-[state=active]:bg-scanner-info/20">
          <Camera className="h-4 w-4 mr-2" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="map" className="data-[state=active]:bg-scanner-info/20">
          <Map className="h-4 w-4 mr-2" />
          Location Map
        </TabsTrigger>
        <TabsTrigger value="table" className="data-[state=active]:bg-scanner-info/20">
          <BarChart className="h-4 w-4 mr-2" />
          Results Table
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <ViewerOverview cameras={cameras} />
      </TabsContent>
      
      <TabsContent value="map">
        {activeTab === 'map' && (
          <CameraMap 
            cameras={cameras} 
            onSelectCamera={(camera) => {
              console.log('Selected camera:', camera);
            }} 
          />
        )}
      </TabsContent>
      
      <TabsContent value="table">
        {activeTab === 'table' && (
          <ResultsTable results={cameras} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ViewerTabs;
