
import { executeHackingTool } from '@/utils/osintUtilsConnector';

export interface UtilityToolParams {
  tool: string;
  input?: string;
  output?: string;
  options?: any;
}

export interface UtilityToolResult {
  success: boolean;
  results?: any;
  error?: string;
}

export const executeFFmpeg = async (params: UtilityToolParams): Promise<UtilityToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'ffmpeg',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('FFmpeg error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during FFmpeg execution'
    };
  }
};

export const executeTapoPoC = async (params: UtilityToolParams): Promise<UtilityToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'tapoPoC',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('TapoPoC error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during TapoPoC execution'
    };
  }
};

export const executeShieldAI = async (params: UtilityToolParams): Promise<UtilityToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'shieldAI',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('ShieldAI error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during ShieldAI execution'
    };
  }
};
