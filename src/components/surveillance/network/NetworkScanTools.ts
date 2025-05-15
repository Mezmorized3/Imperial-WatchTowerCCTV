
import { executeHackingTool } from '@/utils/osintUtilsConnector';

export interface NetworkScanParams {
  tool: string;
  target: string;
  port?: number | string;
  ports?: number[] | string;
  timeout?: number;
  options?: any;
}

export interface NetworkScanResult {
  success: boolean;
  results?: any;
  error?: string;
}

export const executeScapy = async (params: NetworkScanParams): Promise<NetworkScanResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'scapy',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('Scapy error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during Scapy execution'
    };
  }
};

export const executeZMap = async (params: NetworkScanParams): Promise<NetworkScanResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'zmap',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('ZMap error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during ZMap execution'
    };
  }
};

export const executeZGrab = async (params: NetworkScanParams): Promise<NetworkScanResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'zgrab',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('ZGrab error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during ZGrab execution'
    };
  }
};

export const executeMasscan = async (params: NetworkScanParams): Promise<NetworkScanResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'masscan',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('Masscan error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during Masscan execution'
    };
  }
};

export const executeHydra = async (params: NetworkScanParams): Promise<NetworkScanResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'hydra',
      ...params
    });
    
    return {
      success: result.success,
      results: result.success ? result.data : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('Hydra error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during Hydra execution'
    };
  }
};
