import {
  // Base OSINT tools (ensure these are correctly exported from baseOsintTools)
  executeEncoderDecoder,
  executeReverseShellListener,
  executeSqliPayloadTest,
  executeXssPayloadSearch,
  executePasswordCracker,
  executePasswordGenerator,
  executeIpInfo,
  executeDnsLookup,
  executePortScan,
  executeTraceroute,
  executeSubnetScan,
  executeWhoisLookup,
  executeHttpHeaders,
  executeBotExploits,
  executeCCTVScan as executeBaseCCTVScan, // Specific name for base implementation
  executeCCTVHackedScan as executeBaseCCTVHackedScan, // Specific name for base implementation
} from './osintImplementations/baseOsintTools';

import { 
  HackingToolResult, HackingToolErrorData, // Added HackingToolErrorData
  EncoderDecoderParams,
  ReverseShellParams,
  RapidPayloadParams, RapidPayloadData,
  SqliPayloadParams,
  XssPayloadParams,
  PasswordCrackerParams,
  PasswordGeneratorParams,
  IpInfoParams, DnsLookupParams, PortScanParams, TracerouteParams, SubnetScanParams, WhoisLookupParams, HttpHeadersParams,
  BotExploitsParams,
  CCTVHackedParams, CCTVHackedData,
  CCTVScanParams, CCTVScanData,
  BaseToolParams,
  WebhackParams, WebhackData,
  BackHackParams, BackHackData,
  PhotonParams, PhotonData,
  // Add other specific Params/Data types as needed by imported tools
} from './types/osintToolTypes';

// Network Scan Tools
import {
  executeScapy,
  executeZMap,
  executeZGrab,
  executeMasscan,
  executeHydra
} from './osintImplementations/networkScanTools';
// Add Params/Data types for networkScanTools if not already in osintToolTypes

// Web Tools
import {
  executeWebCheck,
  executeWebhack,
  executeBackHack,
  executePhoton,
  executeTorBot
} from './osintImplementations/webTools';
// Add Params/Data types for webTools (WebCheckParams/Data, TorBotParams/Data)

// Social Tools
import {
  executeSocialUsernameSearch, // Using aliased import
  executeTwint,
  executeSocialOSINT // Using aliased import
} from './osintImplementations/socialTools';
// Add Params/Data types for socialTools

// Vision Tools
import {
  executeOpenCV,
  executeDeepstack,
  executeFaceRecognition,
  executeMotion,
  executeGenericONVIFScan, // Using generic ONVIF scan from onvifTools.ts
  executeNmapONVIF
} from './osintImplementations/visionTools'; // visionTools should export these
// Add Params/Data types for visionTools

// Utility Tools
import {
  executeFFmpeg,
  executeTapoPoC,
  // executeShieldAI is from securityTools now
} from './osintImplementations/utilityTools';
// Add Params/Data types for utilityTools

// Security Tools
import {
  executeShieldAI,
  executeSecurityAdmin
} from './osintImplementations/securityTools';
// Security Params/Data types are in securityToolTypes.ts, imported via osintToolTypes re-export or directly

// Advanced Tools (like RapidPayload)
import { executeRapidPayload as actualExecuteRapidPayload } from './osintImplementations/advancedTools';

// Specialized CCTV/ONVIF tools from dedicated files (if not covered by generic ones)
import { executeHackCCTV as implHackCCTV } from './osintImplementations/hackCCTVTools';
import { 
    executeCameradar as implCameradar, 
    executeOpenCCTV as implOpenCCTV, 
    executeEyePwn as implEyePwn, 
    executeCamDumper as implCamDumper, 
    executeCamerattack as implCamerattack 
} from './osintImplementations/cctvHackedTools';

// Connector-level functions for CCTV that components will call
// These now wrap the direct implementations from osintImplementations/* or could be direct mappings
// For simplicity, we can map directly in toolFunctionMap and export those.
// The CCTVTools.ts in components/surveillance/network contains wrappers that call executeHackingTool.

export const executeRapidPayload = async (params: RapidPayloadParams): Promise<HackingToolResult<RapidPayloadData>> => {
  return actualExecuteRapidPayload(params);
};

export const executeCamDumper = async (params: any) => {
  return executeHackingTool({ tool: 'camDumper', ...params });
};

export const executeCamerattack = async (params: any) => {
  return executeHackingTool({ tool: 'camerattack', ...params });
};

export const executeHackCCTV = async (params: any) => {
  return executeHackingTool({ tool: 'hackCCTV', ...params });
};

export const executeCameradar = async (params: any) => {
  return executeHackingTool({ tool: 'cameradar', ...params });
};

export const executeOpenCCTV = async (params: any) => {
  return executeHackingTool({ tool: 'openCCTV', ...params });
};

export const executeEyePwn = async (params: any) => {
  return executeHackingTool({ tool: 'eyePwn', ...params });
};

export const executeOSINT = async (params: any) => {
  return executeHackingTool({ tool: 'osint', ...params });
};

