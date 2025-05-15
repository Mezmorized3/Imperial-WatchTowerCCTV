
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
  executeCCTVScan as execCCTV,
  executeCCTVHacked as execCCTVHacked,
  executeHackCCTV,
  executeCameradar,
  executeOpenCCTV,
  executeEyePwn,
  executeCamDumper,
  executeCamerattack
} from './components/surveillance/network/CCTVTools';

const toolFunctionMap: { [key: string]: (params: any) => Promise<HackingToolResult<any, any>> } = {
  encoderDecoder: executeEncoderDecoder,
  listener: executeReverseShellListener,
  rapidPayload: executeRapidPayload,
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
  cctvHackedScan: executeCCTVHackedScan,
  cctvScan: executeCCTVScan,
  
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
  
  // Export CCTV tools
  cctv: execCCTV,
  cctvHacked: execCCTVHacked,
  hackCCTV: executeHackCCTV,
  cameradar: executeCameradar,
  openCCTV: executeOpenCCTV,
  eyePwn: executeEyePwn,
  camDumper: executeCamDumper,
  camerattack: executeCamerattack
};

export const executeHackingTool = async (
  params: { tool: string; [key: string]: any }
): Promise<HackingToolResult<any, any>> => {
  const { tool, ...toolParams } = params;
  const toolFunction = toolFunctionMap[tool];

  if (!toolFunction) {
    console.error(`Tool not found: ${tool}`);
    return { success: false, error: `Tool "${tool}" not implemented or mapped.` };
  }

  try {
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

// Re-export all the tool functions
export {
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
  executeHackCCTV,
  executeCameradar,
  executeOpenCCTV,
  executeEyePwn,
  executeCamDumper,
  executeCamerattack
};
