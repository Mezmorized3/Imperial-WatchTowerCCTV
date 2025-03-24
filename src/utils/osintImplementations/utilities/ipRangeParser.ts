
/**
 * Utility to parse IP ranges in various formats
 */

/**
 * Parses an IP range string into an array of IP addresses
 * Supports CIDR notation (192.168.1.0/24) and range notation (192.168.1.1-10)
 */
export const parseIpRange = (ipRange: string): string[] => {
  // Basic implementation to parse CIDR notation
  if (ipRange.includes('/')) {
    const [baseIp, cidrPart] = ipRange.split('/');
    const cidr = parseInt(cidrPart);
    
    // For simplicity, return a few IPs in the range for simulation
    const ipParts = baseIp.split('.');
    const results: string[] = [];
    
    // Generate 10 IPs in the range
    for (let i = 0; i < 10; i++) {
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
      
      for (let i = startNum; i <= endNum && i <= 255; i++) {
        results.push(`${baseParts[0]}.${baseParts[1]}.${baseParts[2]}.${i}`);
      }
    }
    
    return results;
  }
  
  // Single IP
  return [ipRange];
};
