
// Updated osintImplementations.ts to include missing exports and fix imports.

// Note: For missing implementations like executeMegaRtspBruter, getCommonRtspUsers, getCommonRtspPasswords,
// these should be imported and exported here.

import { executeWebCheck } from './osintImplementations/webTools';
import { executeCCTV } from './osintImplementations/cameraTools';
import { executeHackCCTV } from './osintImplementations/hackCCTVTools';
// Fix import of networkTools that actually exports executeZGrab
import { executeZGrab } from './osintImplementations/networkTools';
// Fix import for rtspBruteTools exporting executeMegaRtspBruter and helpers
import { executeMegaRtspBruter, getCommonRtspUsers, getCommonRtspPasswords } from './osintImplementations/rtspBruteTools';
// Fix import for streamingToolTypes to executeRtspServer
import { executeRtspServer } from './osintImplementations/streamingTools'; // changed from streamingToolTypes to streamingTools

// Some implementations missing or renamed in your project codebase should be safely removed or corrected

// The broad exports below correspond to the implementations you import in components
import { executeOSINT } from './osintImplementations/securityTools';
import { executeTorBot } from './osintImplementations/advancedTools';
import { executeTwint } from './osintImplementations/socialTools';
import { executeUsernameSearch } from './osintImplementations/usernameSearchTools';

import { executeCamerattack } from './osintImplementations/camerattackTools';
import { executeCamDumper } from './osintImplementations/camDumperTools';
// Updated executeOpenCCTV to executeCCTV as per error suggestion
// import { executeOpenCCTV } from './osintImplementations/openCCTVCameraTools'; // Not found, replaced by executeCCTV

import { executeEyePwn } from './osintImplementations/eyePwnTools';
import { executeIngram } from './osintImplementations/ingramTools';

export {
  executeWebCheck,
  executeCCTV,
  executeHackCCTV,
  executeZGrab,
  executeMegaRtspBruter,
  getCommonRtspUsers,
  getCommonRtspPasswords,
  executeRtspServer,
  executeOSINT,
  executeTorBot,
  executeTwint,
  executeUsernameSearch,
  executeCamerattack,
  executeCamDumper,
  executeEyePwn,
  executeIngram
};
