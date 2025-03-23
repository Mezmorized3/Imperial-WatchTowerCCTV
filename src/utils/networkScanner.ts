import { ScanTarget, ScanSettings, CameraResult, ScanProgress } from '@/types/scanner';
import { simulateNetworkDelay } from './networkUtils';
import { getRandomGeoLocation } from './osintUtils';
import { ProxyConfig } from './osintToolTypes';

// Generate a random number of simulated camera results
const generateSimulatedResults = (
  ipRange: string,
  count: number = Math.floor(Math.random() * 5) + 1
): CameraResult[] => {
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

// Simulate a network scan with progress updates
export const scanNetwork = async (
  target: string,
  settings: ScanSettings,
  onProgress: (progress: ScanProgress) => void,
  onCameraFound: (camera: CameraResult) => void,
  scanType: string = 'ip',
  abortSignal?: AbortSignal,
  proxyConfig?: ProxyConfig
): Promise<void> => {
  // Check if scan has been aborted
  if (abortSignal?.aborted) {
    throw new Error('Scan was aborted');
  }

  console.log(`Starting scan of ${target} with type: ${scanType || 'ip/range'}`);
  
  // If we're using a search engine query, handle it differently
  if (scanType && ['shodan', 'zoomeye', 'censys'].includes(scanType)) {
    return await handleSearchEngineQuery(target, scanType, settings, onProgress, onCameraFound, abortSignal);
  }
  
  // Parse the CIDR notation to get start and end IPs
  const [baseIp, cidrMask] = target.split('/');
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

  // Simulate scanning - in a real implementation, we would make actual network requests
  const simulatedScanTime = settings.aggressive ? 30000 : 45000; // 30-45 seconds for a simulated scan
  const updatesPerSecond = 5;
  const updateInterval = 1000 / updatesPerSecond;
  const totalUpdates = Math.floor(simulatedScanTime / updateInterval);
  const hostsPerUpdate = Math.ceil(maxHosts / totalUpdates);
  
  console.log(`Simulation parameters: 
    - Total scan time: ${simulatedScanTime / 1000}s
    - Hosts to scan: ${maxHosts}
    - Updates per second: ${updatesPerSecond}
    - Hosts per update: ${hostsPerUpdate}
  `);
  
  const startScanSimulation = async () => {
    for (let i = 0; i < totalUpdates; i++) {
      // Check if scan has been aborted
      if (abortSignal?.aborted) {
        console.log("Scan was aborted during simulation");
        throw new Error('Scan was aborted');
      }
      
      // Simulate scanning a batch of IPs
      const hostsThisUpdate = Math.min(hostsPerUpdate, maxHosts - scannedCount);
      scannedCount += hostsThisUpdate;
      
      // Generate a current IP for display
      const currentIpNum = baseIpNum + scannedCount % maxHosts;
      const currentIp = [
        (currentIpNum >>> 24) & 255,
        (currentIpNum >>> 16) & 255,
        (currentIpNum >>> 8) & 255,
        currentIpNum & 255
      ].join('.');
      
      // Simulate finding cameras (1.5-3% chance per update, adjusted by size of update)
      const findProbability = settings.aggressive ? 0.03 : 0.015;
      const findThreshold = findProbability * hostsThisUpdate / 10;
      
      if (Math.random() < findThreshold) {
        // Simulate finding a camera
        const cameraResult = await simulateCameraFind(currentIp, settings, abortSignal);
        if (cameraResult && !abortSignal?.aborted) {
          foundCount++;
          onCameraFound(cameraResult);
        }
      }
      
      // Update progress
      onProgress({
        status: 'running',
        targetsTotal: maxHosts,
        targetsScanned: scannedCount,
        camerasFound: foundCount,
        currentTarget: currentIp,
        scanSpeed: settings.aggressive ? 25 : 10, // IPs per second
        startTime: new Date()
      });
      
      // Wait for next update
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, updateInterval);
        
        if (abortSignal) {
          abortSignal.addEventListener('abort', () => {
            clearTimeout(timeout);
            reject(new Error('Scan was aborted'));
          });
        }
      });
    }
    
    // Complete the scan
    if (!abortSignal?.aborted) {
      onProgress({
        status: 'completed',
        targetsTotal: maxHosts,
        targetsScanned: maxHosts,
        camerasFound: foundCount,
        endTime: new Date()
      });
    }
  };
  
  // Start the simulation
  try {
    await startScanSimulation();
  } catch (error) {
    if (error instanceof Error && error.message === 'Scan was aborted') {
      throw error;
    }
    console.error('Error during scan simulation:', error);
  }
};

/**
 * Simulates finding a camera at the given IP
 */
