
/**
 * Implementation for hackCCTV tools
 * Based on implementations from:
 * - https://github.com/Whomrx666/Hack-cctv
 * - https://github.com/akashblackhat/cctv-Hack.py
 * - https://github.com/er4vn/Cam-Dumper
 * - https://github.com/nak0823/OpenCCTV
 * - https://github.com/Rihan444/CCTV_HACKED
 * - https://github.com/Hasan-Malek/EyePwn
 * - https://github.com/jorhelp/Ingram
 */

import { simulateNetworkDelay } from '../networkUtils';
import { 
  ScanResult,
  HackCCTVParams,
  CameraResult,
  CameraStatus,
  Vulnerability,
  CamDumperParams,
  OpenCCTVParams,
  EyePwnParams,
  IngramParams
} from '../types/cameraTypes';
import { nanoid } from 'nanoid';
import { getCountryCities, getRandomIpFromCountry } from '../countryUtils';

// Custom parseIpRange implementation
const parseIpRange = (ipRange: string): string[] => {
  // Basic implementation to parse CIDR notation
  if (ipRange.includes('/')) {
    const [baseIp, cidrPart] = ipRange.split('/');
    const cidr = parseInt(cidrPart);
    
    // For simulation, return a few IPs in the range
    const ipParts = baseIp.split('.');
    const results: string[] = [];
    
    // Generate 10 IPs in the range
    for (let i = 0; i < 10; i++) {
      const lastOctet = parseInt(ipParts[3]) + i;
      if (lastOctet <= 255) {
        results.push(`${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${lastOctet}`);
      }
    }
    
    return results;
  }
  
  // Handle range notation like 192.168.1.1-10
  if (ipRange.includes('-')) {
    const [start, end] = ipRange.split('-');
    const results: string[] = [];
    
    if (start.includes('.')) {
      const baseParts = start.split('.');
      const startNum = parseInt(baseParts[3]);
      const endNum = parseInt(end);
      
      for (let i = startNum; i <= endNum && i <= 255; i++) {
        results.push(`${baseParts[0]}.${baseParts[1]}.${baseParts[2]}.${i}`);
      }
    }
    
    return results;
  }
  
  // Single IP
  return [ipRange];
};

// Create a database of common default CCTV credentials
const defaultCredentials = [
  { username: 'admin', password: 'admin' },
  { username: 'admin', password: '12345' },
  { username: 'admin', password: '123456' },
  { username: 'admin', password: 'password' },
  { username: 'admin', password: '' },
  { username: 'root', password: 'root' },
  { username: 'root', password: '12345' },
  { username: 'root', password: 'pass' },
  { username: 'user', password: 'user' },
  { username: 'guest', password: 'guest' }
];

// Create a database of common camera vulnerabilities
const commonVulnerabilities: Record<string, Vulnerability[]> = {
  'hikvision': [
    { name: 'CVE-2021-36260', severity: 'critical', description: 'Command injection vulnerability in Hikvision IP cameras' },
    { name: 'CVE-2022-28173', severity: 'high', description: 'Authentication bypass in Hikvision cameras' },
    { name: 'Default credentials', severity: 'high', description: 'Device using factory default credentials' }
  ],
  'dahua': [
    { name: 'CVE-2021-33044', severity: 'critical', description: 'Authentication bypass in Dahua cameras' },
    { name: 'CVE-2021-33045', severity: 'high', description: 'Arbitrary file reading vulnerability in Dahua' },
    { name: 'Weak encryption', severity: 'medium', description: 'Weak password encryption in transmission' }
  ],
  'axis': [
    { name: 'CVE-2018-10660', severity: 'high', description: 'Authentication bypass in Axis cameras' },
    { name: 'Unencrypted RTSP', severity: 'medium', description: 'RTSP stream lacks encryption' }
  ],
  'generic': [
    { name: 'Default credentials', severity: 'high', description: 'Device using factory default credentials' },
    { name: 'Unencrypted traffic', severity: 'medium', description: 'Device transmits unencrypted video stream' },
    { name: 'Outdated firmware', severity: 'medium', description: 'Device running outdated firmware with known vulnerabilities' }
  ]
};

