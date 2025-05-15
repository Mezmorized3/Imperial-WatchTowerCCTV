
import { executeHackingTool } from '@/utils/osintUtilsConnector';

export interface WebToolParams {
  tool: string;
  target: string;
  options?: any;
}

export interface WebToolResult {
  success: boolean;
  results?: any;
  error?: string;
}

export const executeWebCheck = async (params: WebToolParams): Promise<WebToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'webCheck',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('WebCheck error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during WebCheck execution'
    };
  }
};

export const executeWebhack = async (params: WebToolParams): Promise<WebToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'webhack',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('Webhack error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during Webhack execution'
    };
  }
};

export const executeBackHack = async (params: WebToolParams): Promise<WebToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'backHack',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('BackHack error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during BackHack execution'
    };
  }
};

export const executePhoton = async (params: WebToolParams): Promise<WebToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'photon',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('Photon error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during Photon execution'
    };
  }
};

export const executeTorBot = async (params: WebToolParams): Promise<WebToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'torBot',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('TorBot error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during TorBot execution'
    };
  }
};
