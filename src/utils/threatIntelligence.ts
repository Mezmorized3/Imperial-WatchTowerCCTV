
/**
 * Utilities for threat intelligence data
 */
import { simulateNetworkDelay } from './networkUtils';

export type ThreatIntelData = {
  threatScore: number;
  classifications: string[];
  firstSeen?: string;
  lastSeen?: string;
  malwareSamples?: {
    name: string;
    type: string;
    firstSeen: string;
  }[];
  activityLog?: {
    date: string;
    activity: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }[];
};

/**
 * Get comprehensive threat intelligence for an IP
 */
export const getComprehensiveThreatIntel = async (ip: string): Promise<ThreatIntelData> => {
  await simulateNetworkDelay();
  
  // Generate a threat score based on the IP (for simulation)
  const ipParts = ip.split('.');
  const lastOctet = parseInt(ipParts[ipParts.length - 1]);
  
  // Make the last octet influence the threat score (for demo purposes)
  // Higher last octets will have higher threat scores
  const threatScore = Math.min(100, Math.round((lastOctet / 255) * 100));
  
  // Generate random classifications based on the threat score
  const possibleClassifications = [
    'Malware C2', 'Botnet Node', 'Spam', 'Scanning', 'Brute Force', 
    'Web Attacks', 'Phishing', 'Proxy', 'TOR Exit Node', 'Cryptocurrency Mining'
  ];
  
  // Higher threat score means more classifications
  const numClassifications = Math.max(1, Math.floor(threatScore / 20));
  const classifications = [];
  
  // Select random classifications without duplicates
  const shuffled = [...possibleClassifications].sort(() => 0.5 - Math.random());
  for (let i = 0; i < numClassifications; i++) {
    classifications.push(shuffled[i]);
  }
  
  // Generate first seen date (higher threat score = seen longer ago)
  const daysAgo = Math.floor((threatScore / 100) * 365) + 1;
  const firstSeen = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Generate last seen date (higher threat score = seen more recently)
  const lastSeenDaysAgo = Math.max(0, Math.floor((1 - threatScore / 100) * 30));
  const lastSeen = new Date(Date.now() - lastSeenDaysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Generate malware samples if threat score is high enough
  let malwareSamples = undefined;
  if (threatScore > 70) {
    const possibleMalware = [
      { name: 'Emotet', type: 'Trojan' },
      { name: 'TrickBot', type: 'Banking Trojan' },
      { name: 'Dridex', type: 'Banking Malware' },
      { name: 'Maze', type: 'Ransomware' },
      { name: 'Ryuk', type: 'Ransomware' },
      { name: 'ZeuS', type: 'Banking Trojan' },
      { name: 'CobaltStrike', type: 'Penetration Testing' },
      { name: 'Mirai', type: 'IoT Botnet' }
    ];
    
    const numSamples = Math.floor(Math.random() * 3) + 1;
    malwareSamples = [];
    
    for (let i = 0; i < numSamples; i++) {
      const sample = possibleMalware[Math.floor(Math.random() * possibleMalware.length)];
      const sampleDaysAgo = Math.floor(Math.random() * 180) + 1;
      const sampleDate = new Date(Date.now() - sampleDaysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      malwareSamples.push({
        ...sample,
        firstSeen: sampleDate
      });
    }
  }
  
  // Generate activity log if threat score is medium or higher
  let activityLog = undefined;
  if (threatScore > 30) {
    activityLog = [];
    const numActivities = Math.floor((threatScore / 100) * 10) + 1;
    
    const possibleActivities = [
      { activity: 'Port scan detected', severity: 'low' as const },
      { activity: 'Multiple failed login attempts', severity: 'medium' as const },
      { activity: 'Suspicious outbound connection', severity: 'medium' as const },
      { activity: 'Malware communication detected', severity: 'high' as const },
      { activity: 'Data exfiltration attempt', severity: 'high' as const },
      { activity: 'Ransomware communication', severity: 'critical' as const }
    ];
    
    for (let i = 0; i < numActivities; i++) {
      const activity = possibleActivities[Math.floor(Math.random() * possibleActivities.length)];
      const activityDaysAgo = Math.floor(Math.random() * 30) + 1;
      const activityDate = new Date(Date.now() - activityDaysAgo * 24 * 60 * 60 * 1000).toISOString();
      
      activityLog.push({
        date: activityDate,
        activity: activity.activity,
        severity: activity.severity
      });
    }
    
    // Sort by date, most recent first
    activityLog.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  return {
    threatScore,
    classifications,
    firstSeen,
    lastSeen,
    malwareSamples,
    activityLog
  };
};

/**
 * Check vulnerability database for firmware vulnerabilities
 */
export const analyzeFirmware = async (
  manufacturer: string, 
  model: string, 
  version: string
): Promise<any> => {
  await simulateNetworkDelay();
  
  // For demonstration, if the version number's first digit is low, show more vulnerabilities
  const majorVersion = parseInt(version.split('.')[0]);
  const isVulnerable = majorVersion < 3; // Older versions are more vulnerable
  
  if (!isVulnerable) {
    return {
      vulnerabilities: [],
      latestVersion: `${majorVersion + 1}.0.0`,
      updateAvailable: true,
      risk: 'low'
    };
  }
  
  // Generate list of potential vulnerabilities
  const vulnerabilities = [
    {
      cve: 'CVE-2019-1234',
      severity: 'high',
      description: 'Buffer overflow in web interface allows remote code execution',
      affectedVersions: 'All versions below 3.0.0'
    },
    {
      cve: 'CVE-2020-5678',
      severity: 'medium',
      description: 'Default credentials vulnerability allows unauthorized access',
      affectedVersions: 'All versions below 2.5.0'
    },
    {
      cve: 'CVE-2018-9012',
      severity: 'critical',
      description: 'Remote command injection through RTSP stack',
      affectedVersions: 'All versions below 2.0.0'
    }
  ];
  
  // Filter vulnerabilities based on version
  const applicableVulnerabilities = vulnerabilities.filter(v => {
    if (v.cve.includes('2018') && majorVersion < 2) return true;
    if (v.cve.includes('2019') && majorVersion < 3) return true;
    if (v.cve.includes('2020') && majorVersion < 2.5) return true;
    return false;
  });
  
  return {
    vulnerabilities: applicableVulnerabilities,
    latestVersion: `${majorVersion + 2}.0.0`,
    updateAvailable: true,
    risk: applicableVulnerabilities.length > 0 ? 
      (applicableVulnerabilities.some(v => v.severity === 'critical') ? 'critical' : 
       applicableVulnerabilities.some(v => v.severity === 'high') ? 'high' : 'medium') 
      : 'low'
  };
};
