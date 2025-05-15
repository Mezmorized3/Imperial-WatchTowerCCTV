
import { executeHackingTool } from '@/utils/osintUtilsConnector';
import { 
    CCTVScanData, 
    CCTVHackedData, 
    CCTVCamera as OsintCCTVCamera, 
    CCTVHackedCamera as OsintCCTVHackedCamera,
    HackingToolResult
} from '@/utils/types/osintToolTypes';

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
      // Fix the error access by using type assertion
      const errorMessage = result.success === false ? result.error : "Unknown error during CCTV scan";
      return {
        success: false,
        error: errorMessage
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
      // Fix the error access
      const errorMessage = result.success === false ? result.error : "Unknown error during CCTV hacked scan";
      return {
        success: false,
        error: errorMessage
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

// Fix all other methods with the same pattern
export const executeHackCCTV = async (params: CCTVScanParams): Promise<CCTVScanResult> => {
  try {
    const result: HackingToolResult<CCTVScanData> = await executeHackingTool({ 
      tool: 'hackCCTV',
      ...params
    });
    if (result.success) {
      return {
        success: true,
        cameras: result.data.results?.cameras,
      };
    } else {
      const errorMessage = result.success === false ? result.error : "Unknown error during hack CCTV";
      return {
        success: false,
        error: errorMessage
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
      const errorMessage = result.success === false ? result.error : "Unknown error during cameradar scan";
      return {
        success: false,
        error: errorMessage
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
      const errorMessage = result.success === false ? result.error : "Unknown error during OpenCCTV scan";
      return {
        success: false,
        error: errorMessage
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
    const result: HackingToolResult<CCTVScanData> = await executeHackingTool({ 
      tool: 'eyePwn',
      ...params
    });
    if (result.success) {
      return {
        success: true,
        cameras: result.data.results?.cameras,
      };
    } else {
      const errorMessage = result.success === false ? result.error : "Unknown error during EyePwn scan";
      return {
        success: false,
        error: errorMessage
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
    const result: HackingToolResult<CCTVScanData> = await executeHackingTool({ 
      tool: 'camDumper',
      ...params
    });
    if (result.success) {
      return {
        success: true,
        cameras: result.data.results?.cameras,
      };
    } else {
      const errorMessage = result.success === false ? result.error : "Unknown error during CamDumper scan";
      return {
        success: false,
        error: errorMessage
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
    const result: HackingToolResult<CCTVScanData> = await executeHackingTool({ 
      tool: 'camerattack',
      ...params
    });
    if (result.success) {
      return {
        success: true,
        cameras: result.data.results?.cameras,
      };
    } else {
      const errorMessage = result.success === false ? result.error : "Unknown error during Camerattack scan";
      return {
        success: false,
        error: errorMessage
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
