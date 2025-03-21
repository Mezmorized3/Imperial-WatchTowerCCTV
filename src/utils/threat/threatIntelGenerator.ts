
import { ThreatIntelData } from '@/types/scanner';

/**
 * Generate simulated threat intelligence data for an IP
 */
export const generateThreatIntelligence = (ip: string): ThreatIntelData => {
  // Random confidence score between 0 and 100
  const confidenceScore = Math.floor(Math.random() * 100);
  
  // Random reputation score between 0 and 100
  const ipReputation = Math.floor(Math.random() * 100);
  
  // Calculate date strings
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 90); // Up to 90 days ago
  const firstSeen = new Date(now.getTime() - (daysAgo * 86400000)).toISOString();
  
  // If reputation is low, add malicious report details
  let threatIntel: ThreatIntelData = {
    ipReputation,
    confidenceScore,
    source: Math.random() > 0.7 ? 'virustotal' : 
            Math.random() > 0.5 ? 'abuseipdb' : 
            Math.random() > 0.2 ? 'threatfox' : 'other',
  };
  
  // For lower reputation IPs, add more threat data
  if (ipReputation < 50) {
    const reportedDaysAgo = Math.floor(Math.random() * daysAgo);
    
    threatIntel = {
      ...threatIntel,
      lastReportedMalicious: new Date(now.getTime() - (reportedDaysAgo * 86400000)).toISOString(),
      associatedMalware: getRandomMalwareNames(),
      reportedBy: getRandomReporters(),
      firstSeen,
      tags: getRandomTags()
    };
  }
  
  return threatIntel;
};

/**
 * Get comprehensive threat intelligence for an IP
 */
export const getComprehensiveThreatIntel = async (ip: string): Promise<ThreatIntelData> => {
  // Simulate API delay for more realistic behavior
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate basic threat intelligence
  const threatIntel = generateThreatIntelligence(ip);
  
  // Enhance with additional data in a simulated "comprehensive" lookup
  const enhancedThreatIntel: ThreatIntelData = {
    ...threatIntel,
    // Add a higher confidence score for comprehensive lookups
    confidenceScore: Math.min(threatIntel.confidenceScore + 15, 100),
    // Add additional tags if not already present
    tags: [...(threatIntel.tags || []), ...(Math.random() > 0.7 ? ['comprehensive-scan'] : [])]
  };
  
  return enhancedThreatIntel;
};
