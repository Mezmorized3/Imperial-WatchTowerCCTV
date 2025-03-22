// Utility functions for RTSP stream handling
import { simulateNetworkDelay } from './networkUtils';
import { ToolResult } from './osintToolTypes';
import { ffmpegConvertRtspToHls, ffmpegRecordStream } from './ffmpeg/ffmpegService';

/**
 * Validate RTSP URL format
 */
export const validateRtspUrl = (url: string): boolean => {
  const rtspRegex = new RegExp('^rtsp://([a-zA-Z0-9.-]+(:\\d+)?)(/[a-zA-Z0-9/.-]+)?$');
  return rtspRegex.test(url);
};

/**
 * Extract credentials from RTSP URL
 */
export const extractCredentials = (rtspUrl: string): { username?: string; password?: string; url: string } => {
  try {
    const url = new URL(rtspUrl);
    const username = url.username;
    const password = url.password;
    url.username = '';
    url.password = '';
    return {
      username: username || undefined,
      password: password || undefined,
      url: url.toString()
    };
  } catch (error) {
    console.error('Error extracting credentials from RTSP URL:', error);
    return { url: rtspUrl };
  }
};

/**
 * Test RTSP stream connectivity
 */
export const testRtspStreamConnectivity = async (rtspUrl: string): Promise<boolean> => {
  // Simulate network delay
  await simulateNetworkDelay(1000);
  
  // Simulate RTSP stream connectivity check
  const isReachable = Math.random() > 0.1; // Simulate 90% success rate
  return isReachable;
};

/**
 * Analyze RTSP stream
 */
export const analyzeRtspStream = async (rtspUrl: string): Promise<any> => {
  // Simulate network delay
  await simulateNetworkDelay(2000);
  
  // Simulate RTSP stream analysis
  const streamInfo = {
    resolution: '1920x1080',
    codec: 'H.264',
    audio: 'AAC',
    framerate: 30
  };
  return streamInfo;
};

/**
 * Convert RTSP stream to HLS
 */
export const convertRtspStreamToHls = async (rtspUrl: string): Promise<ToolResult> => {
  try {
    // Simulate network delay
    await simulateNetworkDelay(1500);
    
    // Simulate RTSP to HLS conversion
    const hlsUrl = 'http://example.com/hls/stream.m3u8';
    return {
      success: true,
      data: {
        hlsUrl: hlsUrl
      },
      simulatedData: true
    };
  } catch (error) {
    console.error('Error converting RTSP to HLS:', error);
    return {
      success: false,
      data: {
        error: error instanceof Error ? error.message : 'Unknown error converting RTSP to HLS'
      },
      simulatedData: true
    };
  }
};

/**
 * Record RTSP stream
 */
export const recordRtspStream = async (rtspUrl: string, duration: number): Promise<ToolResult> => {
  try {
    // Simulate network delay
    await simulateNetworkDelay(1500);
    
    // Simulate RTSP stream recording
    const recordingPath = '/path/to/recording.mp4';
    return {
      success: true,
      data: {
        recordingPath: recordingPath
      },
      simulatedData: true
    };
  } catch (error) {
    console.error('Error recording RTSP stream:', error);
    return {
      success: false,
      data: {
        error: error instanceof Error ? error.message : 'Unknown error recording RTSP stream'
      },
      simulatedData: true
    };
  }
};

/**
 * Generate test RTSP stream URL
 */
export const generateTestRtspStreamUrl = (): string => {
  const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  return `rtsp://${ip}:554/live`;
};

/**
 * Fetch stream metadata
 */
export const fetchStreamMetadata = async (streamUrl: string): Promise<any> => {
  console.log(`Fetching stream metadata for: ${streamUrl}`);
  
  // Simulate delay for API call
  await simulateNetworkDelay(1500);
  
  // This would be replaced with actual API call in production
  // Integration point for real stream metadata lookup from external APIs
  try {
    return {
      title: 'Example Stream',
      description: 'A test stream for demonstration purposes',
      contentType: 'video/mp4',
      resolution: '1280x720',
      frameRate: 30,
      audioCodec: 'AAC',
      videoCodec: 'H.264'
    };
  } catch (error) {
    console.error(`Error fetching stream metadata: ${error}`);
    throw error;
  }
};

/**
 * Convert RTSP to HLS using FFmpeg
 */
