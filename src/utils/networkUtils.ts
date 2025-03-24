
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
  // This is a simulation - in a real app this would call a WHOIS API
  await simulateNetworkDelay(1000);
  
  return {
    domain,
    registrar: 'Example Registrar, LLC',
    registrationDate: '2010-01-15',
    expiryDate: '2025-01-15',
    nameservers: [
      'ns1.examplehost.com',
      'ns2.examplehost.com'
    ],
    status: 'Active',
    registrant: {
      organization: 'Example Organization',
      country: 'US',
      email: 'admin@example.com'
    }
  };
};

/**
 * Fetches DNS records for a domain
 */
export const fetchDnsRecords = async (domain: string, recordType = 'A'): Promise<any[]> => {
  // This is a simulation - in a real app this would perform a DNS lookup
  await simulateNetworkDelay(800);
  
  const records: any = {
    A: [
      { name: domain, value: '93.184.216.34', ttl: 300 },
      { name: `www.${domain}`, value: '93.184.216.34', ttl: 300 }
    ],
    MX: [
      { name: domain, value: `mail1.${domain}`, priority: 10, ttl: 3600 },
      { name: domain, value: `mail2.${domain}`, priority: 20, ttl: 3600 }
    ],
    TXT: [
      { name: domain, value: 'v=spf1 include:_spf.example.com -all', ttl: 3600 }
    ],
    CNAME: [
      { name: `cdn.${domain}`, value: 'cdn.external-provider.com', ttl: 3600 }
    ]
  };
  
  return records[recordType as keyof typeof records] || [];
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
