// Import statements
import { simulateNetworkDelay } from './networkUtils';
import { getRandomGeoLocation } from './osintUtils';
import { CameraResult } from '@/types/scanner';
import { Vulnerability } from '@/utils/types/cameraTypes';
import { nanoid } from 'nanoid';
import { getCountryCode } from './geoUtils';

// Define Eastern European countries rather than importing to avoid conflict
const EASTERN_EUROPEAN_COUNTRIES = ['ukraine', 'russia', 'georgia', 'romania', 'belarus', 'moldova', 'poland', 'hungary', 'slovakia', 'czech'];

/**
 * Utility functions for searching cameras using different search engines and methods
 */

/**
 * Generate a random vulnerability
 */
const generateRandomVulnerability = (): Vulnerability => {
  const severityLevels: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
  return {
    id: nanoid(),
    name: `CVE-${2023 + Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 10000)}`,
    severity: severityLevels[Math.floor(Math.random() * 4)],
    description: 'Simulated vulnerability description'
  };
};

/**
 * Generate a set of random vulnerabilities
 */
const generateRandomVulnerabilities = (count: number = 3): Vulnerability[] => {
  const vulnerabilities: Vulnerability[] = [];
  for (let i = 0; i < count; i++) {
    vulnerabilities.push(generateRandomVulnerability());
  }
  return vulnerabilities;
};

/**
 * Generate a random IP address
 */
const generateRandomIP = (): string => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

/**
 * Generate a random port number
 */
const generateRandomPort = (): number => {
  const commonPorts = [80, 443, 554, 8080, 8888];
  return commonPorts[Math.floor(Math.random() * commonPorts.length)];
};

/**
 * Generate a random MAC address
 */
const generateRandomMAC = (): string => {
  let mac = '';
  for (let i = 0; i < 6; i++) {
    mac += Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    if (i < 5) mac += ':';
  }
  return mac;
};

/**
 * Generate a random firmware version
 */
const generateRandomFirmwareVersion = (): string => {
  return `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`;
};

/**
 * Generate a random camera model
 */
const generateRandomCameraModel = (manufacturer: string): string => {
  const modelPrefixes: Record<string, string[]> = {
    Hikvision: ['DS-2CD', 'DS-2DE', 'DS-2SE'],
    Dahua: ['IPC-HDW', 'IPC-HFW', 'SD'],
    Axis: ['P13', 'M30', 'Q16'],
    default: ['Cam', 'IP', 'Net']
  };
  
  const prefix = modelPrefixes[manufacturer] ? modelPrefixes[manufacturer][Math.floor(Math.random() * modelPrefixes[manufacturer].length)] : modelPrefixes.default[Math.floor(Math.random() * modelPrefixes.default.length)];
  return `${prefix}${Math.floor(Math.random() * 1000)}`;
};

/**
 * Execute camera search from various sources
 */
