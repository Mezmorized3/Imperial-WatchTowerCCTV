
import React, { useState, useEffect } from 'react';
import ViewerHeader from '@/components/viewer/ViewerHeader';
import ViewerTabs from '@/components/viewer/ViewerTabs';
import CameraSearchTools from '@/components/surveillance/CameraSearchTools';
import { mockCameras } from '@/data/mockCameras';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Search } from 'lucide-react';

const Viewer = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [cameras, setCameras] = useState(mockCameras);
  const [toolsMode, setToolsMode] = useState<string>('viewer');

  // Debug logs for monitoring component lifecycle
  useEffect(() => {
    console.log("Viewer component mounted");
  }, []);

  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <ViewerHeader />
      
      <main className="container mx-auto py-6 px-4">
        <Tabs value={toolsMode} onValueChange={setToolsMode} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="viewer" className="flex items-center">
              <Camera className="mr-2 h-4 w-4" /> Camera Viewer
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center">
              <Search className="mr-2 h-4 w-4" /> Search Tools
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="viewer">
            <ViewerTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              cameras={cameras} 
            />
          </TabsContent>
          
          <TabsContent value="search">
            <CameraSearchTools />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Viewer;
