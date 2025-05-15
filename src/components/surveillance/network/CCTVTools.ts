
import { executeHackingTool } from '@/utils/osintUtilsConnector';

export interface CCTVScanParams {
  tool: string;
  target: string;
  port?: number;
  timeout?: number;
}

export interface CCTVScanResult {
  success: boolean;
  cameras?: {
    id: string;
    ip: string;
    port: number;
    manufacturer: string;
    model: string;
    url: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  }[];
  error?: string;
}

export const executeCCTVScan = async (params: CCTVScanParams): Promise<CCTVScanResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'cctvScan',
      ...params
    });
    
    return {
      success: result.success,
      cameras: result.success ? result.data?.cameras : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('CCTV scan error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during CCTV scan'
    };
  }
};

export const executeCCTVHacked = async (params: CCTVScanParams): Promise<CCTVScanResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'cctvHackedScan',
      ...params
    });
    
    return {
      success: result.success,
      cameras: result.success ? result.data?.cameras : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('CCTV hacked scan error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during CCTV hacked scan'
    };
  }
};

export const executeHackCCTV = async (params: CCTVScanParams): Promise<CCTVScanResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'hackCCTV',
      ...params
    });
    
    return {
      success: result.success,
      cameras: result.success ? result.data?.cameras : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('Hack CCTV error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during hack CCTV'
    };
  }
};

export const executeCameradar = async (params: CCTVScanParams): Promise<CCTVScanResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'cameradar',
      ...params
    });
    
    return {
      success: result.success,
      cameras: result.success ? result.data?.cameras : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('Cameradar error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during cameradar scan'
    };
  }
};

export const executeOpenCCTV = async (params: CCTVScanParams): Promise<CCTVScanResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'openCCTV',
      ...params
    });
    
    return {
      success: result.success,
      cameras: result.success ? result.data?.cameras : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('OpenCCTV error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during OpenCCTV scan'
    };
  }
};

export const executeEyePwn = async (params: CCTVScanParams): Promise<CCTVScanResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'eyePwn',
      ...params
    });
    
    return {
      success: result.success,
      cameras: result.success ? result.data?.cameras : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('EyePwn error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during EyePwn scan'
    };
  }
};

export const executeCamDumper = async (params: CCTVScanParams): Promise<CCTVScanResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'camDumper',
      ...params
    });
    
    return {
      success: result.success,
      cameras: result.success ? result.data?.cameras : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('CamDumper error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during CamDumper scan'
    };
  }
};

export const executeCamerattack = async (params: CCTVScanParams): Promise<CCTVScanResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'camerattack',
      ...params
    });
    
    return {
      success: result.success,
      cameras: result.success ? result.data?.cameras : undefined,
      error: !result.success ? (result.data as any)?.message || (result as any).error : undefined
    };
  } catch (error) {
    console.error('Camerattack error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during Camerattack scan'
    };
  }
};
