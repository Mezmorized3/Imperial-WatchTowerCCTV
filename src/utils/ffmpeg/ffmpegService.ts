import { simulateNetworkDelay } from '../networkUtils';
import { FFmpegParams, ToolResult } from '@/utils/types/osintToolTypes';

/**
 * Executes FFmpeg commands on RTSP streams
 * @param params FFmpeg parameters
 * @returns Result of the FFmpeg operation
 */
export const executeFFmpeg = async (params: FFmpegParams): Promise<ToolResult> => {
  console.log('Executing FFmpeg with params:', params);
  
  try {
    // Validate input
    if (!params.input) {
      return {
        success: false,
        error: 'Input stream URL is required'
      };
    }
    
    // Handle direct input stream or input parameter
    const inputStream = params.inputStream || params.input;
    if (!inputStream) {
      return {
        success: false,
        error: 'No input stream provided'
      };
    }
    
    // Simulate processing delay
    await simulateNetworkDelay(2000);
    
    // Build FFmpeg command
    const command = buildFFmpegCommand(params);
    
    return {
      success: true,
      data: {
        command,
        outputFile: params.output || 'output.mp4',
        duration: params.duration || 'full',
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error executing FFmpeg:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Builds an FFmpeg command string from parameters
 */
const buildFFmpegCommand = (params: FFmpegParams): string => {
  let command = 'ffmpeg -i "' + (params.inputStream || params.input) + '"';
  
  // Add video codec if specified
  if (params.videoCodec) {
    command += ' -c:v ' + params.videoCodec;
  }
  
  // Add audio codec if specified
  if (params.audioCodec) {
    command += ' -c:a ' + params.audioCodec;
  }
  
  // Add duration if specified - convert to string if it's a number
  if (params.duration) {
    const durationStr = typeof params.duration === 'number' ? params.duration.toString() : params.duration;
    command += ' -t ' + durationStr;
  }
  
  // Add resolution if specified
  if (params.resolution) {
    command += ' -s ' + params.resolution;
  }
  
  // Add bitrate if specified
  if (params.bitrate) {
    command += ' -b:v ' + params.bitrate;
  }
  
  // Add framerate if specified
  if (params.framerate) {
    command += ' -r ' + params.framerate;
  }
  
  // Add filters if specified
  if (params.filters && params.filters.length > 0) {
    command += ' -vf "' + params.filters.join(',') + '"';
  }
  
  // Add output file
  command += ' ' + (params.outputPath || params.output || 'output.' + (params.outputFormat || 'mp4'));
  
  return command;
};

/**
 * Converts an RTSP stream to HLS format
 */
export const convertRtspToHls = async (params: FFmpegParams): Promise<ToolResult> => {
  console.log('Converting RTSP to HLS with params:', params);
  
  try {
    // Validate input
    if (!params.inputStream && !params.input) {
      return {
        success: false,
        error: 'Input stream URL is required'
      };
    }
    
    // Simulate processing delay
    await simulateNetworkDelay(3000);
    
    // Build FFmpeg command for HLS conversion
    const inputStream = params.inputStream || params.input;
    const command = `ffmpeg -i "${inputStream}" -c:v h264 -c:a aac -hls_time 4 -hls_list_size 10 -start_number 1 output.m3u8`;
    
    return {
      success: true,
      data: {
        command,
        outputPath: params.outputPath || 'output.m3u8',
        playlistUrl: '/hls/output.m3u8',
        segments: 10,
        segmentDuration: 4,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error converting RTSP to HLS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Takes a screenshot from an RTSP stream
 */
export const takeStreamScreenshot = async (params: FFmpegParams): Promise<ToolResult> => {
  console.log('Taking screenshot from stream with params:', params);
  
  try {
    // Validate input
    if (!params.inputStream && !params.input) {
      return {
        success: false,
        error: 'Input stream URL is required'
      };
    }
    
    // Simulate processing delay
    await simulateNetworkDelay(1000);
    
    // Build FFmpeg command for screenshot
    const inputStream = params.inputStream || params.input;
    const command = `ffmpeg -i "${inputStream}" -frames:v 1 -q:v 2 ${params.outputPath || 'screenshot.jpg'}`;
    
    return {
      success: true,
      data: {
        command,
        outputPath: params.outputPath || 'screenshot.jpg',
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error taking screenshot:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Records a segment from an RTSP stream
 */
export const recordStreamSegment = async (params: FFmpegParams): Promise<ToolResult> => {
  console.log('Recording stream segment with params:', params);
  
  try {
    // Validate input
    if (!params.inputStream && !params.input) {
      return {
        success: false,
        error: 'Input stream URL is required'
      };
    }
    
    // Convert duration to string for processing delay calculation
    const durationStr = typeof params.duration === 'number' ? params.duration.toString() : params.duration;
    const durationSeconds = durationStr ? parseInt(durationStr) : 30;
    
    // Simulate processing delay
    await simulateNetworkDelay(durationSeconds * 100);
    
    // Build FFmpeg command for recording
    const inputStream = params.inputStream || params.input;
    const command = `ffmpeg -i "${inputStream}" -c:v copy -c:a copy -t ${durationStr || '30'} ${params.outputPath || 'recording.mp4'}`;
    
    return {
      success: true,
      data: {
        command,
        outputPath: params.outputPath || 'recording.mp4',
        duration: durationStr || '30s',
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error recording stream segment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

export default {
  executeFFmpeg,
  convertRtspToHls,
  takeStreamScreenshot,
  recordStreamSegment
};
