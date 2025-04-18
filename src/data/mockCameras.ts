
import { CameraResult } from '@/types/scanner';

export const mockCameras: CameraResult[] = [
  {
    id: 'cam1',
    ip: '192.168.1.100',
    port: 554,
    brand: 'Hikvision',
    model: 'DS-2CD2032',
    status: 'online',
    vulnerabilities: [
      { id: 'vuln1', name: 'Default Password', severity: 'critical', cvssScore: 9.8 },
      { id: 'vuln2', name: 'Outdated Firmware', severity: 'medium', cvssScore: 6.5 }
    ],
    credentials: { username: 'admin', password: '12345' },
    location: { country: 'United States', city: 'New York', coords: { lat: 40.7128, lng: -74.0060 } }
  },
  {
    id: 'cam2',
    ip: '192.168.1.101',
    port: 554,
    brand: 'Dahua',
    model: 'IPC-HDW4631C-A',
    status: 'online',
    vulnerabilities: [
      { id: 'vuln3', name: 'Unencrypted Stream', severity: 'high', cvssScore: 7.2 }
    ],
    location: { country: 'Germany', city: 'Berlin', coords: { lat: 52.5200, lng: 13.4050 } }
  },
  {
    id: 'cam3',
    ip: '192.168.1.102',
    port: 554,
    brand: 'Axis',
    model: 'P3245-LVE',
    status: 'vulnerable',
    vulnerabilities: [
      { id: 'vuln4', name: 'Outdated SDK', severity: 'medium', cvssScore: 5.9 },
      { id: 'vuln5', name: 'ONVIF Security Issues', severity: 'medium', cvssScore: 5.2 }
    ],
    location: { country: 'Japan', city: 'Tokyo', coords: { lat: 35.6762, lng: 139.6503 } }
  }
];