export const executeCameraSearch = async (
  searchParams: { 
    country?: string;
    manufacturer?: string;
    protocol?: string;
    port?: string;
    onlyVulnerable?: boolean;
    limit?: number;
  },
  searchEngine: 'shodan' | 'zoomeye' | 'censys' | 'insecam' = 'shodan'
): Promise<{ success: boolean; cameras?: CameraResult[] }> => {
  console.log(`Executing ${searchEngine} camera search:`, searchParams);
  await simulateNetworkDelay(1500, 3000);
  
  const numResults = searchParams.limit || 10;
  const results: CameraResult[] = [];
  
  // Generate country-specific cameras if requested
  const country = searchParams.country?.toLowerCase();

  for (let i = 0; i < numResults; i++) {
    // Determine camera details based on country/region
    const location = country ? getRandomGeoLocation(country) : getRandomGeoLocation();
    const manufacturer = searchParams.manufacturer || ['Hikvision', 'Dahua', 'Axis', 'Panasonic', 'Sony'][Math.floor(Math.random() * 5)];
    
    // Create camera model based on manufacturer
    let model = '';
    if (manufacturer === 'Hikvision') {
      model = `DS-2CD${1000 + Math.floor(Math.random() * 9000)}`;
    } else if (manufacturer === 'Dahua') {
      model = `IPC-HDW${1000 + Math.floor(Math.random() * 9000)}`;
    } else if (manufacturer === 'Axis') {
      model = `P${Math.floor(Math.random() * 9)}${100 + Math.floor(Math.random() * 900)}`;
    } else {
      model = `IP Camera ${Math.floor(Math.random() * 1000)}`;
    }
    
    // Determine if camera is vulnerable
    const isVulnerable = searchParams.onlyVulnerable || Math.random() > 0.6;
    
    // Create base camera object
    const camera: CameraResult = {
      id: nanoid(),
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      port: parseInt(searchParams.port || '0') || [80, 554, 8000, 8080, 37777][Math.floor(Math.random() * 5)],
      manufacturer: manufacturer,
      model: model,
      firmwareVersion: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
      status: isVulnerable ? 'vulnerable' : 'online',
      accessLevel: isVulnerable ? 'admin' : 'none',
      lastSeen: new Date().toISOString(),
      location: {
        country: location.country,
        city: location.city,
        latitude: location.latitude,
        longitude: location.longitude
      }
    };
    
    // Add vulnerabilities for vulnerable cameras
    if (isVulnerable) {
      const threatIntel = {
        ipReputation: Math.floor(Math.random() * 60) + 40,
        confidenceScore: Math.floor(Math.random() * 50) + 50,
        associatedMalware: ['Mirai', 'Gafgyt', 'Tsunami'].slice(0, Math.floor(Math.random() * 3) + 1),
        lastUpdated: new Date().toISOString(),
        source: 'threatfox' as const
      };
      
      camera.threatIntel = threatIntel;
      
      camera.vulnerabilities = [
        {
          id: nanoid(),
          name: 'Default Credentials',
          severity: 'high',
          description: 'Camera uses default login credentials'
        }
      ];
      
      if (Math.random() > 0.5) {
        camera.vulnerabilities.push({
          id: nanoid(),
          name: 'Outdated Firmware',
          severity: 'medium',
          description: 'Device is running outdated firmware with known security issues'
        });
      }
      
      camera.rtspUrl = `rtsp://${camera.ip}:${camera.port}/live/ch01`;
      camera.httpUrl = `http://${camera.ip}:${camera.port}/`;
    }
    
    results.push(camera);
  }
  
  return {
    success: true,
    cameras: results
  };
};

/**
 * Find cameras in Eastern Europe using a specified method
 */
