
/**
 * Utility for calculating IP ranges in CIDR notation
 */

/**
 * Calculate the number of IP addresses in a CIDR range
 * 
 * @param cidr CIDR notation string (e.g., "192.168.1.0/24")
 * @returns The number of IP addresses in the range
 */
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

/**
 * Convert a CIDR range to the first and last IP in the range
 * 
 * @param cidr CIDR notation string (e.g., "192.168.1.0/24")
 * @returns Object containing first and last IP addresses in the range
 */
export const cidrToRange = (cidr: string): { first: string; last: string } => {
  if (!cidr.includes('/')) {
    return { first: cidr, last: cidr }; // Single IP
  }
  
  const [baseIp, prefixStr] = cidr.split('/');
  const prefix = parseInt(prefixStr, 10);
  
  if (isNaN(prefix) || prefix < 0 || prefix > 32) {
    throw new Error(`Invalid CIDR prefix: ${prefixStr}`);
  }
  
  // Parse the base IP address
  const octets = baseIp.split('.').map(Number);
  if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) {
    throw new Error(`Invalid IP address: ${baseIp}`);
  }
  
  // Convert to 32-bit integer
  let ipInt = (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
  
  // Calculate the mask
  const mask = ~((1 << (32 - prefix)) - 1);
  
  // Calculate the first and last IP in the range
  const firstIpInt = ipInt & mask;
  const lastIpInt = firstIpInt | ~mask;
  
  // Convert back to string
  const firstIp = [
    (firstIpInt >>> 24) & 255,
    (firstIpInt >>> 16) & 255,
    (firstIpInt >>> 8) & 255,
    firstIpInt & 255
  ].join('.');
  
  const lastIp = [
    (lastIpInt >>> 24) & 255,
    (lastIpInt >>> 16) & 255,
    (lastIpInt >>> 8) & 255,
    lastIpInt & 255
  ].join('.');
  
  return { first: firstIp, last: lastIp };
};
