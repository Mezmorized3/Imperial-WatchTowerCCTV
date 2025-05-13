import { CameraResult } from '@/types/scanner';

// This function will handle opening an RTSP stream
export const openRtspStream = (camera: CameraResult): string => {
  // Return a properly formatted URL for our viewer
  const rtspUrl = camera.url || `rtsp://${camera.ip}:${camera.port || 554}/Streaming/Channels/101`;
  
  // Construct a URL to our viewer page with the camera info
  const viewerUrl = `/viewer?url=${encodeURIComponent(rtspUrl)}&name=${encodeURIComponent(camera.manufacturer || '')} ${encodeURIComponent(camera.model || '')}`;
  
  // Open the viewer in a new window or tab
  window.open(viewerUrl, '_blank');
  
  return rtspUrl;
};

// Add DETAILED_COUNTRY_IP_RANGES for FileCentipede component
export const DETAILED_COUNTRY_IP_RANGES = {
  "US": [
    { range: "3.0.0.0/8", ASN: "AS16509", organization: "Amazon AWS", count: "16,777,216" },
    { range: "8.0.0.0/8", ASN: "AS3356", organization: "Level 3", count: "16,777,216" },
    { range: "11.0.0.0/8", ASN: "AS721", organization: "DoD", count: "16,777,216" }
  ],
  "RU": [
    { range: "5.0.0.0/16", ASN: "AS12389", organization: "Rostelecom", count: "65,536" },
    { range: "31.13.0.0/16", ASN: "AS47241", organization: "VKONTAKTE", count: "65,536" },
    { range: "77.75.0.0/17", ASN: "AS13238", organization: "YANDEX", count: "32,768" }
  ],
  "CN": [
    { range: "1.0.0.0/8", ASN: "AS4134", organization: "China Telecom", count: "16,777,216" },
    { range: "14.0.0.0/8", ASN: "AS4134", organization: "China Telecom", count: "16,777,216" },
    { range: "27.0.0.0/8", ASN: "AS4134", organization: "China Telecom", count: "16,777,216" }
  ],
  "UK": [
    { range: "2.24.0.0/13", ASN: "AS2856", organization: "British Telecom", count: "524,288" },
    { range: "5.64.0.0/12", ASN: "AS5607", organization: "Sky Broadband", count: "1,048,576" },
    { range: "78.144.0.0/13", ASN: "AS5089", organization: "Virgin Media", count: "524,288" }
  ],
  "UA": [
    { range: "31.128.0.0/11", ASN: "AS15895", organization: "Kyivstar", count: "2,097,152" },
    { range: "77.88.0.0/18", ASN: "AS25229", organization: "Volia", count: "16,384" },
    { range: "91.194.168.0/21", ASN: "AS3326", organization: "Datagroup", count: "2,048" }
  ]
};

// Other mock data as needed
