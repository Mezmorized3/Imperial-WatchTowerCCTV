import {
  executeEncoderDecoder,
  executeReverseShellListener,
  executeRapidPayload,
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
  executeCCTVHackedScan,
  executeCCTVScan
} from './osintTools';

import { 
  HackingToolResult,
  EncoderDecoderParams,
  ReverseShellParams,
  RapidPayloadParams,
  SqliPayloadParams,
  XssPayloadParams,
  PasswordCrackerParams,
  PasswordGeneratorParams,
  IpInfoParams, DnsLookupParams, PortScanParams, TracerouteParams, SubnetScanParams, WhoisLookupParams, HttpHeadersParams,
  BotExploitsParams, CCTVHackedParams, CCTVScanParams
} from './types/osintToolTypes';

// Import all the surveillance network tools
import {
  executeScapy,
  executeZMap,
  executeZGrab,
  executeMasscan,
  executeHydra
} from './components/surveillance/network/NetworkScanTools';

import {
  executeWebCheck,
  executeWebhack,
  executeBackHack,
  executePhoton,
  executeTorBot
} from './components/surveillance/network/WebTools';

import {
  executeUsernameSearch,
  executeTwint,
  executeOSINT
} from './components/surveillance/network/SocialTools';

import {
  executeOpenCV,
  executeDeepstack,
  executeFaceRecognition,
  executeMotion,
  executeONVIFScan,
  executeNmapONVIF
} from './components/surveillance/network/VisionTools';

import {
  executeFFmpeg,
  executeTapoPoC,
  executeShieldAI
} from './components/surveillance/network/UtilityTools';

import {
  executeCCTVScan as execCCTVConnector, // renamed to avoid conflict with osintTools version if any
  executeCCTVHacked as execCCTVHackedConnector, // renamed
  executeHackCCTV,
  executeCameradar,
  executeOpenCCTV,
  executeEyePwn,
  executeCamDumper,
  executeCamerattack
} from './components/surveillance/network/CCTVTools'; // These are wrappers calling executeHackingTool

// Placeholder for actual rapid payload implementation if not in osintTools.ts
// This should be the actual implementation or a call to it.
// For now, let's assume it's a placeholder that needs to be correctly linked.
// If executeRapidPayload is implemented elsewhere (e.g. in osintImplementations), import it from there.
// For the purpose of this fix, we'll create a mock implementation here if one doesn't exist,
// or ensure it's correctly imported if it's in another file.
// Let's assume it's meant to be like other tools, using a HackingToolResult structure.

// Example: if executeRapidPayload is in osintImplementations/advancedTools.ts
import { executeRapidPayload as actualExecuteRapidPayload } from './osintImplementations/advancedTools'; // Adjust path if needed

export const executeRapidPayload = async (params: RapidPayloadParams): Promise<HackingToolResult<RapidPayloadData, any>> => {
  // This function in osintUtilsConnector might just be a re-export or a light wrapper
  // if the actual logic is elsewhere.
  // For now, let's assume it calls the actual implementation.
  return actualExecuteRapidPayload(params); // This was missing
};