export const findEasternEuropeanCameras = async (
  method: 'shodan' | 'scan' | 'osint',
  params: {
    country?: string;
    onlyVulnerable?: boolean;
    limit?: number;
  } = {}
): Promise<{ success: boolean; cameras?: CameraResult[] }> => {
  console.log(`Finding Eastern European cameras using ${method}:`, params);
  await simulateNetworkDelay(2000, 4000);
  
  // Use target country or select a random Eastern European country
  let targetCountry = params.country?.toLowerCase();
  if (!targetCountry || !EASTERN_EUROPEAN_COUNTRIES.includes(targetCountry)) {
    targetCountry = EASTERN_EUROPEAN_COUNTRIES[Math.floor(Math.random() * EASTERN_EUROPEAN_COUNTRIES.length)];
  }
  
  // Use different approach based on method
  if (method === 'shodan') {
    return executeCameraSearch({
      country: targetCountry,
      onlyVulnerable: params.onlyVulnerable,
      limit: params.limit
    }, 'shodan');
  } else if (method === 'scan') {
    // Get country IP ranges
    const countryCode = getCountryCode(targetCountry);
    const ipRanges = [
      { range: `5.${Math.floor(Math.random() * 255)}.0.0/16`, description: `${targetCountry.toUpperCase()} ISP Range 1`, assignDate: '2008-05-12' },
      { range: `31.${Math.floor(Math.random() * 255)}.0.0/16`, description: `${targetCountry.toUpperCase()} ISP Range 2`, assignDate: '2010-09-03' },
      { range: `93.${Math.floor(Math.random() * 255)}.0.0/16`, description: `${targetCountry.toUpperCase()} ISP Range 3`, assignDate: '2007-02-28' }
    ];
    
    // Use a random IP range
    const randomRange = ipRanges[Math.floor(Math.random() * ipRanges.length)];
    
    // Generate vulnerabilities for vulnerable cameras in this region
    const generateVulnerabilities = (): { id: string; name: string; severity: 'low' | 'medium' | 'high' | 'critical'; description: string }[] => {
      const vulnerabilities = [
        {
          id: nanoid(),
          name: 'Default Credentials',
          severity: 'high' as const,
          description: 'Camera uses default login credentials'
        }
      ];
      
      if (Math.random() > 0.5) {
        vulnerabilities.push({
          id: nanoid(),
          name: 'Unauthenticated Access',
          severity: 'critical' as const,
          description: 'Camera allows access without authentication'
        });
      }
      
      if (Math.random() > 0.7) {
        vulnerabilities.push({
          id: nanoid(),
          name: 'Command Injection',
          severity: 'critical' as const,
          description: 'Device is vulnerable to command injection attacks'
        });
      }
      
      return vulnerabilities;
    };
    
    // Generate cameras in Eastern Europe with typical characteristics
    const numResults = params.limit || 10;
    const results: CameraResult[] = [];
    
    for (let i = 0; i < numResults; i++) {
      const isVulnerable = params.onlyVulnerable || Math.random() > 0.3;
      const location = getRandomGeoLocation(targetCountry);
      
      // Select manufacturer based on region trends
      let manufacturer;
      if (targetCountry === 'russia') {
        manufacturer = ['Hikvision', 'Dahua', 'RVi', 'ActiveCam'][Math.floor(Math.random() * 4)];
      } else if (targetCountry === 'ukraine') {
        manufacturer = ['Hikvision', 'Dahua', 'Uniview', 'Ezviz'][Math.floor(Math.random() * 4)];
      } else if (targetCountry === 'georgia') {
        manufacturer = ['Hikvision', 'Dahua', 'TVT'][Math.floor(Math.random() * 3)];
      } else {
        manufacturer = ['Hikvision', 'Dahua', 'Axis'][Math.floor(Math.random() * 3)];
      }
      
      // Generate basic camera object
      const camera: CameraResult = {
        id: nanoid(),
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        port: [80, 554, 8000, 8080, 37777][Math.floor(Math.random() * 5)],
        manufacturer: manufacturer,
        model: `${manufacturer}-EE${1000 + Math.floor(Math.random() * 9000)}`,
        firmwareVersion: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
        status: isVulnerable ? 'vulnerable' : 'online',
        accessLevel: isVulnerable ? (Math.random() > 0.5 ? 'admin' : 'view') : 'none',
        lastSeen: new Date().toISOString(),
        location: {
          country: location.country,
          city: location.city,
          latitude: location.latitude,
          longitude: location.longitude
        }
      };
      
      // Add vulnerabilities and threat intel for vulnerable cameras
      if (isVulnerable) {
        camera.vulnerabilities = generateVulnerabilities();
        
        const threatIntel = {
          ipReputation: Math.floor(Math.random() * 60) + 40,
          confidenceScore: Math.floor(Math.random() * 50) + 50,
          associatedMalware: ['Mirai', 'Gafgyt', 'Tsunami'].slice(0, Math.floor(Math.random() * 3) + 1),
          lastUpdated: new Date().toISOString(),
          source: 'threatfox' as const
        };
        
        camera.threatIntel = threatIntel;
        
        // Add URLs for accessing the camera
        camera.rtspUrl = `rtsp://${camera.ip}:${camera.port === 554 ? 554 : 8554}/live/ch01`;
        camera.httpUrl = `http://${camera.ip}:${camera.port === 80 ? 80 : camera.port}/`;
      }
      
      results.push(camera);
    }
    
    return {
      success: true,
      cameras: results
    };
  } else {
    // Use OSINT method
    const numResults = params.limit || 10;
    const results: CameraResult[] = [];
    
    // Generate cameras using OSINT characteristics
    for (let i = 0; i < numResults; i++) {
      const location = getRandomGeoLocation(targetCountry);
      
      // OSINT method typically finds more vulnerable cameras
      const isVulnerable = params.onlyVulnerable || Math.random() > 0.2;
      
      // Select manufacturer with Eastern European specifics
      const manufacturer = ['Hikvision', 'Dahua', 'Axis', 'RVi', 'ActiveCam', 'TVT', 'Ezviz'][Math.floor(Math.random() * 7)];
      
      // Create camera result
      const camera: CameraResult = {
        id: nanoid(),
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        port: [80, 554, 8000, 8080, 37777][Math.floor(Math.random() * 5)],
        manufacturer: manufacturer,
        model: `${manufacturer}${Math.floor(Math.random() * 1000)}`,
        firmwareVersion: `v${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`,
        status: isVulnerable ? 'vulnerable' : 'online',
        accessLevel: isVulnerable ? (Math.random() > 0.3 ? 'admin' : 'view') : 'none',
        lastSeen: new Date().toISOString(),
        location: {
          country: location.country,
          city: location.city,
          latitude: location.latitude,
          longitude: location.longitude
        }
      };
      
      // Add vulnerability and threat intel data
      if (isVulnerable) {
        camera.vulnerabilities = [
          {
            id: nanoid(),
            name: 'Default Credentials',
            severity: 'high',
            description: 'Camera uses default login credentials'
          }
        ];
        
        if (Math.random() > 0.5) {
          camera.vulnerabilities.push({
            id: nanoid(),
            name: 'Information Disclosure',
            severity: 'medium',
            description: 'Device leaks sensitive configuration information'
          });
        }
        
        const threatIntel = {
          ipReputation: Math.floor(Math.random() * 60) + 40,
          confidenceScore: Math.floor(Math.random() * 50) + 50,
          associatedMalware: ['Mirai', 'Gafgyt', 'Tsunami'].slice(0, Math.floor(Math.random() * 3) + 1),
          lastUpdated: new Date().toISOString(),
          source: 'threatfox' as const
        };
        
        camera.threatIntel = threatIntel;
        
        // Add camera access URLs
        camera.rtspUrl = `rtsp://${camera.ip}:${camera.port === 554 ? 554 : 8554}/live/ch01`;
        camera.httpUrl = `http://${camera.ip}:${camera.port === 80 ? 80 : camera.port}/`;
        
        // Add credentials if available
        if (Math.random() > 0.3) {
          camera.credentials = {
            username: ['admin', 'root', 'user', 'service'][Math.floor(Math.random() * 4)],
            password: ['admin', 'password', '12345', ''][Math.floor(Math.random() * 4)]
          };
        }
      }
      
      results.push(camera);
    }
    
    return {
      success: true,
      cameras: results
    };
  }
};

