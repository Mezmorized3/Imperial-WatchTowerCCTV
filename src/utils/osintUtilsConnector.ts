import {
  executeEncoderDecoder,
  executeReverseShellListener,
  // executeRapidPayload, // This will be handled by the specific import below
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
  // executeBotExploits, // To be imported from osintImplementations
  // executeCCTVHackedScan, // To be imported from osintImplementations or specific CCTV files
  // executeCCTVScan // To be imported from osintImplementations or specific CCTV files
} from './osintImplementations/baseOsintTools'; // Assuming these are now in baseOsintTools

import { 
  HackingToolResult,
  EncoderDecoderParams,
  ReverseShellParams,
  RapidPayloadParams, RapidPayloadData, // Import RapidPayloadData
  SqliPayloadParams,
  XssPayloadParams,
  PasswordCrackerParams,
  PasswordGeneratorParams,
  IpInfoParams, DnsLookupParams, PortScanParams, TracerouteParams, SubnetScanParams, WhoisLookupParams, HttpHeadersParams,
  BotExploitsParams, // Corrected type
  CCTVHackedParams, // Corrected type
  CCTVScanParams,   // Corrected type
  BaseToolParams    // Import BaseToolParams
} from './types/osintToolTypes';

// Import implementations from their new locations in osintImplementations
import {
  executeScapy,
  executeZMap,
  executeZGrab,
  executeMasscan,
  executeHydra
} from './osintImplementations/networkScanTools';

import {
  executeWebCheck,
  executeWebhack,
  executeBackHack,
  executePhoton,
  executeTorBot
} from './osintImplementations/webTools';

import {
  executeUsernameSearch, // Consider aliasing if baseOsintTools has a different one.
  executeTwint,
  executeOSINT
} from './osintImplementations/socialTools';

import {
  executeOpenCV,
  executeDeepstack,
  executeFaceRecognition,
  executeMotion,
  executeONVIFScan, // This is the one from visionTools.ts
  executeNmapONVIF
} from './osintImplementations/visionTools';

import {
  executeFFmpeg,
  executeTapoPoC,
  executeShieldAI
} from './osintImplementations/utilityTools';

// Import CCTV tool wrappers from the components/surveillance/network directory as they are service-like
import {
  executeCCTVScan as execCCTVConnector, 
  executeCCTVHacked as execCCTVHackedConnector, 
  executeHackCCTV as execHackCCTVConnector, // Use distinct names for these connector-level functions
  executeCameradar as execCameradarConnector,
  executeOpenCCTV as execOpenCCTVConnector,
  executeEyePwn as execEyePwnConnector,
  executeCamDumper as execCamDumperConnector,
  executeCamerattack as execCamerattackConnector
} from '../components/surveillance/network/CCTVTools'; // Corrected path

// Import the actual executeRapidPayload implementation
import { executeRapidPayload as actualExecuteRapidPayload } from './osintImplementations/advancedTools';

// This executeRapidPayload is the one components should import from the connector.
export const executeRapidPayload = async (params: RapidPayloadParams): Promise<HackingToolResult<RapidPayloadData, any>> => {
  return actualExecuteRapidPayload(params);
};

// Import base tool implementations for cctvScan, cctvHackedScan, botExploits if they are in baseOsintTools
import { 
    executeCCTVScan as executeBaseCCTVScan,
    executeCCTVHackedScan as executeBaseCCTVHackedScan,
    executeBotExploits 
} from './osintImplementations/baseOsintTools';

// Import specific implementations for hackCCTV, cameradar etc. from their dedicated files in osintImplementations
import { executeHackCCTV as implHackCCTV } from './osintImplementations/hackCCTVTools';
import { 
    executeCameradar as implCameradar, 
    executeOpenCCTV as implOpenCCTV, 
    executeEyePwn as implEyePwn, 
    executeCamDumper as implCamDumper, 
    executeCamerattack as implCamerattack 
} from './osintImplementations/cctvHackedTools';


const toolFunctionMap: { [key: string]: (params: BaseToolParams) => Promise<HackingToolResult<any, any>> } = {
  encoderDecoder: executeEncoderDecoder,
  listener: executeReverseShellListener,
  rapidPayload: actualExecuteRapidPayload, // Use the actual implementation here
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
  botExploits: executeBotExploits, // From baseOsintTools

  // Mapped to implementations from osintImplementations (not the wrappers from ../components)
  cctvHackedScan: executeBaseCCTVHackedScan, // From baseOsintTools
  cctvScan: executeBaseCCTVScan,             // From baseOsintTools
  
  scapy: executeScapy,
  zmap: executeZMap,
  zgrab: executeZGrab,
  masscan: executeMasscan,
  hydra: executeHydra,
  
  webCheck: executeWebCheck,
  webhack: executeWebhack,
  backHack: executeBackHack,
  photon: executePhoton,
  torBot: executeTorBot,
  
  usernameSearch: executeUsernameSearch,
  twint: executeTwint,
  osint: executeOSINT,
  
  openCV: executeOpenCV,
  deepstack: executeDeepstack,
  faceRecognition: executeFaceRecognition,
  motion: executeMotion,
  onvifScan: executeONVIFScan, // from visionTools
  nmapONVIF: executeNmapONVIF,
  
  ffmpeg: executeFFmpeg,
  tapoPoC: executeTapoPoC,
  shieldAI: executeShieldAI,
  
  // These map to the *implementations* from osintImplementations, not the wrappers in CCTVTools.ts
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
  // ... keep existing code (executeHackingTool implementation)
  const { tool, ...toolParams } = params;
  const toolFunction = toolFunctionMap[tool];

  if (!toolFunction) {
    console.error(`Tool not found: ${tool}`);
    return { success: false, error: `Tool "${tool}" not implemented or mapped.`, data: { message: `Tool "${tool}" not implemented or mapped.`} };
  }

  try {
    const result = await toolFunction(toolParams as BaseToolParams); 
    return result;
  } catch (error) {
    console.error(`Error executing tool ${tool}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : `An unknown error occurred while executing ${tool}.`,
      data: { message: error instanceof Error ? error.message : `An unknown error occurred while executing ${tool}.` }
    };
  }
};

// Re-export all the tool functions that components might call directly
// These should be the "user-facing" functions, which might be wrappers or direct implementations.
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
  executeBotExploits,      // From baseOsintTools
  executeBaseCCTVHackedScan as executeCCTVHackedScan, // Re-export the base implementation
  executeBaseCCTVScan as executeCCTVScan,          // Re-export the base implementation

  // Re-export surveillance tools (implementations from osintImplementations)
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
  executeUsernameSearch, // Or aliased executeSocialUsernameSearch
  executeTwint,
  executeOSINT,          // Or aliased executeSocialOSINT
  executeOpenCV,
  executeDeepstack,
  executeFaceRecognition,
  executeMotion,
  executeONVIFScan,      // From visionTools
  executeNmapONVIF,
  executeFFmpeg,
  executeTapoPoC,
  executeShieldAI,
  
  // Re-export CCTV tool wrappers from CCTVTools.ts (components/surveillance/network/CCTVTools)
  // These are the functions components like HackCCTVTool.tsx would call.
  execCCTVConnector as executeCCTV, 
  execCCTVHackedConnector as executeCCTVHacked,
  execHackCCTVConnector,    // Exporting the connector version
  execCameradarConnector,   
  execOpenCCTVConnector,    
  execEyePwnConnector,      
  execCamDumperConnector,   
  execCamerattackConnector  
};
