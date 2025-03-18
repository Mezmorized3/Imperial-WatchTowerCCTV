
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

// Mock data for demonstration
const mockCameras: CameraResult[] = [
  {
    id: '1',
    ip: '203.0.113.1',
    port: 8080,
    brand: 'Hikvision',
    model: 'DS-2CD2032',
    firmware: '5.4.5',
    status: 'vulnerable',
    vulnerabilities: ['Default credentials', 'CVE-2021-36260'],
    services: ['rtsp', 'http'],
    location: {
      country: 'United States',
      city: 'New York',
      latitude: 40.7128,
      longitude: -74.0060
    },
    lastSeen: new Date().toISOString(),
    firstSeen: new Date().toISOString()
  },
  {
    id: '2',
    ip: '198.51.100.2',
    port: 554,
    brand: 'Dahua',
    model: 'IPC-HDW4631C-A',
    firmware: '2.800.0000000.40',
    status: 'online',
    services: ['rtsp'],
    location: {
      country: 'Germany',
      city: 'Berlin',
      latitude: 52.5200,
      longitude: 13.4050
    },
    lastSeen: new Date().toISOString(),
    firstSeen: new Date().toISOString()
  },
  {
    id: '3',
    ip: '192.0.2.3',
    port: 80,
    brand: 'Axis',
    model: 'P1448-LE',
    firmware: '10.4.0',
    status: 'authenticated',
    services: ['http', 'https', 'rtsp'],
    location: {
      country: 'Japan',
      city: 'Tokyo',
      latitude: 35.6762,
      longitude: 139.6503
    },
    lastSeen: new Date().toISOString(),
    firstSeen: new Date().toISOString()
  }
];

const Viewer = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('globe');
  const [cameras, setCameras] = useState<CameraResult[]>(mockCameras);

  // Set the globe tab as active when component mounts
  useEffect(() => {
    setActiveTab('globe');
  }, []);

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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              <GlobeView 
                cameras={cameras}
                scanInProgress={false}
              />
            </TabsContent>
            
            <TabsContent value="map">
              <CameraMap 
                cameras={cameras} 
                onSelectCamera={(camera) => {
                  console.log('Selected camera:', camera);
                }} 
              />
            </TabsContent>
            
            <TabsContent value="table">
              <ResultsTable results={cameras} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Viewer;