const simulateCameraFind = async (
  ip: string, 
  settings: ScanSettings,
  abortSignal?: AbortSignal
): Promise<CameraResult | null> => {
  if (abortSignal?.aborted) return null;
  
  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, 150));
  if (abortSignal?.aborted) return null;
  
  const port = [80, 8080, 554, 443, 8000, 8081, 8181, 9000][Math.floor(Math.random() * 8)];
  const brands = ['Hikvision', 'Dahua', 'Axis', 'Vivotek', 'Bosch', 'Samsung', 'Sony'];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const model = `${brand} ${Math.floor(Math.random() * 1000)}`;
  const firmwareVersion = `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`;
  
  let status: 'online' | 'vulnerable' | 'authenticated' = 'online';
  let credentials = null;
  let vulnerabilities = undefined;
  
  // Simulate credential testing if enabled
  if (settings.testCredentials && Math.random() < 0.3) {
    status = 'authenticated';
    credentials = {
      username: ['admin', 'root', 'user'][Math.floor(Math.random() * 3)],
      password: ['admin', 'password', '12345', 'pass'][Math.floor(Math.random() * 4)]
    };
  }
  
  // Simulate vulnerability checking if enabled
  if (settings.checkVulnerabilities && Math.random() < 0.4) {
    status = 'vulnerable';
    
    const vulnTypes = [
      { name: 'Default Credentials', severity: 'high' as const, description: 'Camera is using default manufacturer credentials' },
      { name: 'CVE-2017-7921', severity: 'critical' as const, description: 'Authentication bypass vulnerability in Hikvision IP cameras' },
      { name: 'CVE-2021-33044', severity: 'high' as const, description: 'Dahua cameras contain hard-coded credentials' },
      { name: 'Unauthenticated RTSP', severity: 'medium' as const, description: 'RTSP stream accessible without authentication' },
      { name: 'CVE-2018-10088', severity: 'high' as const, description: 'Buffer overflow vulnerability in ONVIF implementation' }
    ];
    
    const numVulns = Math.floor(Math.random() * 3) + 1;
    vulnerabilities = [];
    
    for (let i = 0; i < numVulns; i++) {
      const vulnIndex = Math.floor(Math.random() * vulnTypes.length);
      vulnerabilities.push(vulnTypes[vulnIndex]);
    }
  }
  
  // Create the camera result
  const result: CameraResult = {
    id: `${ip}:${port}`,
    ip,
    port,
    brand,
    model,
    firmwareVersion,
    url: `rtsp://${ip}:${port === 554 ? 554 : port}/Streaming/Channels/101`,
    snapshotUrl: `http://${ip}:${port}/cgi-bin/snapshot.cgi`,
    status,
    credentials,
    vulnerabilities,
    lastSeen: new Date().toISOString(),
    responseTime: Math.floor(Math.random() * 200) + 50,
    accessLevel: credentials ? 'admin' : 'view'
  };
  
  // Add threat intel if enabled
  if (settings.checkVulnerabilities) {
    result.threatIntel = await getComprehensiveThreatIntel(ip);
    
    if (result.firmwareVersion) {
      result.firmwareAnalysis = await analyzeFirmware(
        result.brand || 'Unknown', 
        result.model || 'Unknown', 
        result.firmwareVersion
      );
    }
  }
  
  return result;
};

/**
 * Handles search engine queries for Shodan, ZoomEye, and Censys
 */
