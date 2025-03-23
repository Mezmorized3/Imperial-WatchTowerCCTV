// Utility functions for RTSP stream handling
import { ToolResult } from './osintToolTypes';
import { ffmpegConvertRtspToHls, ffmpegRecordStream } from './ffmpeg/ffmpegService';
import { executeExternalTool } from './github/externalToolsConnector';

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
    // Check if Imperial proxy is enabled
    const useImperialProxy = localStorage.getItem('rtspProxyEnabled') !== 'false';
    const imperialProxyUrl = localStorage.getItem('rtspProxyUrl');
    
    if (useImperialProxy && imperialProxyUrl) {
      // Use Imperial proxy for better performance
      const streamId = btoa(rtspUrl).replace(/[/+=]/g, '').substring(0, 12);
      return `${imperialProxyUrl}/stream/${streamId}/index.m3u8`;
    }
    
    // Generate a unique output path
    const outputDir = `output/streams/${Date.now()}`;
    const outputPath = `${outputDir}/stream.m3u8`;
    
    const result = await ffmpegConvertRtspToHls(rtspUrl, outputPath);
    
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

// Additional Imperial chest integration functions

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
