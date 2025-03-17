
import { CameraResult } from '@/types/scanner';

// This function will handle opening an RTSP stream
export const openRtspStream = (camera: CameraResult): string => {
  // Return a properly formatted URL for our viewer
  const rtspUrl = camera.url || `rtsp://${camera.ip}:${camera.port || 554}/Streaming/Channels/101`;
  
  // Construct a URL to our viewer page with the camera info
  const viewerUrl = `/viewer?url=${encodeURIComponent(rtspUrl)}&name=${encodeURIComponent(camera.brand || '')} ${encodeURIComponent(camera.model || '')}`;
  
  // Open the viewer in a new window or tab
  window.open(viewerUrl, '_blank');
  
  return rtspUrl;
};

// Expose regions data for the UI
export const REGIONS = [
  { code: 'us', name: 'United States' },
  { code: 'eu', name: 'Europe' },
  { code: 'asia', name: 'Asia' },
  { code: 'sa', name: 'South America' },
  { code: 'af', name: 'Africa' },
  { code: 'ru', name: 'Russia' },
  { code: 'ua', name: 'Ukraine' },
  { code: 'cn', name: 'China' },
  { code: 'pl', name: 'Poland' },
  { code: 'ro', name: 'Romania' },
  { code: 'ge', name: 'Georgia' }
];

// Real IP ranges by country
export const COUNTRY_IP_RANGES: Record<string, Array<{label: string, value: string}>> = {
  us: [
    { label: 'US East Coast', value: '23.10.0.0/16' },
    { label: 'US West Coast', value: '40.12.0.0/16' },
    { label: 'US Government', value: '161.203.0.0/16' }
  ],
  ru: [
    { label: 'Moscow Region', value: '95.174.0.0/16' },
    { label: 'St. Petersburg', value: '178.176.0.0/16' },
    { label: 'Russian Federation ISPs', value: '5.18.0.0/16' },
    { label: 'Rostelecom', value: '213.87.0.0/16' },
    { label: 'Moscow Government', value: '87.245.0.0/16' },
    { label: 'Ural Region', value: '91.210.0.0/16' }
  ],
  cn: [
    { label: 'Beijing', value: '180.149.0.0/16' },
    { label: 'Shanghai', value: '116.224.0.0/16' }
  ],
  ua: [
    { label: 'Kiev', value: '176.38.0.0/16' },
    { label: 'Lviv', value: '77.121.0.0/16' },
    { label: 'Odessa', value: '195.138.0.0/16' },
    { label: 'Kharkiv', value: '46.98.0.0/16' },
    { label: 'Kyiv ISPs', value: '91.207.0.0/16' },
    { label: 'Ukrainian Government', value: '194.44.0.0/16' },
    { label: 'Dnipro', value: '193.151.0.0/16' },
    { label: 'Eastern Ukraine', value: '46.211.0.0/16' }
  ],
  pl: [
    { label: 'Warsaw', value: '5.184.0.0/16' },
    { label: 'Krakow', value: '5.173.0.0/16' },
    { label: 'Government Networks', value: '149.156.0.0/16' }
  ],
  ro: [
    { label: 'Bucharest', value: '79.112.0.0/16' },
    { label: 'Cluj', value: '188.26.0.0/16' },
    { label: 'Timisoara', value: '109.163.0.0/16' },
    { label: 'Government Infrastructure', value: '193.226.0.0/16' },
    { label: 'Telecom Romania', value: '81.196.0.0/16' },
    { label: 'Academic Networks', value: '141.85.0.0/16' }
  ],
  ge: [
    { label: 'Tbilisi', value: '31.146.0.0/16' },
    { label: 'Batumi', value: '85.114.0.0/16' },
    { label: 'Government', value: '91.151.0.0/16' }
  ]
};

// Real Shodan queries by country
export const COUNTRY_SHODAN_QUERIES: Record<string, Array<{label: string, value: string}>> = {
  us: [
    { label: 'US Public Cameras', value: 'webcamxp country:US port:80,8080' },
    { label: 'US Hikvision', value: 'product:hikvision country:US' }
  ],
  ru: [
    { label: 'Russian Cameras', value: 'webcam country:RU' },
    { label: 'Moscow CCTV', value: 'webcamxp city:Moscow' },
    { label: 'Russian Traffic Cams', value: 'product:axis country:RU has_screenshot:true' }
  ],
  cn: [
    { label: 'China IP Cameras', value: 'has_screenshot:true product:hikvision country:CN' },
    { label: 'Beijing Cameras', value: 'webcam city:Beijing has_screenshot:true' }
  ],
  ua: [
    { label: 'Ukraine Public Cameras', value: 'country:UA has_screenshot:true webcam' },
    { label: 'Kiev Traffic Cams', value: 'city:Kiev country:UA port:80,8080 webcam' },
    { label: 'Ukraine Border Cams', value: 'country:UA product:dahua has_screenshot:true' },
    { label: 'Odessa Harbor Cams', value: 'city:Odessa country:UA port:554 has_screenshot:true' }
  ],
  pl: [
    { label: 'Poland Traffic Cams', value: 'country:PL webcam has_screenshot:true' },
    { label: 'Warsaw Public Areas', value: 'city:Warsaw country:PL port:80,8080,554 product:hikvision' },
    { label: 'Polish Border Surveillance', value: 'country:PL product:dahua has_screenshot:true' }
  ],
  ro: [
    { label: 'Romania Public Cameras', value: 'country:RO has_screenshot:true webcam' },
    { label: 'Bucharest CCTV', value: 'city:Bucharest country:RO product:hikvision' },
    { label: 'Romanian Highway Cams', value: 'country:RO port:554 product:axis has_screenshot:true' }
  ],
  ge: [
    { label: 'Georgia Public Cameras', value: 'country:GE has_screenshot:true webcam' },
    { label: 'Tbilisi Street Cams', value: 'city:Tbilisi country:GE product:hikvision' },
    { label: 'Georgia Border Surveillance', value: 'country:GE port:554 has_screenshot:true' }
  ]
};
