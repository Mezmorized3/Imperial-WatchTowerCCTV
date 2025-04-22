
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
  executeOpenCV,
  executeONVIFFuzzer,
  executeWebRTCStreamer,
  executeTapoPoC,
  executeShodan,
  executeCensys,
  executeHttpx,
  executeNuclei,
  executeAmass,
  executeLive555,
  executeGoCV,
  executeOpenALPR,
  executeTensorFlow,
  executeDarknet,
  executeEyeWitness
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

// Export ONVIF Fuzzer and additional tools
export {
  executeONVIFFuzzer,
  executeWebRTCStreamer,
  executeTapoPoC
};

// Export extended network tools
export {
  executeShodan,
  executeCensys,
  executeHttpx,
  executeNuclei,
  executeAmass
};

// Export computer vision tools
export {
  executeLive555,
  executeGoCV,
  executeOpenALPR,
  executeTensorFlow,
  executeDarknet,
  executeEyeWitness
};
