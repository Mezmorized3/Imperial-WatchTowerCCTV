/**
 * OSINT Tools Connector
 * This module provides bridges between our frontend and real external tools.
 */

import { 
  ToolResult,
  ProxyConfig
} from './types/baseTypes';

import {
  CCTVParams,
  SpeedCameraParams,
  CamerattackParams
} from './types/cameraTypes';

import {
  TorBotParams,
  BotExploitsParams,
  ImperialOculusParams
} from './types/networkTypes';

import {
  WebHackParams,
  WebCheckParams,
  BackHackParams
} from './types/webTypes';

import {
  TwintParams,
  OSINTParams
} from './types/socialTypes';

import {
  ShieldAIParams,
  RapidPayloadParams,
  HackingToolParams,
  FFmpegParams,
  SecurityAdminParams
} from './types/advancedToolTypes';

import {
  executeExternalTool,
  checkToolAvailability,
  setupTool
} from './github/externalToolsConnector';

import { imperialServerService } from './imperialServerService';

// Fix: Define ToolExecutionResult interface to match expected structure
interface ToolExecutionResult<T> {
  success: boolean;
  data: T;
  error?: string;
}

/**
 * Base function to execute any OSINT tool through the server API
 */
const executeToolThroughAPI = async <T extends object>(
  toolName: string, 
  params: T
): Promise<ToolResult> => {
  try {
    // Try to execute the tool through the server API
    const response = await imperialServerService.executeOsintTool(toolName, params);
    
    if (response && response.success) {
      return {
        success: true,
        data: response.data,
        simulatedData: false
      };
    }
    
    // If server API fails, try to execute the tool locally
    console.log(`Server API execution failed for ${toolName}, trying local execution...`);
    return await executeToolLocallyIfAvailable(toolName, params);
  } catch (error) {
    console.error(`Error executing ${toolName}:`, error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : `Failed to execute ${toolName}`,
      simulatedData: false
    };
  }
};

/**
 * Try to execute a tool locally if available
 */
const executeToolLocallyIfAvailable = async <T extends object>(
  toolName: string, 
  params: T
): Promise<ToolResult> => {
  // Check if tool is available locally
  const isAvailable = await checkToolAvailability(toolName);
  
  if (isAvailable) {
    // Convert params to array of args for command-line style execution
    const args: string[] = [];
    
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === 'boolean' && value) {
        args.push(`--${key}`);
      } else if (value !== undefined && value !== null && value !== '') {
        args.push(`--${key}`, value.toString());
      }
    });
    
    // Fix: Handle the case when data might be undefined in ToolExecutionResult
    const result = await executeExternalTool(toolName, args);
    return {
      success: result.success,
      data: result.data || {}, // Ensure data is always defined
      error: result.error,
      simulatedData: false
    };
  }
  
  // If tool is not available, try to set it up
  const setupSuccess = await setupTool(toolName);
  
  if (setupSuccess) {
    console.log(`Successfully set up ${toolName}, trying execution again...`);
    return executeToolLocallyIfAvailable(toolName, params);
  }
  
  console.error(`Tool ${toolName} is not available and could not be set up`);
  return {
    success: false,
    data: null,
    error: `Tool ${toolName} is not available and could not be set up automatically.`,
    simulatedData: false
  };
};

// Camera tools with real implementations
export const executeCameradarReal = async (params: { target: string, ports?: string }): Promise<ToolResult> => {
  return executeToolThroughAPI('cameradar', params);
};

export const executeIPCamSearchReal = async (params: { subnet: string, protocols?: string[] }): Promise<ToolResult> => {
  return executeToolThroughAPI('ipcam_search', params);
};

export const executeCCTVReal = async (params: CCTVParams): Promise<ToolResult> => {
  return executeToolThroughAPI('cctv', params);
};

export const executeSpeedCameraReal = async (params: SpeedCameraParams): Promise<ToolResult> => {
  return executeToolThroughAPI('speed-camera', params);
};

export const executeCamerattackReal = async (params: CamerattackParams): Promise<ToolResult> => {
  return executeToolThroughAPI('camerattack', params);
};

// Web tools with real implementations
export const executeWebCheckReal = async (params: WebCheckParams): Promise<ToolResult> => {
  return executeToolThroughAPI('web-check', params);
};

export const executeWebhackReal = async (params: WebHackParams): Promise<ToolResult> => {
  return executeToolThroughAPI('webhack', params);
};

export const executePhotonReal = async (params: { url: string, depth?: number, timeout?: number }): Promise<ToolResult> => {
  return executeToolThroughAPI('photon', params);
};

export const executeBackHackReal = async (params: BackHackParams): Promise<ToolResult> => {
  return executeToolThroughAPI('backhack', params);
};

// Network tools with real implementations
export const executeTorBotReal = async (params: TorBotParams): Promise<ToolResult> => {
  return executeToolThroughAPI('torbot', params);
};

export const executeImperialOculusReal = async (params: ImperialOculusParams): Promise<ToolResult> => {
  return executeToolThroughAPI('imperial-oculus', params);
};

