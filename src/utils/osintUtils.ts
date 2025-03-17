import { CameraResult } from '@/types/scanner';
import { getCameraDetailsByIp } from './zoomEyeUtils';

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

/**
 * Query ZoomEye API for CCTV camera information
 * Note: In a real application, we would use the actual ZoomEye API with proper authentication
 * Now updated to use the ZoomEye library when available, falling back to mock data
 */
export const queryZoomEyeApi = async (ip: string): Promise<Record<string, any>> => {
  console.log(`Querying ZoomEye for IP: ${ip}`);
  
  try {
    // Try to use the actual ZoomEye API if it's initialized
    const zoomEyeResults = await getCameraDetailsByIp(ip);
    
    if (zoomEyeResults && zoomEyeResults.matches && zoomEyeResults.matches.length > 0) {
      // Process and return real data from ZoomEye
      const result = zoomEyeResults.matches[0];
      
      // Extract relevant information from the ZoomEye result
      return {
        'IP Address': ip,
        'Last Scanned': result.timestamp || new Date().toISOString().split('T')[0],
        'Manufacturer': result.app || 'Unknown',
        'Model': result.device?.model || 'Unknown',
        'Firmware Version': result.version || 'Unknown',
        'Open Ports': result.portinfo?.port || 'Unknown',
        'HTTP Service': result.portinfo?.service === 'http' ? `Port ${result.portinfo.port} - Web Management Interface` : 'Not detected',
        'RTSP Service': result.portinfo?.service === 'rtsp' ? `Port ${result.portinfo.port} - Video Stream` : 'Not detected',
        'SSL/TLS': result.ssl ? 'Enabled' : 'Disabled',
        'Authentication': 'Unknown',
        'Geolocation': {
          lat: parseFloat(result.geoinfo?.latitude) || 0,
          lng: parseFloat(result.geoinfo?.longitude) || 0,
          accuracy: 'High'
        }
      };
    }
    
    // Fall back to mock data if no results
    console.log('No real ZoomEye data available, using mock data');
    return getMockZoomEyeData(ip);
  } catch (error) {
    console.error('Error querying ZoomEye API:', error);
    console.log('Falling back to mock data');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Return mock data as fallback
    return getMockZoomEyeData(ip);
  }
};

/**
 * Get mock ZoomEye data for demo purposes
 */
const getMockZoomEyeData = (ip: string): Record<string, any> => {
  // Generate random recent date
  const randomRecentDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    return date.toISOString().split('T')[0];
  };
  
  // Generate random port for different services
  const httpPort = [80, 8080, 8000, 8081, 8888][Math.floor(Math.random() * 5)];
  const rtspPort = [554, 8554, 10554][Math.floor(Math.random() * 3)];
  
  // Generate random camera manufacturer and model
  const manufacturers = [
    { name: 'Hikvision', models: ['DS-2CD2032-I', 'DS-2CD2142FWD-I', 'DS-2CD2042WD-I'] },
    { name: 'Dahua', models: ['IPC-HDW4431C-A', 'IPC-HDBW4631R-S', 'DH-IPC-HFW4431E-SE'] },
    { name: 'Axis', models: ['M3015', 'P1448-LE', 'P3225-LV Mk II'] },
    { name: 'Samsung', models: ['SNH-V6410PN', 'SNH-P6410BN', 'SND-L6083R'] },
    { name: 'Bosch', models: ['DINION IP 4000 HD', 'FLEXIDOME IP outdoor 4000 IR', 'TINYON IP 2000 WI'] }
  ];
  
  const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
  const model = manufacturer.models[Math.floor(Math.random() * manufacturer.models.length)];
  
  // Generate random firmware version
  const generateFirmwareVersion = () => {
    const major = Math.floor(Math.random() * 5) + 1;
    const minor = Math.floor(Math.random() * 10);
    const patch = Math.floor(Math.random() * 20);
    return `v${major}.${minor}.${patch}`;
  };
  
  // Random open ports
  const openPorts = [];
  if (Math.random() > 0.3) openPorts.push(httpPort);
  if (Math.random() > 0.3) openPorts.push(rtspPort);
  if (Math.random() > 0.6) openPorts.push(22); // SSH
  if (Math.random() > 0.7) openPorts.push(23); // Telnet
  if (Math.random() > 0.8) openPorts.push(9000); // API port
  
  return {
    'IP Address': ip,
    'Last Scanned': randomRecentDate(),
    'Manufacturer': manufacturer.name,
    'Model': model,
    'Firmware Version': generateFirmwareVersion(),
    'Open Ports': openPorts.join(', '),
    'HTTP Service': Math.random() > 0.3 ? `Port ${httpPort} - Web Management Interface` : 'Not detected',
    'RTSP Service': Math.random() > 0.3 ? `Port ${rtspPort} - Video Stream` : 'Not detected',
    'SSL/TLS': Math.random() > 0.5 ? 'Enabled' : 'Disabled',
    'Authentication': Math.random() > 0.4 ? 'Required' : 'Not required or bypassed',
    'Geolocation': getRandomGeoLocation(ip)
  };
};

/**
 * Generate a random geolocation near the country associated with the IP
 */
export const getRandomGeoLocation = (ip: string): {lat: number; lng: number; accuracy: string} => {
  // Use the mock country to determine a base location
  const country = getMockCountry(ip);
  
  // Base coordinates for countries (approximate centers)
  const countryCoords: Record<string, [number, number]> = {
    'United States': [37.0902, -95.7129],
    'Germany': [51.1657, 10.4515],
    'France': [46.2276, 2.2137],
    'Netherlands': [52.1326, 5.2913],
    'United Kingdom': [55.3781, -3.4360],
    'Japan': [36.2048, 138.2529],
    'Singapore': [1.3521, 103.8198],
    'Australia': [-25.2744, 133.7751],
    'Brazil': [-14.2350, -51.9253],
    'Canada': [56.1304, -106.3468],
    'Italy': [41.8719, 12.5674],
    'Spain': [40.4637, -3.7492]
  };
  
  // Default to US if country not found
  const baseCoords = countryCoords[country] || countryCoords['United States'];
  
  // Add some randomness to the coordinates (within ~50-100km)
  const latVariation = (Math.random() - 0.5) * 0.9;
  const lngVariation = (Math.random() - 0.5) * 0.9;
  
  return {
    lat: baseCoords[0] + latVariation,
    lng: baseCoords[1] + lngVariation,
    accuracy: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low'
  };
};

/**
 * Get more comprehensive OSINT data from multiple sources
 */
export const getComprehensiveOsintData = async (ip: string): Promise<Record<string, any>> => {
  console.log(`Getting comprehensive OSINT data for IP: ${ip}`);
  
  try {
    // Query all sources in parallel
    const [whoisData, dnsRecords, vulnerabilities, zoomeyeData] = await Promise.all([
      fetchWhoisData(ip),
      fetchDnsRecords(ip),
      checkVulnerabilityDatabase(ip),
      queryZoomEyeApi(ip)
    ]);
    
    // Combine the data
    return {
      whois: whoisData,
      dns: dnsRecords,
      vulnerabilities,
      zoomEye: zoomeyeData,
      geolocation: zoomeyeData.Geolocation,
      comprehensive: true
    };
  } catch (error) {
    console.error("Error fetching comprehensive OSINT data:", error);
    throw error;
  }
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