const toolFunctionMap: { [key: string]: (params: BaseToolParams) => Promise<HackingToolResult<any, any>> } = {
  // Base OSINT
  encoderDecoder: executeEncoderDecoder,
  listener: executeReverseShellListener,
  sqliPayloadTest: executeSqliPayloadTest,
  xssPayloadSearch: executeXssPayloadSearch,
  passwordCracker: executePasswordCracker,
  passwordGenerator: executePasswordGenerator,
  ipInfo: executeIpInfo,
  dnsLookup: executeDnsLookup,
  portScan: executePortScan,
  traceroute: executeTraceroute,
  subnetScan: executeSubnetScan,
  whois: executeWhoisLookup,
  httpHeaders: executeHttpHeaders,
  botExploits: executeBotExploits,
  
  // Advanced
  rapidPayload: actualExecuteRapidPayload,

  // Network Scan
  scapy: executeScapy,
  zmap: executeZMap,
  zgrab: executeZGrab,
  masscan: executeMasscan,
  hydra: executeHydra,
  
  // Web
  webCheck: executeWebCheck,
  webhack: executeWebhack,
  backHack: executeBackHack,
  photon: executePhoton,
  torBot: executeTorBot,
  
  // Social
  usernameSearch: executeSocialUsernameSearch,
  twint: executeTwint,
  osint: executeSocialOSINT,
  
  // Vision
  openCV: executeOpenCV,
  deepstack: executeDeepstack,
  faceRecognition: executeFaceRecognition,
  motion: executeMotion, // from visionTools
  onvifScan: executeGenericONVIFScan, // generic ONVIF scan
  nmapONVIF: executeNmapONVIF,
  
  // Utility
  ffmpeg: executeFFmpeg,
  tapoPoC: executeTapoPoC,
  
  // Security
  shieldAI: executeShieldAI,
  securityAdmin: executeSecurityAdmin,
  
  // Specialized CCTV (implementations)
  cctvScan: executeBaseCCTVScan, // Base version for generic cctv scan
  cctvHackedScan: executeBaseCCTVHackedScan, // Base version for generic hacked scan
  hackCCTV: implHackCCTV,
  cameradar: implCameradar,
  openCCTV: implOpenCCTV,
  eyePwn: implEyePwn,
  camDumper: implCamDumper,
  camerattack: implCamerattack,
};

export const executeHackingTool = async (
  params: { tool: string; [key: string]: any }
): Promise<HackingToolResult<any, any>> => {
  const { tool, ...toolParams } = params;
  const toolFunction = toolFunctionMap[tool];

  if (!toolFunction) {
    console.error(`Tool not found: ${tool}`);
    return { success: false, error: `Tool "${tool}" not implemented or mapped.`, data: { message: `Tool "${tool}" not implemented or mapped.`} };
  }

  try {
    // Ensure the 'tool' property is part of toolParams if the specific function expects it (most do via BaseToolParams)
    const fullParams = { tool, ...toolParams } as BaseToolParams;
    const result = await toolFunction(fullParams); 
    return result;
  } catch (error) {
    console.error(`Error executing tool ${tool}:`, error);
    const errorMessage = error instanceof Error ? error.message : `An unknown error occurred while executing ${tool}.`;
    return { 
      success: false, 
      error: errorMessage,
      data: { message: errorMessage } as HackingToolErrorData
    };
  }
};

// Re-export all the tool functions that components might call directly for type safety and convenience
// These should now point to the actual implementations or the executeRapidPayload wrapper.
export {
  executeEncoderDecoder,
  executeReverseShellListener,
  // executeRapidPayload is exported above specifically
  executeSqliPayloadTest,
  executeXssPayloadSearch,
  executePasswordCracker,
  executePasswordGenerator,
  executeIpInfo,
  executeDnsLookup,
  executePortScan,
  executeTraceroute,
  executeSubnetScan,
  executeWhoisLookup,
  executeHttpHeaders,
  executeBotExploits,
  executeBaseCCTVScan as executeCCTVScan, // Exporting the base implementation for direct use
  executeBaseCCTVHackedScan as executeCCTVHackedScan, // Exporting the base implementation

  executeScapy,
  executeZMap,
  executeZGrab,
  executeMasscan,
  executeHydra,
  executeWebCheck,
  executeWebhack,
  executeBackHack,
  executePhoton,
  executeTorBot,
  executeSocialUsernameSearch,
  executeTwint,
  executeSocialOSINT,
  executeOpenCV,
  executeDeepstack,
  executeFaceRecognition,
  executeMotion,
  executeGenericONVIFScan as executeONVIFScan, // Exporting the generic ONVIF scan
  executeNmapONVIF,
  executeFFmpeg,
  executeTapoPoC,
  executeShieldAI,
  executeSecurityAdmin,
  
  // Export direct implementations of specialized CCTV tools
  implHackCCTV as executeActualHackCCTV, // Giving distinct names if needed to avoid confusion with component wrappers
  implCameradar as executeActualCameradar,
  implOpenCCTV as executeActualOpenCCTV,
  implEyePwn as executeActualEyePwn,
  implCamDumper as executeActualCamDumper,
  implCamerattack as executeActualCamerattack
};

// Note: The CCTVTools.ts in components/surveillance/network/ exports functions
// like executeCCTVScan, executeCCTVHacked etc. which internally call executeHackingTool.
// If components directly import from there, that's fine.
// If components import from here (osintUtilsConnector), they should use the names exported above.
// For clarity, if CCTVTools.ts functions are the intended public API for components,
// then this connector might not need to re-export every single CCTV implementation under those exact names.
// However, toolFunctionMap needs the direct implementations.
