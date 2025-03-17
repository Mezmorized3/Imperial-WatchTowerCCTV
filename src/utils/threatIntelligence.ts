
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

/**
 * Analyzes firmware for known vulnerabilities and potential exploits
 */
export const analyzeFirmware = async (brand: string, model: string, version: string) => {
  console.log(`Analyzing firmware for ${brand} ${model} version ${version}`);
  
  // We need access to a vulnerability database or API
  const nvdApiKey = process.env.NVD_API_KEY;
  if (!nvdApiKey) {
    console.warn('No NVD API key configured. Set NVD_API_KEY environment variable for firmware analysis.');
    return {
      knownVulnerabilities: [],
      outdated: false,
      lastUpdate: null,
      recommendedVersion: null
    };
  }
  
  try {
    // Query the NVD API for vulnerabilities related to this firmware
    const response = await fetch(
      `https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName=cpe:2.3:o:${brand.toLowerCase()}:${model.toLowerCase()}:${version}`,
      {
        headers: {
          'apiKey': nvdApiKey
        }
      }
    );
    
    if (!response.ok) {
      console.error(`NVD API error: ${response.status} ${response.statusText}`);
      return {
        knownVulnerabilities: [],
        outdated: false,
        lastUpdate: null,
        recommendedVersion: null
      };
    }
    
    const data = await response.json();
    const vulnerabilities = data?.vulnerabilities || [];
    
    // Extract CVE IDs from the response
    const cveIds = vulnerabilities.map((vuln: any) => vuln.cve?.id || '').filter(Boolean);
    
    return {
      knownVulnerabilities: cveIds,
      outdated: cveIds.length > 0, // Consider outdated if it has vulnerabilities
      lastUpdate: null, // We don't have this information
      recommendedVersion: null // We don't have this information
    };
  } catch (error) {
    console.error(`Error analyzing firmware: ${error}`);
    return {
      knownVulnerabilities: [],
      outdated: false,
      lastUpdate: null,
      recommendedVersion: null
    };
  }
};
