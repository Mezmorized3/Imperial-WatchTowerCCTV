
import { nanoid } from 'nanoid';
import { ScanSettings, CameraResult, ScanResult } from '@/utils/osintToolTypes';

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

/**
 * Simulates a network scan for CCTV cameras
 */
export const scanNetwork = async (settings: ScanSettings): Promise<ScanResult> => {
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
          vulnerabilities: generateVulnerabilities(randomType)
        };
        
        // Add additional data for detailed scans
        if (settings.detailed) {
          // Add threat intelligence data
          camera.threatIntelligence = getThreatIntelligence(camera.ip);
          
          // Add firmware analysis
          camera.firmware = analyzeFirmware(camera.manufacturer);
        }
        
        cameras.push(camera);
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