// Additional utility to convert firmware version to detailed object
export const analyzeFirmwareVersion = (version: string) => {
  const versionMatch = version.match(/v?(\d+)\.(\d+)(?:\.(\d+))?/i);
  
  if (!versionMatch) {
    return {
      major: 0,
      minor: 0,
      patch: 0,
      isOutdated: true,
      vulnerabilities: [{
        id: nanoid(),
        name: 'Unknown Firmware',
        severity: 'high',
        description: 'Unable to identify firmware version',
        cve: 'N/A'
      }]
    };
  }
  
  const major = parseInt(versionMatch[1]);
  const minor = parseInt(versionMatch[2]);
  const patch = versionMatch[3] ? parseInt(versionMatch[3]) : 0;
  
  // Simulate if firmware is outdated
  const isOutdated = major < 5 || (major === 5 && minor < 10);
  
  // Generate vulnerabilities for outdated firmware
  const vulnerabilities = isOutdated ? [
    {
      id: nanoid(),
      name: `CVE-${2020 + Math.floor(Math.random() * 3)}-${1000 + Math.floor(Math.random() * 9000)}`,
      severity: 'high',
      description: 'Remote code execution vulnerability in firmware',
      cve: `CVE-${2020 + Math.floor(Math.random() * 3)}-${1000 + Math.floor(Math.random() * 9000)}`,
      published: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      fixed: false
    }
  ] : [];
  
  return {
    major,
    minor,
    patch,
    isOutdated,
    vulnerabilities
  };
};
