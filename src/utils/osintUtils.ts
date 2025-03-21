import { CameraResult, ThreatIntelData } from '@/types/scanner';
import { getComprehensiveThreatIntel, analyzeFirmware } from './threatIntelligence';

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
 * Enhanced: Query ZoomEye API for CCTV camera information with threat intelligence
 */
export const queryZoomEyeApi = async (ip: string): Promise<Record<string, any>> => {
  console.log(`Querying ZoomEye for IP: ${ip}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Get threat intelligence data
  const threatIntel = await getComprehensiveThreatIntel(ip);
  
  // Mock ZoomEye data for demonstration
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
  
  const firmwareVersion = generateFirmwareVersion();
  
  // Get firmware analysis
  const firmwareAnalysis = Math.random() > 0.5 ? 
    await analyzeFirmware(manufacturer.name, model, firmwareVersion.substring(1)) : null;
  
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
    'Firmware Version': firmwareVersion,
    'Firmware Analysis': firmwareAnalysis,
    'Open Ports': openPorts.join(', '),
    'HTTP Service': Math.random() > 0.3 ? `Port ${httpPort} - Web Management Interface` : 'Not detected',
    'RTSP Service': Math.random() > 0.3 ? `Port ${rtspPort} - Video Stream` : 'Not detected',
    'SSL/TLS': Math.random() > 0.5 ? 'Enabled' : 'Disabled',
    'Authentication': Math.random() > 0.4 ? 'Required' : 'Not required or bypassed',
    'Geolocation': getRandomGeoLocation(ip),
    'Threat Intelligence': threatIntel
  };
};

/**
 * Generate a random geolocation near the country associated with the IP
 */
export const getRandomGeoLocation = (ip: string): {lat: number; lng: number; accuracy: string; country: string; city: string} => {
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
  
  // Generate a random city based on the country
  const cities: Record<string, string[]> = {
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    'Germany': ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt'],
    'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
    'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo'],
    'Singapore': ['Singapore'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza'],
    'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Ottawa'],
    'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Florence'],
    'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza']
  };
  
  // Choose a random city for the country
  const countryCity = cities[country] || cities['United States'];
  const city = countryCity[Math.floor(Math.random() * countryCity.length)];
  
  return {
    lat: baseCoords[0] + latVariation,
    lng: baseCoords[1] + lngVariation,
    accuracy: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
    country: country,
    city: city
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

// NEW FUNCTIONALITY: InsecamOrg country-based camera search

// Add the missing getCountryName function
function getCountryName(countryCode: string): string {
  const countryMap: Record<string, string> = {
    'US': 'United States',
    'JP': 'Japan',
    'KR': 'South Korea',
    'GB': 'United Kingdom',
    'FR': 'France',
    'DE': 'Germany',
    'IT': 'Italy',
    'TR': 'Turkey',
    'RU': 'Russia',
    'CA': 'Canada',
    'CN': 'China',
    'AU': 'Australia',
    'IN': 'India',
    'MX': 'Mexico',
    'BR': 'Brazil',
    'ES': 'Spain',
    'NL': 'Netherlands',
    'IL': 'Israel',
    'PS': 'Palestine',
    'SA': 'Saudi Arabia',
    'AE': 'United Arab Emirates',
    'EG': 'Egypt',
    'UA': 'Ukraine',
    'BE': 'Belgium',
    'PL': 'Poland'
  };
  
  return countryMap[countryCode] || countryCode;
}

/**
 * Get list of countries with camera counts from Insecam
 */
export const getInsecamCountries = async (): Promise<Array<{
  code: string;
  country: string;
  count: number;
}>> => {
  console.log('Fetching countries list from Insecam');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real implementation, this would scrape data from insecam.org
  // For demonstration purposes, we'll use mock data
  return [
    { code: 'US', country: 'United States', count: 4352 },
    { code: 'JP', country: 'Japan', count: 1532 },
    { code: 'KR', country: 'South Korea', count: 1227 },
    { code: 'GB', country: 'United Kingdom', count: 985 },
    { code: 'FR', country: 'France', count: 865 },
    { code: 'DE', country: 'Germany', count: 759 },
    { code: 'IT', country: 'Italy', count: 703 },
    { code: 'TR', country: 'Turkey', count: 673 },
    { code: 'RU', country: 'Russia', count: 587 },
    { code: 'CA', country: 'Canada', count: 552 },
    { code: 'CN', country: 'China', count: 513 },
    { code: 'AU', country: 'Australia', count: 428 },
    { code: 'IN', country: 'India', count: 387 },
    { code: 'MX', country: 'Mexico', count: 346 },
    { code: 'BR', country: 'Brazil', count: 321 },
    { code: 'ES', country: 'Spain', count: 298 },
    { code: 'NL', country: 'Netherlands', count: 276 },
    { code: 'IL', country: 'Israel', count: 224 },
    { code: 'PS', country: 'Palestine', count: 198 },
    { code: 'SA', country: 'Saudi Arabia', count: 187 },
    { code: 'AE', country: 'United Arab Emirates', count: 173 },
    { code: 'EG', country: 'Egypt', count: 162 },
    { code: 'UA', country: 'Ukraine', count: 151 },
    { code: 'BE', country: 'Belgium', count: 142 },
    { code: 'PL', country: 'Poland', count: 134 }
  ];
};

/**
 * Search for cameras in a specific country using Insecam
 */
export const searchInsecamByCountry = async (countryCode: string, page: number = 1): Promise<{
  cameras: Array<{
    id: string;
    ip: string;
    port: number;
    previewUrl: string;
    location: string;
    manufacturer?: string;
  }>;
  totalPages: number;
  currentPage: number;
}> => {
  console.log(`Searching Insecam for cameras in country: ${countryCode}, page: ${page}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, this would scrape data from insecam.org/en/bycountry/{countryCode}/?page={page}
  // For demonstration purposes, we'll generate mock results
  
  // Generate a random total between 3-12 pages
  const totalPages = Math.floor(Math.random() * 10) + 3;
  
  // Generate 8-16 camera results per page
  const cameraCount = Math.floor(Math.random() * 9) + 8;
  const cameras = [];
  
  for (let i = 0; i < cameraCount; i++) {
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const port = [80, 8080, 8081, 9000, 554][Math.floor(Math.random() * 5)];
    const manufacturers = ['Hikvision', 'Dahua', 'Axis', 'Foscam', 'Amcrest', 'Reolink', 'Vivotek', 'Bosch', 'Samsung', undefined];
    
    cameras.push({
      id: `insecam-${ip}-${port}`,
      ip,
      port,
      previewUrl: `http://${ip}:${port}/snapshot.jpg`,
      location: getCountryName(countryCode),
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)]
    });
  }
  
  return {
    cameras,
    totalPages,
    currentPage: page
  };
};

