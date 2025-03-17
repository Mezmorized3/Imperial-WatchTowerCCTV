
/**
 * Utility functions for RTSP stream handling
 */

/**
 * Get the proper stream URL for a camera
 * This handles different camera types and their RTSP URL formats
 */
export const getProperStreamUrl = (
  camera: { 
    brand?: string; 
    model?: string; 
    ip: string; 
    credentials?: { username: string; password: string } | null;
  }
): string => {
  const { brand, ip, credentials } = camera;
  const username = credentials?.username || '';
  const password = credentials?.password || '';
  const authPart = credentials ? `${username}:${password}@` : '';
  
  // Handle different camera brands and their RTSP URL formats
  if (brand?.toLowerCase().includes('hikvision')) {
    return `rtsp://${authPart}${ip}:554/Streaming/Channels/101`;
  } else if (brand?.toLowerCase().includes('dahua')) {
    return `rtsp://${authPart}${ip}:554/cam/realmonitor?channel=1&subtype=0`;
  } else if (brand?.toLowerCase().includes('axis')) {
    return `rtsp://${authPart}${ip}:554/axis-media/media.amp`;
  } else if (brand?.toLowerCase().includes('vivotek')) {
    return `rtsp://${authPart}${ip}:554/live.sdp`;
  } else if (brand?.toLowerCase().includes('foscam')) {
    return `rtsp://${authPart}${ip}:554/videoMain`;
  } else if (brand?.toLowerCase().includes('amcrest')) {
    return `rtsp://${authPart}${ip}:554/cam/realmonitor?channel=1&subtype=0`;
  } else {
    // Generic RTSP URL for unknown cameras - we'll try the most common path
    return `rtsp://${authPart}${ip}:554/Streaming/Channels/101`;
  }
};

/**
 * Converts RTSP URL to a properly formatted proxy URL that the browser can display
 */
export const convertRtspToHls = (rtspUrl: string): string => {
  // Due to browser limitations, we need to proxy the RTSP stream through an HLS server
  const proxyServerUrl = process.env.RTSP_PROXY_SERVER || 'http://localhost:8083';
  
  // Format: http://rtsp-proxy-server/stream?url=rtsp://camera-ip
  return `${proxyServerUrl}/stream?url=${encodeURIComponent(rtspUrl)}`;
};

/**
 * Test if an RTSP URL is accessible
 * This will try to connect to the RTSP stream through our proxy to verify it's working
 */
export const testRtspConnection = async (rtspUrl: string): Promise<boolean> => {
  try {
    const proxyUrl = convertRtspToHls(rtspUrl);
    
    // Attempt to connect to the proxy URL
    const response = await fetch(proxyUrl, { 
      method: 'HEAD',
      timeout: 5000
    } as RequestInit);
    
    return response.ok;
  } catch (error) {
    console.error('Error testing RTSP connection:', error);
    return false;
  }
};
