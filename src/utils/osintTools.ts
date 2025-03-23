
/**
 * OSINT and camera discovery tools
 * This file provides a central interface for all tools
 */

// Export types for the tools
export type {
  ToolParams,
  ToolResult,
  ScanResult,
  UsernameResult,
  CameraResult,
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
  // New tool parameter types
  RapidPayloadParams,
  HackingToolParams,
  FFmpegParams,
  SecurityAdminParams,
  // Scrapy tool types
  ScrapyParams,
  ScrapyResult
} from './osintToolTypes';

// Import function implementations from specific modules
import { 
  executeUsernameSearch, 
  executeCameradar, 
  executeIPCamSearch,
  executeWebCheck, 
  executeCCTV, 
  executeTorBot,
  executeWebhack, 
  executeSpeedCamera, 
  executeTwint,
  executePhoton, 
  executeOSINT, 
  executeShieldAI,
  executeBotExploits, 
  executeCamerattack, 
  executeBackHack,
  executeImperialOculus,
  // New tools
  executeRapidPayload,
  executeHackingTool,
  executeSecurityAdmin,
  executeFFmpeg,
  ffmpegConvertRtspToHls,
  ffmpegRecordStream,
  applyMotionDetection
} from './osintImplementations';

// Export the functions directly
export {
  executeUsernameSearch, 
  executeCameradar, 
  executeIPCamSearch,
  executeWebCheck, 
  executeCCTV, 
  executeTorBot,
  executeWebhack, 
  executeSpeedCamera, 
  executeTwint,
  executePhoton, 
  executeOSINT, 
  executeShieldAI,
  executeBotExploits, 
  executeCamerattack, 
  executeBackHack,
  executeImperialOculus,
  // New tools
  executeRapidPayload,
  executeHackingTool,
  executeSecurityAdmin,
  executeFFmpeg,
  ffmpegConvertRtspToHls,
  ffmpegRecordStream,
  applyMotionDetection
};

// Export utility functions from other modules
export * from './searchUtils';
export * from './networkUtils';
export * from './cameraSearchUtils';
export * from './geoUtils';
