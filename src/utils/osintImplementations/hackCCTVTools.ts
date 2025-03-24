
/**
 * Implementation for hackCCTV tools
 * Based on implementations from:
 * - https://github.com/Whomrx666/Hack-cctv
 * - https://github.com/akashblackhat/cctv-Hack.py
 * - https://github.com/er4vn/Cam-Dumper
 * - https://github.com/nak0823/OpenCCTV
 * - https://github.com/Rihan444/CCTV_HACKED
 */

import { simulateNetworkDelay } from '../networkUtils';
import { 
  ScanResult,
  HackCCTVParams,
  CameraResult,
  CameraStatus
} from '../types/cameraTypes';
import { nanoid } from 'nanoid';

// Custom parseIpRange implementation since the import is failing
const parseIpRange = (ipRange: string): string[] => {
  // Basic implementation to parse CIDR notation
  if (ipRange.includes('/')) {
    const [baseIp, cidrPart] = ipRange.split('/');
    const cidr = parseInt(cidrPart);
    
    // For simplicity, return a few IPs in the range for simulation
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
  { username: 'admin', password: 'password' },
  { username: 'admin', password: '' },
  { username: 'root', password: 'root' },
  { username: 'root', password: 'admin' },
  { username: 'root', password: '12345' },
  { username: 'user', password: 'user' },
  { username: 'supervisor', password: 'supervisor' },
  { username: 'ubnt', password: 'ubnt' },
];

// Create a database of common vulnerabilities in CCTV cameras
const commonVulnerabilities = [
  {
    name: 'Default Credentials',
    severity: 'high' as const,
    description: 'The camera uses factory default username and password'
  },
  {
    name: 'Telnet Enabled',
    severity: 'critical' as const,
    description: 'Telnet service is enabled on this device'
  },
  {
    name: 'Outdated Firmware',
    severity: 'medium' as const,
    description: 'Camera firmware has known security vulnerabilities'
  },
  {
    name: 'Unencrypted RTSP Stream',
    severity: 'medium' as const,
    description: 'Video stream is transmitted without encryption'
  },
  {
    name: 'Web Interface XSS',
    severity: 'high' as const,
    description: 'Web interface is vulnerable to cross-site scripting attacks'
  },
  {
    name: 'Authentication Bypass',
    severity: 'critical' as const,
    description: 'Camera has known authentication bypass vulnerabilities'
  },
  {
    name: 'Command Injection',
    severity: 'critical' as const,
    description: 'Device is vulnerable to command injection attacks via the web interface'
  },
  {
    name: 'Insecure Password Storage',
    severity: 'high' as const,
    description: 'Passwords are stored in cleartext or with weak encryption'
  }
];

// Simulated camera brands with their default ports and vulnerabilities
const cameraModels = [
  { brand: 'Hikvision', model: 'DS-2CD2xx2', ports: [80, 443, 554], vulnerabilities: [0, 2, 3] },
  { brand: 'Dahua', model: 'DH-IPC-HDWxx', ports: [80, 443, 554, 37777], vulnerabilities: [0, 2, 3, 7] },
  { brand: 'Axis', model: 'AXIS P33xx', ports: [80, 443, 554], vulnerabilities: [2, 3] },
  { brand: 'Foscam', model: 'FI9xxx', ports: [80, 443, 554, 88], vulnerabilities: [0, 1, 2, 4, 7] },
  { brand: 'Amcrest', model: 'IP2M-8xx', ports: [80, 443, 554], vulnerabilities: [0, 2, 3] },
  { brand: 'Reolink', model: 'RLC-4xx', ports: [80, 443, 554], vulnerabilities: [0, 3] },
  { brand: 'Ubiquiti', model: 'UniFi Video G3', ports: [80, 443, 554, 7080], vulnerabilities: [3] },
  { brand: 'Bosch', model: 'DINION IP', ports: [80, 443, 554], vulnerabilities: [2, 3] },
  { brand: 'Hanwha', model: 'QNV-xx', ports: [80, 443, 554], vulnerabilities: [0, 2, 3] },
  { brand: 'Vivotek', model: 'FD9xx', ports: [80, 443, 554], vulnerabilities: [0, 2, 3, 4, 6] },
];

/**
 * Simulates a bruteforce attempt on a camera
 * @param ip The IP address to target
 * @param port The port to target
 * @returns Object containing success status and credentials if found
 */
const simulateBruteforce = (ip: string, port: number = 80): { success: boolean; credentials: { username: string; password: string } | null } => {
  // Simulate a 30% chance of finding valid credentials
  const success = Math.random() < 0.3;
  
  if (success) {
    // If successful, return a random set of default credentials
    const credIndex = Math.floor(Math.random() * defaultCredentials.length);
    return {
      success: true,
      credentials: defaultCredentials[credIndex]
    };
  }
  
  return {
    success: false,
    credentials: null
  };
};

/**
 * Executes the hackCCTV tool to find vulnerable CCTV cameras
 * Based on multiple implementations from GitHub repos
 */
export const executeHackCCTV = async (params: HackCCTVParams): Promise<ScanResult> => {
  await simulateNetworkDelay(2000);
  console.log('Executing hackCCTV:', params);
  
  // Parse target IP or range
  const targetIPs: string[] = [];
  
  if (params.target) {
    targetIPs.push(...parseIpRange(params.target));
  } else {
    // Generate some random IPs for demo
    for (let i = 0; i < 5; i++) {
      const ip = `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
      targetIPs.push(ip);
    }
  }
  
  // Limit the number of targets for the simulation
  const limitedTargets = targetIPs.slice(0, params.deepScan ? 10 : 5);
  const results: CameraResult[] = [];
  
  // Process each target IP
  for (const ip of limitedTargets) {
    // Randomly determine if this IP has a camera
    const hasCameraChance = Math.random();
    
    if (hasCameraChance > 0.4) { // 60% chance to find a camera
      // Select a random camera model
      const cameraIndex = Math.floor(Math.random() * cameraModels.length);
      const camera = cameraModels[cameraIndex];
      
      // Select a random port from the camera's typical ports
      const portIndex = Math.floor(Math.random() * camera.ports.length);
      const port = camera.ports[portIndex];
      
      // Perform bruteforce if requested
      let credentials = null;
      if (params.bruteforce) {
        const bruteforceResult = simulateBruteforce(ip, port);
        if (bruteforceResult.success) {
          credentials = bruteforceResult.credentials;
        }
      }
      
      // Generate vulnerabilities based on the camera model
      const vulnerabilities = camera.vulnerabilities.map(index => commonVulnerabilities[index]);
      
      // Determine the country based on IP pattern
      let country = 'United States';
      if (ip.startsWith('5.152.') || ip.startsWith('31.146.') || ip.startsWith('37.110.')) {
        country = 'Georgia';
      } else if (ip.startsWith('5.2.') || ip.startsWith('5.12.') || ip.startsWith('31.5.')) {
        country = 'Romania';
      } else if (ip.startsWith('5.1.') || ip.startsWith('5.58.') || ip.startsWith('5.105.')) {
        country = 'Ukraine';
      } else if (ip.startsWith('5.3.') || ip.startsWith('5.8.') || ip.startsWith('5.16.')) {
        country = 'Russia';
      }
      
      // Generate a city based on the country
      const cities: Record<string, string[]> = {
        'Georgia': ['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi'],
        'Romania': ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași'],
        'Ukraine': ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv'],
        'Russia': ['Moscow', 'Saint Petersburg', 'Kazan', 'Novosibirsk'],
        'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston']
      };
      
      const cityList = cities[country] || cities['United States'];
      const city = cityList[Math.floor(Math.random() * cityList.length)];
      
      // Generate a result for this camera
      results.push({
        id: nanoid(),
        ip,
        port,
        model: `${camera.brand} ${camera.model}${Math.floor(Math.random() * 100)}`,
        manufacturer: camera.brand,
        rtspUrl: `rtsp://${ip}:${port === 554 ? 554 : '554'}/live/ch0`,
        status: credentials !== null ? 'vulnerable' : (Math.random() > 0.2 ? 'online' : 'offline') as CameraStatus,
        lastSeen: new Date().toISOString(),
        accessLevel: credentials !== null ? 'admin' : 'none',
        credentials,
        vulnerabilities,
        geolocation: {
          country,
          city
        }
      });
    }
  }
  
  return {
    success: true,
    total: targetIPs.length,
    found: results.length,
    results: results,
    data: {
      cameras: results,
      total: results.length,
      vulnerabilities: commonVulnerabilities
    },
    simulatedData: true
  };
};
