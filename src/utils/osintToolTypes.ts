
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

// Export all imported types
export {
  ToolParams,
  ToolResult,
  UsernameResult,
  ScanResult,
  ProxyConfig,
  ThreatIntelData,
  CameraResult,
  CCTVParams,
  CCTVExplorerParams,
  HackCCTVParams,
  BackHackParams,
  CamDumperParams,
  OpenCCTVParams,
  EyePwnParams,
  IngramParams,
  NetworkScanParams,
  TorBotParams,
  BotExploitsParams,
  ChromeExtensionParams,
  ImperialOculusParams,
  WebCheckParams,
  WebHackParams,
  SocialSearchParams,
  SocialPostData,
  RapidPayloadParams,
  HackingToolParams,
  SecurityAdminParams,
  FFmpegParams,
  ImperialShieldResult
};
