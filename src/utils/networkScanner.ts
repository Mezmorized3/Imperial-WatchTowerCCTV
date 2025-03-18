import { CameraResult, ScanProgress, ScanSettings, ScanTarget } from '@/types/scanner';
import { analyzeFirmware, getComprehensiveThreatIntel } from './threatIntelligence';

/**
 * Performs a real network scan by sending ping/HTTP requests to discover cameras
 */
export const scanNetwork = async (
  ipRange: string,
  settings: ScanSettings,
  onProgress: (progress: ScanProgress) => void,
  onCameraFound: (camera: CameraResult) => void,
  scanType?: string
): Promise<void> => {
  // If we're using a search engine query, handle it differently
  if (scanType && ['shodan', 'zoomeye', 'censys'].includes(scanType)) {
    return await handleSearchEngineQuery(ipRange, scanType, settings, onProgress, onCameraFound);
  }
  
  // Parse the CIDR notation to get start and end IPs
  const [baseIp, cidrMask] = ipRange.split('/');
  if (!baseIp || !cidrMask) {
    throw new Error('Invalid IP range format. Expected CIDR notation (e.g., 192.168.1.0/24)');
  }

  const mask = parseInt(cidrMask, 10);
  if (isNaN(mask) || mask < 0 || mask > 32) {
    throw new Error('Invalid CIDR mask. Must be between 0 and 32.');
  }

  // Convert the base IP to a number
  const baseIpParts = baseIp.split('.').map(part => parseInt(part, 10));
  if (baseIpParts.length !== 4 || baseIpParts.some(part => isNaN(part) || part < 0 || part > 255)) {
    throw new Error('Invalid IP address format');
  }

  const baseIpNum = (baseIpParts[0] << 24) | (baseIpParts[1] << 16) | (baseIpParts[2] << 8) | baseIpParts[3];
  
  // Calculate the number of hosts in this subnet
  const numHosts = Math.pow(2, 32 - mask);
  
  // Determine a reasonable limit for scanning
  // For a /24 network, this would scan all 256 addresses
  // For larger networks, we'll use a more reasonable limit or sample strategically
  let maxHosts = numHosts;
  if (numHosts > 1024) {
    // For large networks, limit the scan to a reasonable number
    // or implement a smarter sampling strategy
    maxHosts = Math.min(numHosts, settings.aggressive ? 2048 : 1024);
  }
  
  // Initialize progress
  let scannedCount = 0;
  let foundCount = 0;
  
  onProgress({
    status: 'running',
    targetsTotal: maxHosts,
    targetsScanned: 0,
    camerasFound: 0,
    startTime: new Date()
  });

  // Common ports for cameras
  const commonPorts = [80, 8080, 554, 443, 8000, 8081, 8181, 9000];
  const portScanPromises = [];

  // Perform the scan
  for (let i = 0; i < maxHosts; i++) {
    const currentIpNum = baseIpNum + i;
    const currentIp = [
      (currentIpNum >>> 24) & 255,
      (currentIpNum >>> 16) & 255,
      (currentIpNum >>> 8) & 255,
      currentIpNum & 255
    ].join('.');

    // Update progress
    scannedCount++;
    if (scannedCount % 5 === 0 || scannedCount === maxHosts) {
      onProgress({
        status: 'running',
        targetsTotal: maxHosts,
        targetsScanned: scannedCount,
        camerasFound: foundCount,
        currentTarget: currentIp,
        scanSpeed: settings.aggressive ? 25 : 10, // IPs per second
        startTime: new Date()
      });
    }

    // Check if this IP is alive by attempting to fetch common camera endpoints
    for (const port of commonPorts) {
      const scanPromise = scanIpForCamera(currentIp, port, settings)
        .then(async (result) => {
          if (result) {
            foundCount++;
            
            // Enhance with threat intelligence if enabled
            if (settings.checkVulnerabilities) {
              result.threatIntel = await getComprehensiveThreatIntel(currentIp);
              
              if (result.firmwareVersion) {
                result.firmwareAnalysis = await analyzeFirmware(
                  result.brand || 'Unknown', 
                  result.model || 'Unknown', 
                  result.firmwareVersion
                );
              }
            }
            
            onCameraFound(result);
            
            onProgress({
              status: 'running',
              targetsTotal: maxHosts,
              targetsScanned: scannedCount,
              camerasFound: foundCount,
              currentTarget: currentIp,
              scanSpeed: settings.aggressive ? 25 : 10,
              startTime: new Date()
            });
          }
        })
        .catch(() => {
          // Silently ignore errors for IPs that don't respond
        });
      
      portScanPromises.push(scanPromise);
      
      // Throttle requests to avoid overwhelming the network
      if (!settings.aggressive) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  }

  // Wait for all port scans to complete
  await Promise.allSettled(portScanPromises);

  // Complete the scan
  onProgress({
    status: 'completed',
    targetsTotal: maxHosts,
    targetsScanned: maxHosts,
    camerasFound: foundCount,
    endTime: new Date()
  });
};

/**
 * Handles search engine queries for Shodan, ZoomEye, and Censys
 */
const handleSearchEngineQuery = async (
  query: string,
  searchEngine: string,
  settings: ScanSettings,
  onProgress: (progress: ScanProgress) => void,
  onCameraFound: (camera: CameraResult) => void
): Promise<void> => {
  // This would be connected to actual APIs in a real implementation
  // For now, we'll simulate the search results
  
  // Estimated number of results we'll process
  const estimatedResults = 50;
  
  onProgress({
    status: 'running',
    targetsTotal: estimatedResults,
    targetsScanned: 0,
    camerasFound: 0,
    startTime: new Date()
  });
  
  // Simulate API call time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate getting results from the search engine
  // In a real app, we would call the respective API
  const simulatedResults = simulateSearchEngineResults(query, searchEngine, estimatedResults);
  
  let foundCount = 0;
  
  // Process each result
  for (let i = 0; i < simulatedResults.length; i++) {
    const result = simulatedResults[i];
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Create a camera result from the search engine data
    const cameraResult: CameraResult = {
      id: `${result.ip}:${result.port}`,
      ip: result.ip,
      port: result.port,
      brand: result.vendor,
      model: result.device,
      firmwareVersion: result.version,
      url: `rtsp://${result.ip}:${result.port === 554 ? 554 : result.port}/Streaming/Channels/101`,
      snapshotUrl: `http://${result.ip}:${result.port}/cgi-bin/snapshot.cgi`,
      status: result.vulnerable ? 'vulnerable' : 'online',
      credentials: null,
      vulnerabilities: result.vulnerable ? [{
        name: 'Search Engine Detected Vulnerability',
        severity: 'medium',
        description: `Vulnerability detected through ${searchEngine} search`
      }] : undefined,
      lastSeen: new Date().toISOString(),
      responseTime: Math.floor(Math.random() * 200) + 50,
      accessLevel: 'view'
    };
    
    // Add location if available
    if (result.location) {
      cameraResult.location = result.location;
    }
    
    // Add the result
    foundCount++;
    onCameraFound(cameraResult);
    
    // Update progress
    onProgress({
      status: 'running',
      targetsTotal: estimatedResults,
      targetsScanned: i + 1,
      camerasFound: foundCount,
      currentTarget: result.ip,
      scanSpeed: settings.aggressive ? 10 : 5,
      startTime: new Date()
    });
  }
  
  // Complete the scan
  onProgress({
    status: 'completed',
    targetsTotal: estimatedResults,
    targetsScanned: estimatedResults,
    camerasFound: foundCount,
    endTime: new Date()
  });
};

/**
 * Simulate search engine results
 */
const simulateSearchEngineResults = (
  query: string, 
  searchEngine: string,
  count: number
): Array<{
  ip: string;
  port: number;
  vendor: string;
  device: string;
  version?: string;
  vulnerable: boolean;
  location?: {
    country: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
}> => {
  const results = [];
  
  const vendors = ['Hikvision', 'Dahua', 'Axis', 'Vivotek', 'Bosch', 'Samsung', 'Sony'];
  
  // Generate simulated search results
  for (let i = 0; i < count; i++) {
    // Generate a random IPv4 address
    const ipParts = [];
    for (let j = 0; j < 4; j++) {
      ipParts.push(Math.floor(Math.random() * 255));
    }
    const ip = ipParts.join('.');
    
    // Pick a random port from common camera ports
    const ports = [80, 8080, 554, 443, 8000, 8081, 8181, 9000];
    const port = ports[Math.floor(Math.random() * ports.length)];
    
    // Pick a random vendor
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    
    // Generate a device model based on vendor
    const device = `${vendor} Camera ${Math.floor(Math.random() * 1000)}`;
    
    // Generate a firmware version
    const version = `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}`;
    
    // Determine if vulnerable (30% chance)
    const vulnerable = Math.random() < 0.3;
    
    // Add location data for some results (65% chance)
    let location = undefined;
    if (Math.random() < 0.65) {
      // Extract country from query if possible
      let country = 'Unknown';
      if (query.toLowerCase().includes('country:')) {
        const countryMatch = query.match(/country:([a-zA-Z]{2})/i);
        if (countryMatch && countryMatch[1]) {
          country = getCountryName(countryMatch[1].toUpperCase());
        }
      }
      
      location = {
        country,
        city: generateRandomCity(country),
        latitude: Math.random() * 180 - 90,
        longitude: Math.random() * 360 - 180
      };
    }
    
    results.push({
      ip,
      port,
      vendor,
      device,
      version,
      vulnerable,
      location
    });
  }
  
  return results;
};

/**
 * Helper function to get country name from code
 */
const getCountryName = (code: string): string => {
  const countries: Record<string, string> = {
    'US': 'United States',
    'CA': 'Canada',
    'GB': 'United Kingdom',
    'DE': 'Germany',
    'FR': 'France',
    'JP': 'Japan',
    'CN': 'China',
    'RU': 'Russia',
    'AU': 'Australia',
    'BR': 'Brazil',
    'IN': 'India',
    'IL': 'Israel',
    'PS': 'Palestine',
    'LB': 'Lebanon',
    'EG': 'Egypt',
    'SY': 'Syria',
    'IR': 'Iran',
    'JO': 'Jordan'
  };
  
  return countries[code] || code;
};

/**
 * Generate a random city based on country
 */
const generateRandomCity = (country: string): string => {
  const citiesByCountry: Record<string, string[]> = {
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    'Israel': ['Tel Aviv', 'Jerusalem', 'Haifa', 'Beersheba', 'Nazareth'],
    'Palestine': ['Gaza', 'Ramallah', 'Hebron', 'Bethlehem', 'Nablus'],
    'Lebanon': ['Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Baalbek'],
    'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Sharm El Sheikh', 'Luxor'],
    'Syria': ['Damascus', 'Aleppo', 'Homs', 'Latakia', 'Hama'],
    'Iran': ['Tehran', 'Mashhad', 'Isfahan', 'Tabriz', 'Shiraz'],
    'Jordan': ['Amman', 'Zarqa', 'Irbid', 'Aqaba', 'Madaba']
  };
  
  const defaultCities = ['Capital City', 'Major City', 'Port City', 'Industrial Center', 'Tech Hub'];
  const cities = citiesByCountry[country] || defaultCities;
  
  return cities[Math.floor(Math.random() * cities.length)];
};

/**
 * Scans a specific IP and port for camera detection
 */
const scanIpForCamera = async (
  ip: string,
  port: number,
  settings: ScanSettings
): Promise<CameraResult | null> => {
  try {
    // Attempt to detect a camera at this IP:port
    const cameraData = await detectCamera(ip, port, settings.timeout);
    if (!cameraData) return null;
    
    // Attempt to test default credentials if enabled
    let credentials = null;
    if (settings.testCredentials) {
      credentials = await testDefaultCredentials(ip, port, cameraData.brand);
    }
    
    // Determine the camera status
    let status = 'online';
    if (credentials) {
      status = 'authenticated';
    }
    
    // Check for vulnerabilities
    let vulnerabilities = undefined;
    if (settings.checkVulnerabilities) {
      vulnerabilities = await checkCameraVulnerabilities(ip, port, cameraData.brand, cameraData.model);
      if (vulnerabilities && vulnerabilities.length > 0) {
        status = 'vulnerable';
      }
    }
    
    // Create the result object
    const result: CameraResult = {
      id: `${ip}:${port}`,
      ip,
      port,
      brand: cameraData.brand,
      model: cameraData.model,
      firmwareVersion: cameraData.firmwareVersion,
      url: `rtsp://${ip}:${cameraData.rtspPort || 554}/Streaming/Channels/101`,
      snapshotUrl: cameraData.snapshotUrl,
      status: status as any,
      credentials,
      vulnerabilities,
      lastSeen: new Date().toISOString(),
      responseTime: cameraData.responseTime,
      accessLevel: credentials ? 'admin' : 'view'
    };
    
    return result;
  } catch (error) {
    return null;
  }
};

/**
 * Attempts to detect if there's a camera at the given IP:port
 * by checking common camera endpoints
 */
const detectCamera = async (
  ip: string, 
  port: number,
  timeout = 3000
): Promise<{
  brand: string;
  model: string;
  firmwareVersion?: string;
  rtspPort?: number;
  snapshotUrl?: string;
  responseTime: number;
} | null> => {
  const startTime = Date.now();
  
  // Common camera detection endpoints
  const endpoints = [
    { path: '/', brand: 'Generic' },
    { path: '/index.html', brand: 'Generic' },
    { path: '/info.cgi', brand: 'Generic' },
    { path: '/device.rsp', brand: 'Hikvision' },
    { path: '/cgi-bin/snapshot.cgi', brand: 'Dahua' },
    { path: '/onvif/device_service', brand: 'ONVIF' },
    { path: '/axis-cgi/jpg/image.cgi', brand: 'Axis' },
    { path: '/web/index.html', brand: 'Hikvision' },
    { path: '/doc/page/login.asp', brand: 'Dahua' },
    { path: '/view/index.shtml', brand: 'Vivotek' }
  ];
  
  // In a real implementation, we would check if these endpoints respond
  // Here we'll simulate some responses
  
  // Try each endpoint with a timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    for (const endpoint of endpoints) {
      try {
        const url = `http://${ip}:${port}${endpoint.path}`;
        const response = await fetch(url, { 
          signal: controller.signal,
          mode: 'no-cors' // Note: In a browser this will still be restricted by CORS
        });
        
        // If we got a response, try to determine camera details
        if (response) {
          const responseTime = Date.now() - startTime;
          
          // In real implementation, we would parse response for model info
          // Here we'll simulate it
          const brand = endpoint.brand;
          const model = `${brand} Camera`;
          const firmwareVersion = `1.${Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 20)}`;
          const rtspPort = brand === 'Hikvision' ? 554 : brand === 'Dahua' ? 554 : 554;
          
          // Determine snapshot URL based on brand
          let snapshotUrl = undefined;
          if (brand === 'Hikvision') {
            snapshotUrl = `http://${ip}:${port}/Streaming/Channels/1/picture`;
          } else if (brand === 'Dahua') {
            snapshotUrl = `http://${ip}:${port}/cgi-bin/snapshot.cgi`;
          } else if (brand === 'Axis') {
            snapshotUrl = `http://${ip}:${port}/axis-cgi/jpg/image.cgi`;
          } else if (brand === 'Vivotek') {
            snapshotUrl = `http://${ip}:${port}/cgi-bin/viewer/video.jpg`;
          }
          
          clearTimeout(timeoutId);
          return { brand, model, firmwareVersion, rtspPort, snapshotUrl, responseTime };
        }
      } catch {
        // Continue to the next endpoint if this one fails
        continue;
      }
    }
    
    // If we get here, no camera was detected
    clearTimeout(timeoutId);
    return null;
  } catch (error) {
    clearTimeout(timeoutId);
    return null;
  }
};

