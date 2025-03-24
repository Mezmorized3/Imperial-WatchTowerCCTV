
/**
 * Re-export all OSINT tool types from their specific modules
 * This file is maintained for backward compatibility
 */

// Import types directly to avoid namespace conflicts
import { ToolParams, ToolResult, UsernameResult } from './types/baseTypes';
import { CameraResult, CCTVParams, CCTVExplorerParams } from './types/cameraTypes';
import { NetworkScanParams, TorBotParams } from './types/networkToolTypes';
import { WebCheckParams, WebhackParams } from './types/webToolTypes';
import { SocialSearchParams, SocialPostData } from './types/socialToolTypes';

// Export all imported types
export {
  ToolParams,
  ToolResult,
  UsernameResult,
  CameraResult,
  CCTVParams,
  CCTVExplorerParams,
  NetworkScanParams,
  TorBotParams,
  WebCheckParams,
  WebhackParams,
  SocialSearchParams,
  SocialPostData
};

// Note: We're not re-exporting all types to avoid ambiguity errors
// For full type access, import directly from the specific module
