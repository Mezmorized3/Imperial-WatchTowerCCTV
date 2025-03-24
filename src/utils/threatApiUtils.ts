
/**
 * API utility functions for threat intelligence
 */

import { ThreatIntelData } from './types/baseTypes';
import { simulateNetworkDelay } from './networkUtils';

/**
 * Check VirusTotal for IP reputation and threat data
 */
export const checkVirusTotal = async (ip: string): Promise<ThreatIntelData | null> => {
  try {
    await simulateNetworkDelay(1500);
    
    // Simulated data - in production, replace with actual API call
    const score = Math.floor(Math.random() * 100);
    
    return {
      ipReputation: score,
      lastReportedMalicious: score < 60 ? new Date(Date.now() - Math.random() * 30 * 86400000).toISOString() : undefined,
      associatedMalware: score < 50 ? ['Emotet', 'Trickbot'] : [],
      reportedBy: score < 70 ? ['VirusTotal Community', 'Cisco Talos'] : [],
      firstSeen: new Date(Date.now() - Math.random() * 365 * 86400000).toISOString(),
      tags: score < 60 ? ['malware', 'botnet'] : [],
      confidenceScore: score,
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
export const checkAbuseIPDB = async (ip: string): Promise<ThreatIntelData | null> => {
  try {
    await simulateNetworkDelay(1200);
    
    // Simulated data - in production, replace with actual API call
    const score = Math.floor(Math.random() * 100);
    
    return {
      ipReputation: score,
      lastReportedMalicious: score < 60 ? new Date(Date.now() - Math.random() * 30 * 86400000).toISOString() : undefined,
      associatedMalware: [],
      reportedBy: score < 70 ? ['AbuseIPDB Community'] : [],
      firstSeen: score < 80 ? new Date(Date.now() - Math.random() * 180 * 86400000).toISOString() : undefined,
      tags: score < 60 ? ['scanning', 'ssh'] : [],
      confidenceScore: score,
      source: 'abuseipdb',
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error checking AbuseIPDB:', error);
    return null;
  }
};

/**
 * Generate consistent threat intelligence for an IP
 */
export const generateThreatIntel = (ip: string, source: 'virustotal' | 'abuseipdb' | 'threatfox' | 'other' = 'other'): ThreatIntelData => {
  // Generate a hash-like value from the IP
  const ipNum = ip.split('.').reduce((acc, octet, i) => 
    acc + parseInt(octet) * Math.pow(256, 3 - i), 0);
  
  // Use the IP number to seed our "random" values
  const reputation = 30 + (ipNum % 70); // 30-99
  const confidence = 20 + (ipNum % 75); // 20-94
  
  return {
    ipReputation: reputation,
    confidenceScore: confidence,
    associatedMalware: reputation < 60 ? ['Unknown Malware'] : [],
    source,
    lastUpdated: new Date().toISOString()
  };
};
