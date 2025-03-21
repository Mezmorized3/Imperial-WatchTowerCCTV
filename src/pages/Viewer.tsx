
import React, { useState, useEffect } from 'react';
import ViewerHeader from '@/components/viewer/ViewerHeader';
import ViewerTabs from '@/components/viewer/ViewerTabs';
import { mockCameras } from '@/data/mockCameras';
import { useIsMobile } from '@/hooks/use-mobile';

const Viewer = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [cameras, setCameras] = useState(mockCameras);

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
        <div className="mb-6">
          <ViewerTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            cameras={cameras} 
          />
        </div>
      </main>
    </div>
  );
};

export default Viewer;
