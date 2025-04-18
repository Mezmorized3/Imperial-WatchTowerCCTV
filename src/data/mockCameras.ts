
import { CameraResult } from '@/types/scanner';

export const mockCameras: CameraResult[] = [
  {
    id: 'cam1',
    ip: '192.168.1.100',
    port: 554,
    brand: 'Hikvision',
    model: 'DS-2CD2032',
    status: 'online',
    accessLevel: 'admin', // Added required accessLevel property
    vulnerabilities: [
      { id: 'vuln1', name: 'Default Password', severity: 'critical', description: 'Default credentials detected' },
      { id: 'vuln2', name: 'Outdated Firmware', severity: 'medium', description: 'Running outdated firmware version' }
    ],
    credentials: { username: 'admin', password: '12345' },
    location: { 
      country: 'United States', 
      city: 'New York', 
      latitude: 40.7128, 
      longitude: -74.0060 
    }
  },
  {
    id: 'cam2',
    ip: '192.168.1.101',
    port: 554,
    brand: 'Dahua',
    model: 'IPC-HDW4631C-A',
    status: 'online',
    accessLevel: 'view', // Added required accessLevel property
    vulnerabilities: [
      { id: 'vuln3', name: 'Unencrypted Stream', severity: 'high', description: 'Transmitting data without encryption' }
    ],
    location: { 
      country: 'Germany', 
      city: 'Berlin', 
      latitude: 52.5200, 
      longitude: 13.4050 
    }
  },
  {
    id: 'cam3',
    ip: '192.168.1.102',
    port: 554,
    brand: 'Axis',
    model: 'P3245-LVE',
    status: 'vulnerable',
    accessLevel: 'limited', // Added required accessLevel property
    vulnerabilities: [
      { id: 'vuln4', name: 'Outdated SDK', severity: 'medium', description: 'Using vulnerable SDK version' },
      { id: 'vuln5', name: 'ONVIF Security Issues', severity: 'medium', description: 'ONVIF implementation has security flaws' }
    ],
    location: { 
      country: 'Japan', 
      city: 'Tokyo', 
      latitude: 35.6762, 
      longitude: 139.6503 
    }
  }
];
