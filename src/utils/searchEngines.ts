
import { CameraResult } from '@/types/scanner';

// Mock function for ZoomEye API
export const searchZoomEye = async (query: string): Promise<CameraResult[]> => {
  console.log(`Searching ZoomEye for: ${query}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock results
  const results: CameraResult[] = [];
  const resultCount = Math.floor(Math.random() * 10) + 2;
  
  for (let i = 0; i < resultCount; i++) {
    const randomIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const randomPort = [80, 8080, 554, 8554, 443][Math.floor(Math.random() * 5)];
    
    results.push({
      id: `zoomeye-${randomIP}-${i}`,
      ip: randomIP,
      port: randomPort,
      brand: ['Hikvision', 'Dahua', 'Axis', 'Bosch', 'Samsung'][Math.floor(Math.random() * 5)],
      model: `Model-${Math.floor(Math.random() * 1000)}`,
      status: ['online', 'vulnerable', 'authenticated', 'offline'][Math.floor(Math.random() * 4)] as CameraStatus,
      location: {
        country: ['United States', 'Germany', 'Japan', 'Brazil', 'Australia'][Math.floor(Math.random() * 5)],
        city: ['New York', 'Berlin', 'Tokyo', 'Rio', 'Sydney'][Math.floor(Math.random() * 5)],
        latitude: (Math.random() * 180) - 90,
        longitude: (Math.random() * 360) - 180
      },
      lastSeen: new Date().toISOString(),
      accessLevel: ['none', 'view', 'control', 'admin'][Math.floor(Math.random() * 4)] as 'none' | 'view' | 'control' | 'admin',
      responseTime: Math.floor(Math.random() * 1000)
    });
  }
  
  return results;
};

// Mock function for Censys API
export const searchCensys = async (query: string): Promise<CameraResult[]> => {
  console.log(`Searching Censys for: ${query}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1800));
  
  // Generate mock results
  const results: CameraResult[] = [];
  const resultCount = Math.floor(Math.random() * 8) + 3;
  
  for (let i = 0; i < resultCount; i++) {
    const randomIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const randomPort = [80, 8080, 554, 8554, 443][Math.floor(Math.random() * 5)];
    
    const hasVulnerabilities = Math.random() > 0.5;
    const vulnerabilities = hasVulnerabilities ? [
      {
        name: ['Default Password', 'Open Telnet', 'Outdated Firmware', 'XSS Vulnerability'][Math.floor(Math.random() * 4)],
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical',
        description: 'Security vulnerability detected in camera firmware.'
      }
    ] : undefined;
    
    results.push({
      id: `censys-${randomIP}-${i}`,
      ip: randomIP,
      port: randomPort,
      brand: ['Amcrest', 'Reolink', 'Foscam', 'Ubiquiti', 'Vivotek'][Math.floor(Math.random() * 5)],
      model: `Model-${Math.floor(Math.random() * 1000)}`,
      status: hasVulnerabilities ? 'vulnerable' : ['online', 'authenticated', 'offline'][Math.floor(Math.random() * 3)] as CameraStatus,
      vulnerabilities,
      location: {
        country: ['Canada', 'France', 'India', 'Russia', 'South Korea'][Math.floor(Math.random() * 5)],
        city: ['Toronto', 'Paris', 'Delhi', 'Moscow', 'Seoul'][Math.floor(Math.random() * 5)],
        latitude: (Math.random() * 180) - 90,
        longitude: (Math.random() * 360) - 180
      },
      lastSeen: new Date().toISOString(),
      accessLevel: ['none', 'view', 'control', 'admin'][Math.floor(Math.random() * 4)] as 'none' | 'view' | 'control' | 'admin',
      responseTime: Math.floor(Math.random() * 1000)
    });
  }
  
  return results;
};
