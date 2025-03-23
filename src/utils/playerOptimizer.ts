
/**
 * Player Optimizer
 * 
 * Utilities for optimizing video player performance and compatibility
 */

/**
 * Detect best player engine based on browser and stream type
 */
export const detectOptimalPlayerEngine = (
  streamUrl: string,
  options: {
    preferMobile?: boolean;
    lowBandwidth?: boolean;
    preferNative?: boolean;
  } = {}
): 'native' | 'hlsjs' | 'videojs' | 'go2rtc' => {
  const { preferMobile, lowBandwidth, preferNative } = options;
  
  // Check if URL is HLS format
  const isHls = streamUrl.includes('.m3u8');
  
  // Check if URL is RTSP format
  const isRtsp = streamUrl.startsWith('rtsp://');
  
  // Check for mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // Check for Safari browser (which has good native HLS support)
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  // Check for low-end device
  const isLowEndDevice = navigator.hardwareConcurrency 
    ? navigator.hardwareConcurrency <= 2 
    : false;
  
  // Get user preference from localStorage
  const userPreference = localStorage.getItem('preferredStreamEngine') as any;
  if (userPreference) {
    return userPreference;
  }
  
  // Handle specific scenarios
  if (preferNative || (isSafari && isHls)) {
    return 'native'; // Safari has good native HLS support
  }
  
  if (isRtsp) {
    // RTSP needs conversion, check if go2rtc is available
    const go2rtcUrl = localStorage.getItem('go2rtcUrl');
    if (go2rtcUrl) {
      return 'go2rtc';
    }
    return 'videojs'; // Fallback to videojs for RTSP
  }
  
  if (preferMobile || isMobile) {
    return isLowEndDevice ? 'native' : 'hlsjs';
  }
  
  if (lowBandwidth || isLowEndDevice) {
    return 'native'; // Native player is often more efficient
  }
  
  // Default fallback based on stream type
  if (isHls) {
    return 'hlsjs';
  }
  
  return 'videojs'; // Most versatile option as default
};

/**
 * Analyze and fix common stream URL issues
 */
export const analyzeAndFixStreamUrl = (url: string): string => {
  let fixedUrl = url.trim();
  
  // Fix missing protocol
  if (!fixedUrl.startsWith('http') && !fixedUrl.startsWith('rtsp')) {
    if (fixedUrl.includes('.m3u8')) {
      fixedUrl = `https://${fixedUrl}`;
    } else {
      fixedUrl = `rtsp://${fixedUrl}`;
    }
  }
  
  // Fix common syntax issues with authentication
  if (fixedUrl.includes(':') && fixedUrl.includes('@')) {
    const parts = fixedUrl.split('@');
    if (parts.length === 2) {
      const authPart = parts[0];
      const urlPart = parts[1];
      
      // Check if protocol is in the auth part incorrectly
      if (authPart.includes('://') && authPart.split('://').length === 2) {
        const protocol = authPart.split('://')[0];
        const credentials = authPart.split('://')[1];
        fixedUrl = `${protocol}://${credentials}@${urlPart}`;
      }
    }
  }
  
  // Fix double slashes in path
  fixedUrl = fixedUrl.replace(/([^:])\/\//g, '$1/');
  
  return fixedUrl;
};

/**
 * Get stream access capabilities for a URL
 */
export const getStreamCapabilities = (url: string): {
  requiresAuth: boolean;
  supportsDirect: boolean;
  supportsHls: boolean;
  supportsProxy: boolean;
  recommendedEngine: 'native' | 'hlsjs' | 'videojs' | 'go2rtc';
} => {
  const lowerUrl = url.toLowerCase();
  const isHls = lowerUrl.includes('.m3u8');
  const isRtsp = lowerUrl.startsWith('rtsp://');
  const isDash = lowerUrl.includes('.mpd');
  const hasAuth = url.includes('@') || url.includes('username=') || url.includes('password=');
  
  return {
    requiresAuth: hasAuth,
    supportsDirect: isHls || lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm'),
    supportsHls: isHls || isRtsp,
    supportsProxy: true, // Imperial proxy can handle most streams
    recommendedEngine: detectOptimalPlayerEngine(url)
  };
};

/**
 * Optimize stream for network conditions
 */
export const optimizeForNetwork = (
  url: string, 
  bandwidth: number // In Kbps
): string => {
  // Add quality parameters for streams that support it
  if (url.includes('.m3u8') && bandwidth < 1000) {
    // For low bandwidth, try to force lower quality
    if (url.includes('?')) {
      return `${url}&maxrate=800000`;
    } else {
      return `${url}?maxrate=800000`;
    }
  }
  
  return url;
};
