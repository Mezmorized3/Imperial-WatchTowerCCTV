
import { executeHackingTool } from '@/utils/osintUtilsConnector';

export interface VisionToolParams {
  tool: string;
  target?: string;
  input?: string;
  options?: any;
}

export interface VisionToolResult {
  success: boolean;
  results?: any;
  error?: string;
}

export const executeOpenCV = async (params: VisionToolParams): Promise<VisionToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'openCV',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('OpenCV error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during OpenCV execution'
    };
  }
};

export const executeDeepstack = async (params: VisionToolParams): Promise<VisionToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'deepstack',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('Deepstack error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during Deepstack execution'
    };
  }
};

export const executeFaceRecognition = async (params: VisionToolParams): Promise<VisionToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'faceRecognition',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('Face recognition error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during face recognition'
    };
  }
};

export const executeMotion = async (params: VisionToolParams): Promise<VisionToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'motion',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('Motion error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during Motion execution'
    };
  }
};

export const executeONVIFScan = async (params: VisionToolParams): Promise<VisionToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'onvifScan',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('ONVIF scan error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during ONVIF scan'
    };
  }
};

export const executeNmapONVIF = async (params: VisionToolParams): Promise<VisionToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'nmapONVIF',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('Nmap ONVIF error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during Nmap ONVIF execution'
    };
  }
};
