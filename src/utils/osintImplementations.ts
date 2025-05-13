
/**
 * Streamlined OSINT implementations - only including functionality we actually have
 */

// Import web tools
import { executeWebCheck } from './osintImplementations/webTools';

// Import camera tools
import { executeCCTV } from './osintImplementations/cameraTools';
import { executeHackCCTV } from './osintImplementations/hackCCTVTools';

// Import streaming tools
import { executeRtspServer } from './osintImplementations/streamingTools';

// Import social tools
import { executeTwint } from './osintImplementations/socialTools';
import { executeUsernameSearch } from './osintImplementations/usernameSearchTools';

// Export all available tools
export {
  // Web tools
  executeWebCheck,
  
  // Camera tools
  executeCCTV,
  executeHackCCTV,
  
  // Streaming tools
  executeRtspServer,
  
  // Social tools
  executeTwint,
  executeUsernameSearch
};