// NEW FUNCTIONALITY: Google dork search for cameras (similar to SearchCAM)

/**
 * Perform a Google dork search for cameras
 */
export const googleDorkSearch = async (dorkQuery: string): Promise<{
  results: Array<{
    id: string;
    title: string;
    url: string;
    snippet: string;
    isCamera: boolean;
  }>;
}> => {
  console.log(`Performing Google dork search with query: ${dorkQuery}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // In a real implementation, this would use Google search API or scrape Google results
  // For demonstration purposes, we'll generate mock results
  
  // Common camera dork queries to simulate matching against
  const cameraDorks = [
    'intitle:"live view"',
    'inurl:view/index.shtml',
    'intitle:"webcamXP"',
    'inurl:/view.shtml',
    'intitle:"IP CAMERA Viewer"',
    'intitle:"AXIS Video Server"',
    'intext:"powered by webcamXP"',
    'intitle:"View Video"',
    'intitle:"Live NetSnap Cam-Server feed"',
    'intitle:"Active Webcam Page"'
  ];
  
  // Check if the query contains any camera dorks to determine likelihood of results
  const containsCameraDork = cameraDorks.some(dork => dorkQuery.toLowerCase().includes(dork.toLowerCase()));
  
  // Generate 3-12 results
  const resultCount = containsCameraDork ? Math.floor(Math.random() * 10) + 3 : Math.floor(Math.random() * 5) + 1;
  const results = [];
  
  for (let i = 0; i < resultCount; i++) {
    // Generate realistic-looking results
    const isCamera = containsCameraDork ? Math.random() > 0.3 : Math.random() > 0.7;
    
    // Generate different types of URLs and titles based on whether it's a camera
    let url, title, snippet;
    
    if (isCamera) {
      // Generate a camera-like URL and title
      const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      const port = [80, 8080, 8081, 9000, 554][Math.floor(Math.random() * 5)];
      const paths = ['/view.shtml', '/index.html', '/live.html', '/webcam.html', '/camera.html'];
      const path = paths[Math.floor(Math.random() * paths.length)];
      
      url = `http://${ip}:${port}${path}`;
      
      const titles = [
        'Live View - Network Camera',
        'IP Camera Viewer',
        'AXIS Video Server',
        'Live NetSnap Cam-Server feed',
        'Webcam XP 5 - Live View',
        'Surveillance Camera - Live Feed',
        'Security Camera Web Interface'
      ];
      
      title = titles[Math.floor(Math.random() * titles.length)];
      
      const snippets = [
        'Live view of security camera. User: admin Password: admin ... View different camera angles and configure motion detection settings.',
        'Control panel for IP camera system. Set recording schedules, view live feeds, and configure alert settings.',
        'RTSP stream available at rtsp://admin:admin@... View live camera feed and access recording archive.',
        'Web interface for surveillance camera. PTZ controls available. Current status: recording.',
        'Access your security camera remotely. Supports ONVIF protocol and integrates with NVR systems.'
      ];
      
      snippet = snippets[Math.floor(Math.random() * snippets.length)];
    } else {
      // Generate a non-camera result that might have matched the query
      const domains = ['security-camera-reviews.com', 'cctv-forum.net', 'surveillance-guide.org', 'securitycameras.com', 'ipcamtalk.com'];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const paths = ['/best-cameras', '/setup-guide', '/how-to-access-cameras', '/camera-comparison', '/security-tips'];
      const path = paths[Math.floor(Math.random() * paths.length)];
      
      url = `https://${domain}${path}`;
      
      const titles = [
        'How to Access Security Cameras Remotely - Complete Guide',
        'Best IP Cameras for Home Security in 2023',
        'Security Camera Setup Instructions',
        'Understanding RTSP, ONVIF and Other Camera Protocols',
        'Forum: Can\'t Access My Security Camera'
      ];
      
      title = titles[Math.floor(Math.random() * titles.length)];
      
      const snippets = [
        'Learn how to access your security cameras from anywhere using port forwarding and dynamic DNS services.',
        'Comprehensive comparison of the top IP camera brands including Hikvision, Dahua, Axis and more.',
        'Step-by-step guide to setting up your surveillance system including camera placement and wiring.',
        'Discussion about common security vulnerabilities in IP cameras and how to protect your system.',
        'Troubleshooting guide for common connection issues with IP cameras and NVR systems.'
      ];
      
      snippet = snippets[Math.floor(Math.random() * snippets.length)];
    }
    
    results.push({
      id: `dork-${i}-${Date.now()}`,
      title,
      url,
      snippet,
      isCamera
    });
  }
  
  return { results };
};

