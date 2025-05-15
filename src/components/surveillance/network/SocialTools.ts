
import { executeHackingTool } from '@/utils/osintUtilsConnector';

export interface SocialToolParams {
  tool: string;
  username?: string;
  query?: string;
  options?: any;
}

export interface SocialToolResult {
  success: boolean;
  results?: any;
  error?: string;
}

export const executeUsernameSearch = async (params: SocialToolParams): Promise<SocialToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'usernameSearch',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('Username search error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during username search'
    };
  }
};

export const executeTwint = async (params: SocialToolParams): Promise<SocialToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'twint',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('Twint error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during Twint execution'
    };
  }
};

export const executeOSINT = async (params: SocialToolParams): Promise<SocialToolResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'osint',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('OSINT error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during OSINT execution'
    };
  }
};
