
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, ArrowLeft, Map, BarChart } from 'lucide-react';
import GlobeView from '@/components/GlobeView';
import CameraMap from '@/components/CameraMap';
import ResultsTable from '@/components/ResultsTable';
import { CameraResult } from '@/types/scanner';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock data for demonstration
const mockCameras: CameraResult[] = [
  {
    id: '1',
    ip: '203.0.113.1',
    port: 8080,
    brand: 'Hikvision',
    model: 'DS-2CD2032',
    firmwareVersion: '5.4.5',
    status: 'vulnerable',
    vulnerabilities: [
      {
        name: 'Default credentials',
        severity: 'high',
        description: 'Camera using default manufacturer credentials'
      },
      {
        name: 'CVE-2021-36260',
        severity: 'critical',
        description: 'Remote command execution vulnerability in Hikvision devices'
      }
    ],
    services: ['rtsp', 'http'],
    location: {
      country: 'United States',
      city: 'New York',
      latitude: 40.7128,
      longitude: -74.0060
    },
    lastSeen: new Date().toISOString(),
    firstSeen: new Date().toISOString(),
    accessLevel: 'admin'
  },
  {
    id: '2',
    ip: '198.51.100.2',
    port: 554,
    brand: 'Dahua',
    model: 'IPC-HDW4631C-A',
    firmwareVersion: '2.800.0000000.40',
    status: 'online',
    services: ['rtsp'],
    location: {
      country: 'Germany',
      city: 'Berlin',
      latitude: 52.5200,
      longitude: 13.4050
    },
    lastSeen: new Date().toISOString(),
    firstSeen: new Date().toISOString(),
    accessLevel: 'view'
  },
  {
    id: '3',
    ip: '192.0.2.3',
    port: 80,
    brand: 'Axis',
    model: 'P1448-LE',
    firmwareVersion: '10.4.0',
    status: 'authenticated',
    services: ['http', 'https', 'rtsp'],
    location: {
      country: 'Japan',
      city: 'Tokyo',
      latitude: 35.6762,
      longitude: 139.6503
    },
    lastSeen: new Date().toISOString(),
    firstSeen: new Date().toISOString(),
    accessLevel: 'control'
  }
];

const Viewer = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>('globe');
  const [cameras, setCameras] = useState<CameraResult[]>(mockCameras);
  const [isGlobeReady, setIsGlobeReady] = useState(false);

  // Initialize globe tab
  useEffect(() => {
    console.log("Viewer component mounted");
    // Force a re-render to make sure the globe is initialized
    setTimeout(() => {
      setIsGlobeReady(true);
      console.log("Setting globe ready state to true");
    }, 100);
  }, []);

  // Debug log when tab changes
  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <header className="bg-scanner-dark-alt border-b border-gray-800 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> 
              Back to Scanner
            </Button>
            <h1 className="text-xl font-bold">Camera Viewer</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          {/* Ensure the globe tab is selected by default */}
          <Tabs defaultValue="globe" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-scanner-dark-alt w-full justify-start">
              <TabsTrigger value="globe" className="data-[state=active]:bg-scanner-info/20">
                <Globe className="h-4 w-4 mr-2" />
                Interactive Globe
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
            
            <TabsContent value="globe" className="pt-4">
              {/* Always render the GlobeView when on globe tab, regardless of conditional checks */}
              <div style={{ height: '500px', width: '100%', position: 'relative' }}>
                <GlobeView 
                  cameras={cameras}
                  scanInProgress={false}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="map" className="pt-4">
              {activeTab === 'map' && (
                <CameraMap 
                  cameras={cameras} 
                  onSelectCamera={(camera) => {
                    console.log('Selected camera:', camera);
                  }} 
                />
              )}
            </TabsContent>
            
            <TabsContent value="table" className="pt-4">
              {activeTab === 'table' && (
                <ResultsTable results={cameras} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Viewer;
