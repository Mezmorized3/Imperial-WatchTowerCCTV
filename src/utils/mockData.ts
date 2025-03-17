import { CameraResult, ScanSettings } from '@/types/scanner';

// Let's update the startMockScan function to match our implementation
export const startMockScan = (
  onProgress: (progressPercentage: number, camerasFound: number, currentTarget?: string, scanSpeed?: number) => void,
  onComplete: (results: CameraResult[]) => void,
  onError: (message: string) => void,
  options?: Partial<ScanSettings & {
    deepScan?: boolean;
    portScan?: boolean;
    vulnerabilityScan?: boolean;
    retryCount?: number;
  }>
) => {
  // Implement mockData functionality here
  // For now, we'll leave this as a stub that simulates a scan
  
  let isCancelled = false;
  let progress = 0;
  let camerasFound = 0;
  const simulationSpeed = options?.aggressive ? 5 : 2; // Faster for aggressive mode
  
  const interval = setInterval(() => {
    if (isCancelled) {
      clearInterval(interval);
      return;
    }
    
    // Simulate progress and finding cameras
    progress += Math.random() * simulationSpeed;
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Complete the scan
      onComplete(MOCK_CAMERA_RESULTS);
    } else {
      // Randomly find cameras during the scan
      if (Math.random() > 0.9) {
        camerasFound++;
      }
      
      // Generate a current target IP (simulated)
      const currentIP = `192.168.1.${Math.floor(Math.random() * 255)}`;
      
      // Calculate scan speed (IPs per second)
      const scanSpeed = options?.aggressive ? 150 + Math.floor(Math.random() * 100) : 
                        80 + Math.floor(Math.random() * 70);
      
      onProgress(progress, camerasFound, currentIP, scanSpeed);
    }
  }, 200);
  
  // Return a function to stop the scan
  return () => {
    isCancelled = true;
    clearInterval(interval);
  };
};

// Add the mock camera results
export const MOCK_CAMERA_RESULTS: CameraResult[] = [
  // Include sample camera results here
  {
    id: '1',
    ip: '192.168.1.100',
    port: 554,
    brand: 'Hikvision',
    model: 'DS-2CD2142FWD-I',
    url: 'rtsp://admin:admin@192.168.1.100:554/Streaming/Channels/101',
    snapshotUrl: 'http://192.168.1.100:80/Streaming/Channels/1/picture',
    status: 'vulnerable',
    credentials: {
      username: 'admin',
      password: 'admin'
    },
    vulnerabilities: [
      {
        name: 'Default Credentials',
        severity: 'high',
        description: 'Camera is using default manufacturer credentials'
      },
      {
        name: 'CVE-2017-7921',
        severity: 'critical',
        description: 'Authentication bypass vulnerability in Hikvision IP cameras'
      }
    ],
    location: {
      country: 'United States',
      city: 'New York',
      latitude: 40.7128,
      longitude: -74.0060
    },
    lastSeen: new Date().toISOString(),
    accessLevel: 'admin',
    responseTime: 120
  },
  // Add more mock camera results as needed
];

// Add mock regions data
export const REGIONS = [
  { code: 'us', name: 'United States' },
  { code: 'eu', name: 'Europe' },
  { code: 'asia', name: 'Asia' },
  { code: 'sa', name: 'South America' },
  { code: 'af', name: 'Africa' },
  { code: 'ru', name: 'Russia' },
  { code: 'ua', name: 'Ukraine' },
  { code: 'cn', name: 'China' }
];

// Mock IP ranges by country
export const COUNTRY_IP_RANGES: Record<string, Array<{label: string, value: string}>> = {
  us: [
    { label: 'US East Coast', value: '23.10.0.0/16' },
    { label: 'US West Coast', value: '40.12.0.0/16' },
    { label: 'US Government', value: '161.203.0.0/16' }
  ],
  ru: [
    { label: 'Moscow Region', value: '95.174.0.0/16' },
    { label: 'St. Petersburg', value: '178.176.0.0/16' }
  ],
  cn: [
    { label: 'Beijing', value: '180.149.0.0/16' },
    { label: 'Shanghai', value: '116.224.0.0/16' }
  ],
  ua: [
    { label: 'Kiev', value: '176.38.0.0/16' },
    { label: 'Lviv', value: '77.121.0.0/16' }
  ]
};

// Mock Shodan queries by country
export const COUNTRY_SHODAN_QUERIES: Record<string, Array<{label: string, value: string}>> = {
  us: [
    { label: 'US Public Cameras', value: 'webcamxp country:US port:80,8080' },
    { label: 'US Hikvision', value: 'product:hikvision country:US' }
  ],
  ru: [
    { label: 'Russian Cameras', value: 'webcam country:RU' },
    { label: 'Moscow CCTV', value: 'webcamxp city:Moscow' }
  ],
  cn: [
    { label: 'China IP Cameras', value: 'has_screenshot:true product:hikvision country:CN' },
    { label: 'Beijing Cameras', value: 'webcam city:Beijing has_screenshot:true' }
  ],
  ua: [
    { label: 'Ukraine Public Cameras', value: 'country:UA has_screenshot:true webcam' },
    { label: 'Kiev Traffic Cams', value: 'city:Kiev country:UA port:80,8080 webcam' }
  ]
};
