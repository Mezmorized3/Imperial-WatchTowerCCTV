
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ViewerHeader from '@/components/viewer/ViewerHeader';
import ViewerTabs from '@/components/viewer/ViewerTabs';
import CameraSearchTools from '@/components/surveillance/CameraSearchTools';
import QuickStreamPlayer from '@/components/QuickStreamPlayer';
import { mockCameras } from '@/data/mockCameras';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Search, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const Viewer = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [cameras, setCameras] = useState(mockCameras);
  const [toolsMode, setToolsMode] = useState<string>('viewer');
  const [optimizedStreaming, setOptimizedStreaming] = useState<boolean>(true);
  const { toast } = useToast();

  // Parse URL params to determine if we should show quick play mode
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'quick') {
      setToolsMode('quick');
    }
  }, [location]);

  // Check if Imperial Server streaming is configured
  useEffect(() => {
    const rtspProxyEnabled = localStorage.getItem('rtspProxyEnabled') !== 'false';
    const rtspProxyUrl = localStorage.getItem('rtspProxyUrl');
    
    // If not configured, show a notice
    if (!rtspProxyUrl && toolsMode === 'viewer') {
      toast({
        title: "Streaming Not Configured",
        description: "Configure Imperial Server streaming in Settings for optimal performance.",
        duration: 6000,
      });
    }
    
    setOptimizedStreaming(!!rtspProxyUrl && rtspProxyEnabled);
  }, [toolsMode]);

  // Debug logs for monitoring component lifecycle
  useEffect(() => {
    console.log("Viewer component mounted");
  }, []);

  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
  }, [activeTab]);
  
  const handleOptimizedStreamingToggle = (checked: boolean) => {
    setOptimizedStreaming(checked);
    localStorage.setItem('rtspProxyEnabled', checked.toString());
    
    toast({
      title: checked ? "Optimized Streaming Enabled" : "Optimized Streaming Disabled",
      description: checked 
        ? "Using Imperial Server for better performance" 
        : "Using fallback streaming method",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <ViewerHeader />
      
      <main className="container mx-auto py-6 px-4">
        <Tabs value={toolsMode} onValueChange={setToolsMode} className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <TabsList>
              <TabsTrigger value="viewer" className="flex items-center">
                <Camera className="mr-2 h-4 w-4" /> Camera Viewer
              </TabsTrigger>
              <TabsTrigger value="quick" className="flex items-center">
                <Camera className="mr-2 h-4 w-4" /> Quick Stream
              </TabsTrigger>
              <TabsTrigger value="search" className="flex items-center">
                <Search className="mr-2 h-4 w-4" /> Search Tools
              </TabsTrigger>
            </TabsList>
            
            {toolsMode === 'viewer' && (
              <Card className="bg-scanner-card border-gray-700 w-full sm:w-auto">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex flex-col">
                      <Label htmlFor="optimized-streaming" className="text-sm">Optimized Streaming</Label>
                      <p className="text-xs text-gray-400">Uses Imperial Server for better performance</p>
                    </div>
                    <Switch 
                      id="optimized-streaming" 
                      checked={optimizedStreaming}
                      onCheckedChange={handleOptimizedStreamingToggle}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <TabsContent value="viewer">
            <ViewerTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              cameras={cameras} 
            />
          </TabsContent>
          
          <TabsContent value="quick">
            <div className="flex justify-center">
              <Card className="border-gray-700 bg-scanner-dark-alt w-full max-w-2xl">
                <CardContent className="p-6">
                  <QuickStreamPlayer />
                </CardContent>
              </Card>
            </div>
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
