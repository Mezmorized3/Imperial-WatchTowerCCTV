
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, ArrowLeft, Map, BarChart, Camera } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [cameras, setCameras] = useState<CameraResult[]>(mockCameras);

  // Debug logs for monitoring component lifecycle
  useEffect(() => {
    console.log("Viewer component mounted");
  }, []);

  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
  }, [activeTab]);

  // Group cameras by country
  const camerasByCountry = cameras.reduce((acc, camera) => {
    const country = camera.location?.country || 'Unknown';
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(camera);
    return acc;
  }, {} as Record<string, CameraResult[]>);

  // Summary stats
  const totalCameras = cameras.length;
  const vulnerableCameras = cameras.filter(c => c.status === 'vulnerable').length;
  const countriesCount = Object.keys(camerasByCountry).length;

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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/globe')}
            className="bg-scanner-dark-alt border-scanner-primary text-scanner-primary hover:bg-scanner-primary/20"
          >
            <Globe className="h-4 w-4 mr-2" />
            View 3D Globe
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-scanner-dark-alt w-full justify-start">
              <TabsTrigger value="overview" className="data-[state=active]:bg-scanner-info/20">
                <Globe className="h-4 w-4 mr-2" />
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
            
            <TabsContent value="overview" className="pt-4">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-scanner-card border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Camera className="w-5 h-5 text-scanner-primary" />
                      <span>Cameras Found</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-white">{totalCameras}</div>
                    <p className="text-gray-400 mt-2">Total number of cameras discovered</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-scanner-card border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-scanner-primary" />
                      <span>Countries</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-white">{countriesCount}</div>
                    <p className="text-gray-400 mt-2">Spanning across {countriesCount} countries</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-scanner-card border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center space-x-2">
                      <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white">!</span>
                      <span>Vulnerable</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-white">{vulnerableCameras}</div>
                    <p className="text-gray-400 mt-2">Cameras with security issues</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <Card className="bg-scanner-card border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Cameras by Country</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {Object.entries(camerasByCountry).map(([country, camerasInCountry]) => (
                        <li key={country} className="flex items-center justify-between p-3 bg-scanner-dark-alt rounded-md">
                          <div className="flex items-center">
                            <span className="mr-2 text-lg">{country === 'United States' ? '🇺🇸' : country === 'Germany' ? '🇩🇪' : country === 'Japan' ? '🇯🇵' : '🌍'}</span>
                            <span>{country}</span>
                          </div>
                          <Badge className="bg-scanner-primary">{camerasInCountry.length}</Badge>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
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