// NEW FUNCTIONALITY: Sherlock-like username search

/**
 * Search for a username across multiple platforms (similar to Sherlock)
 */
export const searchUsername = async (username: string): Promise<{
  results: Array<{
    platform: string;
    url: string;
    exists: boolean;
    username: string;
    note?: string;
  }>;
}> => {
  console.log(`Searching for username: ${username} across platforms`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // In a real implementation, this would check each site for the username
  // For demonstration purposes, we'll generate mock results
  
  const platforms = [
    { name: 'GitHub', url: `https://github.com/${username}`, probability: 0.7 },
    { name: 'Twitter', url: `https://twitter.com/${username}`, probability: 0.8 },
    { name: 'Instagram', url: `https://instagram.com/${username}`, probability: 0.75 },
    { name: 'Facebook', url: `https://facebook.com/${username}`, probability: 0.65 },
    { name: 'LinkedIn', url: `https://linkedin.com/in/${username}`, probability: 0.6 },
    { name: 'Reddit', url: `https://reddit.com/user/${username}`, probability: 0.7 },
    { name: 'YouTube', url: `https://youtube.com/@${username}`, probability: 0.5 },
    { name: 'Tumblr', url: `https://${username}.tumblr.com`, probability: 0.4 },
    { name: 'Medium', url: `https://medium.com/@${username}`, probability: 0.5 },
    { name: 'Pinterest', url: `https://pinterest.com/${username}`, probability: 0.55 },
    { name: 'Steam', url: `https://steamcommunity.com/id/${username}`, probability: 0.6 },
    { name: 'Twitch', url: `https://twitch.tv/${username}`, probability: 0.5 },
    { name: 'Patreon', url: `https://patreon.com/${username}`, probability: 0.3 },
    { name: 'TikTok', url: `https://tiktok.com/@${username}`, probability: 0.65 },
    { name: 'HackerOne', url: `https://hackerone.com/${username}`, probability: 0.2 }
  ];
  
  const results = platforms.map(platform => {
    const exists = Math.random() < platform.probability;
    
    return {
      platform: platform.name,
      url: platform.url,
      exists,
      username,
      note: exists ? undefined : Math.random() > 0.7 ? 'Profile set to private' : undefined
    };
  });
  
  return { results };
};

// NEW FUNCTIONALITY: Web-Check like site analysis

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
  
  // Fix the securityHeaders type by using explicit union types for status
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
      header: 'Strict-Transport
