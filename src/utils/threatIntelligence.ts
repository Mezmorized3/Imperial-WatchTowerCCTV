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

/**
 * Analyze firmware for vulnerabilities and provide security recommendations
 */
export const analyzeFirmware = async (
  manufacturer: string,
  model: string,
  firmwareVersion: string
): Promise<{
  outdated: boolean;
  lastUpdate?: string;
  recommendedVersion?: string;
  knownVulnerabilities: string[];
  securityScore?: number;
  recommendations?: string[];
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Simulate firmware version parsing
  const versionParts = firmwareVersion.split('.');
  const majorVersion = parseInt(versionParts[0], 10) || 0;
  const minorVersion = parseInt(versionParts[1], 10) || 0;
  const patchVersion = parseInt(versionParts[2], 10) || 0;
  
  // Generate a "latest" version that's potentially newer
  const latestMajor = majorVersion + (Math.random() > 0.8 ? 1 : 0);
  const latestMinor = latestMajor > majorVersion ? 0 : minorVersion + (Math.random() > 0.6 ? 1 : 0);
  const latestPatch = latestMajor > majorVersion || latestMinor > minorVersion ? 0 : patchVersion + (Math.random() > 0.4 ? Math.floor(Math.random() * 5) + 1 : 0);
  
  // Determine if firmware is outdated
  const outdated = latestMajor > majorVersion || latestMinor > minorVersion || latestPatch > patchVersion;
  
  // Generate a random date for the "last update"
  const now = new Date();
  const monthsAgo = Math.floor(Math.random() * 24) + 1; // 1-24 months ago
  const lastUpdate = new Date(now.getTime() - (monthsAgo * 30 * 86400000)).toISOString();
  
  // Generate recommended version
  const recommendedVersion = `${latestMajor}.${latestMinor}.${latestPatch}`;
  
  // Generate known vulnerabilities for outdated firmware
  let knownVulnerabilities: string[] = [];
  if (outdated) {
    const vulnCount = Math.floor(Math.random() * 3) + (outdated ? 1 : 0);
    if (vulnCount > 0) {
      const possibleCVEs = [
        'CVE-2021-36260', 'CVE-2021-33044', 'CVE-2021-32941', 
        'CVE-2020-25078', 'CVE-2020-9587', 'CVE-2019-9082', 
        'CVE-2018-10088', 'CVE-2018-6414', 'CVE-2017-7921'
      ];
      
      for (let i = 0; i < vulnCount; i++) {
        const index = Math.floor(Math.random() * possibleCVEs.length);
        if (!knownVulnerabilities.includes(possibleCVEs[index])) {
          knownVulnerabilities.push(possibleCVEs[index]);
        }
      }
    }
  }
  
  // Generate security score (lower for outdated firmware)
  const securityScore = outdated 
    ? Math.floor(Math.random() * 40) + 20  // 20-60 for outdated firmware
    : Math.floor(Math.random() * 25) + 75; // 75-100 for current firmware
  
  // Generate recommendations
  const recommendations = [
    outdated ? `Update firmware to the latest version ${recommendedVersion}` : 'Firmware is current',
    'Enable automatic updates if available',
    'Restrict network access to the device',
    'Change default credentials',
    'Disable unused services and ports'
  ].filter(Boolean);
  
  return {
    outdated,
    lastUpdate,
    recommendedVersion: outdated ? recommendedVersion : undefined,
    knownVulnerabilities,
    securityScore,
    recommendations: recommendations.slice(0, Math.floor(Math.random() * 3) + 1)
  };
};
