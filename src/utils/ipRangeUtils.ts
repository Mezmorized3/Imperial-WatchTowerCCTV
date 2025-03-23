
/**
 * Utilities for handling IP ranges and CIDR notation
 */

import { DETAILED_COUNTRY_IP_RANGES } from './mockData';

export interface IpRange {
  range: string;
  description: string;
  assignDate: string;
}

/**
 * Convert CIDR notation to an IP range (start and end IPs)
 */
export const cidrToRange = (cidr: string): { start: string; end: string } => {
  const [ip, prefixStr] = cidr.split('/');
  const prefix = parseInt(prefixStr);
  
  // Convert IP to a number
  const ipParts = ip.split('.').map(Number);
  let ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
  
  // Calculate the start and end of the range
  const mask = ~((1 << (32 - prefix)) - 1);
  const startNum = ipNum & mask;
  const endNum = startNum | ~mask;
  
  // Convert numbers back to IP strings
  const startIp = [
    (startNum >>> 24) & 255,
    (startNum >>> 16) & 255,
    (startNum >>> 8) & 255,
    startNum & 255
  ].join('.');
  
  const endIp = [
    (endNum >>> 24) & 255,
    (endNum >>> 16) & 255,
    (endNum >>> 8) & 255,
    endNum & 255
  ].join('.');
  
  return { start: startIp, end: endIp };
};

/**
 * Convert IP range (start and end IPs) to CIDR notation
 * Note: This is a simplified version and may not be perfect for all ranges
 */
export const rangeToCidr = (startIp: string, endIp: string): string[] => {
  // Convert IPs to numbers
  const startParts = startIp.split('.').map(Number);
  const endParts = endIp.split('.').map(Number);
  
  let startNum = (startParts[0] << 24) | (startParts[1] << 16) | (startParts[2] << 8) | startParts[3];
  const endNum = (endParts[0] << 24) | (endParts[1] << 16) | (endParts[2] << 8) | endParts[3];
  
  const result: string[] = [];
  
  while (startNum <= endNum) {
    let maxSize = 0;
    for (let x = 0; x < 32; x++) {
      const mask = 1 << x;
      if ((startNum & mask) !== 0) {
        break;
      }
      maxSize = x;
    }
    
    let maxDiff = 32;
    while (maxDiff > 0) {
      const mask = 1 << (maxDiff - 1);
      if (startNum + mask - 1 <= endNum) {
        break;
      }
      maxDiff--;
    }
    
    maxSize = Math.min(maxSize, maxDiff);
    const prefix = 32 - maxSize;
    
    // Convert start number to IP
    const ip = [
      (startNum >>> 24) & 255,
      (startNum >>> 16) & 255,
      (startNum >>> 8) & 255,
      startNum & 255
    ].join('.');
    
    result.push(`${ip}/${prefix}`);
    startNum += 1 << maxSize;
  }
  
  return result;
};

/**
 * Get all IP ranges for a specific country
 */
export const getCountryIpRanges = (countryCode: string): IpRange[] => {
  const lowerCaseCode = countryCode.toLowerCase();
  return DETAILED_COUNTRY_IP_RANGES[lowerCaseCode as keyof typeof DETAILED_COUNTRY_IP_RANGES] || [];
};

/**
 * Generate a random IP within a given CIDR range
 */
export const getRandomIpInRange = (cidr: string): string => {
  const { start, end } = cidrToRange(cidr);
  
  // Convert IPs to numbers
  const startParts = start.split('.').map(Number);
  const endParts = end.split('.').map(Number);
  
  const startNum = (startParts[0] << 24) | (startParts[1] << 16) | (startParts[2] << 8) | startParts[3];
  const endNum = (endParts[0] << 24) | (endParts[1] << 16) | (endParts[2] << 8) | endParts[3];
  
  // Generate a random number between start and end
  const randomNum = startNum + Math.floor(Math.random() * (endNum - startNum + 1));
  
  // Convert back to IP string
  return [
    (randomNum >>> 24) & 255,
    (randomNum >>> 16) & 255,
    (randomNum >>> 8) & 255,
    randomNum & 255
  ].join('.');
};

/**
 * Calculate the number of IPs in a CIDR range
 */
export const calculateIpsInRange = (cidr: string): number => {
  const prefix = parseInt(cidr.split('/')[1]);
  return Math.pow(2, 32 - prefix);
};
