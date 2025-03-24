/**
 * Network utility functions for networking operations
 */

/**
 * Simulates a network delay for realistic testing
 */
export const simulateNetworkDelay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Fetches WHOIS data for a domain
 */
export const fetchWhoisData = async (domain: string): Promise<any> => {
  try {
    // Use a real WHOIS API service
    const response = await fetch(`https://whois.freeaiapi.io/?domain=${domain}`);
    if (!response.ok) {
      throw new Error(`WHOIS API returned status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching WHOIS data:', error);
    throw error;
  }
};

/**
 * Fetches DNS records for a domain
 */
export const fetchDnsRecords = async (domain: string, recordType = 'A'): Promise<any[]> => {
  try {
    // Use a real DNS API service
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=${recordType}`);
    if (!response.ok) {
      throw new Error(`DNS API returned status: ${response.status}`);
    }
    const data = await response.json();
    
    // Parse the response into a common format
    return (data.Answer || []).map((record: any) => ({
      name: record.name,
      value: record.data,
      ttl: record.TTL,
      type: recordType
    }));
  } catch (error) {
    console.error('Error fetching DNS records:', error);
    throw error;
  }
};

/**
 * Calculates the subnet size from a CIDR notation
 */
export const calculateSubnetSize = (cidr: string): number => {
  const parts = cidr.split('/');
  if (parts.length !== 2) return 0;
  
  const prefix = parseInt(parts[1], 10);
  if (isNaN(prefix) || prefix < 0 || prefix > 32) return 0;
  
  return Math.pow(2, 32 - prefix);
};

/**
 * Converts an IP address to its numeric representation
 */
export const ipToNumber = (ip: string): number => {
  const parts = ip.split('.');
  if (parts.length !== 4) return 0;
  
  return ((parseInt(parts[0], 10) << 24) >>> 0) +
         ((parseInt(parts[1], 10) << 16) >>> 0) +
         ((parseInt(parts[2], 10) << 8) >>> 0) +
         parseInt(parts[3], 10);
};

/**
 * Converts a numeric representation to an IP address
 */
export const numberToIp = (num: number): string => {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255
  ].join('.');
};

/**
 * Generates a random IP address within a given subnet
 */
export const getRandomIpInSubnet = (subnet: string): string => {
  const [base, cidr] = subnet.split('/');
  if (!base || !cidr) return '';
  
  const baseNum = ipToNumber(base);
  const size = calculateSubnetSize(subnet);
  
  if (size === 0) return '';
  
  const randomOffset = Math.floor(Math.random() * (size - 2)) + 1;
  return numberToIp(baseNum + randomOffset);
};

/**
 * Sends a ping to the specified host to check if it's alive
 */
export const pingHost = async (host: string, timeout = 1000): Promise<{alive: boolean, responseTime?: number}> => {
  try {
    const startTime = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(`https://${host}`, {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors'
    });
    
    clearTimeout(timeoutId);
    const endTime = performance.now();
    
    return {
      alive: true,
      responseTime: Math.round(endTime - startTime)
    };
  } catch (error) {
    return { alive: false };
  }
};

/**
 * Performs a traceroute to the specified host
 */
export const traceroute = async (host: string): Promise<any[]> => {
  console.log('Traceroute is not natively supported in browsers');
  // In a real implementation, this would be handled by a backend service
  throw new Error('Traceroute requires server-side implementation');
};
