/**
 * Connector between UI components and OSINT tool implementations
 * Provides a unified interface for executing OSINT tools
 */

import { toast } from '@/components/ui/use-toast';

import { 
  executeUsernameSearch, 
  executeCameradar, 
  executeIPCamSearch,
  executeWebCheck, 
  executeCCTV, 
  executeTorBot,
  executeWebhack, 
  executeSpeedCamera, 
  executeTwint,
  executePhoton, 
  executeOSINT, 
  executeShieldAI,
  executeBotExploits, 
  executeCamerattack, 
  executeBackHack,
  executeImperialOculus,
  executeHackCCTV,
  executeRapidPayload,
  executeHackingTool,
  executeSecurityAdmin,
  executeFFmpeg
} from './osintImplementations';

// Import tool types
import { ToolParams, ToolResult, ProxyConfig } from './types/baseTypes';
import { HackCCTVParams } from './types/cameraTypes';
import { TorBotParams, BotExploitsParams, ImperialOculusParams } from './types/networkToolTypes';
import { WebCheckParams, WebHackParams, BackHackParams } from './types/webToolTypes';
import { UsernameParams, TwintParams, OSINTParams } from './types/socialToolTypes';
import { RapidPayloadParams, HackingToolParams, SecurityAdminParams, FFmpegParams } from './types/advancedToolTypes';
import { CCTVParams, SpeedCameraParams, CamerattackParams } from './types/cameraTypes';
import { ShieldAIParams } from './types/networkToolTypes';

// Define a generic result type for tool execution
interface ToolExecutionResult<T> {
  success: boolean;
  error?: string;
  data?: T;
  simulatedData?: boolean;
}

// Function to execute a username search tool
export async function executeUsernameTool(
  username: string,
  toolParams?: any,
  proxyConfig?: ProxyConfig
): Promise<ToolResult> {
  // Check if username is provided
  if (!username) {
    return {
      success: false,
      error: 'Username is required',
      data: null,
      simulatedData: true
    };
  }
  
  try {
    // For username-based tools, show a toast notification
    toast({
      title: `Searching for username ${username}`,
      description: `This may take a few moments...`,
    });
    
    // Execute the username search tool
    const result = await executeUsernameSearch({
      username,
      ...(toolParams || {})
    });
    
    return {
      success: result.success,
      data: result.data || {},
      simulatedData: result.simulatedData
    };
  } catch (error) {
    console.error('Error executing username tool:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error executing username tool',
      data: {},
      simulatedData: true
    };
  }
}

