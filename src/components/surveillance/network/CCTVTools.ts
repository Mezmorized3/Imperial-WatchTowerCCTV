import { executeHackingTool } from '@/utils/osintUtilsConnector';
import { 
    CCTVScanData, 
    CCTVHackedData, 
    CCTVCamera as OsintCCTVCamera, 
    CCTVHackedCamera as OsintCCTVHackedCamera,
    HackingToolResult, // Import HackingToolResult
    HackingToolErrorData // Assuming this type is correctly defined here or re-exported
} from '@/utils/types/osintToolTypes'; // Assuming these types are correctly defined here or re-exported

export interface CCTVScanParams {
  tool: string; 
  target: string; 
  port?: number;
  timeout?: number;
  [key: string]: any; 
}

export interface CCTVCamera extends OsintCCTVCamera {}
export interface CCTVHackedCamera extends OsintCCTVHackedCamera {}


export interface CCTVScanResult {
  success: boolean;
  cameras?: CCTVCamera[] | CCTVHackedCamera[];
  error?: string;
}

export const executeCCTVScan = async (params: CCTVScanParams): Promise<CCTVScanResult> => {
  try {
    const result: HackingToolResult<CCTVScanData> = await executeHackingTool({
      tool: 'cctvScan', 
      ...params 
    });
    
    if (result.success) {
      return {
        success: true,
        cameras: result.data.results?.cameras,
      };
    } else {
      return {
        success: false,
        error: result.error || (result.data as HackingToolErrorData)?.message || 'Unknown error during CCTV scan'
      };
    }
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
    const result: HackingToolResult<CCTVHackedData> = await executeHackingTool({
      tool: 'cctvHackedScan', 
      ...params
    });
    
    if (result.success) {
      return {
        success: true,
        cameras: result.data.results?.cameras,
      };
    } else {
      return {
        success: false,
        error: result.error || (result.data as HackingToolErrorData)?.message || 'Unknown error during CCTV hacked scan'
      };
    }
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
    const result: HackingToolResult<CCTVHackedData> = await executeHackingTool({ // CCTVHackedData is more likely for a "hack" tool
      tool: 'hackCCTV',
      ...params
    });
    if (result.success) {
      return {
        success: true,
        cameras: result.data.results?.cameras, // Assuming cameras are part of CCTVHackedData
      };
    } else {
      return {
        success: false,
        error: result.error || (result.data as HackingToolErrorData)?.message || 'Unknown error during hack CCTV'
      };
    }
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
    const result: HackingToolResult<CCTVScanData> = await executeHackingTool({
      tool: 'cameradar',
      ...params
    });
    if (result.success) {
      return {
        success: true,
        cameras: result.data.results?.cameras,
      };
    } else {
      return {
        success: false,
        error: result.error || (result.data as HackingToolErrorData)?.message || 'Unknown error during cameradar scan'
      };
    }
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
    const result: HackingToolResult<CCTVScanData> = await executeHackingTool({
      tool: 'openCCTV',
      ...params
    });
     if (result.success) {
      return {
        success: true,
        cameras: result.data.results?.cameras,
      };
    } else {
      return {
        success: false,
        error: result.error || (result.data as HackingToolErrorData)?.message || 'Unknown error during OpenCCTV scan'
      };
    }
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
    const result: HackingToolResult<CCTVHackedData> = await executeHackingTool({ // EyePwn sounds like it might find hacked/vulnerable cams
      tool: 'eyePwn',
      ...params
    });
    if (result.success) {
      return {
        success: true,
        cameras: result.data.results?.cameras,
      };
    } else {
      return {
        success: false,
        error: result.error || (result.data as HackingToolErrorData)?.message || 'Unknown error during EyePwn scan'
      };
    }
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
    const result: HackingToolResult<CCTVHackedData> = await executeHackingTool({ // CamDumper sounds like it gets data from cams
      tool: 'camDumper',
      ...params
    });
    if (result.success) {
      return {
        success: true,
        cameras: result.data.results?.cameras, // Assuming it returns hacked camera data
      };
    } else {
      return {
        success: false,
        error: result.error || (result.data as HackingToolErrorData)?.message || 'Unknown error during CamDumper scan'
      };
    }
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
    const result: HackingToolResult<CCTVHackedData> = await executeHackingTool({ // Camerattack implies finding vulnerable/hacked cams
      tool: 'camerattack',
      ...params
    });
    if (result.success) {
      return {
        success: true,
        cameras: result.data.results?.cameras,
      };
    } else {
      return {
        success: false,
        error: result.error || (result.data as HackingToolErrorData)?.message || 'Unknown error during Camerattack scan'
      };
    }
  } catch (error) {
    console.error('Camerattack error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during Camerattack scan'
    };
  }
};
