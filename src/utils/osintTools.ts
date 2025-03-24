
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
  applyMotionDetection
} from './osintImplementations';

// Export all camera tools
export {
  executeCameradar,
  executeIPCamSearch,
  executeCCTV,
  executeSpeedCamera,
  executeCamerattack,
  executeHackCCTV
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

// Comment out missing exports
// export {
//   executeUsernameSearch
// };

// Comment out missing exports
// export {
//   executeTwint
// };

// Comment out missing exports
// export {
//   executeOSINT
// };

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
