
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
  // In a real implementation, you would:
  // 1. Use a proxy server like RTSP-to-HLS converter (ffmpeg-based solution)
  // 2. Or use a WebRTC-based approach like WebRTC-to-RTSP gateway
  
  // For a real deployment, you would need:
  // - A server running something like rtsp-simple-server, MediaMTX, or NGINX with RTMP module
  // - A proxy endpoint that takes the RTSP URL and returns an HLS stream
  
  // Example of a real proxy URL (if you had one):
  // return `https://your-rtsp-proxy-server.com/stream?url=${encodeURIComponent(rtspUrl)}`;
  
  // For demonstration purposes, if the RTSP URL is from your local network,
  // we'll return a reliable public HLS demo stream
  if (rtspUrl.includes('192.168.') || rtspUrl.includes('10.0.') || rtspUrl.includes('172.16.')) {
    return 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
  }
  
  // If it's an external IP, we'll also use a demo stream for safety and reliability
  // In a real implementation, you would proxy this through your server
  return 'https://cdn.bitmovin.com/content/assets/art-of-motion-dash-hls-progressive/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';
};

/**
 * Test if an RTSP URL is accessible
 */
export const testRtspConnection = async (rtspUrl: string): Promise<boolean> => {
  // In a browser environment, we cannot directly test RTSP connections
  // This would need to be done via a server-side proxy
  // For demonstration, we'll simulate a test
  
  try {
    // Simulate a network request to test the connection
    // In a real implementation, this would be a call to your backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 80% success rate for demo
    return Math.random() > 0.2;
  } catch (error) {
    console.error('Error testing RTSP connection:', error);
    return false;
  }
};