export const executeBotExploitsReal = async (params: BotExploitsParams): Promise<ToolResult> => {
  return executeToolThroughAPI('botexploits', params);
};

// Social tools with real implementations
export const executeUsernameSearchReal = async (username: string): Promise<ToolResult> => {
  return executeToolThroughAPI('sherlock', { username });
};

export const executeTwintReal = async (params: TwintParams): Promise<ToolResult> => {
  return executeToolThroughAPI('twint', params);
};

export const executeOSINTReal = async (params: OSINTParams): Promise<ToolResult> => {
  return executeToolThroughAPI('osint', params);
};

// Advanced tools with real implementations
export const executeShieldAIReal = async (params: ShieldAIParams): Promise<ToolResult> => {
  return executeToolThroughAPI('shield-ai', params);
};

export const executeRapidPayloadReal = async (params: RapidPayloadParams): Promise<ToolResult> => {
  return executeToolThroughAPI('rapidpayload', params);
};

export const executeHackingToolReal = async (params: HackingToolParams): Promise<ToolResult> => {
  return executeToolThroughAPI('hackingtool', params);
};

export const executeFFmpegReal = async (params: FFmpegParams): Promise<ToolResult> => {
  return executeToolThroughAPI('ffmpeg', params);
};

export const executeSecurityAdminReal = async (params: SecurityAdminParams): Promise<ToolResult> => {
  return executeToolThroughAPI('security-admin', params);
};

/**
 * Setup all external tools from their GitHub repositories
 * @returns Promise resolving to setup results
 */
export const setupAllTools = async (): Promise<{
  success: boolean;
  results: Record<string, boolean>;
}> => {
  console.log('Setting up all external tools...');
  
  try {
    // First, try using the server API to set up tools
    const response = await imperialServerService.executeOsintTool('setup-tools', {
      tools: [
        'cameradar', 'ipcam_search', 'speed-camera', 'cctv', 'camerattack',
        'web-check', 'webhack', 'photon', 'backhack',
        'torbot', 'botexploits',
        'sherlock', 'twint', 'osint',
        'shield-ai', 'hackingtool', 'security-admin',
        'ffmpeg', 'shinobi'
      ]
    });
    
    if (response && response.success) {
      return response.data;
    }
  } catch (error) {
    console.error('Error using server API to set up tools:', error);
  }
  
  // Fallback to local setup if server API fails
  const results: Record<string, boolean> = {};
  let allSuccess = true;
  
  // Set up each tool
  for (const toolName of [
    'cameradar', 'ipcam_search', 'speed-camera', 'cctv', 'camerattack',
    'web-check', 'webhack', 'photon', 'backhack',
    'torbot', 'botexploits',
    'sherlock', 'twint', 'osint',
    'shield-ai', 'hackingtool', 'security-admin',
    'ffmpeg', 'shinobi'
  ]) {
    console.log(`Setting up ${toolName}...`);
    const success = await setupTool(toolName);
    results[toolName] = success;
    
    if (!success) {
      allSuccess = false;
    }
  }
  
  return {
    success: allSuccess,
    results
  };
};

/**
 * Get real implementation of a tool
 */
export const getRealImplementation = <T extends Function>(
  toolName: string,
  realImplementation: T
): T => {
  console.log(`Using real implementation for ${toolName}`);
  return realImplementation;
};

/**
 * Execute a tool by name
 */
export const executeToolByName = async (toolName: string, params: any): Promise<ToolResult> => {
  try {
    const result = await simulateToolExecution(toolName, params);
    return {
      success: result?.success || false,
      data: result?.data || {},
      error: result?.error,
      simulatedData: true
    };
  } catch (error) {
    return {
      success: false,
      data: {},
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      simulatedData: true
    };
  }
};

/**
 * Simulate tool execution
 */
const simulateToolExecution = async (toolName: string, params: any): Promise<ToolResult> => {
  // Check if tool is available locally
  const isAvailable = await checkToolAvailability(toolName);
  
  if (isAvailable) {
    // Convert params to array of args for command-line style execution
    const args: string[] = [];
    
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === 'boolean' && value) {
        args.push(`--${key}`);
      } else if (value !== undefined && value !== null && value !== '') {
        args.push(`--${key}`, value.toString());
      }
    });
    
    // Fix: Handle the case when data might be undefined in ToolExecutionResult
    const result = await executeExternalTool(toolName, args);
    return {
      success: result.success,
      data: result.data || {}, // Ensure data is always defined
      error: result.error,
      simulatedData: false
    };
  }
  
  // If tool is not available, try to set it up
  const setupSuccess = await setupTool(toolName);
  
  if (setupSuccess) {
    console.log(`Successfully set up ${toolName}, trying execution again...`);
    return simulateToolExecution(toolName, params);
  }
  
  console.error(`Tool ${toolName} is not available and could not be set up`);
  return {
    success: false,
    data: null,
    error: `Tool ${toolName} is not available and could not be set up automatically.`,
    simulatedData: false
  };
};
