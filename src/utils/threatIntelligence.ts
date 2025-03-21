
/**
 * Re-export all threat intelligence functionality
 */
import { getRandomMalwareNames, getRandomReporters, getRandomTags } from './threat/threatDataGenerators';
import { generateThreatIntelligence, getComprehensiveThreatIntel } from './threat/threatIntelGenerator';
import { analyzeFirmware } from './threat/firmwareAnalyzer';

// Re-export all functionality
export {
  generateThreatIntelligence,
  getComprehensiveThreatIntel,
  getRandomMalwareNames,
  getRandomReporters,
  getRandomTags,
  analyzeFirmware
};
