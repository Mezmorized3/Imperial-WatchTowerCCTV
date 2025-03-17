
import { CameraResult } from '@/types/scanner';

// Note: In a real application, these functions would connect to actual WHOIS/DNS services
// or use APIs. For this demo, we're returning mock data.

/**
 * Fetch WHOIS information for an IP address
 */
export const fetchWhoisData = async (ip: string): Promise<Record<string, any>> => {
  console.log(`Fetching WHOIS data for IP: ${ip}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a production app, this would call a real WHOIS API
  // Mock data for demonstration purposes
  return {
    'IP Address': ip,
    'ASN': `AS${Math.floor(Math.random() * 65000) + 1000}`,
    'Organization': getMockOrganization(ip),
    'Network Range': getMockNetworkRange(ip),
    'Country': getMockCountry(ip),
    'Registrar': 'RIPE NCC',
    'Registration Date': '2018-03-14',
    'Last Updated': '2023-11-27',
    'Abuse Contact': `abuse@${getMockOrganization(ip).toLowerCase().replace(' ', '')}.com`
  };
};

/**
 * Fetch DNS records for an IP address
 */
export const fetchDnsRecords = async (ip: string): Promise<Record<string, any>[]> => {
  console.log(`Fetching DNS records for IP: ${ip}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a production app, this would perform actual DNS lookups
  // Mock data for demonstration purposes
  const domain = generateMockDomain(ip);
  
  return [
    {
      type: 'A',
      name: domain,
      value: ip,
      ttl: 3600
    },
    {
      type: 'MX',
      name: domain,
      value: `mail.${domain}`,
      priority: 10,
      ttl: 3600
    },
    {
      type: 'TXT',
      name: domain,
      value: `v=spf1 include:_spf.${domain} -all`,
      ttl: 3600
    },
    {
      type: 'NS',
      name: domain,
      value: `ns1.${domain}`,
      ttl: 86400
    },
    {
      type: 'NS',
      name: domain,
      value: `ns2.${domain}`,
      ttl: 86400
    }
  ];
};

/**
 * Check vulnerability databases for known issues with this IP/device
 */
export const checkVulnerabilityDatabase = async (ip: string): Promise<Record<string, any>[]> => {
  console.log(`Checking vulnerability databases for IP: ${ip}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a production app, this would query real vulnerability databases like NVD, CVE, etc.
  // Mock data for demonstration purposes - sometimes returns vulnerabilities, sometimes not
  
  const shouldReturnVulnerabilities = Math.random() > 0.3; // 70% chance to return vulnerabilities
  
  if (!shouldReturnVulnerabilities) {
    return [];
  }
  
  const cameraVulnerabilities = [
    {
      name: 'Default Credentials Exposure',
      description: 'Device is configured with factory default credentials, allowing unauthorized access.',
      severity: 'critical',
      cve: 'CVE-2019-10999'
    },
    {
      name: 'Unauthenticated RTSP Stream',
      description: 'RTSP stream is accessible without authentication, exposing private video feed.',
      severity: 'high',
      cve: 'CVE-2018-16603'
    },
    {
      name: 'Outdated Firmware',
      description: 'Device is running an outdated firmware version with known security issues.',
      severity: 'medium',
      cve: 'CVE-2020-9524'
    },
    {
      name: 'Web Interface XSS Vulnerability',
      description: 'The web interface is vulnerable to cross-site scripting attacks.',
      severity: 'medium',
      cve: 'CVE-2021-32577'
    },
    {
      name: 'Insecure Storage of Credentials',
      description: 'Device stores credentials in an insecure manner, potentially allowing extraction.',
      severity: 'high',
      cve: 'CVE-2017-18042'
    }
  ];
  
  // Return 1-3 random vulnerabilities
  const numVulnerabilities = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...cameraVulnerabilities].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numVulnerabilities);
};

// Helper functions for generating mock data

function getMockOrganization(ip: string): string {
  const orgs = [
    'Cloudflare Inc.',
    'Amazon Technologies Inc.',
    'Google LLC',
    'Microsoft Corporation',
    'OVH SAS',
    'Digital Ocean LLC',
    'Hetzner Online GmbH',
    'Level 3 Communications',
    'Comcast Cable Communications',
    'Tencent Cloud Computing'
  ];
  
  // Use IP to deterministically select an organization
  const ipSum = ip.split('.').reduce((sum, octet) => sum + parseInt(octet, 10), 0);
  return orgs[ipSum % orgs.length];
}

function getMockNetworkRange(ip: string): string {
  const parts = ip.split('.');
  return `${parts[0]}.${parts[1]}.0.0/16`;
}

function getMockCountry(ip: string): string {
  const countries = [
    'United States', 'Germany', 'France', 'Netherlands', 
    'United Kingdom', 'Japan', 'Singapore', 'Australia',
    'Brazil', 'Canada', 'Italy', 'Spain'
  ];
  
  // Use IP to deterministically select a country
  const ipSum = ip.split('.').reduce((sum, octet) => sum + parseInt(octet, 10), 0);
  return countries[ipSum % countries.length];
}

function generateMockDomain(ip: string): string {
  const tlds = ['.com', '.net', '.org', '.io', '.cloud'];
  const words = ['secure', 'net', 'server', 'host', 'cloud', 'data', 'stream', 'cdn', 'api', 'web'];
  
  // Use IP to deterministically generate a domain
  const ipSum = ip.split('.').reduce((sum, octet) => sum + parseInt(octet, 10), 0);
  const word1 = words[ipSum % words.length];
  const word2 = words[(ipSum + 1) % words.length];
  const tld = tlds[ipSum % tlds.length];
  
  return `${word1}-${word2}${tld}`;
}
