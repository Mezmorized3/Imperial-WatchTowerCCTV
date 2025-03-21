
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
  BackHackParams
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
  executeBackHack
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
  executeBackHack
};

// Export utility functions from other modules
export * from './searchUtils';
export * from './networkUtils';
export * from './cameraSearchUtils';
export * from './geoUtils';
