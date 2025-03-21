
/**
 * Network utilities for simulating delays and network operations
 */

/**
 * Simulate a network delay (useful for dev environment)
 */
export const simulateNetworkDelay = async (maxDelayMs: number = 800): Promise<void> => {
  const delay = Math.floor(Math.random() * maxDelayMs) + 200; // 200-1000ms delay
  await new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Fetch WHOIS data for a domain or IP
 */
export const fetchWhoisData = async (target: string): Promise<Record<string, any>> => {
  await simulateNetworkDelay();
  
  // Simulated WHOIS data
  return {
    domain: target,
    registrar: 'Some Registrar Inc.',
    registrant: {
      name: 'Example Corporation',
      organization: 'Example Inc.',
      address: '123 Example St.',
      city: 'New York',
      state: 'NY',
      country: 'US'
    },
    created: '2020-01-01',
    expires: '2025-01-01',
    nameservers: ['ns1.example.com', 'ns2.example.com']
  };
};

/**
 * Fetch DNS records for a domain
 */
export const fetchDnsRecords = async (domain: string): Promise<Record<string, any>[]> => {
  await simulateNetworkDelay();
  
  // Simulated DNS records
  return [
    { type: 'A', value: '192.0.2.1', ttl: 3600 },
    { type: 'AAAA', value: '2001:db8::1', ttl: 3600 },
    { type: 'MX', value: 'mail.example.com', priority: 10, ttl: 3600 },
    { type: 'NS', value: 'ns1.example.com', ttl: 86400 },
    { type: 'TXT', value: 'v=spf1 include:_spf.example.com ~all', ttl: 3600 }
  ];
};

/**
 * Check vulnerabilities in a network device
 */
export const checkVulnerabilityDatabase = async (target: string): Promise<Record<string, any>[]> => {
  await simulateNetworkDelay();
  
  // Simulated vulnerabilities
  return [
    { 
      cve: 'CVE-2021-1234', 
      severity: 'High', 
      description: 'Buffer overflow vulnerability in the HTTP handler',
      affected: ['FirmwareVersions < 2.1.3']
    },
    { 
      cve: 'CVE-2020-5678', 
      severity: 'Medium', 
      description: 'Authentication bypass in the web interface',
      affected: ['FirmwareVersions < 1.9.0']
    }
  ];
};

/**
 * Analyze a website for security and information
 */
export const analyzeWebsite = async (url: string): Promise<Record<string, any>> => {
  await simulateNetworkDelay(2000); // This is a more intensive operation
  
  // Clean up URL if needed
  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }
  
  // Extract domain
  const domain = url.replace(/^https?:\/\//i, '').split('/')[0];
  
  // Simulate gathering of data
  const securityHeaders = [
    { header: 'Strict-Transport-Security', value: Math.random() > 0.5 ? 'max-age=31536000; includeSubDomains' : null, status: Math.random() > 0.5 ? 'good' : 'bad' },
    { header: 'Content-Security-Policy', value: Math.random() > 0.7 ? "default-src 'self'" : null, status: Math.random() > 0.5 ? 'good' : 'warning' },
    { header: 'X-Content-Type-Options', value: Math.random() > 0.6 ? 'nosniff' : null, status: Math.random() > 0.6 ? 'good' : 'bad' },
    { header: 'X-Frame-Options', value: Math.random() > 0.5 ? 'DENY' : null, status: Math.random() > 0.5 ? 'good' : 'bad' },
    { header: 'X-XSS-Protection', value: Math.random() > 0.5 ? '1; mode=block' : null, status: Math.random() > 0.5 ? 'good' : 'bad' },
  ];
  
  const technologies = [
    'NGINX', 'jQuery', 'React', 'Bootstrap', 'Google Analytics', 
    'WordPress', 'PHP', 'Font Awesome', 'CloudFlare'
  ].filter(() => Math.random() > 0.5);
  
  const ports = [
    { port: 80, service: 'HTTP', protocol: 'TCP', state: 'open' },
    { port: 443, service: 'HTTPS', protocol: 'TCP', state: 'open' },
    { port: 21, service: 'FTP', protocol: 'TCP', state: Math.random() > 0.7 ? 'open' : 'closed' },
    { port: 22, service: 'SSH', protocol: 'TCP', state: Math.random() > 0.7 ? 'open' : 'closed' },
    { port: 25, service: 'SMTP', protocol: 'TCP', state: Math.random() > 0.8 ? 'open' : 'closed' },
    { port: 3306, service: 'MySQL', protocol: 'TCP', state: Math.random() > 0.9 ? 'open' : 'closed' },
  ];
  
  const dns = await fetchDnsRecords(domain);
  
  const certificates = Math.random() > 0.2 ? {
    subject: domain,
    issuer: ['Let\'s Encrypt Authority X3', 'DigiCert SHA2 Secure Server CA', 'Sectigo RSA Domain Validation Secure Server CA'][Math.floor(Math.random() * 3)],
    validFrom: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000).toISOString(),
    validTo: new Date(Date.now() + Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
    daysRemaining: Math.floor(Math.random() * 300) + 1
  } : null;
  
  return {
    url,
    domain,
    dns,
    securityHeaders,
    technologies,
    ports,
    certificates
  };
};
