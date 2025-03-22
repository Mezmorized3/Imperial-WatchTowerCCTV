
/**
 * FFmpeg Service
 * Provides integration with FFmpeg for media processing tasks
 */

import { FFmpegParams, ToolResult } from '../osintToolTypes';
import { executeExternalTool, checkToolAvailability } from '../github/externalToolsConnector';

/**
 * Execute FFmpeg with given parameters
 */
export const executeFFmpeg = async (params: FFmpegParams): Promise<ToolResult> => {
  // Check if real FFmpeg is available
  const isFFmpegAvailable = await checkToolAvailability('ffmpeg');
  
  if (isFFmpegAvailable) {
    try {
      const args: string[] = [];
      
      if (params.inputStream) args.push('-i', params.inputStream);
      else if (params.input) args.push('-i', params.input);
      
      if (params.videoCodec) args.push('-c:v', params.videoCodec);
      if (params.audioCodec) args.push('-c:a', params.audioCodec);
      if (params.resolution) args.push('-s', params.resolution);
      if (params.bitrate) args.push('-b:v', params.bitrate);
      if (params.framerate) args.push('-r', params.framerate);
      
      if (params.filters && params.filters.length > 0) {
        args.push('-vf', params.filters.join(','));
      }
      
      // Add additional options if provided
      if (params.options) {
        Object.entries(params.options).forEach(([key, value]) => {
          if (value === null) {
            args.push(`-${key}`);
          } else {
            args.push(`-${key}`, value.toString());
          }
        });
      }
      
      const outputPath = params.outputPath || params.output || 'output.mp4';
      args.push(outputPath);
      
      const result = await executeExternalTool('ffmpeg', args);
      
      return {
        success: result.success,
        data: result.data || { 
          command: result.command,
          outputFile: outputPath,
          output: result.output
        },
        error: result.error,
        simulatedData: false
      };
    } catch (error) {
      console.error('Error executing FFmpeg:', error);
      return {
        success: false,
        data: {
          error: error instanceof Error ? error.message : 'Unknown error executing FFmpeg'
        },
        simulatedData: false
      };
    }
  }
  
  // If FFmpeg is not available, return an error
  return {
    success: false,
    data: {
      error: 'FFmpeg is not available on this system'
    },
    simulatedData: false
  };
};

/**
 * Convert RTSP stream to HLS format
 */
export const ffmpegConvertRtspToHls = async (
  rtspUrl: string,
  outputPath: string = 'output/stream.m3u8',
  segmentDuration: number = 4
): Promise<ToolResult> => {
  try {
    const params: FFmpegParams = {
      input: rtspUrl,
      output: outputPath,
      videoCodec: 'libx264',
      audioCodec: 'aac',
      options: {
        hls_time: segmentDuration,
        hls_list_size: 10,
        hls_flags: 'delete_segments'
      }
    };
    
    return await executeFFmpeg(params);
  } catch (error) {
    console.error('Error converting RTSP to HLS:', error);
    return {
      success: false,
      data: {
        error: error instanceof Error ? error.message : 'Unknown error converting RTSP to HLS'
      },
      simulatedData: false
    };
  }
};

/**
 * Record a video stream for a specified duration
 */
export const ffmpegRecordStream = async (
  streamUrl: string,
  outputPath: string = 'output/recording.mp4',
  duration: number | string = 60
): Promise<ToolResult> => {
  try {
    const params: FFmpegParams = {
      input: streamUrl,
      output: outputPath,
      videoCodec: 'copy',
      audioCodec: 'copy',
      options: {
        t: duration.toString()
      }
    };
    
    return await executeFFmpeg(params);
  } catch (error) {
    console.error('Error recording stream:', error);
    return {
      success: false,
      data: {
        error: error instanceof Error ? error.message : 'Unknown error recording stream'
      },
      simulatedData: false
    };
  }
};

/**
 * Apply motion detection filter to video
 */
export const applyMotionDetection = async (
  inputPath: string,
  sensitivity: number = 0.05
): Promise<ToolResult> => {
  try {
    // Motion detection filter string
    const motionFilter = `select='gt(scene,${sensitivity})',showinfo`;
    
    const params: FFmpegParams = {
      input: inputPath,
      output: `output/motion_${Date.now()}.mp4`,
      videoCodec: 'libx264',
      filters: [motionFilter],
      options: {
        an: null, // No audio
        vsync: 'vfr' // Variable framerate
      }
    };
    
    return await executeFFmpeg(params);
  } catch (error) {
    console.error('Error applying motion detection:', error);
    return {
      success: false,
      data: {
        error: error instanceof Error ? error.message : 'Unknown error applying motion detection'
      },
      simulatedData: false
    };
  }
};

// Add these export aliases
export const convertRtspToHls = ffmpegConvertRtspToHls;
export const recordStream = ffmpegRecordStream;