// Common camera models by manufacturer for each country
const countrySpecificCameraModels: Record<string, Record<string, string[]>> = {
  'ukraine': {
    'hikvision': ['DS-2CD2043G0-I', 'DS-2CD2T47G1-L', 'DS-2CD2355FWD-I'],
    'dahua': ['IPC-HDW4631C-A', 'DH-IPC-HDBW4631R-ZS', 'DH-IPC-HFW4231E-SE'],
    'axis': ['P1448-LE', 'M2025-LE', 'P3245-LVE'],
    'bosch': ['DINION IP 4000i', 'FLEXIDOME IP 4000i', 'DINION IP starlight 6000']
  },
  'russia': {
    'hikvision': ['DS-2CD2027G2-L', 'DS-2CD2143G2-IS', 'DS-2CD2T22WD-I5'],
    'dahua': ['IPC-HDBW4431F-AS', 'DH-SD59430U-HNI', 'DH-IPC-HFW5231E-Z12E'],
    'axis': ['P3235-LVE', 'P1445-LE', 'M3057-PLVE'],
    'rvi': ['RVi-1NCT2120', 'RVi-2NCT6032', 'RVi-IPC43DNS']
  },
  'georgia': {
    'hikvision': ['DS-2CD2047G1-L', 'DS-2CD2123G0-I', 'DS-2CD1043G0-I'],
    'dahua': ['IPC-HDW5231R-ZE', 'DH-IPC-HFW5231E-Z5E', 'DH-HAC-HDW1200EMP'],
    'axis': ['M2026-LE', 'P1435-LE', 'P3235-LV'],
    'ezviz': ['C3W', 'C3WN', 'C6CN']
  },
  'romania': {
    'hikvision': ['DS-2CD2043G2-I', 'DS-2CD2123G2-IS', 'DS-2CD2683G1-IZS'],
    'dahua': ['IPC-HDBW4831E-ASE', 'DH-IPC-HDW4431EM-ASE', 'DH-IPC-HFW4831E-SE'],
    'axis': ['M3045-V', 'P1447-LE', 'P3227-LVE'],
    'provision': ['PR-I4230IPVF', 'PR-D4220IPVF', 'PR-I1180IPVF']
  }
};

// Generate simulated camera details for a specific IP
const generateCameraDetails = (ip: string, port: number, country?: string): CameraResult => {
  // Define manufacturers and models
  const manufacturers = ['Hikvision', 'Dahua', 'Axis', 'Bosch', 'Samsung', 'Pelco', 'Sony'];
  
  // Determine manufacturer
  const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
  
  // Handle country-specific details
  let model = '';
  let cities: string[] = [];
  
  if (country && country.toLowerCase() in countrySpecificCameraModels) {
    const countryKey = country.toLowerCase();
    const manufacturerKey = manufacturer.toLowerCase();
    
    // Get country-specific camera models
    if (manufacturerKey in countrySpecificCameraModels[countryKey]) {
      const models = countrySpecificCameraModels[countryKey][manufacturerKey];
      model = models[Math.floor(Math.random() * models.length)];
    }
    
    // Get cities for this country
    cities = getCountryCities(country);
  } else {
    // Generate generic model
    const modelNumbers = ['1080p', '2MP', '4MP', '5MP', '8MP'];
    const modelTypes = ['Dome', 'Bullet', 'PTZ', 'Turret', 'Cube'];
    model = `${manufacturer} ${modelTypes[Math.floor(Math.random() * modelTypes.length)]} ${modelNumbers[Math.floor(Math.random() * modelNumbers.length)]}`;
  }
  
  // Create vulnerabilities based on manufacturer
  let vulnerabilities: Vulnerability[] = [];
  const manufacturerKey = manufacturer.toLowerCase();
  
  if (manufacturerKey in commonVulnerabilities) {
    // Copy some (or all) vulnerabilities from the common list
    const allVulns = commonVulnerabilities[manufacturerKey];
    const numVulns = Math.floor(Math.random() * (allVulns.length + 1));
    
    for (let i = 0; i < numVulns; i++) {
      vulnerabilities.push(allVulns[i]);
    }
  } else {
    // Use generic vulnerabilities
    const genericVulns = commonVulnerabilities['generic'];
    const numVulns = Math.floor(Math.random() * (genericVulns.length + 1));
    
    for (let i = 0; i < numVulns; i++) {
      vulnerabilities.push(genericVulns[i]);
    }
  }
  
  // Randomly determine if default credentials are used
  const useDefaultCreds = Math.random() < 0.4; // 40% chance
  const credentials = useDefaultCreds ? 
    defaultCredentials[Math.floor(Math.random() * defaultCredentials.length)] : 
    undefined;
  
  // Determine camera status based on vulnerabilities
  let status: CameraStatus = 'online';
  if (vulnerabilities.some(v => v.severity === 'critical')) {
    status = 'vulnerable';
  } else if (useDefaultCreds) {
    status = 'vulnerable';
  } else if (vulnerabilities.length > 0) {
    status = Math.random() < 0.5 ? 'vulnerable' : 'online';
  }
  
  // Generate geolocation if country is provided
  let geolocation = undefined;
  if (country) {
    geolocation = {
      country: country,
      city: cities.length > 0 ? cities[Math.floor(Math.random() * cities.length)] : undefined,
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180
    };
  }
  
  // Generate result
  return {
    id: nanoid(),
    ip,
    port,
    manufacturer: manufacturer,
    model: model,
    status,
    vulnerabilities: vulnerabilities.length > 0 ? vulnerabilities : undefined,
    credentials: credentials,
    geolocation,
    accessible: status !== 'offline',
    rtspPath: '/Streaming/Channels/101',
    lastSeen: new Date(),
    firstSeen: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date within last 30 days
  };
};

