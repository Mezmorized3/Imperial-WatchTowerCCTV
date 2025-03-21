
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import GlobeComponent from '@/components/GlobeView';
import { CameraResult } from '@/types/scanner';

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

const GlobePage = () => {
  const navigate = useNavigate();
  const [cameras] = useState<CameraResult[]>(mockCameras);

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
            <h1 className="text-xl font-bold">3D Globe Visualization</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="h-[700px] w-full bg-scanner-dark-alt rounded-lg overflow-hidden">
          <GlobeComponent 
            cameras={cameras} 
            scanInProgress={false}
          />
        </div>
      </main>
    </div>
  );
};

export default GlobePage;
