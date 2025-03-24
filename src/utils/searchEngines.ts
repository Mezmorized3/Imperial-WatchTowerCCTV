import { CameraResult as ScannerCameraResult, CameraStatus } from '@/types/scanner';
import { getComprehensiveThreatIntel, analyzeFirmware } from './threatIntelligence';
import { simulateNetworkDelay } from './networkUtils';
import { ThreatIntelData } from './types/threatIntelTypes';
import { getIpPrefixByCountry, getCountryName, getCountryCities, getCountryCoordinates } from './countryUtils';

/**
 * Generate a search query for Shodan
 */
export const generateShodanQuery = (params: { 
  country?: string, 
  port?: number | string,
  product?: string,
  os?: string
}): string => {
  const parts = [];
  
  if (params.country) parts.push(`country:${params.country}`);
  if (params.port) parts.push(`port:${params.port}`);
  if (params.product) parts.push(`product:${params.product}`);
  if (params.os) parts.push(`os:${params.os}`);
  
  // Default to webcams if no specific query
  if (parts.length === 0) parts.push('webcams');
  
  return parts.join(' ');
};

/**
 * Search Shodan for cameras - this is a simulation that will be 
 * replaced with actual Shodan API integration
 */
export const searchShodan = async (query: string, limit = 10): Promise<ScannerCameraResult[]> => {
  console.log(`[Shodan Search] Query: ${query}, Limit: ${limit}`);
  
  // Simulate network delay
  await simulateNetworkDelay(2000);
  
  // Parse country codes from query
  let countryCode = 'US';
  const countryMatch = query.match(/country:([a-zA-Z]{2})/i);
  if (countryMatch && countryMatch[1]) {
    countryCode = countryMatch[1].toUpperCase();
  }
  
  // Generate simulated results
  const results: ScannerCameraResult[] = [];
  const count = Math.min(limit, 25);
  
  // Mapping of product name patterns based on query
  const productRegex = /product:"?([^"]+)"?/i;
  const productMatch = query.match(productRegex);
  let productName = productMatch ? productMatch[1] : '';
  
  if (!productName) {
    if (query.includes('hikvision')) productName = 'Hikvision';
    else if (query.includes('dahua')) productName = 'Dahua';
    else if (query.includes('axis')) productName = 'Axis';
    else if (query.includes('vivotek')) productName = 'Vivotek';
    else if (query.includes('webcam')) productName = 'Generic Webcam';
    else if (query.includes('rtsp')) productName = 'RTSP Camera';
    else if (query.includes('web server')) productName = 'IP Camera';
    else productName = 'Surveillance Camera';
  }
  
  // Parse port from query
  let port = 80;
  const portMatch = query.match(/port:(\d+)/i);
  if (portMatch && portMatch[1]) {
    port = parseInt(portMatch[1]);
  }
  
  // Get IP prefixes for this country
  const ipPrefixes = getIpPrefixByCountry(countryCode);
  if (!ipPrefixes || ipPrefixes.length === 0) {
    // Fallback to a generic prefix if country not found
    const ipPrefix = Math.floor(Math.random() * 223) + 1;
    
    for (let i = 0; i < count; i++) {
      // Random IP within the range
      const ip = `${ipPrefix}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      generateCameraResult(results, ip, port, productName, countryCode);
    }
  } else {
    // Generate IPs based on the country's prefixes
    for (let i = 0; i < count; i++) {
      const prefixIndex = Math.floor(Math.random() * ipPrefixes.length);
      const randomPrefix = ipPrefixes[prefixIndex];
      let ip = '';
      
      if (randomPrefix.includes('/')) {
        // Handle CIDR notation
        const [baseIp, cidrPart] = randomPrefix.split('/');
        const ipParts = baseIp.split('.');
        // Generate a random IP within the CIDR range (simplified)
        ip = `${ipParts[0]}.${ipParts[1]}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      } else {
        ip = randomPrefix;
      }
      
      generateCameraResult(results, ip, port, productName, countryCode);
    }
  }
  
  return results;
};

/**
 * Helper function to generate a camera result
 */
function generateCameraResult(results: ScannerCameraResult[], ip: string, port: number, productName: string, countryCode: string) {
  // Generate a vulns array for some results
  const vulns = Math.random() > 0.7 ? [
    { 
      id: `vuln-${Math.random().toString(36).substring(2, 7)}`,
      name: `${productName} Default Credentials`, 
      severity: (Math.random() > 0.5 ? 'high' : 'critical') as 'high' | 'critical', 
      description: 'Device uses factory default credentials' 
    }
  ] : [];
  
  // Generate location data
  const country = getCountryName(countryCode);
  const cities = getCountryCities(countryCode);
  const city = cities && cities.length > 0 ? cities[Math.floor(Math.random() * cities.length)] : 'Unknown';
  
  // Geo coordinates with some randomization
  const coords = getCountryCoordinates(countryCode);
  let latitude = 0;
  let longitude = 0;
  
  if (coords) {
    latitude = coords.latitude + (Math.random() * 5) - 2.5;
    longitude = coords.longitude + (Math.random() * 5) - 2.5;
  } else {
    latitude = (Math.random() * 180) - 90;
    longitude = (Math.random() * 360) - 180;
  }
  
  // Threat intelligence data
  const threatIntelData: ThreatIntelData = {
    ipReputation: Math.floor(Math.random() * 100),
    lastReportedMalicious: Math.random() > 0.7 ? new Date(Date.now() - Math.random() * 30 * 86400000).toISOString() : undefined,
    associatedMalware: Math.random() > 0.8 ? ['TrickBot', 'Mirai'] : [],
    reportedBy: Math.random() > 0.7 ? ['ThreatFox Community'] : undefined,
    firstSeen: new Date(Date.now() - Math.random() * 180 * 86400000).toISOString(),
    tags: Math.random() > 0.6 ? ['iot', 'camera'] : [],
    confidenceScore: Math.floor(Math.random() * 100),
    source: 'threatfox',
    lastUpdated: new Date().toISOString()
  };
  
  // Create the camera result
  results.push({
    id: `shodan-${Math.random().toString(36).substring(2)}`,
    ip,
    port,
    brand: productName.split(' ')[0],
    model: `${productName} P${1000 + Math.floor(Math.random() * 999)}`,
    url: `rtsp://${ip}:${port}/stream`,
    snapshotUrl: `http://${ip}:${port}/snapshot.jpg`,
    status: Math.random() > 0.3 ? 'online' : 'unknown',
    vulnerabilities: vulns,
    location: {
      country,
      city,
      latitude,
      longitude
    },
    credentials: Math.random() > 0.7 ? {
      username: 'admin',
      password: Math.random() > 0.5 ? 'admin' : '12345'
    } : null,
    lastSeen: new Date().toISOString(),
    accessLevel: Math.random() > 0.7 ? 'admin' : (Math.random() > 0.5 ? 'view' : 'none'),
    responseTime: Math.floor(Math.random() * 500),
    threatIntel: threatIntelData
  });
}

/**
 * Search ZoomEye for cameras
 */
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

/**
 * Search Censys for cameras
 */
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
