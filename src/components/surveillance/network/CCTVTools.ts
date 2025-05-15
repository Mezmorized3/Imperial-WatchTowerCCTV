
import { executeHackingTool } from '@/utils/osintUtilsConnector';
import { CCTVScanData, CCTVHackedData, CCTVCamera as OsintCCTVCamera, CCTVHackedCamera as OsintCCTVHackedCamera } from '@/utils/types/osintToolTypes';

export interface CCTVScanParams {
  tool: string; // This 'tool' might be redundant if executeHackingTool handles it internally
  target: string; // Or a more generic query/options object
  port?: number;
  timeout?: number;
  // Add any other relevant params that specific CCTV tools might need
  [key: string]: any; // Allow other params
}

// Define a more specific Camera type for the results if needed, or use OsintCCTVCamera
export interface CCTVCamera extends OsintCCTVCamera {}
export interface CCTVHackedCamera extends OsintCCTVHackedCamera {}


export interface CCTVScanResult {
  success: boolean;
  cameras?: CCTVCamera[] | CCTVHackedCamera[]; // Can be either type of camera array
  error?: string;
}

export const executeCCTVScan = async (params: CCTVScanParams): Promise<CCTVScanResult> => {
  try {
    const result = await executeHackingTool({
      tool: 'cctvScan', // Specific tool key for the connector
      ...params // Pass other params like target, port, etc.
    });
    
    if (result.success) {
      const scanData = result.data.results as CCTVScanData;
      return {
        success: true,
        cameras: scanData?.cameras,
      };
    } else {
      return {
        success: false,
        error: (result.data as any)?.message || result.error || 'Unknown error during CCTV scan'
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
    const result = await executeHackingTool({
      tool: 'cctvHackedScan', // Specific tool key
      ...params
    });
    
    if (result.success) {
      const hackedData = result.data.results as CCTVHackedData;
      return {
        success: true,
        cameras: hackedData?.cameras,
      };
    } else {
      return {
        success: false,
        error: (result.data as any)?.message || result.error || 'Unknown error during CCTV hacked scan'
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
    const result = await executeHackingTool({
      tool: 'hackCCTV',
      ...params
    });
    if (result.success) {
      // Assuming hackCCTV returns a structure similar to CCTVScanData or needs specific typing
      const responseData = result.data.results as CCTVScanData; // Adjust if HackCCTV has a different result structure
      return {
        success: true,
        cameras: responseData?.cameras,
      };
    } else {
      return {
        success: false,
        error: (result.data as any)?.message || result.error || 'Unknown error during hack CCTV'
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
    const result = await executeHackingTool({
      tool: 'cameradar',
      ...params
    });
    if (result.success) {
      const responseData = result.data.results as CCTVScanData; 
      return {
        success: true,
        cameras: responseData?.cameras,
      };
    } else {
      return {
        success: false,
        error: (result.data as any)?.message || result.error || 'Unknown error during cameradar scan'
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
    const result = await executeHackingTool({
      tool: 'openCCTV',
      ...params
    });
     if (result.success) {
      const responseData = result.data.results as CCTVScanData;
      return {
        success: true,
        cameras: responseData?.cameras,
      };
    } else {
      return {
        success: false,
        error: (result.data as any)?.message || result.error || 'Unknown error during OpenCCTV scan'
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
    const result = await executeHackingTool({
      tool: 'eyePwn',
      ...params
    });
    if (result.success) {
      // EyePwn might have a different structure, adjust CCTVScanData or create a new type if needed
      const responseData = result.data.results as CCTVScanData; 
      return {
        success: true,
        cameras: responseData?.cameras,
      };
    } else {
      return {
        success: false,
        error: (result.data as any)?.message || result.error || 'Unknown error during EyePwn scan'
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
    const result = await executeHackingTool({
      tool: 'camDumper',
      ...params
    });
    if (result.success) {
      const responseData = result.data.results as CCTVScanData;
      return {
        success: true,
        cameras: responseData?.cameras,
      };
    } else {
      return {
        success: false,
        error: (result.data as any)?.message || result.error || 'Unknown error during CamDumper scan'
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
    const result = await executeHackingTool({
      tool: 'camerattack',
      ...params
    });
    if (result.success) {
      const responseData = result.data.results as CCTVScanData;
      return {
        success: true,
        cameras: responseData?.cameras,
      };
    } else {
      return {
        success: false,
        error: (result.data as any)?.message || result.error || 'Unknown error during Camerattack scan'
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
