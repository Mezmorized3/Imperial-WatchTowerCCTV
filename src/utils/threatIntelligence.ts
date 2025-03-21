
import { ThreatIntelData } from '@/types/scanner';
import { checkVirusTotal, checkAbuseIPDB } from './threatApiUtils';
import { analyzeFirmware } from './firmwareUtils';

/**
 * Aggregates threat intelligence from multiple sources
 */
export const getComprehensiveThreatIntel = async (ip: string): Promise<ThreatIntelData | null> => {
  try {
    // Only try to fetch threat intel if API keys are available
    const virusTotalKey = process.env.VIRUSTOTAL_API_KEY;
    const abuseIPDBKey = process.env.ABUSEIPDB_API_KEY;
    
    if (!virusTotalKey && !abuseIPDBKey) {
      console.warn('No threat intelligence API keys configured. Set VIRUSTOTAL_API_KEY and ABUSEIPDB_API_KEY environment variables.');
      return null;
    }
    
    // Call the APIs in parallel if we have keys
    const [virusTotalData, abuseIPDBData] = await Promise.all([
      virusTotalKey ? checkVirusTotal(ip) : Promise.resolve(null),
      abuseIPDBKey ? checkAbuseIPDB(ip) : Promise.resolve(null)
    ]);
    
    // If no data from any source, return null
    if (!virusTotalData && !abuseIPDBData) {
      return null;
    }
    
    // Prefer the source with the lowest reputation score (most malicious)
    if (virusTotalData && abuseIPDBData) {
      if (virusTotalData.ipReputation <= abuseIPDBData.ipReputation) {
        return {
          ...virusTotalData,
          // Combine tags if both sources have them
          tags: [...(virusTotalData.tags || []), ...(abuseIPDBData.tags || [])]
            .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
        };
      } else {
        return {
          ...abuseIPDBData,
          // Combine tags if both sources have them
          tags: [...(abuseIPDBData.tags || []), ...(virusTotalData.tags || [])]
            .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
        };
      }
    }
    
    // Return whichever source has data
    return virusTotalData || abuseIPDBData;
  } catch (error) {
    console.error("Error fetching threat intelligence:", error);
    return null;
  }
};

// Re-export for backward compatibility
export { analyzeFirmware } from './firmwareUtils';
export { checkVirusTotal, checkAbuseIPDB } from './threatApiUtils';
