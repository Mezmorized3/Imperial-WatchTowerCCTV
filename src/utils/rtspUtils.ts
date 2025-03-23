// Utility functions for RTSP stream handling
import { ToolResult } from './osintToolTypes';
import { ffmpegConvertRtspToHls, ffmpegRecordStream } from './ffmpeg/ffmpegService';
import { executeExternalTool } from './github/externalToolsConnector';
import { sanitizeStreamUrl, formatAuthHeaders } from './videoUtils';

/**
 * Validate RTSP URL format
 */
export const validateRtspUrl = (url: string): boolean => {
  const rtspRegex = new RegExp('^rtsp://([a-zA-Z0-9._~:/?#\\[\\]@!$&\'()*+,;=%-]*)$');
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
    // Create a clean URL without credentials
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
 * Handle special URL characters and encoding for HLS URLs
 */
export const normalizeStreamUrl = (url: string): string => {
  try {
    // Remove any XML-unsafe characters that might cause issues
    let normalizedUrl = url.trim();
    
    // If the URL is already encoded (contains %xx sequences), decode it first to prevent double-encoding
    if (normalizedUrl.includes('%')) {
      try {
        normalizedUrl = decodeURIComponent(normalizedUrl);
      } catch (e) {
        console.warn('URL decoding failed, using original URL', e);
      }
    }
    
    // Handle URLs with authentication in them
    if (normalizedUrl.includes('@')) {
      console.log('URL contains authentication credentials');
      try {
        // Try to parse and preserve the authentication
        const urlObj = new URL(normalizedUrl);
        if (urlObj.username || urlObj.password) {
          console.log('Stream URL contains credentials, ensuring they are preserved');
        }
      } catch (err) {
        console.warn('URL parsing failed for auth handling', err);
      }
    }
    
    // Special handling for URLs with explicit credentials like user:pass@host
    if (normalizedUrl.includes(':') && normalizedUrl.includes('@')) {
      // Be careful not to modify the URL format
      console.log('Handling URL with explicit credentials');
    }
    
    return normalizedUrl;
  } catch (error) {
    console.error('Error normalizing stream URL:', error);
    return url; // Return original URL if normalization fails
  }
};

/**
 * Test RTSP stream connectivity
 */
export const testRtspStreamConnectivity = async (rtspUrl: string): Promise<boolean> => {
  try {
    // Use ffprobe to check RTSP stream connectivity
    const result = await executeExternalTool('ffprobe', [
      '-v', 'error',
      '-show_entries', 'stream=codec_type',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      '-select_streams', 'v:0',
      '-timeout', '5',
      rtspUrl
    ]);
    
    return result.success;
  } catch (error) {
    console.error('Error testing RTSP connectivity:', error);
    return false;
  }
};

/**
 * Analyze RTSP stream
 */
export const analyzeRtspStream = async (rtspUrl: string): Promise<any> => {
  try {
    // Use ffprobe to analyze RTSP stream
    const result = await executeExternalTool('ffprobe', [
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_format',
      '-show_streams',
      '-timeout', '5',
      rtspUrl
    ]);
    
    if (result.success && result.output) {
      try {
        const data = JSON.parse(result.output);
        const videoStream = data.streams?.find((s: any) => s.codec_type === 'video');
        
        if (videoStream) {
          return {
            resolution: `${videoStream.width}x${videoStream.height}`,
            codec: videoStream.codec_name,
            audio: data.streams?.find((s: any) => s.codec_type === 'audio')?.codec_name || 'none',
            framerate: eval(videoStream.r_frame_rate) // Evaluates "30/1" to 30
          };
        }
      } catch (parseError) {
        console.error('Error parsing ffprobe output:', parseError);
      }
    }
    
    throw new Error('Failed to analyze RTSP stream');
  } catch (error) {
    console.error('Error analyzing RTSP stream:', error);
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
      simulatedData: false
    };
  }
};

/**
 * Record stream using FFmpeg
 */
export const recordStreamFFmpeg = async (streamUrl: string, outputPath: string = 'output/recording.mp4', duration: number | string = 60): Promise<ToolResult> => {
  try {
    // Ensure duration is a string
    const durationStr = typeof duration === 'number' ? duration.toString() : duration;
    return await ffmpegRecordStream(streamUrl, outputPath, durationStr);
  } catch (error) {
    console.error('Error recording stream with FFmpeg:', error);
    return {
      success: false,
      data: {
        error: error instanceof Error ? error.message : 'Unknown error recording stream with FFmpeg'
      },
      simulatedData: false
    };
  }
};

