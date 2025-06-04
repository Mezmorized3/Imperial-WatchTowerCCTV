
import { HackingToolResult, BaseToolParams } from './types/osintToolTypes';

// Real API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const API_KEY = process.env.REACT_APP_API_KEY;

// Generic tool executor with real API calls
export const executeHackingTool = async <T extends BaseToolParams, R = any>(
  params: T
): Promise<HackingToolResult<R>> => {
  try {
    // Input validation
    if (!params.tool) {
      return {
        success: false,
        error: 'Tool parameter is required',
        data: { message: 'Missing tool specification' }
      };
    }

    // Make real API call
    const response = await fetch(`${API_BASE_URL}/tools/${params.tool}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` })
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      data: {
        results: result.data || result,
        message: result.message || `${params.tool} execution completed`
      }
    };

  } catch (error) {
    console.error(`Tool execution error (${params.tool}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      data: { 
        message: `Failed to execute ${params.tool}`,
        results: []
      }
    };
  }
};

// Specific tool implementations - real API calls
export const executeCameraScan = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'cameraScan' });
};

export const executeCCTVScan = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'cctvScan' });
};

export const executeCCTVHacked = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'cctvHacked' });
};

export const executeHackCCTV = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'hackCCTV' });
};

export const executeCameradar = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'cameradar' });
};

export const executeOpenCCTV = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'openCCTV' });
};

export const executeEyePwn = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'eyePwn' });
};

export const executeCamDumper = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'camDumper' });
};

export const executeCamerattack = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'camerattack' });
};

export const executeWebhack = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'webhack' });
};

export const executeWebCheck = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'webCheck' });
};

export const executeBackHack = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'backHack' });
};

export const executePhoton = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'photon' });
};

export const executeTorBot = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'torBot' });
};

export const executeSocialUsernameSearch = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'usernameSearch' });
};

export const executeTwint = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'twint' });
};

export const executeOSINT = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'osint' });
};

export const executeNmapONVIF = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'nmapONVIF' });
};

export const executeMasscan = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'masscan' });
};

export const executeHydra = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'hydra' });
};

export const executeScapy = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'scapy' });
};

export const executeZMap = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'zmap' });
};

export const executeZGrab = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'zgrab' });
};

export const executeMotion = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'motion' });
};

export const executeMotionEye = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'motionEye' });
};

export const executeDeepstack = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'deepstack' });
};

export const executeFaceRecognition = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'faceRecognition' });
};

export const executeRtspServer = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'rtspServer' });
};

export const executeZoneMinder = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'zoneMinder' });
};

export const executeOpenCV = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'openCV' });
};

export const executeFFmpeg = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'ffmpeg' });
};

export const executeShieldAI = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'shieldAI' });
};

export const executeSecurityAdmin = async (params: BaseToolParams) => {
  return executeHackingTool({ ...params, tool: 'securityAdmin' });
};
