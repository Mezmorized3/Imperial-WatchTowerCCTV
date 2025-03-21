
import { ThreatIntelData } from '@/types/scanner';

/**
 * Fetches threat intelligence data for an IP address from VirusTotal
 * Requires a valid VirusTotal API key
 */
export const checkVirusTotal = async (ip: string): Promise<ThreatIntelData | null> => {
  console.log(`Checking VirusTotal for IP: ${ip}`);
  
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) {
    console.error('No VirusTotal API key provided');
    return null;
  }
  
  try {
    const response = await fetch(`https://www.virustotal.com/api/v3/ip_addresses/${ip}`, {
      headers: {
        'x-apikey': apiKey
      }
    });
    
    if (!response.ok) {
      console.error(`VirusTotal API error: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    const attributes = data?.data?.attributes;
    
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
 * Requires a valid AbuseIPDB API key
 */
export const checkAbuseIPDB = async (ip: string): Promise<ThreatIntelData | null> => {
  console.log(`Checking AbuseIPDB for IP: ${ip}`);
  
  const apiKey = process.env.ABUSEIPDB_API_KEY;
  if (!apiKey) {
    console.error('No AbuseIPDB API key provided');
    return null;
  }
  
  try {
    const response = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}&maxAgeInDays=90&verbose=true`, {
      headers: {
        'Key': apiKey,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`AbuseIPDB API error: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    const attributes = data?.data;
    
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

