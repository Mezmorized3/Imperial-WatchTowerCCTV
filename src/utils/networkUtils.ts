
/**
 * Network utilities for OSINT and security tools
 */

/**
 * Parse an IP range into an array of individual IP addresses
 * @param range IP range in CIDR notation (e.g., 192.168.1.0/24)
 * @returns Array of IP addresses
 */
export const parseIpRange = (range: string): string[] => {
  // Basic implementation - in real world this would handle full CIDR parsing
  if (!range.includes('/')) {
    return [range]; // Not a range, just a single IP
  }

  const [baseIp, cidr] = range.split('/');
  const cidrNum = parseInt(cidr, 10);
  
  if (isNaN(cidrNum) || cidrNum < 0 || cidrNum > 32) {
    console.error('Invalid CIDR notation:', range);
    return [baseIp];
  }

  // For simplicity, we'll just return a small sample range
  // In a real implementation, this would properly calculate the entire range
  const ipParts = baseIp.split('.').map(part => parseInt(part, 10));
  const results: string[] = [];
  
  // Generate some IPs in the range (simplified)
  for (let i = 0; i < 10; i++) {
    const lastOctet = (ipParts[3] + i) % 256;
    results.push(`${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${lastOctet}`);
  }
  
  return results;
};

/**
 * Check if a port is open on a given host
 * @param host IP address or hostname
 * @param port Port number
 * @returns Promise resolving to boolean indicating if port is open
 */
export const isPortOpen = async (host: string, port: number): Promise<boolean> => {
  // In a real implementation, this would use socket programming to check the port
  // For now, we'll use a simulated approach
  console.log(`Checking if port ${port} is open on ${host}`);

  // This should be replaced with actual port scanning in production code
  // using something like net.Socket in Node.js
  const randomResult = Math.random() > 0.3; // 70% chance of port being open (for simulation)
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
  
  return randomResult;
};

/**
 * Simulate network delay for API calls
 * @param ms Milliseconds to delay (default random 500-1500ms)
 */
export const simulateNetworkDelay = (ms?: number): Promise<void> => {
  const delay = ms || (500 + Math.random() * 1000);
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Get available network interfaces
 * @returns List of network interfaces
 */
export const getNetworkInterfaces = (): string[] => {
  // In a real implementation, this would use Node.js os.networkInterfaces()
  // For frontend simulation, we'll return mock data
  return [
    'eth0 (Ethernet)',
    'wlan0 (Wireless)',
    'lo (Loopback)'
  ];
};

/**
 * Ping a host to check if it's reachable
 * @param host Hostname or IP address
 * @returns Promise resolving to ping result in ms, or null if unreachable
 */
export const pingHost = async (host: string): Promise<number | null> => {
  // In a real implementation, this would use actual ping or TCP socket
  console.log(`Pinging host: ${host}`);
  
  // Simulate network delay
  await simulateNetworkDelay();
  
  // Simulate 85% success rate
  if (Math.random() > 0.15) {
    return Math.floor(10 + Math.random() * 100); // Random ping time between 10-110ms
  }
  
  return null; // Host unreachable
};
