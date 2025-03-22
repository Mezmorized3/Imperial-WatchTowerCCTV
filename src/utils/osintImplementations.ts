
/**
 * Implementation of OSINT and camera discovery tools
 * This file re-exports all tool implementations from their respective modules
 */

// Re-export all camera tools
export {
  executeCameradar,
  executeIPCamSearch,
  executeCCTV,
  executeSpeedCamera,
  executeCamerattack
} from './osintImplementations/cameraTools';

// Re-export all web tools
export {
  executeWebCheck,
  executeWebhack,
  executePhoton,
  executeBackHack
} from './osintImplementations/webTools';

// Re-export all network tools
export {
  executeTorBot,
  executeImperialOculus,
  executeBotExploits
} from './osintImplementations/networkTools';

// Re-export all social tools
export {
  executeUsernameSearch,
  executeTwint,
  executeOSINT
} from './osintImplementations/socialTools';

// Re-export all security tools
export {
  executeShieldAI
} from './osintImplementations/securityTools';

// Export the new advanced tools
export {
  executeRapidPayload,
  executeHackingTool,
  executeSecurityAdmin
} from './osintImplementations/advancedTools';

// Export FFmpeg-related tools
export {
  executeFFmpeg,
  convertRtspToHls as ffmpegConvertRtspToHls,
  recordStream as ffmpegRecordStream,
  applyMotionDetection
} from './ffmpeg/ffmpegService';
