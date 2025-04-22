
/**
 * OSINT tools implementations
 */

// Import implementations from individual files
// Web and network tools
import { executeWebCheck } from './osintImplementations/webTools';
import { executeCCTV } from './osintImplementations/cameraTools';
import { executeHackCCTV } from './osintImplementations/hackCCTVTools';
import { executeZGrab } from './osintImplementations/networkTools';
import { executeHydra } from './osintImplementations/rtspBruteTools';
import { executeRtspServer } from './osintImplementations/streamingToolTypes';

// OSINT tools
import { executeOSINT } from './osintImplementations/securityTools';
import { executeTorBot } from './osintImplementations/advancedTools';
import { executeTwint } from './osintImplementations/socialTools';
import { executeUsernameSearch } from './osintImplementations/usernameSearchTools';

// Export all implementations
export {
  executeWebCheck,
  executeCCTV,
  executeHackCCTV,
  executeZGrab,
  executeHydra,
  executeRtspServer,
  executeOSINT,
  executeTorBot,
  executeTwint,
  executeUsernameSearch
};
