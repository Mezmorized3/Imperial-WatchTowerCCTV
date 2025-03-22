
/**
 * OSINT Tools Connector
 * This module provides bridges between our mock implementations and real external tools.
 */

import { 
  ToolResult,
  CCTVParams,
  TorBotParams,
  WebHackParams,
  SpeedCameraParams,
  WebCheckParams,
  TwintParams,
  OSINTParams,
  ShieldAIParams,
  BotExploitsParams,
  CamerattackParams,
  BackHackParams,
  ImperialOculusParams,
  RapidPayloadParams,
  HackingToolParams,
  FFmpegParams,
  SecurityAdminParams
} from './osintToolTypes';

import {
  executeExternalTool,
  checkToolAvailability,
  setupTool
} from './github/externalToolsConnector';

// Camera tools with real implementations

export const executeCameradarReal = async (params: { target: string, ports?: string }): Promise<ToolResult> => {
  const args = ['-t', params.target];
  if (params.ports) args.push('-p', params.ports);
  
  const result = await executeExternalTool('cameradar', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

export const executeIPCamSearchReal = async (params: { subnet: string, protocols?: string[] }): Promise<ToolResult> => {
  const args = ['-s', params.subnet];
  if (params.protocols) {
    params.protocols.forEach(protocol => {
      args.push('-p', protocol);
    });
  }
  
  const result = await executeExternalTool('ipcam_search', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

export const executeCCTVReal = async (params: CCTVParams): Promise<ToolResult> => {
  const args = ['-r', params.region];
  if (params.limit) args.push('-l', params.limit.toString());
  if (params.saveResults) args.push('-s');
  if (params.country) args.push('-c', params.country);
  
  const result = await executeExternalTool('cctv', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

export const executeSpeedCameraReal = async (params: SpeedCameraParams): Promise<ToolResult> => {
  const args: string[] = [];
  if (params.sensitivity) args.push('-s', params.sensitivity.toString());
  if (params.resolution) args.push('-r', params.resolution);
  if (params.threshold) args.push('-t', params.threshold.toString());
  
  const result = await executeExternalTool('speed-camera', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

export const executeCamerattackReal = async (params: CamerattackParams): Promise<ToolResult> => {
  const args = ['-t', params.target];
  if (params.sessions) args.push('-s', params.sessions.toString());
  if (params.timeout) args.push('-o', params.timeout.toString());
  if (params.mode) args.push('-m', params.mode);
  
  const result = await executeExternalTool('camerattack', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

// Web tools with real implementations

export const executeWebCheckReal = async (params: WebCheckParams): Promise<ToolResult> => {
  const args = ['-d', params.domain];
  if (params.checks && params.checks.length > 0) {
    args.push('-c', params.checks.join(','));
  }
  
  const result = await executeExternalTool('web-check', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

export const executeWebhackReal = async (params: WebHackParams): Promise<ToolResult> => {
  const args = ['-t', params.target];
  if (params.mode) args.push('-m', params.mode);
  if (params.url) args.push('-u', params.url);
  
  const result = await executeExternalTool('webhack', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

export const executePhotonReal = async (params: { url: string, depth?: number }): Promise<ToolResult> => {
  const args = ['-u', params.url];
  if (params.depth) args.push('-d', params.depth.toString());
  
  const result = await executeExternalTool('photon', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

export const executeBackHackReal = async (params: BackHackParams): Promise<ToolResult> => {
  const args = ['-u', params.url];
  if (params.extractData) args.push('-e');
  if (params.target) args.push('-t', params.target);
  
  const result = await executeExternalTool('backhack', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

// Network tools with real implementations

export const executeTorBotReal = async (params: TorBotParams): Promise<ToolResult> => {
  const args = ['-u', params.url];
  if (params.level) args.push('-l', params.level.toString());
  if (params.dumpData) args.push('-d');
  if (params.mode) args.push('-m', params.mode);
  
  const result = await executeExternalTool('torbot', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

export const executeImperialOculusReal = async (params: ImperialOculusParams): Promise<ToolResult> => {
  // Since Imperial Oculus is a custom tool, we'll need to create it
  // For now, we'll map it to existing network scanning tools
  
  const args = ['-t', params.target];
  if (params.ports) args.push('-p', params.ports);
  if (params.scanType) args.push('-s', params.scanType);
  
  // Try to use nmap if available, otherwise fall back to a custom implementation
  const isNmapAvailable = await checkToolAvailability('nmap');
  const toolName = isNmapAvailable ? 'nmap' : 'imperial-oculus';
  
  const result = await executeExternalTool(toolName, args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

export const executeBotExploitsReal = async (params: BotExploitsParams): Promise<ToolResult> => {
  const args = ['-t', params.target];
  if (params.port) args.push('-p', params.port.toString());
  if (params.attackType) args.push('-a', params.attackType);
  if (params.scanType) args.push('-s', params.scanType);
  
  const result = await executeExternalTool('botexploits', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

// Social tools with real implementations

export const executeUsernameSearchReal = async (username: string): Promise<ToolResult> => {
  const args = [username];
  
  const result = await executeExternalTool('sherlock', args);
  
  return {
    success: result.success,
    data: result.data || { 
      sites: result.output?.split('\n').map(line => {
        const [name, status] = line.split(':');
        const found = status?.trim() === 'Found';
        return {
          name,
          url: `https://${name.toLowerCase()}.com/${username}`,
          found,
          accountUrl: found ? `https://${name.toLowerCase()}.com/${username}` : undefined
        };
      }).filter(site => site.name) || [],
      totalFound: result.output?.split('\n').filter(line => line.includes('Found')).length || 0
    },
    error: result.error,
    simulatedData: false
  };
};

export const executeTwintReal = async (params: TwintParams): Promise<ToolResult> => {
  const args: string[] = [];
  if (params.username) args.push('-u', params.username);
  if (params.search) args.push('-s', params.search);
  if (params.limit) args.push('-l', params.limit.toString());
  
  const result = await executeExternalTool('twint', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

export const executeOSINTReal = async (params: OSINTParams): Promise<ToolResult> => {
  const args = ['-t', params.target];
  if (params.type) args.push('-y', params.type);
  if (params.depth) args.push('-d', params.depth);
  
  const result = await executeExternalTool('osint', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

// Advanced tools with real implementations

export const executeShieldAIReal = async (params: ShieldAIParams): Promise<ToolResult> => {
  const args = ['-t', params.target];
  if (params.mode) args.push('-m', params.mode);
  if (params.depth) args.push('-d', params.depth);
  if (params.aiModel) args.push('-a', params.aiModel);
  
  const result = await executeExternalTool('shield-ai', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

export const executeRapidPayloadReal = async (params: RapidPayloadParams): Promise<ToolResult> => {
  const args = ['-o', params.targetOS, '-t', params.payloadType];
  if (params.format) args.push('-f', params.format);
  if (params.options) {
    Object.entries(params.options).forEach(([key, value]) => {
      args.push(`--${key}`, value.toString());
    });
  }
  
  const result = await executeExternalTool('rapidpayload', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

export const executeHackingToolReal = async (params: HackingToolParams): Promise<ToolResult> => {
  // Map to appropriate category and tool in the hackingtool framework
  const categoryArg = params.category || params.toolCategory || 'all';
  const args = ['-c', categoryArg, '-t', params.tool];
  
  if (params.options) {
    Object.entries(params.options).forEach(([key, value]) => {
      args.push(`--${key}`, value.toString());
    });
  }
  
  const result = await executeExternalTool('hackingtool', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
};

export const executeFFmpegReal = async (params: FFmpegParams): Promise<ToolResult> => {
  const args: string[] = [];
  
  if (params.inputStream) args.push('-i', params.inputStream);
  else if (params.input) args.push('-i', params.input);
  
  if (params.videoCodec) args.push('-c:v', params.videoCodec);
  if (params.audioCodec) args.push('-c:a', params.audioCodec);
  if (params.resolution) args.push('-s', params.resolution);
  if (params.bitrate) args.push('-b:v', params.bitrate);
  if (params.framerate) args.push('-r', params.framerate);
  
  if (params.filters && params.filters.length > 0) {
    args.push('-vf', params.filters.join(','));
  }
  
  const outputPath = params.outputPath || params.output || 'output.mp4';
  args.push(outputPath);
  
  const result = await executeExternalTool('ffmpeg', args);
  
  return {
    success: result.success,
    data: result.data || { 
      output: result.output,
      outputFile: outputPath
    },
    error: result.error,
    simulatedData: false
  };
};

export const executeSecurityAdminReal = async (params: SecurityAdminParams): Promise<ToolResult> => {
  const args = ['-c', params.command];
  if (params.scanType) args.push('-s', params.scanType);
  
  if (params.options) {
    Object.entries(params.options).forEach(([key, value]) => {
      args.push(`--${key}`, value.toString());
    });
  }
  
  const result = await executeExternalTool('security-admin', args);
  
  return {
    success: result.success,
    data: result.data || { output: result.output },
    error: result.error,
    simulatedData: false
  };
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
  
  const results: Record<string, boolean> = {};
  let allSuccess = true;
  
  try {
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
  } catch (error) {
    console.error('Error setting up tools:', error);
    return {
      success: false,
      results
    };
  }
};

/**
 * Get a real implementation of a tool if available, otherwise fall back to mock
 * @param toolName The name of the tool
 * @param mockImplementation The mock implementation function
 * @param realImplementation The real implementation function
 * @returns The appropriate implementation based on availability
 */
export const getRealOrMockImplementation = async <T extends Function>(
  toolName: string,
  mockImplementation: T,
  realImplementation: T
): Promise<T> => {
  const isAvailable = await checkToolAvailability(toolName);
  
  if (isAvailable) {
    console.log(`Using real implementation for ${toolName}`);
    return realImplementation;
  } else {
    console.log(`Using mock implementation for ${toolName} (tool not available)`);
    return mockImplementation;
  }
};
