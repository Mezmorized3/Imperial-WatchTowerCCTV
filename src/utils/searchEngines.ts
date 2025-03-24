import { CameraResult } from '@/utils/types/cameraTypes';
import { CameraStatus, Vulnerability } from '@/utils/types/cameraTypes';
import { ThreatIntelData } from '@/utils/types/threatIntelTypes';
import { getComprehensiveThreatIntel, analyzeFirmware } from './threatIntelligence';
import { simulateNetworkDelay } from './networkUtils';
import { getIpPrefixByCountry, getCountryName, getCountryCities, getCountryCoordinates } from './countryUtils';
import { getRandomGeoLocation } from './osintUtils';
import { getCountryIpRanges, getRandomIpInRange } from './ipRangeUtils';
import { EASTERN_EUROPEAN_COUNTRIES } from './constants/countries';

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
export async function searchShodanCameras(
  query: string,
  limit: number = 10
): Promise<{ total: number, results: CameraResult[] }> {
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
  const results: CameraResult[] = [];
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
  
  return { total: count, results };
}

/**
 * Helper function to generate a camera result
 */
function generateCameraResult(results: CameraResult[], ip: string, port: number, productName: string, countryCode: string) {
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
export async function searchZoomEyeCameras(
  query: string,
  limit: number = 10
): Promise<{ total: number, results: CameraResult[] }> {
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
  
  return { total: resultCount, results };
};

/**
 * Search Censys for cameras
 */
export async function searchCensysCameras(
  query: string,
  limit: number = 10
): Promise<{ total: number, results: CameraResult[] }> {
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
  
  return { total: resultCount, results };
};

/**
 * Function to search for CCTV cameras using ThreatFox API
 * This is a mock implementation for demonstration purposes
 */
export async function searchThreatFoxCameras(
  query: string,
  limit: number = 10
): Promise<{ total: number, results: CameraResult[] }> {
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
      source: 'threatfox' as const,
      lastUpdated: new Date().toISOString()
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
          id: `VULN-${Math.floor(Math.random() * 1000)}`,
          name: 'Botnet C&C Communication',
          severity: 'critical' as 'critical',
          description: 'Device is communicating with known botnet command and control servers.'
        },
        {
          id: `VULN-${Math.floor(Math.random() * 1000)}`,
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
  
  return { total: resultCount, results };
}

/**
 * Search engines implementation for security camera discovery
 * This is a mock implementation with simulated data for demonstration purposes
 */

/**
 * Search cameras by country
 */
export const searchCamerasByCountry = async (
  country: string,
  limit: number = 10,
  includeVulnerable: boolean = false
): Promise<CameraResult[]> => {
  await simulateNetworkDelay(800, 2000);
  
  // Special handling for our target countries
  const isTargetCountry = EASTERN_EUROPEAN_COUNTRIES.includes(country.toLowerCase());
  
  // Get IP ranges for the country
  const ipRanges = getCountryIpRanges(country.toLowerCase());
  
  // Increase camera count for target countries
  const cameraCount = isTargetCountry ? limit * 2 : limit;
  
  const cameras: CameraResult[] = [];
  
  for (let i = 0; i < cameraCount; i++) {
    // Select a random IP range from the country
    const randomRangeIndex = Math.floor(Math.random() * ipRanges.length);
    let ip = '';
    
    if (ipRanges.length > 0) {
      ip = getRandomIpInRange(ipRanges[randomRangeIndex]);
    } else {
      // Fallback to random IP if no ranges found
      ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }
    
    // Get random location within the country
    const location = getRandomGeoLocation(country);
    
    // Random camera details
    const manufacturers = ['Hikvision', 'Dahua', 'Axis', 'Bosch', 'Hanwha', 'Uniview'];
    const ports = [80, 554, 8000, 8080, 37777];
    
    // For target countries, use more specific models
    let manufacturer = '';
    let model = '';
    let vulnerabilities: Vulnerability[] = [];
    
    if (isTargetCountry) {
      // Country-specific manufacturers
      if (country.toLowerCase() === 'russia') {
        manufacturer = ['Hikvision', 'RVi', 'Trassir', 'ActiveCam'][Math.floor(Math.random() * 4)];
      } else if (country.toLowerCase() === 'ukraine') {
        manufacturer = ['Hikvision', 'Dahua', 'Ezviz', 'Uniview'][Math.floor(Math.random() * 4)];
      } else if (country.toLowerCase() === 'georgia') {
        manufacturer = ['Hikvision', 'Dahua', 'TVT'][Math.floor(Math.random() * 3)];
      } else if (country.toLowerCase() === 'romania') {
        manufacturer = ['Hikvision', 'Dahua', 'Mobotix', 'Axis'][Math.floor(Math.random() * 4)];
      } else {
        manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
      }
      
      // Generate a model number based on manufacturer
      if (manufacturer === 'Hikvision') {
        model = `DS-2CD${Math.floor(Math.random() * 9000) + 1000}`;
      } else if (manufacturer === 'Dahua') {
        model = `IPC-HDW${Math.floor(Math.random() * 9000) + 1000}`;
      } else if (manufacturer === 'Axis') {
        model = `P${Math.floor(Math.random() * 9000) + 1000}`;
      } else {
        model = `Model-${Math.floor(Math.random() * 9000) + 1000}`;
      }
      
      // Add ID to vulnerabilities for target countries
      if (manufacturer === 'Hikvision') {
        vulnerabilities = [
          { id: 'CVE-2021-36260', name: 'Authentication Bypass', severity: 'critical', description: 'Command injection vulnerability' },
          { id: 'CVE-2017-7921', name: 'Default Credentials', severity: 'critical', description: 'Default admin credentials remain active' }
        ];
      } else if (manufacturer === 'Dahua') {
        vulnerabilities = [
          { id: 'CVE-2021-33044', name: 'Backdoor Access', severity: 'high', description: 'Backdoor access in firmware' },
          { id: 'CVE-2018-10088', name: 'Command Injection', severity: 'high', description: 'Remote code execution possible' }
        ];
      }
    } else {
      manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
      model = `Model-${Math.floor(Math.random() * 9000) + 1000}`;
      
      // Add some generic vulnerabilities with IDs
      if (includeVulnerable && Math.random() > 0.5) {
        vulnerabilities = [
          { id: `VULN-${Math.floor(Math.random() * 1000)}`, name: 'Security Weakness', severity: 'high', description: 'Generic security vulnerability' }
        ];
      }
    }
    
    // Determine if the camera is vulnerable (more likely for target countries)
    const vulnerable = isTargetCountry ? Math.random() > 0.3 : Math.random() > 0.7;
    const status = vulnerable ? 'vulnerable' as CameraStatus : 'online' as CameraStatus;
    
    // Generate threat intelligence data for the camera
    const threatIntel: ThreatIntelData = {
      ipReputation: Math.floor(Math.random() * 100),
      confidenceScore: Math.floor(Math.random() * 100),
      source: ['virustotal', 'abuseipdb', 'threatfox', 'other'][Math.floor(Math.random() * 4)] as any,
      associatedMalware: [],
      lastUpdated: new Date().toISOString()
    };
    
    // Create the camera object
    const camera: CameraResult = {
      id: `search-${Date.now()}-${i}`,
      ip,
      port: ports[Math.floor(Math.random() * ports.length)],
      brand: manufacturer,
      model,
      status,
      location: {
        country: location.country,
        city: location.city,
        latitude: location.latitude,
        longitude: location.longitude
      },
      vulnerabilities,
      lastSeen: new Date().toISOString(),
      accessLevel: ['none', 'view', 'control', 'admin'][Math.floor(Math.random() * 4)] as any,
      threatIntel,
      firmware: {
        version: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
        updateAvailable: Math.random() > 0.5,
        lastChecked: new Date().toISOString(),
        vulnerabilities: vulnerabilities.map(v => v.id) // Convert to string array
      }
    };
    
    cameras.push(camera);
  }
  
  return cameras;
};

const EASTERN_EUROPEAN_COUNTRIES = ['russia', 'ukraine', 'belarus', 'poland', 'romania', 'hungary', 'slovakia', 'moldova'];
