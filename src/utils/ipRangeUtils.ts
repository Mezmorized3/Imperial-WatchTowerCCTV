
/**
 * IP range utility functions
 */

import { DETAILED_COUNTRY_IP_RANGES } from './mockData/countryIpRanges';

/**
 * Get IP ranges for a specific country
 */
export const getCountryIpRanges = (country: string) => {
  const countryKey = country.toLowerCase();
  if (countryKey in DETAILED_COUNTRY_IP_RANGES) {
    return DETAILED_COUNTRY_IP_RANGES[countryKey as keyof typeof DETAILED_COUNTRY_IP_RANGES] || [];
  }
  return [];
};

/**
 * Calculate the number of IPs in a CIDR range
 */
export const calculateIpsInRange = (cidr: string): number => {
  if (!cidr.includes('/')) return 1; // Single IP
  
  const parts = cidr.split('/');
  const prefix = parseInt(parts[1]);
  
  // Calculate 2^(32-prefix)
  return Math.pow(2, 32 - prefix);
};

/**
 * Generate a random IP address within a CIDR range
 */
export const getRandomIpInRange = (cidr: string): string => {
  if (!cidr.includes('/')) return cidr; // If not CIDR, return as is
  
  const [baseIp, maskStr] = cidr.split('/');
  const mask = parseInt(maskStr);
  
  if (mask === 32) return baseIp; // Single IP
  
  // Convert base IP to numeric value
  const ipParts = baseIp.split('.').map(part => parseInt(part));
  let ipNum = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3];
  
  // Calculate network address (mask out host bits)
  const networkMask = ((1 << 32) - 1) - ((1 << (32 - mask)) - 1);
  const networkAddr = ipNum & networkMask;
  
  // Calculate maximum host address
  const maxHosts = (1 << (32 - mask)) - 1;
  
  // Generate random host part
  const randomHostPart = Math.floor(Math.random() * maxHosts) + 1; // +1 to avoid network address
  
  // Combine network and host parts
  const randomIpNum = networkAddr + randomHostPart;
  
  // Convert back to dotted-decimal notation
  return [
    (randomIpNum >> 24) & 255,
    (randomIpNum >> 16) & 255,
    (randomIpNum >> 8) & 255,
    randomIpNum & 255
  ].join('.');
};

/**
 * Check if an IP is within a specified CIDR range
 */
export const isIpInRange = (ip: string, cidr: string): boolean => {
  if (!cidr.includes('/')) return ip === cidr;
  
  const [baseIp, maskStr] = cidr.split('/');
  const mask = parseInt(maskStr);
  
  // Convert IPs to numeric values
  const targetIpParts = ip.split('.').map(part => parseInt(part));
  const baseIpParts = baseIp.split('.').map(part => parseInt(part));
  
  const targetIpNum = (targetIpParts[0] << 24) + (targetIpParts[1] << 16) + 
                      (targetIpParts[2] << 8) + targetIpParts[3];
  const baseIpNum = (baseIpParts[0] << 24) + (baseIpParts[1] << 16) + 
                    (baseIpParts[2] << 8) + baseIpParts[3];
  
  // Calculate network mask
  const networkMask = ((1 << 32) - 1) - ((1 << (32 - mask)) - 1);
  
  // Check if both IPs have the same network part
  return (targetIpNum & networkMask) === (baseIpNum & networkMask);
};
