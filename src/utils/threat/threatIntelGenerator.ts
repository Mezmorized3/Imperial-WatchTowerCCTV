
/**
 * Generates realistic threat intelligence data for demonstrations
 */

import { ThreatIntelData } from '../types/baseTypes';

/**
 * Generate comprehensive threat intelligence for an IP
 */
export const getComprehensiveThreatIntel = async (ip: string): Promise<ThreatIntelData> => {
  // Generate consistent values based on IP to ensure
  // the same IP always gets the same threat intelligence
  const ipParts = ip.split('.');
  if (ipParts.length !== 4) {
    return {
      ipReputation: 50,
      confidenceScore: 50,
      associatedMalware: [],
      source: 'other',
      lastUpdated: new Date().toISOString()
    };
  }

  // Use the IP octets to generate a deterministic set of values
  const ipSum = ipParts.reduce((sum, part) => sum + parseInt(part, 10), 0);
  const lastOctet = parseInt(ipParts[3], 10);
  
  // Generate reputation score between 0-100
  // Lower is more suspicious
  let ipReputation = (ipSum % 70) + 30;
  
  // If last octet is a common SSH/web server port or unusual port, increase suspicion
  if ([22, 25, 80, 443, 8080, 8443, 2222].includes(lastOctet) || lastOctet > 50000) {
    ipReputation = Math.max(10, ipReputation - 30);
  }
  
  // For demo purposes, make certain IP ranges more suspicious
  if (ipParts[0] === '185' || ipParts[0] === '194' || ipParts[0] === '45') {
    ipReputation = Math.max(5, ipReputation - 40);
  }
  
  // Generate threat intelligence data
  const data: ThreatIntelData = {
    ipReputation,
    confidenceScore: 100 - Math.floor(ipReputation / 1.5),
    associatedMalware: [],
    source: determineSource(ipParts),
    lastUpdated: new Date().toISOString()
  };
  
  // If IP is suspicious, add more threat details
  if (ipReputation < 70) {
    data.lastReportedMalicious = new Date(Date.now() - (ipSum * 100000)).toISOString();
    data.firstSeen = new Date(Date.now() - (ipSum * 500000)).toISOString();
    data.reportedBy = determineReporters(ipParts);
    data.tags = determineTags(ipParts);
    
    // If highly suspicious, add malware associations
    if (ipReputation < 40) {
      data.associatedMalware = determineMalware(ipParts);
    }
  }
  
  return data;
};

/**
 * Determine the source of the threat intel based on IP
 */
function determineSource(ipParts: string[]): 'virustotal' | 'abuseipdb' | 'threatfox' | 'other' {
  const lastOctet = parseInt(ipParts[3], 10);
  
  if (lastOctet % 4 === 0) return 'virustotal';
  if (lastOctet % 4 === 1) return 'abuseipdb';
  if (lastOctet % 4 === 2) return 'threatfox';
  return 'other';
}

/**
 * Generate a list of reporters based on IP
 */
function determineReporters(ipParts: string[]): string[] {
  const reporters = [
    'VirusTotal Community',
    'AbuseIPDB',
    'ThreatFox',
    'Cisco Talos',
    'OTX AlienVault',
    'Spamhaus',
    'Emerging Threats',
    'IBM X-Force',
    'Crowdstrike'
  ];
  
  const ipSum = ipParts.reduce((sum, part) => sum + parseInt(part, 10), 0);
  const count = 1 + (ipSum % 3);
  const result: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const index = (parseInt(ipParts[i % 4], 10) + i) % reporters.length;
    result.push(reporters[index]);
  }
  
  return result;
}

/**
 * Generate tags based on IP
 */
function determineTags(ipParts: string[]): string[] {
  const allTags = [
    'malware_host',
    'botnet',
    'scanning',
    'brute_force',
    'spam',
    'C&C',
    'ransomware',
    'phishing',
    'trojan',
    'proxy',
    'tor_exit_node',
    'vpn',
    'ssh_bruteforce',
    'ddos'
  ];
  
  const ipSum = ipParts.reduce((sum, part) => sum + parseInt(part, 10), 0);
  const count = 1 + (ipSum % 3);
  const result: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const index = (parseInt(ipParts[i % 4], 10) + i) % allTags.length;
    result.push(allTags[index]);
  }
  
  return result;
}

/**
 * Generate associated malware based on IP
 */
function determineMalware(ipParts: string[]): string[] {
  const allMalware = [
    'Emotet',
    'TrickBot',
    'Ryuk',
    'Dridex',
    'Lokibot',
    'Qakbot',
    'Ursnif',
    'WannaCry',
    'NotPetya',
    'CobaltStrike',
    'BlackCat',
    'Conti'
  ];
  
  const ipSum = ipParts.reduce((sum, part) => sum + parseInt(part, 10), 0);
  const count = 1 + (ipSum % 2);
  const result: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const index = (parseInt(ipParts[i % 4], 10) + i) % allMalware.length;
    result.push(allMalware[index]);
  }
  
  return result;
}
