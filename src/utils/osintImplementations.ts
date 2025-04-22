
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

// Export the camera hacking tools
export {
  executeHackCCTV,
  executeCamDumper,
  executeOpenCCTV,
  executeEyePwn,
  executeIngram
} from './osintImplementations/hackCCTVTools';

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

// Re-export all security tools with correct import path
export {
  executeSecurityAdmin,
  executeShieldAI
} from './osintImplementations/securityTools';

// Export the new advanced tools
export {
  executeRapidPayload,
  executeHackingTool,
} from './osintImplementations/advancedTools';

// Export FFmpeg-related tools correctly
import { executeFFmpeg, convertRtspToHls, recordStreamSegment } from './ffmpeg/ffmpegService';
export { executeFFmpeg };
// Rename to match expected exports
export const ffmpegConvertRtspToHls = convertRtspToHls;
export const ffmpegRecordStream = recordStreamSegment;
export const applyMotionDetection = async (params: any) => {
  console.log('Motion detection applied', params);
  return { success: true, data: { applied: true } };
};

// Export the social tools from our implementation
export {
  executeUsernameSearch,
  executeTwint,
  executeOSINT
} from './osintImplementations/socialTools';

// Export CCTV Hacked tool
import { executeCCTVHacked } from './osintImplementations/cctvHackedTools';
export { executeCCTVHacked };

// Export ONVIF and network scanning tools
export {
  executeONVIFScan,
  executeMasscan,
  executeZGrab,
  executeHydra,
  executeMotion,
  executeMotionEye,
  executeDeepstack,
  executeFaceRecognition,
  executeRtspServer,
  executeZoneMinder,
  executeNmapONVIF,
  executeOpenCV
} from './osintImplementations/onvifTools';