/**
 * Convert RTSP to HLS
 */
export const convertRtspToHls = async (rtspUrl: string): Promise<string> => {
  try {
    // Try to normalize the URL to handle special characters
    const normalizedUrl = normalizeStreamUrl(rtspUrl);
    console.log(`Converting stream: ${normalizedUrl}`);
    
    // Apply additional sanitization for special characters and auth
    const sanitizedUrl = sanitizeStreamUrl(normalizedUrl);
    console.log(`Sanitized URL: ${sanitizedUrl}`);
    
    // Check if go2rtc is enabled and configured
    const go2rtcUrl = localStorage.getItem('go2rtcUrl');
    const useGo2rtc = !!go2rtcUrl && localStorage.getItem('preferredStreamEngine') === 'go2rtc';
    
    if (useGo2rtc) {
      // Use go2rtc for the conversion
      return `${go2rtcUrl}/api/stream?src=${encodeURIComponent(sanitizedUrl)}`;
    }
    
    // Check if Imperial proxy is enabled
    const useImperialProxy = localStorage.getItem('rtspProxyEnabled') !== 'false';
    const imperialProxyUrl = localStorage.getItem('rtspProxyUrl');
    
    if (useImperialProxy && imperialProxyUrl) {
      // Use Imperial proxy for better performance
      const streamId = btoa(sanitizedUrl).replace(/[/+=]/g, '').substring(0, 12);
      return `${imperialProxyUrl}/stream/${streamId}/index.m3u8`;
    }
    
    // For HLS streams, just return the URL directly - no conversion needed
    if (sanitizedUrl.includes('.m3u8')) {
      console.log(`Direct HLS stream detected: ${sanitizedUrl}`);
      return sanitizedUrl;
    }
    
    // For non-RTSP, non-HLS streams that can be played directly
    if (!sanitizedUrl.startsWith('rtsp://') && 
        (sanitizedUrl.endsWith('.mp4') || 
         sanitizedUrl.endsWith('.webm') || 
         sanitizedUrl.includes('mjpeg'))) {
      console.log(`Direct video stream detected: ${sanitizedUrl}`);
      return sanitizedUrl;
    }
    
    // For RTSP streams, generate a unique output path
    const outputDir = `output/streams/${Date.now()}`;
    const outputPath = `${outputDir}/stream.m3u8`;
    
    const result = await ffmpegConvertRtspToHls(sanitizedUrl, outputPath);
    
    if (result.success) {
      // In a real-world scenario, you'd return a URL to access this stream
      // This could be served by the HLS server from the output directory
      return `/streams/${outputPath.split('/').pop()}`;
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
  if (camera.url) return camera.url;
  
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
    
    // Check if Imperial integration is enabled
    const useImperial = localStorage.getItem('imperialIntegration') !== 'false';
    
    if (useImperial) {
      // Use Imperial chest for storage
      const result = await fetch('/api/imperial/recording/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ streamId, duration: 3600 })
      });
      
      const data = await result.json();
      return data.success;
    } else {
      // Local fallback recording logic
      const streamUrl = `rtsp://example.com/streams/${streamId}`;
      const outputPath = `recordings/${streamId}_${Date.now()}.mp4`;
      
      // Start recording for 3600 seconds (1 hour)
      // This would typically be managed by a background process
      const result = await recordStreamFFmpeg(streamUrl, outputPath, 3600);
      
      return result.success;
    }
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
    
    // Check if Imperial integration is enabled
    const useImperial = localStorage.getItem('imperialIntegration') !== 'false';
    
    if (useImperial) {
      // Use Imperial chest for storage
      const result = await fetch('/api/imperial/recording/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recordingId: streamId })
      });
      
      const data = await result.json();
      return data.success;
    }
    
    // For example, send a signal to the recording process to stop
    // This could involve sending a request to a recording manager service
    
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
 * Save stream to Imperial chest
 */
export const saveStreamToImperialChest = async (streamUrl: string, metadata: any = {}): Promise<boolean> => {
  try {
    // This would connect to the Imperial chest storage system
    const response = await fetch('/api/imperial/streams/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        streamUrl,
        metadata: {
          ...metadata,
          savedAt: new Date().toISOString(),
          source: 'imperial-scanner'
        }
      })
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error saving stream to Imperial chest:', error);
    return false;
  }
};

