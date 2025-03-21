
/**
 * Get random malware names for threat intelligence
 */
export const getRandomMalwareNames = (): string[] => {
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
export const getRandomReporters = (): string[] => {
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
export const getRandomTags = (): string[] => {
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
