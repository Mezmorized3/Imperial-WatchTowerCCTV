
/**
 * Re-export all OSINT tool types from their specific modules
 * This file is maintained for backward compatibility
 */

// Import types directly to avoid namespace conflicts
import { ToolParams, ToolResult, UsernameResult } from './types/baseTypes';
import { CameraResult, CCTVParams, CCTVExplorerParams } from './types/cameraTypes';
import { NetworkScanParams, TorBotParams } from './types/networkToolTypes';
import { WebCheckParams, WebHackParams } from './types/webToolTypes';
import { SocialSearchParams, SocialPostData } from './types/socialToolTypes';

// Export all imported types
export type {
  ToolParams,
  ToolResult,
  UsernameResult,
  CameraResult,
  CCTVParams,
  CCTVExplorerParams,
  NetworkScanParams,
  TorBotParams,
  WebCheckParams,
  WebHackParams,
  SocialSearchParams,
  SocialPostData
};

// Note: We're using export type to avoid ambiguity errors with isolatedModules