const handleSearchEngineQuery = async (
  query: string,
  searchEngine: string,
  settings: ScanSettings,
  onProgress: (progress: ScanProgress) => void,
  onCameraFound: (camera: CameraResult) => void,
  abortSignal?: AbortSignal
): Promise<void> => {
  // Check if scan has been aborted
  if (abortSignal?.aborted) {
    throw new Error('Scan was aborted');
  }

  console.log(`Handling ${searchEngine} query: ${query}`);
  
  // This would be connected to actual APIs in a real implementation
  // For now, we'll simulate the search results
  
  // Estimated number of results we'll process
  const estimatedResults = Math.floor(Math.random() * 20) + 10; // 10-30 results
  
  onProgress({
    status: 'running',
    targetsTotal: estimatedResults,
    targetsScanned: 0,
    camerasFound: 0,
    startTime: new Date()
  });
  
  // Simulate API call time - search engines take time to respond
  const apiCallTime = Math.floor(Math.random() * 2000) + 2000; // 2-4 seconds
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, apiCallTime);
      
      if (abortSignal) {
        abortSignal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new Error('Scan was aborted'));
        });
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Scan was aborted') {
      throw error;
    }
  }
  
  // Check if scan has been aborted
  if (abortSignal?.aborted) {
    throw new Error('Scan was aborted');
  }
  
  // Simulate getting results from the search engine
  // In a real app, we would call the respective API
  const simulatedResults = simulateSearchEngineResults(query, searchEngine, estimatedResults);
  
  let foundCount = 0;
  
  // Process each result with realistic timing
  for (let i = 0; i < simulatedResults.length; i++) {
    // Check if scan has been aborted
    if (abortSignal?.aborted) {
      throw new Error('Scan was aborted');
    }
    
    const result = simulatedResults[i];
    
    // Simulate processing time - vary between 100-400ms per result
    const processingTime = Math.floor(Math.random() * 300) + 100;
    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, processingTime);
        
        if (abortSignal) {
          abortSignal.addEventListener('abort', () => {
            clearTimeout(timeout);
            reject(new Error('Scan was aborted'));
          });
        }
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Scan was aborted') {
        throw error;
      }
    }
    
    // Create a camera result from the search engine data
    const cameraResult: CameraResult = {
      id: `${searchEngine}-${result.ip}:${result.port}`,
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
        name: `${searchEngine.charAt(0).toUpperCase() + searchEngine.slice(1)} Detected Vulnerability`,
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
    
    // Add threat intel if enabled in settings
    if (settings.checkVulnerabilities) {
      cameraResult.threatIntel = await getComprehensiveThreatIntel(result.ip);
      
      if (cameraResult.firmwareVersion) {
        cameraResult.firmwareAnalysis = await analyzeFirmware(
          cameraResult.brand || 'Unknown',
          cameraResult.model || 'Unknown',
          cameraResult.firmwareVersion
        );
      }
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
  
  // Check if scan has been aborted
  if (abortSignal?.aborted) {
    throw new Error('Scan was aborted');
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
  settings: ScanSettings,
  abortSignal?: AbortSignal
): Promise<CameraResult | null> => {
  // Check if scan has been aborted
  if (abortSignal?.aborted) {
    throw new Error('Scan was aborted');
  }
  
  try {
    // Attempt to detect a camera at this IP:port
    const cameraData = await detectCamera(ip, port, settings.timeout, abortSignal);
    if (!cameraData) return null;
    
    // Check if scan has been aborted
    if (abortSignal?.aborted) {
      throw new Error('Scan was aborted');
    }
    
    // Attempt to test default credentials if enabled
    let credentials = null;
    if (settings.testCredentials) {
      credentials = await testDefaultCredentials(ip, port, cameraData.brand, abortSignal);
    }
    
    // Check if scan has been aborted
    if (abortSignal?.aborted) {
      throw new Error('Scan was aborted');
    }
    
    // Determine the camera status
    let status = 'online';
    if (credentials) {
      status = 'authenticated';
    }
    
    // Check for vulnerabilities
    let vulnerabilities = undefined;
    if (settings.checkVulnerabilities) {
      vulnerabilities = await checkCameraVulnerabilities(ip, port, cameraData.brand, cameraData.model, abortSignal);
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
    if (error instanceof Error && error.message === 'Scan was aborted') {
      throw error;
    }
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
  timeout = 3000,
  abortSignal?: AbortSignal
): Promise<{
  brand: string;
  model: string;
  firmwareVersion?: string;
  rtspPort?: number;
  snapshotUrl?: string;
  responseTime: number;
} | null> => {
  // Check if scan has been aborted
  if (abortSignal?.aborted) {
    throw new Error('Scan was aborted');
  }
  
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
  // Use the provided abortSignal if available
  const controller = new AbortController();
  
  // Create a timeout that will abort the controller
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  // Link the external abort signal to our controller
  let abortListener: ((event: Event) => void) | undefined;
  if (abortSignal) {
    abortListener = () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
    abortSignal.addEventListener('abort', abortListener);
  }
  
  try {
    for (const endpoint of endpoints) {
      // Check if scan has been aborted
      if (abortSignal?.aborted) {
        throw new Error('Scan was aborted');
      }
      
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
          if (abortSignal && abortListener) {
            abortSignal.removeEventListener('abort', abortListener);
          }
          return { brand, model, firmwareVersion, rtspPort, snapshotUrl, responseTime };
        }
      } catch (error) {
        // Check if this is an abort error
        if (error instanceof Error && error.name === 'AbortError') {
          if (abortSignal?.aborted) {
            // This is an external abort, not just a timeout
            throw new Error('Scan was aborted');
          }
          // Otherwise it's just a timeout for this endpoint, continue to the next
        }
        // Continue to the next endpoint if this one fails
        continue;
      }
    }
    
    // If we get here, no camera was detected
    clearTimeout(timeoutId);
    if (abortSignal && abortListener) {
      abortSignal.removeEventListener('abort', abortListener);
    }
    return null;
  } catch (error) {
    clearTimeout(timeoutId);
    if (abortSignal && abortListener) {
      abortSignal.removeEventListener('abort', abortListener);
    }
    
    if (error instanceof Error && error.message === 'Scan was aborted') {
      throw error;
    }
    
    return null;
  }
};

/**
 * Test common default credentials for the camera
 */
const testDefaultCredentials = async (
  ip: string, 
  port: number, 
  brand?: string,
  abortSignal?: AbortSignal
): Promise<{ username: string; password: string } | null> => {
  // Check if scan has been aborted
  if (abortSignal?.aborted) {
    throw new Error('Scan was aborted');
  }
  
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
  model?: string,
  abortSignal?: AbortSignal
): Promise<Array<{
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}> | undefined> => {
  // Check if scan has been aborted
  if (abortSignal?.aborted) {
    throw new Error('Scan was aborted');
  }
  
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
