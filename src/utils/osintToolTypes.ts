
/**
 * Re-export all OSINT tool types from their specific modules
 * This file is maintained for backward compatibility
 */

// Import types directly to avoid namespace conflicts
import { 
  ToolParams, 
  ToolResult, 
  UsernameResult, 
  ScanResult, 
  ProxyConfig, 
  ThreatIntelData
} from './types/baseTypes';

import { 
  CameraResult, 
  CCTVParams, 
  CCTVExplorerParams, 
  HackCCTVParams, 
  BackHackParams, 
  CamDumperParams, 
  OpenCCTVParams, 
  EyePwnParams, 
  IngramParams
} from './types/cameraTypes';

import { 
  NetworkScanParams, 
  TorBotParams, 
  BotExploitsParams,
  ChromeExtensionParams,
  ImperialOculusParams
} from './types/networkToolTypes';

import { 
  WebCheckParams, 
  WebHackParams
} from './types/webToolTypes';

import { 
  SocialSearchParams, 
  SocialPostData
} from './types/socialToolTypes';

import {
  RapidPayloadParams,
  HackingToolParams,
  SecurityAdminParams,
  FFmpegParams,
  ImperialShieldResult
} from './types/advancedToolTypes';

// Export all imported types using 'export type' for isolatedModules compatibility
export type { ToolParams };
export type { ToolResult };
export type { UsernameResult };
export type { ScanResult };
export type { ProxyConfig };
export type { ThreatIntelData };
export type { CameraResult };
export type { CCTVParams };
export type { CCTVExplorerParams };
export type { HackCCTVParams };
export type { BackHackParams };
export type { CamDumperParams };
export type { OpenCCTVParams };
export type { EyePwnParams };
export type { IngramParams };
export type { NetworkScanParams };
export type { TorBotParams };
export type { BotExploitsParams };
export type { ChromeExtensionParams };
export type { ImperialOculusParams };
export type { WebCheckParams };
export type { WebHackParams };
export type { SocialSearchParams };
export type { SocialPostData };
export type { RapidPayloadParams };
export type { HackingToolParams };
export type { SecurityAdminParams };
export type { FFmpegParams };
export type { ImperialShieldResult };
