
/**
 * Analyze a website for security and information (similar to Web-Check)
 */
export const analyzeWebsite = async (url: string): Promise<{
  dns: Array<{type: string, value: string}>;
  headers: Record<string, string>;
  technologies: string[];
  securityHeaders: Array<{header: string, value: string | null, status: 'good' | 'warning' | 'bad'}>;
  certificates: {
    issuer: string;
    validFrom: string;
    validTo: string;
    daysRemaining: number;
  } | null;
  ports: Array<{port: number, service: string, state: 'open' | 'closed' | 'filtered'}>;
}> => {
  console.log(`Analyzing website: ${url}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  // In a real implementation, this would perform actual checks on the website
  // For demonstration purposes, we'll generate mock results
  
  // Parse domain from URL
  let domain = url;
  try {
    domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
  } catch (e) {
    // If URL parsing fails, just use the original input
    console.error('Error parsing URL:', e);
  }
  
  // Generate mock DNS records
  const dns = [
    { type: 'A', value: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` },
    { type: 'MX', value: `mail.${domain}` },
    { type: 'TXT', value: `v=spf1 include:_spf.${domain} -all` },
    { type: 'NS', value: `ns1.${domain.split('.').slice(-2).join('.')}` },
    { type: 'NS', value: `ns2.${domain.split('.').slice(-2).join('.')}` },
    { type: 'CNAME', value: `www.${domain}` }
  ];
  
  // Generate mock HTTP headers
  const headers = {
    'Server': ['Apache', 'nginx', 'Microsoft-IIS/10.0', 'cloudflare'][Math.floor(Math.random() * 4)],
    'Content-Type': 'text/html; charset=UTF-8',
    'Cache-Control': 'max-age=3600',
    'X-Powered-By': Math.random() > 0.5 ? ['PHP/7.4.3', 'ASP.NET', 'Express'][Math.floor(Math.random() * 3)] : undefined,
    'Date': new Date().toUTCString()
  };
  
  // Generate mock technologies
  const techOptions = [
    'WordPress', 'React', 'Angular', 'jQuery', 'Bootstrap', 'PHP', 
    'ASP.NET', 'Node.js', 'Ruby on Rails', 'Google Analytics', 
    'Cloudflare', 'AWS', 'Google Cloud', 'Azure', 'Nginx', 'Apache', 
    'MySQL', 'MongoDB', 'PostgreSQL', 'Redis'
  ];
  
  const techCount = Math.floor(Math.random() * 6) + 3; // 3-8 technologies
  const technologies = [];
  
  for (let i = 0; i < techCount; i++) {
    const tech = techOptions[Math.floor(Math.random() * techOptions.length)];
    if (!technologies.includes(tech)) {
      technologies.push(tech);
    }
  }
  
  // Generate security headers with proper type for status
  const securityHeaders = [
    {
      header: 'Content-Security-Policy',
      value: Math.random() > 0.5 ? "default-src 'self'" : null,
      status: Math.random() > 0.5 ? 'good' : 'bad' as 'good' | 'bad'
    },
    {
      header: 'X-XSS-Protection',
      value: Math.random() > 0.7 ? '1; mode=block' : null,
      status: Math.random() > 0.5 ? 'good' : 'warning' as 'good' | 'warning'
    },
    {
      header: 'X-Frame-Options',
      value: Math.random() > 0.6 ? 'SAMEORIGIN' : null,
      status: Math.random() > 0.5 ? 'good' : 'bad' as 'good' | 'bad'
    },
    {
      header: 'X-Content-Type-Options',
      value: Math.random() > 0.8 ? 'nosniff' : null,
      status: Math.random() > 0.5 ? 'good' : 'warning' as 'good' | 'warning'
    },
    {
      header: 'Strict-Transport-Security',
      value: Math.random() > 0.6 ? 'max-age=31536000; includeSubDomains' : null,
      status: Math.random() > 0.5 ? 'good' : 'bad' as 'good' | 'bad'
    }
  ];
  
  // Generate certificate info
  const certIsPresent = Math.random() > 0.3;
  const certificates = certIsPresent ? {
    issuer: ['Let\'s Encrypt Authority X3', 'DigiCert SHA2 Secure Server CA', 'Sectigo RSA Domain Validation Secure Server CA'][Math.floor(Math.random() * 3)],
    validFrom: new Date(Date.now() - Math.random() * 15552000000).toISOString(), // 6 months ago
    validTo: new Date(Date.now() + Math.random() * 15552000000).toISOString(), // 6 months ahead
    daysRemaining: Math.floor(Math.random() * 180) + 1
  } : null;
  
  // Generate open ports
  const portOptions = [
    { port: 21, service: 'FTP' },
    { port: 22, service: 'SSH' },
    { port: 25, service: 'SMTP' },
    { port: 80, service: 'HTTP' },
    { port: 443, service: 'HTTPS' },
    { port: 3306, service: 'MySQL' },
    { port: 8080, service: 'HTTP-Proxy' }
  ];
  
  const ports = portOptions.map(p => ({
    port: p.port,
    service: p.service,
    state: ['open', 'closed', 'filtered'][Math.floor(Math.random() * 3)] as 'open' | 'closed' | 'filtered'
  }));
  
  return {
    dns,
    headers,
    technologies,
    securityHeaders,
    certificates,
    ports
  };
};

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

// Helper functions
function getMockOrganization(ip: string): string {
  const organizations = [
    'Cloudflare, Inc.',
    'Amazon.com, Inc.',
    'Google LLC',
    'Microsoft Corporation',
    'OVH SAS',
    'Digital Ocean, Inc.',
    'Hetzner Online GmbH',
    'Comcast Cable Communications',
    'Verizon Business',
    'AT&T Services, Inc.'
  ];
  
  // Use the last octet of the IP to determine the organization (for consistent mock results)
  const lastOctet = parseInt(ip.split('.')[3]);
  return organizations[lastOctet % organizations.length];
}

function getMockNetworkRange(ip: string): string {
  // Generate a CIDR range based on the IP
  const parts = ip.split('.');
  return `${parts[0]}.${parts[1]}.0.0/16`;
}

function getMockCountry(ip: string): string {
  const countries = [
    'United States',
    'Germany',
    'France',
    'Netherlands',
    'United Kingdom',
    'Japan',
    'Singapore',
    'Australia',
    'Brazil',
    'Canada',
    'Italy',
    'Spain'
  ];
  
  // Use the second octet of the IP to determine the country (for consistent mock results)
  const secondOctet = parseInt(ip.split('.')[1]);
  return countries[secondOctet % countries.length];
}

function generateMockDomain(ip: string): string {
  // Generate a domain based on the IP for consistent mock results
  const parts = ip.split('.');
  const tlds = ['.com', '.net', '.org', '.io', '.tech'];
  const words = ['connect', 'server', 'cloud', 'host', 'net', 'web', 'data', 'secure'];
  
  const word1 = words[parseInt(parts[0]) % words.length];
  const word2 = words[parseInt(parts[1]) % words.length];
  const tld = tlds[parseInt(parts[3]) % tlds.length];
  
  return `${word1}${word2}${tld}`;
}
