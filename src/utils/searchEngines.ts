
import { CameraResult, CameraStatus } from '@/types/scanner';
import { getComprehensiveThreatIntel, analyzeFirmware } from './threatIntelligence';

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
    const brand = ['Hikvision', 'Dahua', 'Axis', 'Bosch', 'Samsung'][Math.floor(Math.random() * 5)];
    const model = `Model-${Math.floor(Math.random() * 1000)}`;
    const firmwareVersion = `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`;
    const status = ['online', 'vulnerable', 'authenticated', 'offline'][Math.floor(Math.random() * 4)] as CameraStatus;
    
    // Get threat intelligence for this IP
    const threatIntel = Math.random() > 0.7 ? await getComprehensiveThreatIntel(randomIP) : null;
    
    // Get firmware analysis if applicable
    const firmwareAnalysis = Math.random() > 0.7 ? await analyzeFirmware(brand, model, firmwareVersion) : null;
    
    results.push({
      id: `zoomeye-${randomIP}-${i}`,
      ip: randomIP,
      port: randomPort,
      brand,
      model,
      firmwareVersion,
      firmwareAnalysis,
      status,
      location: {
        country: ['United States', 'Germany', 'Japan', 'Brazil', 'Australia'][Math.floor(Math.random() * 5)],
        city: ['New York', 'Berlin', 'Tokyo', 'Rio', 'Sydney'][Math.floor(Math.random() * 5)],
        latitude: (Math.random() * 180) - 90,
        longitude: (Math.random() * 360) - 180
      },
      lastSeen: new Date().toISOString(),
      accessLevel: ['none', 'view', 'control', 'admin'][Math.floor(Math.random() * 4)] as 'none' | 'view' | 'control' | 'admin',
      responseTime: Math.floor(Math.random() * 1000),
      threatIntel
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
    const brand = ['Amcrest', 'Reolink', 'Foscam', 'Ubiquiti', 'Vivotek'][Math.floor(Math.random() * 5)];
    const model = `Model-${Math.floor(Math.random() * 1000)}`;
    const firmwareVersion = `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`;
    
    const hasVulnerabilities = Math.random() > 0.5;
    const vulnerabilities = hasVulnerabilities ? [
      {
        name: ['Default Password', 'Open Telnet', 'Outdated Firmware', 'XSS Vulnerability'][Math.floor(Math.random() * 4)],
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical',
        description: 'Security vulnerability detected in camera firmware.'
      }
    ] : undefined;
    
    // Get threat intelligence for this IP
    const threatIntel = Math.random() > 0.7 ? await getComprehensiveThreatIntel(randomIP) : null;
    
    // Get firmware analysis if applicable
    const firmwareAnalysis = Math.random() > 0.7 ? await analyzeFirmware(brand, model, firmwareVersion) : null;
    
    results.push({
      id: `censys-${randomIP}-${i}`,
      ip: randomIP,
      port: randomPort,
      brand,
      model,
      firmwareVersion,
      firmwareAnalysis,
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
      responseTime: Math.floor(Math.random() * 1000),
      threatIntel
    });
  }
  
  return results;
};

/**
 * Function to search for CCTV cameras using ThreatFox API
 * This is a mock implementation for demonstration purposes
 */
export const searchThreatFox = async (query: string): Promise<CameraResult[]> => {
  console.log(`Searching ThreatFox for: ${query}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Generate mock results
  const results: CameraResult[] = [];
  const resultCount = Math.floor(Math.random() * 5) + 1; // ThreatFox likely returns fewer results
  
  for (let i = 0; i < resultCount; i++) {
    const randomIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const randomPort = [80, 8080, 554, 8554, 443][Math.floor(Math.random() * 5)];
    const brand = ['Hikvision', 'Dahua', 'Axis', 'Uniview', 'TVT'][Math.floor(Math.random() * 5)];
    const model = `Model-${Math.floor(Math.random() * 1000)}`;
    const firmwareVersion = `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`;
    
    // For ThreatFox results, all cameras likely have some threat intelligence
    const threatIntel = {
      ipReputation: Math.floor(Math.random() * 30), // Low score (more malicious)
      lastReportedMalicious: new Date(Date.now() - Math.random() * 7776000000).toISOString(), // Last 90 days
      associatedMalware: ['Mirai', 'IoT_Reaper', 'Gafgyt'].slice(0, Math.floor(Math.random() * 3) + 1),
      reportedBy: ['ThreatFox', 'Security Researcher', 'Abuse Report'].slice(0, Math.floor(Math.random() * 3) + 1),
      firstSeen: new Date(Date.now() - Math.random() * 31536000000).toISOString(), // Last year
      tags: ['botnet', 'command_control', 'malware_host'].slice(0, Math.floor(Math.random() * 3) + 1),
      confidenceScore: Math.floor(Math.random() * 20) + 80, // High confidence
      source: 'threatfox' as const
    };
    
    // Get firmware analysis
    const firmwareAnalysis = await analyzeFirmware(brand, model, firmwareVersion);
    
    results.push({
      id: `threatfox-${randomIP}-${i}`,
      ip: randomIP,
      port: randomPort,
      brand,
      model,
      firmwareVersion,
      firmwareAnalysis,
      status: 'vulnerable' as CameraStatus, // ThreatFox results are likely vulnerable
      vulnerabilities: [
        {
          name: 'Botnet C&C Communication',
          severity: 'critical' as 'critical',
          description: 'Device is communicating with known botnet command and control servers.'
        },
        {
          name: 'Malware Infection',
          severity: 'critical' as 'critical',
          description: 'Device appears to be infected with IoT malware.'
        }
      ],
      location: {
        country: ['Russia', 'China', 'North Korea', 'Iran', 'Brazil'][Math.floor(Math.random() * 5)],
        city: ['Moscow', 'Beijing', 'Pyongyang', 'Tehran', 'São Paulo'][Math.floor(Math.random() * 5)],
        latitude: (Math.random() * 180) - 90,
        longitude: (Math.random() * 360) - 180
      },
      lastSeen: new Date().toISOString(),
      accessLevel: 'admin' as 'admin', // Compromised devices likely have admin access
      responseTime: Math.floor(Math.random() * 1000),
      threatIntel
    });
  }
  
  return results;
};
