
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
  executeBotExploits,      // Added
  executeCCTVHackedScan,   // Added
  executeCCTVScan          // Added
  // ... import other specific tool executors from osintTools.ts
} from './osintTools';

import { 
  HackingToolResult,
  // Ensure all relevant Param types are imported if needed for specific validation
  EncoderDecoderParams,
  ReverseShellParams,
  RapidPayloadParams,
  SqliPayloadParams,
  XssPayloadParams,
  PasswordCrackerParams,
  PasswordGeneratorParams,
  IpInfoParams, DnsLookupParams, PortScanParams, TracerouteParams, SubnetScanParams, WhoisLookupParams, HttpHeadersParams,
  BotExploitsParams, CCTVHackedParams, CCTVScanParams // Added
} from './types/osintToolTypes';

const toolFunctionMap: { [key: string]: (params: any) => Promise<HackingToolResult<any, any>> } = {
  encoderDecoder: executeEncoderDecoder,
  listener: executeReverseShellListener, // Assuming 'listener' is the key for ReverseShell
  rapidPayload: executeRapidPayload,
  sqliPayloadTest: executeSqliPayloadTest, // Assuming 'sqliPayloadTest' is the key
  xssPayloadSearch: executeXssPayloadSearch,
  passwordCracker: executePasswordCracker,
  passwordGenerator: executePasswordGenerator,
  ipInfo: executeIpInfo,
  dnsLookup: executeDnsLookup,
  portScan: executePortScan,
  traceroute: executeTraceroute,
  subnetScan: executeSubnetScan,
  whois: executeWhoisLookup, // Assuming 'whois' is the key
  httpHeaders: executeHttpHeaders, // Assuming 'httpHeaders' is the key
  botExploits: executeBotExploits, // Added
  cctvHackedScan: executeCCTVHackedScan, // Added
  cctvScan: executeCCTVScan // Added
  // ... map other tools
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
    // Type assertion for toolParams might be needed if specific tools have very distinct param structures not covered by 'any'
    // For instance, if executeRapidPayload expects RapidPayloadParams specifically.
    // However, the map already uses `(params: any)`, so this should broadly work.
    const result = await toolFunction(toolParams as any); // Cast toolParams if necessary or ensure map value types are specific
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
