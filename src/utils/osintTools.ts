
/**
 * OSINT tools API
 */

import {
  executeCameradar,
  executeIPCamSearch,
  executeCCTV,
  executeSpeedCamera,
  executeCamerattack,
  executeHackCCTV,
  executeCamDumper,
  executeOpenCCTV,
  executeEyePwn,
  executeIngram,
  executeWebCheck,
  executeWebhack,
  executePhoton,
  executeBackHack,
  executeTorBot,
  executeImperialOculus,
  executeBotExploits,
  executeShieldAI,
  executeRapidPayload,
  executeHackingTool,
  executeSecurityAdmin,
  executeFFmpeg,
  ffmpegConvertRtspToHls,
  ffmpegRecordStream,
  applyMotionDetection,
  executeUsernameSearch,
  executeTwint,
  executeOSINT,
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
} from './osintImplementations';

// Import CCTV Hacked tool
import { executeCCTVHacked } from './osintImplementations/cctvHackedTools';

// Export all camera tools
export {
  executeCameradar,
  executeIPCamSearch,
  executeCCTV,
  executeSpeedCamera,
  executeCamerattack,
  executeHackCCTV,
  executeCamDumper,
  executeOpenCCTV,
  executeEyePwn,
  executeIngram,
  executeCCTVHacked
};

// Export all web tools
export {
  executeWebCheck,
  executeWebhack,
  executePhoton,
  executeBackHack
};

// Export all network tools
export {
  executeTorBot,
  executeImperialOculus,
  executeBotExploits
};

// Export all security tools
export {
  executeShieldAI
};

// Export advanced tools
export {
  executeRapidPayload,
  executeHackingTool,
  executeSecurityAdmin
};

// Export FFmpeg tools
export {
  executeFFmpeg,
  ffmpegConvertRtspToHls,
  ffmpegRecordStream,
  applyMotionDetection
};

// Export social tools
export {
  executeUsernameSearch,
  executeTwint,
  executeOSINT
};

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
};
