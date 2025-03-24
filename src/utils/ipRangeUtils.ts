/**
 * Utility functions for handling IP ranges
 */

import { COUNTRY_IP_RANGES, DETAILED_COUNTRY_IP_RANGES } from './mockData/countryIpRanges';

/**
 * Get IP ranges for a specific country code
 */
export const getCountryIpRanges = (countryCode: string): { range: string; description: string }[] => {
  const code = countryCode.toLowerCase();
  
  // Return detailed country IP ranges if available
  if (DETAILED_COUNTRY_IP_RANGES[code as keyof typeof DETAILED_COUNTRY_IP_RANGES]) {
    return DETAILED_COUNTRY_IP_RANGES[code as keyof typeof DETAILED_COUNTRY_IP_RANGES];
  }
  
  // Convert from select format to detailed format if needed
  if (COUNTRY_IP_RANGES[code as keyof typeof COUNTRY_IP_RANGES]) {
    return COUNTRY_IP_RANGES[code as keyof typeof COUNTRY_IP_RANGES].map(item => ({
      range: item.value,
      description: item.label
    }));
  }
  
  return [];
};

/**
 * Generate a random IP address within a specific CIDR range
 */
export const getRandomIpInRange = (cidr: string): string => {
  if (!cidr.includes('/')) return cidr;
  
  const [baseIp, cidrPart] = cidr.split('/');
  const prefix = parseInt(cidrPart);
  const ipParts = baseIp.split('.').map(Number);
  
  // Calculate how many host bits we have to work with
  const hostBits = 32 - prefix;
  const hostAddresses = Math.pow(2, hostBits) - 2; // Subtract network and broadcast addresses
  
  if (hostAddresses <= 0) return baseIp;
  
  // Generate a random host number between 1 and hostAddresses
  const randomHostNum = Math.floor(Math.random() * hostAddresses) + 1;
  
  // Convert to IP address octets
  let remaining = randomHostNum;
  for (let i = 3; i >= 0; i--) {
    if (i >= 4 - Math.ceil(hostBits / 8)) {
      const maxValueForOctet = (i === 4 - Math.ceil(hostBits / 8)) 
        ? 255 - (256 % Math.pow(2, hostBits % 8 || 8))
        : 255;
      
      const originalValue = ipParts[i];
      const addValue = remaining % 256;
      
      ipParts[i] = (originalValue + addValue) % 256;
      remaining = Math.floor(remaining / 256);
    }
  }
  
  return ipParts.join('.');
};

/**
 * Parse CIDR notation and return a list of IP addresses in that range
 * Limited to returning a reasonable number of IPs for large ranges
 */
export const parseCidrToIpList = (cidr: string, limit: number = 100): string[] => {
  if (!cidr.includes('/')) return [cidr];
  
  const [baseIp, cidrPart] = cidr.split('/');
  const prefix = parseInt(cidrPart);
  
  // Calculate how many host bits we have to work with
  const hostBits = 32 - prefix;
  const totalHosts = Math.pow(2, hostBits);
  
  // If the range is too large, return a limited sample
  if (totalHosts > limit) {
    const result: string[] = [];
    for (let i = 0; i < limit; i++) {
      result.push(getRandomIpInRange(cidr));
    }
    return result;
  }
  
  // Otherwise, generate all IPs in the range
  const ipParts = baseIp.split('.').map(Number);
  const result: string[] = [];
  
  for (let i = 0; i < totalHosts; i++) {
    let remaining = i;
    const currentIpParts = [...ipParts];
    
    for (let j = 3; j >= 0; j--) {
      if (j >= 4 - Math.ceil(hostBits / 8)) {
        const addValue = remaining % 256;
        currentIpParts[j] = (currentIpParts[j] + addValue) % 256;
        remaining = Math.floor(remaining / 256);
      }
    }
    
    result.push(currentIpParts.join('.'));
  }
  
  return result;
};

/**
 * Get a specific country's name from its country code
 */
export const getCountryNameFromCode = (code: string): string => {
  const countryMap: {[key: string]: string} = {
    'ge': 'Georgia',
    'ro': 'Romania',
    'ua': 'Ukraine',
    'ru': 'Russia'
  };
  
  return countryMap[code.toLowerCase()] || code;
};
