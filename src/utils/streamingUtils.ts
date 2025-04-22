
/**
 * Utility functions for handling RTSP and WebRTC streams
 */

import { StreamedianParams, JSMpegParams, LiveStreamParams } from './types/streamingToolTypes';

/**
 * Format an RTSP URL with credentials if provided
 */
export const formatRtspUrl = (url: string, username?: string, password?: string): string => {
  if (!username || !password) {
    return url;
  }
  
  // Check if URL already has credentials
  if (url.includes('@')) {
    // URL already has credentials, return as is
    return url;
  }
  
  // Add credentials to URL
  const urlObj = new URL(url);
  urlObj.username = username;
  urlObj.password = password;
  
  return urlObj.toString();
};

/**
 * Check if a stream is accessible
 */
export const checkStreamAvailability = async (streamUrl: string): Promise<boolean> => {
  // In a real implementation, this would make a backend call to check if
  // the stream is accessible. For now, we'll simulate this.
  console.log('Checking stream availability:', streamUrl);
  
  // Simulate network check
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return true for demo URLs
      if (
        streamUrl.includes('demo') || 
        streamUrl.includes('example') || 
        streamUrl.includes('test')
      ) {
        resolve(true);
      } else {
        // For real applications, this would check if the stream is accessible
        // using a server-side proxy that can attempt to connect to the stream
        resolve(Math.random() > 0.3); // 70% chance of success for demo purposes
      }
    }, 1000);
  });
};

/**
 * Convert RTSP URL to WebSocket URL for JSMpeg
 * Note: This requires a server-side proxy to convert RTSP to WebSocket
 */
export const rtspToWebsocket = (rtspUrl: string, proxyUrl = 'wss://stream-proxy.example.com'): string => {
  // In a real implementation, this would encode the RTSP URL and create a
  // proper WebSocket URL for a proxy service
  const encodedRtsp = encodeURIComponent(rtspUrl);
  return `${proxyUrl}?url=${encodedRtsp}`;
};

/**
 * Generate optimal streaming parameters based on network conditions
 */
export const generateOptimalStreamParams = (
  bandwidth: number = 1000, // kbps
  latencyRequired: boolean = false
): { 
  transport: 'tcp' | 'udp',
  resolution: string,
  fps: number
} => {
  let transport: 'tcp' | 'udp' = 'tcp';
  let resolution = '640x480';
  let fps = 15;
  
  // Determine optimal parameters based on bandwidth
  if (bandwidth > 5000) {
    // High bandwidth
    resolution = '1920x1080';
    fps = 30;
    transport = latencyRequired ? 'udp' : 'tcp';
  } else if (bandwidth > 2000) {
    // Medium bandwidth
    resolution = '1280x720';
    fps = 25;
    transport = latencyRequired ? 'udp' : 'tcp';
  } else if (bandwidth > 1000) {
    // Low-medium bandwidth
    resolution = '854x480';
    fps = 20;
    transport = 'tcp'; // For reliability
  } else {
    // Low bandwidth
    resolution = '640x360';
    fps = 15;
    transport = 'tcp'; // For reliability
  }
  
  return { transport, resolution, fps };
};

/**
 * Get common demo RTSP stream URLs
 */
export const getDemoStreamUrls = (): { label: string, url: string }[] => {
  return [
    {
      label: 'IPVM Demo PTZ',
      url: 'rtsp://demo:demo@ipvmdemo.dyndns.org:5541/onvif-media/media.amp?profile=profile_1_h264&sessiontimeout=60&streamtype=unicast'
    },
    {
      label: 'Highway Camera',
      url: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mp4'
    },
    {
      label: 'Test Pattern',
      url: 'rtsp://demo:demo@demo.dyndns.org:5541/test'
    }
  ];
};

/**
 * Create an optimal player configuration
 */
export const createOptimalPlayerConfig = (params: LiveStreamParams): {
  playerType: 'streamedian' | 'jsmpeg' | 'webrtc' | 'hls';
  url: string;
  config: any;
} => {
  const { streamUrl, streamType, playerType, transport = 'tcp' } = params;
  
  // Determine best player based on stream type and browser support
  let optimalPlayer: 'streamedian' | 'jsmpeg' | 'webrtc' | 'hls' = 
    playerType === 'auto' ? 'streamedian' : playerType as 'streamedian' | 'jsmpeg' | 'webrtc' | 'hls';
  
  // If playerType is 'auto', select based on stream type
  if (playerType === 'auto') {
    if (streamType === 'rtsp') {
      optimalPlayer = 'streamedian';
    } else if (streamType === 'websocket') {
      optimalPlayer = 'jsmpeg';
    } else if (streamType === 'webrtc') {
      optimalPlayer = 'webrtc';
    } else {
      optimalPlayer = 'hls';
    }
  }
  
  let url = streamUrl;
  let config: any = {
    autoplay: params.autoplay !== false,
    muted: params.muted !== false
  };
  
  // Configure based on selected player
  if (optimalPlayer === 'streamedian') {
    config = {
      ...config,
      rtspUrl: streamUrl,
      transport: transport
    };
  } else if (optimalPlayer === 'jsmpeg') {
    // For JSMpeg, we need a WebSocket URL
    url = streamType === 'websocket' ? streamUrl : rtspToWebsocket(streamUrl);
    config = {
      ...config,
      wsUrl: url
    };
  } else if (optimalPlayer === 'webrtc') {
    config = {
      ...config,
      rtspUrl: streamUrl
    };
  }
  
  return {
    playerType: optimalPlayer,
    url,
    config
  };
};
