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

/**
 * Analyze a website for security information
 * @param url The URL to analyze
 * @returns Promise resolving to website analysis data
 */
export const analyzeWebsite = async (url: string): Promise<any> => {
  console.log(`Analyzing website: ${url}`);
  
  // Simulate delay for API call
  await simulateNetworkDelay(2500);
  
  // Extract domain from URL if a full URL was provided
  let domain = url;
  try {
    if (url.startsWith('http')) {
      domain = new URL(url).hostname;
    } else if (url.includes('/')) {
      domain = url.split('/')[0];
    }
  } catch (error) {
    console.error('Error parsing URL:', error);
  }
  
  // Generate simulated analysis results
  const results = {
    url: url,
    domain: domain,
    dns: [
      { type: 'A', value: '192.168.1.1' },
      { type: 'MX', value: 'mail.example.com' },
      { type: 'TXT', value: 'v=spf1 include:_spf.example.com ~all' },
      { type: 'NS', value: 'ns1.example.com' }
    ],
    securityHeaders: [
      { header: 'Content-Security-Policy', value: "default-src 'self'", status: 'good' },
      { header: 'X-XSS-Protection', value: '1; mode=block', status: 'good' },
      { header: 'X-Frame-Options', value: 'SAMEORIGIN', status: 'good' },
      { header: 'Strict-Transport-Security', value: '', status: 'warning' },
      { header: 'X-Content-Type-Options', value: 'nosniff', status: 'good' },
      { header: 'Referrer-Policy', value: '', status: 'warning' }
    ],
    technologies: [
      'Nginx',
      'React',
      'Node.js',
      'MongoDB',
      'AWS'
    ],
    ports: [
      { port: 80, state: 'open', service: 'HTTP' },
      { port: 443, state: 'open', service: 'HTTPS' },
      { port: 22, state: 'open', service: 'SSH' },
      { port: 25, state: 'closed', service: 'SMTP' },
      { port: 3306, state: 'filtered', service: 'MySQL' }
    ],
    certificates: {
      issuer: 'Let\'s Encrypt Authority X3',
      validFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days in future
      daysRemaining: 60
    }
  };
  
  return results;
};
