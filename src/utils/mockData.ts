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
export const REGIONS = [];

// Empty country IP ranges
export const DETAILED_COUNTRY_IP_RANGES = {
  ge: [],
  ro: [],
  ua: [],
  ru: []
};

// Empty country IP ranges
export const COUNTRY_IP_RANGES: Record<string, Array<{label: string, value: string}>> = {
  us: [],
  ru: [],
  cn: [],
  ua: [],
  pl: [],
  ro: [],
  ge: [],
  il: [],
  ps: [],
  lb: [],
  eg: [],
  sy: [],
  ir: [],
  jo: []
};

// Empty Shodan queries by country
export const COUNTRY_SHODAN_QUERIES: Record<string, Array<{label: string, value: string}>> = {
  us: [],
  ru: [],
  cn: [],
  ua: [],
  pl: [],
  ro: [],
  ge: [],
  il: [],
  ps: [],
  lb: [],
  eg: [],
  sy: [],
  ir: [],
  jo: []
};

// Empty ZoomEye queries by country
export const COUNTRY_ZOOMEYE_QUERIES: Record<string, Array<{label: string, value: string}>> = {
  us: [],
  ru: [],
  cn: [],
  ua: [],
  pl: [],
  ro: [],
  ge: [],
  il: [],
  ps: [],
  lb: [],
  eg: [],
  sy: [],
  ir: [],
  jo: []
};

// Empty Censys queries by country
export const COUNTRY_CENSYS_QUERIES: Record<string, Array<{label: string, value: string}>> = {
  us: [],
  ru: [],
  cn: [],
  ua: [],
  pl: [],
  ro: [],
  ge: [],
  il: [],
  ps: [],
  lb: [],
  eg: [],
  sy: [],
  ir: [],
  jo: []
};