/**
 * Get all streams from Imperial chest
 */
export const getImperialChestStreams = async (): Promise<any[]> => {
  try {
    const response = await fetch('/api/imperial/streams');
    const data = await response.json();
    return data.streams || [];
  } catch (error) {
    console.error('Error getting streams from Imperial chest:', error);
    return [];
  }
};

/**
 * Get all recordings from Imperial chest
 */
export const getImperialChestRecordings = async (): Promise<any[]> => {
  try {
    const response = await fetch('/api/imperial/recordings');
    const data = await response.json();
    return data.recordings || [];
  } catch (error) {
    console.error('Error getting recordings from Imperial chest:', error);
    return [];
  }
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
  try {
    // This would typically use real-time video analysis or computer vision
    // For implementation with real-world tools, you could use:
    // 1. OpenCV for motion detection
    // 2. A pre-built motion detection service
    
    // For now, we'll return a placeholder implementation
    // that would be replaced with real implementation
    return {
      motionDetected: false,
      confidence: 0,
      objects: []
    };
  } catch (error) {
    console.error('Error detecting motion:', error);
    return {
      motionDetected: false
    };
  }
};

/**
 * Configure go2rtc server
 */
export const configureGo2rtcServer = async (
  serverUrl: string, 
  options: { 
    username?: string; 
    password?: string; 
    apiKey?: string 
  } = {}
): Promise<boolean> => {
  try {
    // Save go2rtc server URL for future use
    localStorage.setItem('go2rtcUrl', serverUrl);
    
    // In a real implementation, we'd validate the connection and potentially
    // set up authentication with the go2rtc server
    
    // Simple validation - just check if the URL is reachable
    const response = await fetch(`${serverUrl}/api/status`, {
      headers: options.apiKey ? { 'Authorization': `Bearer ${options.apiKey}` } : {}
    });
    
    if (response.ok) {
      console.log('go2rtc server configured successfully');
      return true;
    } else {
      console.error('Failed to connect to go2rtc server');
      return false;
    }
  } catch (error) {
    console.error('Error configuring go2rtc server:', error);
    return false;
  }
};

/**
 * Add a stream source to go2rtc
 */
