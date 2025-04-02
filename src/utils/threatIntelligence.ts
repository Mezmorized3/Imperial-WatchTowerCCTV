
/**
 * Threat intelligence utility for Imperial Shield system
 * Provides methods for checking IP threats and analyzing firmware using real APIs
 */

import { ThreatIntelData } from '@/types/scanner';
import { analyzeFirmware as analyzeDeviceFirmware } from './threat/firmwareAnalyzer';

/**
 * Check VirusTotal for IP reputation and threat data
 */
const checkVirusTotal = async (ip: string): Promise<ThreatIntelData | null> => {
  try {
    const response = await fetch(`/api/threat/virustotal?ip=${encodeURIComponent(ip)}`);
    
    if (!response.ok) {
      throw new Error(`VirusTotal API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      ipReputation: data.stats?.reputation || 50,
      lastReportedMalicious: data.last_analysis_date ? new Date(data.last_analysis_date * 1000).toISOString() : undefined,
      associatedMalware: data.associated_malware || [],
      reportedBy: data.detection_engines || [],
      firstSeen: data.first_submission_date ? new Date(data.first_submission_date * 1000).toISOString() : undefined,
      tags: data.tags || [],
      confidenceScore: data.stats?.confidence || 50,
      source: 'virustotal',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error checking VirusTotal:', error);
    return null;
  }
};

/**
 * Check AbuseIPDB for IP reputation and threat data
 */
const checkAbuseIPDB = async (ip: string): Promise<ThreatIntelData | null> => {
  try {
    const response = await fetch(`/api/threat/abuseipdb?ip=${encodeURIComponent(ip)}`);
    
    if (!response.ok) {
      throw new Error(`AbuseIPDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      ipReputation: 100 - (data.abuseConfidenceScore || 0),
      lastReportedMalicious: data.lastReportedAt,
      associatedMalware: [],
      reportedBy: ['AbuseIPDB Community'],
      firstSeen: data.firstReportedAt,
      tags: data.categories?.map((c: any) => c.name) || [],
      confidenceScore: data.abuseConfidenceScore || 0,
      source: 'abuseipdb',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error checking AbuseIPDB:', error);
    return null;
  }
};

/**
 * Check ThreatFox for IP reputation and threat data
 */
const checkThreatFox = async (ip: string): Promise<ThreatIntelData | null> => {
  try {
    const response = await fetch(`/api/threat/threatfox?ip=${encodeURIComponent(ip)}`);
    
    if (!response.ok) {
      throw new Error(`ThreatFox API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      ipReputation: data.malicious ? 10 : 90,
      lastReportedMalicious: data.last_seen,
      associatedMalware: data.malware_families || [],
      reportedBy: data.reporters || [],
      firstSeen: data.first_seen,
      tags: data.tags || [],
      confidenceScore: data.confidence_level || 50,
      source: 'threatfox',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error checking ThreatFox:', error);
    return null;
  }
};

/**
 * Get comprehensive threat intelligence for an IP address
 * This function will try multiple sources and combine the results
 */
export const getComprehensiveThreatIntel = async (ip: string): Promise<ThreatIntelData> => {
  console.log(`Getting comprehensive threat intel for IP: ${ip}`);
  
  try {
    // Try VirusTotal first
    const vtResult = await checkVirusTotal(ip);
    if (vtResult) {
      return vtResult;
    }
    
    // Try AbuseIPDB if VirusTotal failed or returned null
    const abuseResult = await checkAbuseIPDB(ip);
    if (abuseResult) {
      return abuseResult;
    }
    
    // Try ThreatFox if both others failed
    const threatFoxResult = await checkThreatFox(ip);
    if (threatFoxResult) {
      return threatFoxResult;
    }
    
    // If all services failed, return a default object
    return {
      ipReputation: 50,
      confidenceScore: 0,
      source: 'other',
      associatedMalware: [],
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching threat intelligence: ${error}`);
    
    // Return a default object in case of error
    return {
      ipReputation: 50,
      confidenceScore: 0,
      source: 'other',
      associatedMalware: [],
      lastUpdated: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Analyze firmware for vulnerabilities and security issues
 */
export const analyzeFirmware = async (
  manufacturer: string,
  model: string,
  firmwareVersion: string
): Promise<any> => {
  console.log(`Analyzing firmware: ${manufacturer} ${model} ${firmwareVersion}`);
  
  try {
    // Call internal service that does the analysis
    const response = await fetch('/api/threat/firmware-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        manufacturer,
        model,
        firmwareVersion
      })
    });
    
    if (!response.ok) {
      throw new Error(`Firmware analysis API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error analyzing firmware: ${error}`);
    
    // Fallback to the local analyzer if API fails
    return await analyzeDeviceFirmware(manufacturer, model, firmwareVersion);
  }
};