// Function to execute a web check tool
export async function executeWebTool(
  domain: string,
  toolName: string,
  toolParams?: any,
  proxyConfig?: ProxyConfig
): Promise<ToolResult> {
  // Check if domain is provided
  if (!domain) {
    return {
      success: false,
      error: 'Domain is required',
      data: null,
      simulatedData: true
    };
  }
  
  try {
    // For web-based tools, show a toast notification
    toast({
      title: `Analyzing ${domain}`,
      description: `Using ${toolName}. This may take a few moments...`,
    });
    
    let result: ToolExecutionResult<any>;
    
    // Execute the appropriate web tool based on toolName
    switch (toolName) {
      case 'webcheck':
        result = await executeWebCheck({
          domain,
          ...(toolParams || {})
        });
        break;
      case 'webhack':
        result = await executeWebhack({
          target: domain,
          ...(toolParams || {})
        });
        break;
      case 'photon':
        result = await executePhoton({
          url: domain,
          ...(toolParams || {})
        });
        break;
      case 'backhack':
        result = await executeBackHack({
          target: domain,
          ...(toolParams || {})
        });
        break;
      default:
        throw new Error(`Unknown web tool: ${toolName}`);
    }
    
    return {
      success: result.success,
      data: result.data || {},
      simulatedData: result.simulatedData
    };
  } catch (error) {
    console.error(`Error executing ${toolName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : `Unknown error executing ${toolName}`,
      data: {},
      simulatedData: true
    };
  }
}

// Function to execute a camera tool
export async function executeCameraTool(
  target: string,
  toolName: string,
  toolParams?: any,
  proxyConfig?: ProxyConfig
): Promise<ToolResult> {
  // Check if target is provided
  if (!target) {
    return {
      success: false,
      error: 'Target is required',
      data: null,
      simulatedData: true
    };
  }
  
  try {
    // For camera-based tools, show a toast notification
    toast({
      title: `Scanning ${target}`,
      description: `Using ${toolName}. This may take a few moments...`,
    });
    
    let result: ToolExecutionResult<any>;
    
    // Execute the appropriate camera tool based on toolName
    switch (toolName) {
      case 'cameradar':
        result = await executeCameradar({
          target,
          ...(toolParams || {})
        });
        break;
      case 'ipcamsearch':
        result = await executeIPCamSearch({
          subnet: target,
          ...(toolParams || {})
        });
        break;
      case 'cctv':
        result = await executeCCTV({
          region: target,
          ...(toolParams || {})
        });
        break;
      case 'speedcamera':
        result = await executeSpeedCamera({
          rtspUrl: target,
          ...(toolParams || {})
        });
        break;
      case 'camerattack':
        result = await executeCamerattack({
          target,
          ...(toolParams || {})
        });
        break;
      case 'hackcctv':
        result = await executeHackCCTV({
          target,
          ...(toolParams || {})
        });
        break;
      default:
        throw new Error(`Unknown camera tool: ${toolName}`);
    }
    
    return {
      success: result.success,
      data: result.data || {},
      simulatedData: result.simulatedData
    };
  } catch (error) {
    console.error(`Error executing ${toolName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : `Unknown error executing ${toolName}`,
      data: {},
      simulatedData: true
    };
  }
}

// Function to execute a network tool
export async function executeNetworkTool(
  target: string,
  toolName: string,
  toolParams?: any,
  proxyConfig?: ProxyConfig
): Promise<ToolResult> {
  // Check if target is provided
  if (!target) {
    return {
      success: false,
      error: 'Target is required',
      data: null,
      simulatedData: true
    };
  }
  
  try {
    // For network-based tools, show a toast notification
    toast({
      title: `Scanning ${target}`,
      description: `Using ${toolName}. This may take a few moments...`,
    });
    
    let result: ToolExecutionResult<any>;
    
    // Execute the appropriate network tool based on toolName
    switch (toolName) {
      case 'torbot':
        result = await executeTorBot({
          url: target,
          ...(toolParams || {})
        });
        break;
      case 'imperialoculus':
        result = await executeImperialOculus({
          target,
          ...(toolParams || {})
        });
        break;
      case 'botexploits':
        result = await executeBotExploits({
          target,
          ...(toolParams || {})
        });
        break;
      case 'shieldai':
        result = await executeShieldAI({
          target,
          ...(toolParams || {})
        });
        break;
      default:
        throw new Error(`Unknown network tool: ${toolName}`);
    }
    
    return {
      success: result.success,
      data: result.data || {},
      simulatedData: result.simulatedData
    };
  } catch (error) {
    console.error(`Error executing ${toolName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : `Unknown error executing ${toolName}`,
      data: {},
      simulatedData: true
    };
  }
}

// Function to execute a social tool
export async function executeSocialTool(
  target: string,
  toolName: string,
  toolParams?: any,
  proxyConfig?: ProxyConfig
): Promise<ToolResult> {
  // Check if target is provided
  if (!target) {
    return {
      success: false,
      error: 'Target is required',
      data: null,
      simulatedData: true
    };
  }
  
  try {
    // For social-based tools, show a toast notification
    toast({
      title: `Scanning ${target}`,
      description: `Using ${toolName}. This may take a few moments...`,
    });
    
    let result: ToolExecutionResult<any>;
    
    // Execute the appropriate social tool based on toolName
    switch (toolName) {
      case 'twint':
        result = await executeTwint({
          username: target,
          ...(toolParams || {})
        });
        break;
      case 'osint':
        result = await executeOSINT({
          target,
          ...(toolParams || {})
        });
        break;
      default:
        throw new Error(`Unknown social tool: ${toolName}`);
    }
    
    return {
      success: result.success,
      data: result.data || {},
      simulatedData: result.simulatedData
    };
  } catch (error) {
    console.error(`Error executing ${toolName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : `Unknown error executing ${toolName}`,
      data: {},
      simulatedData: true
    };
  }
}

// Function to execute an advanced tool
export async function executeAdvancedTool(
  target: string,
  toolName: string,
  toolParams?: any,
  proxyConfig?: ProxyConfig
): Promise<ToolResult> {
  // Check if target is provided
  if (!target) {
    return {
      success: false,
      error: 'Target is required',
      data: null,
      simulatedData: true
    };
  }
  
  try {
    // For advanced tools, show a toast notification
    toast({
      title: `Executing ${toolName}`,
      description: `This may take a few moments...`,
    });
    
    let result: ToolExecutionResult<any>;
    
    // Execute the appropriate advanced tool based on toolName
    switch (toolName) {
      case 'rapidpayload':
        result = await executeRapidPayload({
          platform: target,
          ...(toolParams || {})
        });
        break;
      case 'hackingtool':
        result = await executeHackingTool({
          target,
          ...(toolParams || {})
        });
        break;
      case 'securityadmin':
        result = await executeSecurityAdmin({
          target,
          ...(toolParams || {})
        });
        break;
      case 'ffmpeg':
        result = await executeFFmpeg({
          input: target,
          ...(toolParams || {})
        });
        break;
      default:
        throw new Error(`Unknown advanced tool: ${toolName}`);
    }
    
    return {
      success: result.success,
      data: result.data || {},
      simulatedData: result.simulatedData
    };
  } catch (error) {
    console.error(`Error executing ${toolName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : `Unknown error executing ${toolName}`,
      data: {},
      simulatedData: true
    };
  }
}