export const addStreamToGo2rtc = async (
  streamUrl: string,
  streamName: string = 'camera1'
): Promise<boolean> => {
  try {
    const go2rtcUrl = localStorage.getItem('go2rtcUrl');
    
    if (!go2rtcUrl) {
      throw new Error('go2rtc server not configured');
    }
    
    // In a real implementation, we'd use the go2rtc API to add a stream
    // This typically involves sending a POST request to the API endpoint
    
    // Example API call (implementation would depend on the actual go2rtc API)
    const response = await fetch(`${go2rtcUrl}/api/streams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: streamName,
        url: streamUrl
      })
    });
    
    if (response.ok) {
      console.log(`Stream ${streamName} added to go2rtc`);
      return true;
    } else {
      console.error('Failed to add stream to go2rtc');
      return false;
    }
  } catch (error) {
    console.error('Error adding stream to go2rtc:', error);
    return false;
  }
};

/**
 * Test connection to any stream URL (RTSP, HLS, etc.)
 */
export const testStreamConnection = async (streamUrl: string): Promise<boolean> => {
  try {
    const normalizedUrl = normalizeStreamUrl(streamUrl);
    
    if (normalizedUrl.startsWith('rtsp://')) {
      return testRtspStreamConnectivity(normalizedUrl);
    }
    
    // For HLS/HTTP streams, use fetch with a HEAD request
    if (normalizedUrl.startsWith('http')) {
      try {
        const response = await fetch(normalizedUrl, { 
          method: 'HEAD',
          mode: 'no-cors', // Try no-cors for cross-origin URLs
          credentials: 'include' // Include credentials for authenticated streams
        });
        return true; // With no-cors we can't check status, so assume success if no error
      } catch (error) {
        console.error('Error testing HTTP stream connection:', error);
        return false;
      }
    }
    
    // For other protocols, assume they work and let the player handle errors
    return true;
  } catch (error) {
    console.error('Error testing stream connection:', error);
    return false;
  }
};

/**
 * Stream URL handling for go2rtc integration
 */
export const getStreamUrlForEngine = (url: string, engine: 'native' | 'hlsjs' | 'videojs' | 'go2rtc'): string => {
  const normalizedUrl = normalizeStreamUrl(url);
  
  // If using go2rtc engine and a go2rtc server is configured
  if (engine === 'go2rtc') {
    const go2rtcUrl = localStorage.getItem('go2rtcUrl');
    if (go2rtcUrl) {
      return `${go2rtcUrl}/api/stream?src=${encodeURIComponent(normalizedUrl)}`;
    }
  }
  
  // For HLS streams with videojs, use player.html
  if (engine === 'videojs' && (normalizedUrl.includes('.m3u8') || normalizedUrl.includes('.mpd'))) {
    return `/player.html?url=${encodeURIComponent(normalizedUrl)}&engine=videojs`;
  }
  
  // Otherwise return the URL as is
  return normalizedUrl;
};

/**
 * Advanced authentication handler for streams
 * Supports various authentication methods for different camera types
 */
export const handleStreamAuthentication = async (
  streamUrl: string,
  options: {
    username?: string;
    password?: string;
    authType?: 'basic' | 'digest' | 'token';
    token?: string;
  } = {}
): Promise<string> => {
  try {
    const { username, password, authType, token } = options;
    
    // If credentials are provided separately
    if ((username || password) && !streamUrl.includes('@')) {
      const urlObj = new URL(streamUrl);
      urlObj.username = username || '';
      urlObj.password = password || '';
      return urlObj.toString();
    }
    
    // If token auth is specified
    if (authType === 'token' && token) {
      const urlObj = new URL(streamUrl);
      urlObj.searchParams.append('token', token);
      return urlObj.toString();
    }
    
    // Otherwise return the original URL
    return streamUrl;
  } catch (error) {
    console.error('Error handling stream authentication:', error);
    return streamUrl;
  }
};

/**
 * Force stream access through multiple methods
 * This will try various approaches to access a protected stream
 */
export const forceStreamAccess = async (streamUrl: string): Promise<string> => {
  console.log(`Attempting to force access to: ${streamUrl}`);
  
  // Try with common credentials if not already specified
  if (!streamUrl.includes('@')) {
    const commonCredentials = [
      { user: 'admin', pass: 'admin' },
      { user: 'admin', pass: '12345' },
      { user: 'admin', pass: 'password' },
      { user: 'root', pass: 'root' },
      { user: 'user', pass: 'user' }
    ];
    
    for (const cred of commonCredentials) {
      try {
        const urlWithCreds = await handleStreamAuthentication(streamUrl, {
          username: cred.user,
          password: cred.pass
        });
        
        // Test if we can connect with these credentials
        const isConnected = await testRtspConnection(urlWithCreds);
        if (isConnected) {
          console.log(`Successfully accessed stream with credentials: ${cred.user}:${cred.pass}`);
          return urlWithCreds;
        }
      } catch (error) {
        continue; // Try next credentials
      }
    }
  }
  
  // Try accessing through go2rtc if available
  const go2rtcUrl = localStorage.getItem('go2rtcUrl');
  if (go2rtcUrl) {
    try {
      console.log('Attempting access through go2rtc');
      return `${go2rtcUrl}/api/stream?src=${encodeURIComponent(streamUrl)}`;
    } catch (error) {
      console.error('Error accessing through go2rtc:', error);
    }
  }
  
  // Try using Imperial proxy if available
  const imperialProxyUrl = localStorage.getItem('rtspProxyUrl');
  if (imperialProxyUrl) {
    try {
      console.log('Attempting access through Imperial proxy');
      const streamId = btoa(streamUrl).replace(/[/+=]/g, '').substring(0, 12);
      return `${imperialProxyUrl}/stream/${streamId}/index.m3u8`;
    } catch (error) {
      console.error('Error accessing through Imperial proxy:', error);
    }
  }
  
  // If all else fails, return the original URL
  return streamUrl;
};
