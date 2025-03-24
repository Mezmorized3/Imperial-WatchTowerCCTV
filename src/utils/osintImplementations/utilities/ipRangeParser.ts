
/**
 * IP range parser utility
 */

/**
 * Parses an IP range in CIDR notation and returns an array of IPs
 * @param ipRange The IP range to parse (e.g., 192.168.1.0/24)
 * @returns An array of individual IP addresses
 */
export const parseIpRange = (ipRange: string): string[] => {
  // Basic implementation to parse CIDR notation
  if (ipRange.includes('/')) {
    const [baseIp, cidrPart] = ipRange.split('/');
    const cidr = parseInt(cidrPart);
    
    // For simulation, return a few IPs in the range
    const ipParts = baseIp.split('.');
    const results: string[] = [];
    
    // Generate up to 10 IPs in the range
    const count = Math.min(10, Math.pow(2, 32 - cidr));
    for (let i = 0; i < count; i++) {
      const lastOctet = parseInt(ipParts[3]) + i;
      if (lastOctet <= 255) {
        results.push(`${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${lastOctet}`);
      }
    }
    
    return results;
  }
  
  // Handle range notation like 192.168.1.1-10
  if (ipRange.includes('-')) {
    const [start, end] = ipRange.split('-');
    const results: string[] = [];
    
    if (start.includes('.')) {
      const baseParts = start.split('.');
      const startNum = parseInt(baseParts[3]);
      const endNum = parseInt(end);
      
      const count = Math.min(10, endNum - startNum + 1);
      for (let i = 0; i < count; i++) {
        const lastOctet = startNum + i;
        if (lastOctet <= 255) {
          results.push(`${baseParts[0]}.${baseParts[1]}.${baseParts[2]}.${lastOctet}`);
        }
      }
    }
    
    return results;
  }
  
  // Single IP
  return [ipRange];
};

/**
 * Estimates the number of IP addresses in a CIDR range
 * @param cidr The CIDR range (e.g., 192.168.1.0/24)
 * @returns The number of IP addresses in the range
 */
export const countIpsInRange = (cidr: string): number => {
  if (!cidr.includes('/')) return 1;
  
  const prefix = parseInt(cidr.split('/')[1]);
  return Math.pow(2, 32 - prefix);
};