// Implementation of Hack-CCTV tool
export const executeHackCCTV = async (params: HackCCTVParams): Promise<ScanResult> => {
  console.log('Executing HackCCTV with params:', params);
  await simulateNetworkDelay(1000, 3000);
  
  const { target, method = 'default-credentials', bruteforce = true, deepScan = false, country } = params;
  
  let targetIps: string[] = [];
  
  // Handle country parameter
  if (country && !target) {
    // Generate random IPs for the specified country
    for (let i = 0; i < 5; i++) {
      const randomIp = getRandomIpFromCountry(country);
      if (randomIp) targetIps.push(randomIp);
    }
  } else {
    targetIps = parseIpRange(target);
  }
  
  // Generate random number of cameras (more if deepScan is true)
  const numCameras = deepScan ? 
    Math.floor(Math.random() * 10) + 5 : // 5-15 cameras
    Math.floor(Math.random() * 5) + 1;   // 1-5 cameras
  
  // Generate camera results
  const cameras: CameraResult[] = [];
  for (let i = 0; i < Math.min(numCameras, targetIps.length); i++) {
    const ip = targetIps[i];
    const port = [80, 554, 8080, 8000, 37777, 37778, 9000, 443][Math.floor(Math.random() * 8)];
    
    const camera = generateCameraDetails(ip, port, country);
    
    // Adjust results based on method
    if (method === 'default-credentials' && !camera.credentials && Math.random() < 0.6) {
      camera.credentials = defaultCredentials[Math.floor(Math.random() * defaultCredentials.length)];
      camera.status = 'vulnerable';
    } else if (method === 'exploit' && (!camera.vulnerabilities || camera.vulnerabilities.length === 0)) {
      const genericVulns = commonVulnerabilities['generic'];
      camera.vulnerabilities = [genericVulns[Math.floor(Math.random() * genericVulns.length)]];
      camera.status = 'vulnerable';
    }
    
    cameras.push(camera);
  }
  
  // Return simulated scan result
  return {
    success: true,
    timestamp: new Date().toISOString(),
    total: targetIps.length,
    found: cameras.length,
    data: { cameras },
    results: cameras,
    simulatedData: true
  };
};

// Implementation of Cam-Dumper tool
export const executeCamDumper = async (params: CamDumperParams): Promise<ScanResult> => {
  console.log('Executing CamDumper with params:', params);
  await simulateNetworkDelay(1000, 2500);
  
  const { target, method = 'scan', country } = params;
  
  let targetIps: string[] = [];
  
  // Handle country parameter
  if (country && !target) {
    // Generate random IPs for the specified country
    for (let i = 0; i < 6; i++) {
      const randomIp = getRandomIpFromCountry(country);
      if (randomIp) targetIps.push(randomIp);
    }
  } else {
    targetIps = parseIpRange(target);
  }
  
  // Generate random number of cameras
  const numCameras = Math.floor(Math.random() * 7) + 2; // 2-8 cameras
  
  // Generate camera results focusing on accessible cameras
  const cameras: CameraResult[] = [];
  for (let i = 0; i < Math.min(numCameras, targetIps.length); i++) {
    const ip = targetIps[i];
    const port = [80, 8080, 81, 82, 9000, 37777][Math.floor(Math.random() * 6)];
    
    const camera = generateCameraDetails(ip, port, country);
    
    // Cam-Dumper focuses on web accessible cameras, ensure they're accessible
    camera.accessible = true;
    if (!camera.credentials) {
      camera.credentials = defaultCredentials[Math.floor(Math.random() * defaultCredentials.length)];
    }
    
    cameras.push(camera);
  }
  
  // Return simulated scan result
  return {
    success: true,
    timestamp: new Date().toISOString(),
    total: targetIps.length,
    found: cameras.length,
    data: { cameras },
    results: cameras,
    simulatedData: true
  };
};

