
/**
 * OSINT tools connector - Streamlined implementation
 */

// Import the actual implementations we have
import {
  executeWebCheck,
  executeCCTV, 
  executeHackCCTV,
  executeRtspServer
} from './osintImplementations';

// Export only the tools we have implementations for
export {
  executeWebCheck,
  executeCCTV,
  executeHackCCTV,
  executeRtspServer
};
