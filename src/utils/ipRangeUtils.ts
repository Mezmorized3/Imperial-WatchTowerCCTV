
/**
 * Utility functions for IP range operations
 */

// Parse an IP range into individual IPs
export const parseIpRange = (ipRange: string): string[] => {
  // Handle CIDR notation (e.g., 192.168.1.0/24)
  if (ipRange.includes('/')) {
    const [baseIp, cidrPart] = ipRange.split('/');
    const cidr = parseInt(cidrPart, 10);
    
    if (cidr < 0 || cidr > 32) {
      throw new Error('Invalid CIDR prefix length');
    }
    
    // For small CIDR ranges, generate all IPs
    if (cidr >= 24) {
      return generateAllIpsInCidr(baseIp, cidr);
    } 
    // For larger ranges, sample IPs to avoid excessive resource usage
    else {
      return sampleIpsInCidr(baseIp, cidr, 100);
    }
  }
  
  // Handle IP ranges with dash (e.g., 192.168.1.1-192.168.1.254)
  if (ipRange.includes('-')) {
    const [startIp, endIp] = ipRange.split('-');
    return generateIpRange(startIp, endIp);
  }
  
  // Handle comma-separated IPs (e.g., 192.168.1.1,192.168.1.2,192.168.1.3)
  if (ipRange.includes(',')) {
    return ipRange.split(',').map(ip => ip.trim());
  }
  
  // Single IP address
  return [ipRange.trim()];
};

// Calculate the number of IP addresses in a CIDR range
export const calculateIpsInRange = (cidr: string): number => {
  if (!cidr.includes('/')) return 1; // Single IP
  
  const [baseIp, prefixStr] = cidr.split('/');
  const prefix = parseInt(prefixStr, 10);
  
  if (isNaN(prefix) || prefix < 0 || prefix > 32) {
    throw new Error(`Invalid CIDR prefix: ${prefixStr}`);
  }
  
  // 2^(32-prefix) is the number of IP addresses in the range
  return Math.pow(2, 32 - prefix);
};

// Generate all IPs in a small CIDR range
const generateAllIpsInCidr = (baseIp: string, cidr: number): string[] => {
  const baseIpParts = baseIp.split('.').map(Number);
  const ips: string[] = [];
  
  // Calculate how many host bits we need
  const hostBits = 32 - cidr;
  const hostCount = Math.min(Math.pow(2, hostBits), 1000); // Limit to 1000 IPs for safety
  
  for (let i = 0; i < hostCount; i++) {
    const ipParts = [...baseIpParts];
    
    // Update the appropriate octets based on the host bits
    if (hostBits <= 8) {
      ipParts[3] = baseIpParts[3] + i;
    } else if (hostBits <= 16) {
      ipParts[2] = baseIpParts[2] + Math.floor(i / 256);
      ipParts[3] = baseIpParts[3] + (i % 256);
    } else if (hostBits <= 24) {
      ipParts[1] = baseIpParts[1] + Math.floor(i / 65536);
      ipParts[2] = baseIpParts[2] + Math.floor((i % 65536) / 256);
      ipParts[3] = baseIpParts[3] + (i % 256);
    } else {
      ipParts[0] = baseIpParts[0] + Math.floor(i / 16777216);
      ipParts[1] = baseIpParts[1] + Math.floor((i % 16777216) / 65536);
      ipParts[2] = baseIpParts[2] + Math.floor((i % 65536) / 256);
      ipParts[3] = baseIpParts[3] + (i % 256);
    }
    
    // Ensure all octets are within valid range (0-255)
    if (ipParts.every(part => part >= 0 && part <= 255)) {
      ips.push(ipParts.join('.'));
    }
  }
  
  return ips;
};