// Implementation of OpenCCTV tool
export const executeOpenCCTV = async (params: OpenCCTVParams): Promise<ScanResult> => {
  console.log('Executing OpenCCTV with params:', params);
  await simulateNetworkDelay(1500, 3000);
  
  const { target, scanMode = 'quick' } = params;
  
  // Parse target
  const targetIps = parseIpRange(target);
  
  // Determine number of cameras based on scan mode
  let numCameras: number;
  switch (scanMode) {
    case 'deep':
      numCameras = Math.floor(Math.random() * 12) + 8; // 8-20 cameras
      break;
    case 'stealth':
      numCameras = Math.floor(Math.random() * 5) + 3; // 3-8 cameras
      break;
    case 'quick':
    default:
      numCameras = Math.floor(Math.random() * 6) + 2; // 2-8 cameras
      break;
  }
  
  // Generate camera results
  const cameras: CameraResult[] = [];
  for (let i = 0; i < Math.min(numCameras, targetIps.length); i++) {
    const ip = targetIps[i];
    
    // OpenCCTV is focused on RTSP, so prioritize port 554
    const port = Math.random() < 0.7 ? 554 : [80, 8080, 8000, 37777][Math.floor(Math.random() * 4)];
    
    // Infer country from IP address (simplified)
    let country: string | undefined;
    if (ip.startsWith('5.58.') || ip.startsWith('31.43.') || ip.startsWith('91.197.')) {
      country = 'Ukraine';
    } else if (ip.startsWith('5.3.') || ip.startsWith('5.8.') || ip.startsWith('5.16.')) {
      country = 'Russia';
    } else if (ip.startsWith('5.152.') || ip.startsWith('31.146.') || ip.startsWith('37.110.')) {
      country = 'Georgia';
    } else if (ip.startsWith('5.2.') || ip.startsWith('5.12.') || ip.startsWith('31.5.')) {
      country = 'Romania';
    }
    
    const camera = generateCameraDetails(ip, port, country);
    
    // For deep scan, ensure more complete details
    if (scanMode === 'deep') {
      if (!camera.credentials && Math.random() < 0.6) {
        camera.credentials = defaultCredentials[Math.floor(Math.random() * defaultCredentials.length)];
      }
      
      if (!camera.vulnerabilities || camera.vulnerabilities.length === 0) {
        const genericVulns = commonVulnerabilities['generic'];
        const randomVuln = genericVulns[Math.floor(Math.random() * genericVulns.length)];
        camera.vulnerabilities = [randomVuln];
      }
    }
    
    // For stealth mode, remove some identifiable info
    if (scanMode === 'stealth') {
      camera.manufacturer = 'Unknown';
      camera.model = 'Unknown';
      delete camera.credentials;
    }
    
    cameras.push(camera);
  }
  
  // Return simulated scan result
  return {
    success: true,
    timestamp: new Date().toISOString(),
    total: targetIps.length,
    found: cameras.length,
    data: { cameras },
    results: cameras,
    simulatedData: true
  };
};