export const convertRtspToHlsFFmpeg = async (rtspUrl: string, outputPath: string = 'output/stream.m3u8'): Promise<ToolResult> => {
  try {
    return await ffmpegConvertRtspToHls(rtspUrl, outputPath);
  } catch (error) {
    console.error('Error converting RTSP to HLS with FFmpeg:', error);
    return {
      success: false,
      data: {
        error: error instanceof Error ? error.message : 'Unknown error converting RTSP to HLS with FFmpeg'
      },
      simulatedData: true
    };
  }
};

/**
 * Record stream using FFmpeg
 */
export const recordStreamFFmpeg = async (streamUrl: string, outputPath: string = 'output/recording.mp4', duration: number = 60): Promise<ToolResult> => {
  try {
    return await ffmpegRecordStream(streamUrl, outputPath, duration.toString());
  } catch (error) {
    console.error('Error recording stream with FFmpeg:', error);
    return {
      success: false,
      data: {
        error: error instanceof Error ? error.message : 'Unknown error recording stream with FFmpeg'
      },
      simulatedData: true
    };
  }
};

/**
 * Convert RTSP to HLS
 */
export const convertRtspToHls = async (rtspUrl: string): Promise<string> => {
  try {
    const result = await convertRtspStreamToHls(rtspUrl);
    if (result.success && result.data.hlsUrl) {
      return result.data.hlsUrl;
    }
    throw new Error('Failed to convert RTSP to HLS');
  } catch (error) {
    console.error('Error in convertRtspToHls:', error);
    throw error;
  }
};

/**
 * Get proper stream URL
 */
export const getProperStreamUrl = (camera: any): string => {
  if (typeof camera === 'string') return camera;
  
  // If camera object has an rtspUrl property, use it
  if (camera.rtspUrl) return camera.rtspUrl;
  
  // Otherwise build a URL based on available properties
  let url = 'rtsp://';
  
  // Add credentials if available
  if (camera.credentials) {
    if (camera.credentials.username) {
      url += camera.credentials.username;
      if (camera.credentials.password) {
        url += `:${camera.credentials.password}`;
      }
      url += '@';
    }
  }
  
  // Add IP and port
  url += camera.ip;
  if (camera.port && camera.port !== 554) {
    url += `:${camera.port}`;
  }
  
  // Add path based on brand or use a default path
  if (camera.brand) {
    const brand = camera.brand.toLowerCase();
    if (brand.includes('hikvision')) {
      url += '/Streaming/Channels/101';
    } else if (brand.includes('dahua')) {
      url += '/cam/realmonitor?channel=1&subtype=0';
    } else if (brand.includes('axis')) {
      url += '/axis-media/media.amp';
    } else {
      url += '/stream1';
    }
  } else {
    url += '/stream';
  }
  
  return url;
};

/**
 * Start recording
 */
export const startRecording = async (streamId: string): Promise<boolean> => {
  try {
    console.log(`Starting recording for stream: ${streamId}`);
    await simulateNetworkDelay(1000);
    return true;
  } catch (error) {
    console.error('Error starting recording:', error);
    return false;
  }
};

/**
 * Stop recording
 */
export const stopRecording = async (streamId: string): Promise<boolean> => {
  try {
    console.log(`Stopping recording for stream: ${streamId}`);
    await simulateNetworkDelay(1000);
    return true;
  } catch (error) {
    console.error('Error stopping recording:', error);
    return false;
  }
};

/**
 * Test RTSP connection
 */
export const testRtspConnection = async (rtspUrl: string): Promise<boolean> => {
  return testRtspStreamConnectivity(rtspUrl);
};

/**
 * Detect motion
 */
export const detectMotion = async (
  streamUrl: string, 
  options: { 
    sensitivity?: number; 
    threshold?: number; 
    region?: { x: number; y: number; width: number; height: number }
  }
): Promise<{
  motionDetected: boolean;
  confidence?: number;
  objects?: string[];
}> => {
  await simulateNetworkDelay(1000);
  
  // Simulate motion detection with random results
  const motionDetected = Math.random() > 0.5;
  const confidence = Math.random();
  
  // Simulate object detection
  let objects: string[] = [];
  if (motionDetected) {
    const possibleObjects = ['person', 'car', 'bicycle', 'truck', 'motorcycle', 'dog', 'cat'];
    const numObjects = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numObjects; i++) {
      const randomIndex = Math.floor(Math.random() * possibleObjects.length);
      objects.push(possibleObjects[randomIndex]);
    }
  }
  
  return {
    motionDetected,
    confidence,
    objects: objects.length > 0 ? objects : undefined
  };
};
