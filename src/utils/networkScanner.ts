import { nanoid } from 'nanoid';
import { CameraResult } from '@/utils/osintToolTypes';
import { ScanProgress, ScanSettings as AppScanSettings } from '@/types/scanner';

// Use the ScanSettings from types/scanner and extend it to ensure compatibility
export interface ScanSettings extends Omit<AppScanSettings, 'regionFilter'> {
  detailed?: boolean;
  aggressive: boolean; // Make sure this is required
  targetSubnet?: string;
  portRange?: string;
  timeout: number;
  testCredentials: boolean;
  checkVulnerabilities: boolean;
  saveSnapshots: boolean;
  regionFilter?: string | string[]; // Support both string and string[] to match both types
  threadsCount: number;
}

// Local functions to fix build errors
const generateVulnerabilities = (cameraType: string) => {
  const severityLevels: ("high" | "medium" | "critical" | "low")[] = ["high", "medium", "critical", "low"];
  
  return [
    {
      name: `Default credentials for ${cameraType}`,
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
      description: "Camera uses factory default username and password"
    },
    {
      name: "Outdated firmware",
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
      description: "Camera firmware has known security vulnerabilities"
    },
    {
      name: "Unencrypted RTSP stream",
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
      description: "Video stream is transmitted without encryption"
    }
  ];
};

const analyzeFirmware = (cameraModel: string) => {
  return {
    version: `1.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 100)}`,
    releaseDate: "2022-06-15",
    vulnerabilities: Math.random() > 0.5 ? "Multiple CVEs detected" : "No known vulnerabilities",
    updateAvailable: Math.random() > 0.6,
    integrityStatus: Math.random() > 0.8 ? "Verified" : "Unknown"
  };
};

const getThreatIntelligence = (ipAddress: string) => {
  return {
    knownMalicious: Math.random() > 0.9,
    reportCount: Math.floor(Math.random() * 5),
    lastReportDate: "2022-10-21",
    associatedThreats: ["Botnet", "Unauthorized Access"].filter(() => Math.random() > 0.7),
    riskScore: Math.floor(Math.random() * 100)
  };
};

// Add missing proxy utility functions
export const testProxyConnection = async (proxyConfig: any): Promise<{
  success: boolean;
  latency?: number;
  details?: string;
  error?: string;
}> => {
  console.log("Testing proxy connection:", proxyConfig);
  await new Promise(resolve => setTimeout(resolve, 1000));
  const success = Math.random() > 0.2; // Simulate 80% success rate
  
  return {
    success,
    latency: success ? Math.floor(Math.random() * 200) + 50 : undefined,
    details: success ? `Connected via ${proxyConfig.type.toUpperCase()} proxy` : undefined,
    error: !success ? "Connection timed out" : undefined
  };
};

export const rotateProxy = async (proxyList: string[], currentProxy?: string): Promise<string> => {
  console.log("Rotating proxy, current:", currentProxy);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!proxyList || proxyList.length === 0) {
    return '';
  }
  
  let index = 0;
  if (currentProxy) {
    const currentIndex = proxyList.indexOf(currentProxy);
    index = (currentIndex >= 0) ? (currentIndex + 1) % proxyList.length : 0;
  } else {
    index = Math.floor(Math.random() * proxyList.length);
  }
  
  return proxyList[index];
};

// Declare ScanResult interface
export interface ScanResult {
  success: boolean;
  data: {
    cameras: CameraResult[];
    total: number;
  };
}

/**
 * Simulates a network scan for CCTV cameras
 */
export const scanNetwork = async (
  targetSubnet: string,
  settings: ScanSettings,
  onProgress?: (progress: ScanProgress) => void,
  onCameraFound?: (camera: CameraResult) => void,
  scanType?: string,
  abortSignal?: AbortSignal,
  proxyConfig?: any
): Promise<ScanResult> => {
  console.log("Starting network scan with settings:", settings);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate finding between 1-20 cameras
      const cameraCount = Math.max(1, Math.floor(Math.random() * 20));
      const cameras: CameraResult[] = [];
      
      // Generate random camera results
      for (let i = 0; i < cameraCount; i++) {
        // Create base IP from the target subnet or use a random one
        const ip = settings.targetSubnet 
          ? `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
          : `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        
        // Generate random camera type
        const cameraTypes = ["Hikvision", "Dahua", "Axis", "Foscam", "Amcrest", "Reolink", "Ubiquiti", "Bosch"];
        const randomType = cameraTypes[Math.floor(Math.random() * cameraTypes.length)];
        
        // Generate a camera entry
        const camera: CameraResult = {
          id: nanoid(),
          ip: ip,
          manufacturer: randomType,
          model: `${randomType}-${Math.floor(Math.random() * 9000) + 1000}`,
          port: Math.floor(Math.random() * 1000) + 7000,
          status: Math.random() > 0.2 ? "online" : "offline",
          type: ["IP Camera", "PTZ Camera", "Dome Camera", "Bullet Camera"][Math.floor(Math.random() * 4)],
          protocol: ["RTSP", "HTTP", "ONVIF"][Math.floor(Math.random() * 3)],
          rtspUrl: `rtsp://${ip}:${8000 + Math.floor(Math.random() * 1000)}/live`,
          credentials: Math.random() > 0.5 ? {
            username: ["admin", "root", "user"][Math.floor(Math.random() * 3)],
            password: ["admin", "password", "123456"][Math.floor(Math.random() * 3)]
          } : null,
          geolocation: {
            country: ["United States", "United Kingdom", "Germany", "Japan", "Australia"][Math.floor(Math.random() * 5)],
            city: ["New York", "London", "Berlin", "Tokyo", "Sydney"][Math.floor(Math.random() * 5)],
            coordinates: [
              (Math.random() * 180) - 90,
              (Math.random() * 360) - 180
            ]
          },
          accessible: Math.random() > 0.3,
          vulnerabilities: generateVulnerabilities(randomType),
          // Add properties to fix type errors
          lastSeen: new Date(),
          accessLevel: Math.random() > 0.5 ? 'admin' : 'guest'
        };
        
        // Add additional data for detailed scans
        if (settings.detailed) {
          // Add threat intelligence data
          camera.threatIntelligence = getThreatIntelligence(camera.ip);
          
          // Add firmware analysis
          camera.firmware = analyzeFirmware(camera.manufacturer!);
        }
        
        cameras.push(camera);
        
        // Call onCameraFound callback if provided
        if (onCameraFound) {
          onCameraFound(camera);
        }
      }
      
      // Update progress if callback provided
      if (onProgress) {
        onProgress({
          status: 'completed',
          targetsTotal: 100,
          targetsScanned: 100,
          camerasFound: cameras.length,
          startTime: new Date(),
          endTime: new Date()
        });
      }
      
      // Return the scan results
      resolve({
        success: true,
        data: {
          cameras,
          total: cameras.length
        }
      });
    }, 2000 + Math.random() * 3000); // Simulate scan taking 2-5 seconds
  });
};
