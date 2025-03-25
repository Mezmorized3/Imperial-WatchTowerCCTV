
/**
 * Network utility functions
 */

/**
 * Simulates a network delay for async operations
 * @param ms Milliseconds to delay
 */
export const simulateNetworkDelay = async (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Utility function to check if a string is a valid IP address
 */
export const isValidIPAddress = (ip: string): boolean => {
  // IPv4 regex pattern
  const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  if (!ipv4Pattern.test(ip)) return false;
  
  // Check if each octet is valid (0-255)
  const octets = ip.split('.');
  for (const octet of octets) {
    const num = parseInt(octet, 10);
    if (num < 0 || num > 255) return false;
  }
  
  return true;
};

/**
 * Utility function to check if a string is a valid CIDR notation
 */
export const isValidCIDR = (cidr: string): boolean => {
  const parts = cidr.split('/');
  if (parts.length !== 2) return false;
  
  const [ip, prefixStr] = parts;
  if (!isValidIPAddress(ip)) return false;
  
  const prefix = parseInt(prefixStr, 10);
  return prefix >= 0 && prefix <= 32;
};

/**
 * Utility function to check if a port number is valid
 */
export const isValidPort = (port: number): boolean => {
  return port > 0 && port < 65536;
};

/**
 * Generates a random delay within a range
 * @param min Minimum delay in milliseconds
 * @param max Maximum delay in milliseconds
 */
export const getRandomDelay = (min = 500, max = 2000): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Formats a network scan speed for display
 * @param ipsPerSecond Number of IPs scanned per second
 */
export const formatScanSpeed = (ipsPerSecond: number): string => {
  if (ipsPerSecond < 1) {
    return `${(ipsPerSecond * 1000).toFixed(1)} IP/min`;
  } else if (ipsPerSecond >= 1000) {
    return `${(ipsPerSecond / 1000).toFixed(1)} K IP/sec`;
  } else {
    return `${ipsPerSecond.toFixed(1)} IP/sec`;
  }
};
