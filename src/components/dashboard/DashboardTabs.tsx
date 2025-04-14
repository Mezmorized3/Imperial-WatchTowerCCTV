
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

  // Helper function to get camera location
  const getCameraLocation = (camera: CameraResult) => {
    if (!camera.location) return null;
    
    // Handle location as object
    if (typeof camera.location === 'object') {
      return camera.location;
    }
    
    // If we reach here, we don't have valid location data
    return null;
  };

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
            const location = getCameraLocation(camera);
            toast({
              title: `Camera ${camera.ip}`,
              description: `${camera.brand || 'Unknown'} camera in ${location?.country || 'Unknown location'}`,
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
