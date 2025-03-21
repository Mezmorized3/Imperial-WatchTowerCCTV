
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
 * Get random malware names for threat intelligence
 */
const getRandomMalwareNames = (): string[] => {
  const malwareNames = [
    'Emotet', 'TrickBot', 'Dridex', 'Ryuk', 'WannaCry', 
    'NotPetya', 'Maze', 'Conti', 'REvil', 'LockBit',
    'CobaltStrike', 'BlackMatter', 'DarkSide', 'PlugX', 'SUNBURST'
  ];
  
  const count = Math.floor(Math.random() * 3) + 1;
  const result: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * malwareNames.length);
    if (!result.includes(malwareNames[index])) {
      result.push(malwareNames[index]);
    }
  }
  
  return result;
};

/**
 * Get random reporter names for threat intelligence
 */
const getRandomReporters = (): string[] => {
  const reporters = [
    'VirusTotal', 'AbuseIPDB', 'ThreatFox', 'AlienVault OTX',
    'IBM X-Force', 'Mandiant', 'CrowdStrike', 'Symantec',
    'Kaspersky', 'ESET', 'Palo Alto Networks', 'Microsoft'
  ];
  
  const count = Math.floor(Math.random() * 3) + 1;
  const result: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * reporters.length);
    if (!result.includes(reporters[index])) {
      result.push(reporters[index]);
    }
  }
  
  return result;
};

/**
 * Get random tags for threat intelligence
 */
const getRandomTags = (): string[] => {
  const tags = [
    'c2', 'phishing', 'ransomware', 'spam', 'tor-exit-node',
    'scanner', 'brute-force', 'ddos', 'proxy', 'botnet',
    'malware-hosting', 'exploit-kit', 'crypto-mining', 'apt'
  ];
  
  const count = Math.floor(Math.random() * 4) + 1;
  const result: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * tags.length);
    if (!result.includes(tags[index])) {
      result.push(tags[index]);
    }
  }
  
  return result;
};