// Implementation of EyePwn tool
export const executeEyePwn = async (params: EyePwnParams): Promise<ScanResult> => {
  console.log('Executing EyePwn with params:', params);
  await simulateNetworkDelay(1200, 2800);
  
  const { target, method = 'all', bruteforce = true, country } = params;
  
  let targetIps: string[] = [];
  
  // Handle country parameter
  if (country && !target) {
    // Generate random IPs for the specified country
    for (let i = 0; i < 7; i++) {
      const randomIp = getRandomIpFromCountry(country);
      if (randomIp) targetIps.push(randomIp);
    }
  } else {
    targetIps = parseIpRange(target);
  }
  
  // Generate random number of cameras
  const numCameras = Math.floor(Math.random() * 8) + 3; // 3-10 cameras
  
  // Generate camera results
  const cameras: CameraResult[] = [];
  for (let i = 0; i < Math.min(numCameras, targetIps.length); i++) {
    const ip = targetIps[i];
    const port = [80, 554, 8080, 8000, 37777, 443][Math.floor(Math.random() * 6)];
    
    const camera = generateCameraDetails(ip, port, country);
    
    // EyePwn focuses on vulnerabilities and exploitation
    if (!camera.vulnerabilities || camera.vulnerabilities.length === 0) {
      const manufacturerKey = camera.manufacturer.toLowerCase();
      
      if (manufacturerKey in commonVulnerabilities) {
        const vulns = commonVulnerabilities[manufacturerKey];
        const numVulns = Math.floor(Math.random() * 3) + 1; // 1-3 vulnerabilities
        
        camera.vulnerabilities = [];
        for (let v = 0; v < numVulns && v < vulns.length; v++) {
          camera.vulnerabilities.push(vulns[v]);
        }
      } else {
        const genericVulns = commonVulnerabilities['generic'];
        const vulnIndex = Math.floor(Math.random() * genericVulns.length);
        camera.vulnerabilities = [genericVulns[vulnIndex]];
      }
    }
    
    // If bruteforce is enabled, add credentials
    if (bruteforce && !camera.credentials && Math.random() < 0.7) {
      camera.credentials = defaultCredentials[Math.floor(Math.random() * defaultCredentials.length)];
    }
    
    // Mark as vulnerable
    camera.status = 'vulnerable';
    
    cameras.push(camera);
  }
  
  // Return simulated scan result
  return {
    success: true,
    timestamp: new Date().toISOString(),
    total: targetIps.length,
    found: cameras.length,
    data: { cameras },
    results: cameras,
    simulatedData: true
  };
};

// Implementation of Ingram tool
export const executeIngram = async (params: IngramParams): Promise<ScanResult> => {
  console.log('Executing Ingram with params:', params);
  await simulateNetworkDelay(1500, 3500);
  
  const { target, scanType = 'quick', country } = params;
  
  let targetIps: string[] = [];
  
  // Handle country parameter
  if (country && !target) {
    // Generate random IPs for the specified country
    for (let i = 0; i < 8; i++) {
      const randomIp = getRandomIpFromCountry(country);
      if (randomIp) targetIps.push(randomIp);
    }
  } else {
    targetIps = parseIpRange(target);
  }
  
  // Determine number of cameras based on scan type
  let numCameras: number;
  switch (scanType) {
    case 'full':
      numCameras = Math.floor(Math.random() * 15) + 5; // 5-20 cameras
      break;
    case 'stealth':
      numCameras = Math.floor(Math.random() * 4) + 1; // 1-5 cameras
      break;
    case 'quick':
    default:
      numCameras = Math.floor(Math.random() * 7) + 2; // 2-9 cameras
      break;
  }
  
  // Generate camera results
  const cameras: CameraResult[] = [];
  for (let i = 0; i < Math.min(numCameras, targetIps.length); i++) {
    const ip = targetIps[i];
    const port = [80, 554, 8080, 8000, 81, 37777, 443][Math.floor(Math.random() * 7)];
    
    const camera = generateCameraDetails(ip, port, country);
    
    // Ingram is focused on detailed analysis
    if (scanType === 'full') {
      // Ensure full details
      if (!camera.credentials && Math.random() < 0.5) {
        camera.credentials = defaultCredentials[Math.floor(Math.random() * defaultCredentials.length)];
      }
      
      if (!camera.vulnerabilities || camera.vulnerabilities.length === 0) {
        const manufacturerKey = camera.manufacturer.toLowerCase();
        
        if (manufacturerKey in commonVulnerabilities) {
          camera.vulnerabilities = [...commonVulnerabilities[manufacturerKey]];
        } else {
          camera.vulnerabilities = [...commonVulnerabilities['generic']];
        }
      }
      
      camera.status = 'vulnerable';
    } else if (scanType === 'stealth') {
      // Minimal footprint for stealth
      delete camera.credentials;
      delete camera.vulnerabilities;
      camera.manufacturer = 'Unknown';
      camera.model = 'Unknown';
    }
    
    cameras.push(camera);
  }
  
  // Return simulated scan result
  return {
    success: true,
    timestamp: new Date().toISOString(),
    total: targetIps.length,
    found: cameras.length,
    data: { cameras },
    results: cameras,
    simulatedData: true
  };
};
