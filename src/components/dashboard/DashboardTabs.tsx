
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Map, BarChart } from 'lucide-react';
import CameraMap from '@/components/CameraMap';
import ResultsTable from '@/components/ResultsTable';
import { CameraResult, ScanProgress } from '@/types/scanner';
import { useToast } from '@/components/ui/use-toast';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  results: CameraResult[];
  scanProgress: ScanProgress;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  setActiveTab,
  results,
  scanProgress
}) => {
  const { toast } = useToast();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="bg-scanner-dark-alt w-full justify-start">
        <TabsTrigger value="map" className="data-[state=active]:bg-scanner-info/20">
          <Map className="h-4 w-4 mr-2" />
          Location Map
        </TabsTrigger>
        <TabsTrigger value="table" className="data-[state=active]:bg-scanner-info/20">
          <BarChart className="h-4 w-4 mr-2" />
          Results Table
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="map">
        <CameraMap 
          cameras={results} 
          onSelectCamera={(camera) => {
            console.log('Selected camera:', camera);
            toast({
              title: `Camera ${camera.ip}`,
              description: `${camera.brand || 'Unknown'} camera in ${camera.location?.country || 'Unknown location'}`,
              duration: 3000,
            });
          }} 
        />
      </TabsContent>
      
      <TabsContent value="table">
        <ResultsTable results={results} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
