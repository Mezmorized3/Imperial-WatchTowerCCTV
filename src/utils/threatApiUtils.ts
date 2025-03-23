
import { ThreatIntelData } from '@/types/scanner';
import { imperialServerService } from './imperialServerService';

/**
 * Fetches threat intelligence data for an IP address from VirusTotal
 * Requires a valid VirusTotal API key from server config
 */
export const checkVirusTotal = async (ip: string): Promise<ThreatIntelData | null> => {
  console.log(`Checking VirusTotal for IP: ${ip}`);
  
  try {
    // Use the server-side implementation that has access to API keys
    const response = await imperialServerService.executeOsintTool('virustotal', { ip });
    
    if (!response || !response.success) {
      console.error('VirusTotal API error:', response?.error || 'Unknown error');
      return null;
    }
    
    const attributes = response.data?.attributes;
    
    if (!attributes) {
      return null;
    }
    
    // Extract relevant data from the VirusTotal response
    return {
      ipReputation: attributes.last_analysis_stats?.malicious ? 
        100 - Math.round((attributes.last_analysis_stats.malicious / attributes.last_analysis_stats.total) * 100) : 100,
      lastReportedMalicious: attributes.last_analysis_date ? 
        new Date(attributes.last_analysis_date * 1000).toISOString() : undefined,
      associatedMalware: attributes.last_analysis_results ? 
        Object.values(attributes.last_analysis_results)
          .filter((result: any) => result.category === 'malicious')
          .map((result: any) => result.result) : undefined,
      reportedBy: attributes.last_analysis_results ? 
        Object.keys(attributes.last_analysis_results)
          .filter((vendor: string) => attributes.last_analysis_results[vendor].category === 'malicious') : undefined,
      firstSeen: attributes.first_submission_date ? 
        new Date(attributes.first_submission_date * 1000).toISOString() : undefined,
      tags: attributes.tags,
      confidenceScore: 90, // High confidence in VirusTotal results
      source: 'virustotal'
    };
  } catch (error) {
    console.error(`Error checking VirusTotal: ${error}`);
    return null;
  }
};

/**
 * Fetches threat intelligence data for an IP address from AbuseIPDB
 * Requires a valid AbuseIPDB API key from server config
 */
export const checkAbuseIPDB = async (ip: string): Promise<ThreatIntelData | null> => {
  console.log(`Checking AbuseIPDB for IP: ${ip}`);
  
  try {
    // Use the server-side implementation that has access to API keys
    const response = await imperialServerService.executeOsintTool('abuseipdb', { ip });
    
    if (!response || !response.success) {
      console.error('AbuseIPDB API error:', response?.error || 'Unknown error');
      return null;
    }
    
    const attributes = response.data;
    
    if (!attributes) {
      return null;
    }
    
    // Calculate reputation score (0-100, higher is better)
    const abuseScore = attributes.abuseConfidenceScore || 0;
    const reputationScore = 100 - abuseScore;
    
    // Extract relevant data from the AbuseIPDB response
    return {
      ipReputation: reputationScore,
      lastReportedMalicious: attributes.lastReportedAt,
      reportedBy: ['AbuseIPDB Community'],
      firstSeen: attributes.lastReportedAt, // First seen in AbuseIPDB
      tags: attributes.usageType ? [attributes.usageType] : undefined,
      confidenceScore: attributes.abuseConfidenceScore,
      source: 'abuseipdb'
    };
  } catch (error) {
    console.error(`Error checking AbuseIPDB: ${error}`);
    return null;
  }
};
