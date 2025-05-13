
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
    { range: "3.0.0.0/8", ASN: "AS16509", organization: "Amazon AWS", count: "16,777,216", description: "Amazon AWS datacenter range", assignDate: "1994-05-01" },
    { range: "8.0.0.0/8", ASN: "AS3356", organization: "Level 3", count: "16,777,216", description: "Level 3 Communications", assignDate: "1992-12-01" },
    { range: "11.0.0.0/8", ASN: "AS721", organization: "DoD", count: "16,777,216", description: "US Department of Defense", assignDate: "1991-05-01" }
  ],
  "RU": [
    { range: "5.0.0.0/16", ASN: "AS12389", organization: "Rostelecom", count: "65,536", description: "Russian state provider", assignDate: "2010-11-03" },
    { range: "31.13.0.0/16", ASN: "AS47241", organization: "VKONTAKTE", count: "65,536", description: "VK social network", assignDate: "2009-08-12" },
    { range: "77.75.0.0/17", ASN: "AS13238", organization: "YANDEX", count: "32,768", description: "Yandex search engine", assignDate: "2006-04-18" }
  ],
  "CN": [
    { range: "1.0.0.0/8", ASN: "AS4134", organization: "China Telecom", count: "16,777,216", description: "China Telecom backbone", assignDate: "2000-03-15" },
    { range: "14.0.0.0/8", ASN: "AS4134", organization: "China Telecom", count: "16,777,216", description: "China Telecom consumer ISP", assignDate: "2001-06-28" },
    { range: "27.0.0.0/8", ASN: "AS4134", organization: "China Telecom", count: "16,777,216", description: "China Telecom business segment", assignDate: "2002-09-10" }
  ],
  "UK": [
    { range: "2.24.0.0/13", ASN: "AS2856", organization: "British Telecom", count: "524,288", description: "BT consumer broadband", assignDate: "2004-07-22" },
    { range: "5.64.0.0/12", ASN: "AS5607", organization: "Sky Broadband", count: "1,048,576", description: "Sky UK residential", assignDate: "2007-02-14" },
    { range: "78.144.0.0/13", ASN: "AS5089", organization: "Virgin Media", count: "524,288", description: "Virgin Media cable users", assignDate: "2005-11-09" }
  ],
  "UA": [
    { range: "31.128.0.0/11", ASN: "AS15895", organization: "Kyivstar", count: "2,097,152", description: "Kyivstar mobile/broadband", assignDate: "2010-05-17" },
    { range: "77.88.0.0/18", ASN: "AS25229", organization: "Volia", count: "16,384", description: "Volia cable provider", assignDate: "2008-03-25" },
    { range: "91.194.168.0/21", ASN: "AS3326", organization: "Datagroup", count: "2,048", description: "Datagroup business ISP", assignDate: "2011-08-30" }
  ]
};

// Other mock data as needed