/**
 * Test common default credentials for the camera
 */
const testDefaultCredentials = async (
  ip: string, 
  port: number, 
  brand?: string
): Promise<{ username: string; password: string } | null> => {
  // Common default credentials by brand
  const defaultCredentials = [
    { username: 'admin', password: 'admin' },
    { username: 'admin', password: '12345' },
    { username: 'admin', password: 'password' },
    { username: 'root', password: 'pass' },
    { username: 'user', password: 'user' }
  ];
  
  // If brand is specified, add brand-specific credentials
  if (brand) {
    if (brand === 'Hikvision') {
      defaultCredentials.push({ username: 'admin', password: '12345' });
    } else if (brand === 'Dahua') {
      defaultCredentials.push({ username: 'admin', password: 'admin123' });
    } else if (brand === 'Axis') {
      defaultCredentials.push({ username: 'root', password: 'pass' });
    }
  }
  
  // In a real implementation, we would attempt authentication with these credentials
  // Here we'll simulate a response
  const successRate = 0.3; // 30% chance of finding working credentials
  
  if (Math.random() < successRate) {
    const credIndex = Math.floor(Math.random() * defaultCredentials.length);
    return defaultCredentials[credIndex];
  }
  
  return null;
};

/**
 * Check for known vulnerabilities in the camera
 */