// Sample IPs in a large CIDR range to avoid generating too many
const sampleIpsInCidr = (baseIp: string, cidr: number, sampleSize: number): string[] => {
  const baseIpParts = baseIp.split('.').map(Number);
  const ips: string[] = [];
  
  // Calculate how many host bits we need
  const hostBits = 32 - cidr;
  const hostCount = Math.pow(2, hostBits);
  
  // Calculate the step size to evenly distribute sampled IPs
  const stepSize = Math.max(1, Math.floor(hostCount / sampleSize));
  
  for (let i = 0; i < hostCount; i += stepSize) {
    if (ips.length >= sampleSize) break;
    
    const ipParts = [...baseIpParts];
    
    // Update the appropriate octets based on the host bits
    if (hostBits <= 8) {
      ipParts[3] = baseIpParts[3] + i;
    } else if (hostBits <= 16) {
      ipParts[2] = baseIpParts[2] + Math.floor(i / 256);
      ipParts[3] = baseIpParts[3] + (i % 256);
    } else if (hostBits <= 24) {
      ipParts[1] = baseIpParts[1] + Math.floor(i / 65536);
      ipParts[2] = baseIpParts[2] + Math.floor((i % 65536) / 256);
      ipParts[3] = baseIpParts[3] + (i % 256);
    } else {
      ipParts[0] = baseIpParts[0] + Math.floor(i / 16777216);
      ipParts[1] = baseIpParts[1] + Math.floor((i % 16777216) / 65536);
      ipParts[2] = baseIpParts[2] + Math.floor((i % 65536) / 256);
      ipParts[3] = baseIpParts[3] + (i % 256);
    }
    
    // Ensure all octets are within valid range (0-255)
    if (ipParts.every(part => part >= 0 && part <= 255)) {
      ips.push(ipParts.join('.'));
    }
  }
  
  return ips;
};

// Generate a range of IPs between start and end IP
const generateIpRange = (startIp: string, endIp: string): string[] => {
  const startParts = startIp.split('.').map(Number);
  const endParts = endIp.split('.').map(Number);
  
  const start = (startParts[0] << 24) | (startParts[1] << 16) | (startParts[2] << 8) | startParts[3];
  const end = (endParts[0] << 24) | (endParts[1] << 16) | (endParts[2] << 8) | endParts[3];
  
  if (start > end) {
    throw new Error('Invalid IP range: start IP is greater than end IP');
  }
  
  const range = Math.min(end - start + 1, 1000); // Limit to 1000 IPs for safety
  const ips: string[] = [];
  
  for (let i = 0; i < range; i++) {
    const ip = start + i;
    const a = (ip >> 24) & 255;
    const b = (ip >> 16) & 255;
    const c = (ip >> 8) & 255;
    const d = ip & 255;
    
    ips.push(`${a}.${b}.${c}.${d}`);
  }
  
  return ips;
};

// Get country-specific IP ranges
export const getCountryIpRanges = (countryCode: string): Array<{range: string, description: string}> => {
  // In a real implementation, this would fetch from a database or API
  // For now, we'll return some placeholder ranges
  const countryRanges: Record<string, Array<{range: string, description: string}>> = {
    'ge': [
      { range: '31.146.0.0/16', description: 'Georgia - Telecoms' },
      { range: '37.110.0.0/16', description: 'Georgia - ISPs' },
      { range: '87.253.0.0/16', description: 'Georgia - Residential' }
    ],
    'ro': [
      { range: '5.2.0.0/16', description: 'Romania - Telecom' },
      { range: '31.14.0.0/16', description: 'Romania - ISPs' },
      { range: '79.113.0.0/16', description: 'Romania - Residential' }
    ],
    'ua': [
      { range: '37.53.0.0/16', description: 'Ukraine - Kyiv ISPs' },
      { range: '77.47.0.0/16', description: 'Ukraine - Telecom' },
      { range: '91.194.0.0/16', description: 'Ukraine - Business' }
    ],
    'ru': [
      { range: '5.45.0.0/16', description: 'Russia - Moscow ISPs' },
      { range: '31.13.0.0/16', description: 'Russia - St. Petersburg' },
      { range: '46.38.0.0/16', description: 'Russia - Telecom Networks' }
    ],
    'us': [
      { range: '66.102.0.0/16', description: 'US - General' },
      { range: '72.14.0.0/16', description: 'US - ISPs' }
    ]
  };
  
  return countryRanges[countryCode.toLowerCase()] || [];
};

// Get a random IP address from a range
export const getRandomIpInRange = (range: string): string => {
  const ips = parseIpRange(range);
  if (ips.length === 0) return '';
  
  const randomIndex = Math.floor(Math.random() * ips.length);
  return ips[randomIndex];
};