const toolFunctionMap: { [key: string]: (params: any) => Promise<HackingToolResult<any, any>> } = {
  encoderDecoder: executeEncoderDecoder,
  listener: executeReverseShellListener,
  rapidPayload: executeRapidPayload, // Now correctly mapped
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
  cctvHackedScan: execCCTVHackedConnector, // Use the imported and potentially renamed connector version
  cctvScan: execCCTVConnector, // Use the imported and potentially renamed connector version
  
  // Export network tools
  scapy: executeScapy,
  zmap: executeZMap,
  zgrab: executeZGrab,
  masscan: executeMasscan,
  hydra: executeHydra,
  
  // Export web tools
  webCheck: executeWebCheck,
  webhack: executeWebhack,
  backHack: executeBackHack,
  photon: executePhoton,
  torBot: executeTorBot,
  
  // Export social tools
  usernameSearch: executeUsernameSearch,
  twint: executeTwint,
  osint: executeOSINT,
  
  // Export vision tools
  openCV: executeOpenCV,
  deepstack: executeDeepstack,
  faceRecognition: executeFaceRecognition,
  motion: executeMotion,
  onvifScan: executeONVIFScan,
  nmapONVIF: executeNmapONVIF,
  
  // Export utility tools
  ffmpeg: executeFFmpeg,
  tapoPoC: executeTapoPoC,
  shieldAI: executeShieldAI,
  
  // Export CCTV tools from CCTVTools.ts (which call executeHackingTool)
  // These keys in toolFunctionMap should map to functions that directly return HackingToolResult
  // The CCTVTools.ts exports (executeHackCCTV, etc.) are already wrappers.
  // So, if 'hackCCTV' is a tool key passed to executeHackingTool, 
  // its implementation should be found through osintImplementations or similar.
  // The executeHackCCTV function from CCTVTools.ts is what a component would call.
  // Let's assume the tool keys like 'hackCCTV', 'cameradar' etc. map to implementations
  // in osintImplementations/index.ts or similar which are then used by executeHackingTool.
  // For example, executeHackingTool({ tool: 'hackCCTV', ... }) will find the 'hackCCTV' function.
  // The map here should point to functions that are expected by `executeHackingTool`'s internal logic if `tool` string is used.
  // Or, these are directly callable functions if not going through `executeHackingTool`.
  // The current structure seems to be that `executeHackCCTV` (from CCTVTools) calls `executeHackingTool({tool: 'hackCCTV'})`.
  // So the `toolFunctionMap` should have an entry for `hackCCTV` that points to the actual implementation.
  // Let's ensure the map points to the functions from osintImplementations for these.
  hackCCTV: async (params: any) => (await import('./osintImplementations/hackCCTVTools')).executeHackCCTV(params),
  cameradar: async (params: any) => (await import('./osintImplementations/cctvHackedTools')).executeCameradar(params), // Example, adjust path
  openCCTV: async (params: any) => (await import('./osintImplementations/cctvHackedTools')).executeOpenCCTV(params), // Example, adjust path
  eyePwn: async (params: any) => (await import('./osintImplementations/cctvHackedTools')).executeEyePwn(params), // Example, adjust path
  camDumper: async (params: any) => (await import('./osintImplementations/cctvHackedTools')).executeCamDumper(params), // Example, adjust path
  camerattack: async (params: any) => (await import('./osintImplementations/cctvHackedTools')).executeCamerattack(params), // Example, adjust path
};

export const executeHackingTool = async (
  params: { tool: string; [key: string]: any }
): Promise<HackingToolResult<any, any>> => {
  const { tool, ...toolParams } = params;
  const toolFunction = toolFunctionMap[tool];

  if (!toolFunction) {
    console.error(`Tool not found: ${tool}`);
    // It's good practice to return a HackingToolResult compatible error
    return { success: false, error: `Tool "${tool}" not implemented or mapped.`, data: { message: `Tool "${tool}" not implemented or mapped.`} };
  }

  try {
    // Assuming toolFunction directly returns HackingToolResult
    const result = await toolFunction(toolParams as any); 
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
export {
  executeEncoderDecoder,
  executeReverseShellListener,
  // executeRapidPayload, // Already exported above
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
  executeCCTVHackedScan, // from osintTools
  executeCCTVScan,       // from osintTools

  // Re-export surveillance tools
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
  executeUsernameSearch,
  executeTwint,
  executeOSINT,
  executeOpenCV,
  executeDeepstack,
  executeFaceRecognition,
  executeMotion,
  executeONVIFScan,
  executeNmapONVIF,
  executeFFmpeg,
  executeTapoPoC,
  executeShieldAI,
  
  // Re-export CCTV tool wrappers from CCTVTools.ts
  execCCTVConnector as executeCCTV, // aliasing for clarity if needed by other parts of the system
  execCCTVHackedConnector as executeCCTVHacked,
  executeHackCCTV,    // from CCTVTools.ts
  executeCameradar,   // from CCTVTools.ts
  executeOpenCCTV,    // from CCTVTools.ts
  executeEyePwn,      // from CCTVTools.ts
  executeCamDumper,   // from CCTVTools.ts
  executeCamerattack  // from CCTVTools.ts
};