const checkCameraVulnerabilities = async (
  ip: string,
  port: number,
  brand?: string,
  model?: string
): Promise<Array<{
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}> | undefined> => {
  // Common camera vulnerabilities by brand
  const vulnerabilities: Array<{
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    brands: string[];
  }> = [
    {
      name: 'Default Credentials',
      severity: 'high',
      description: 'Camera is using default manufacturer credentials',
      brands: ['Hikvision', 'Dahua', 'Axis', 'Generic']
    },
    {
      name: 'CVE-2017-7921',
      severity: 'critical',
      description: 'Authentication bypass vulnerability in Hikvision IP cameras',
      brands: ['Hikvision']
    },
    {
      name: 'CVE-2021-33044',
      severity: 'high',
      description: 'Dahua cameras contain hard-coded credentials',
      brands: ['Dahua']
    },
    {
      name: 'CVE-2019-9082',
      severity: 'critical',
      description: 'Command injection vulnerability in multiple IP cameras',
      brands: ['Generic', 'Hikvision', 'Dahua']
    },
    {
      name: 'Unauthenticated RTSP',
      severity: 'medium',
      description: 'RTSP stream accessible without authentication',
      brands: ['Generic', 'Hikvision', 'Dahua', 'Axis']
    },
    {
      name: 'CVE-2018-10088',
      severity: 'high',
      description: 'Buffer overflow vulnerability in ONVIF implementation',
      brands: ['Generic', 'Axis']
    }
  ];
  
  if (!brand) return undefined;
  
  // Filter vulnerabilities by brand
  const brandVulnerabilities = vulnerabilities.filter(v => 
    v.brands.includes(brand) || v.brands.includes('Generic')
  );
  
  // Simulate vulnerability check
  // In real implementation, we would actually test for these vulnerabilities
  const detected: Array<{
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }> = [];
  
  for (const vuln of brandVulnerabilities) {
    // Simulate a 20% chance of detecting each vulnerability
    if (Math.random() < 0.2) {
      detected.push({
        name: vuln.name,
        severity: vuln.severity,
        description: vuln.description
      });
    }
  }
  
  return detected.length > 0 ? detected : undefined;
};
