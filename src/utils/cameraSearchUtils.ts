
import { CameraResult, ThreatIntelData } from '@/types/scanner';
import { getComprehensiveThreatIntel, analyzeFirmware } from './threatIntelligence';

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

/**
 * Convert country code to country name
 */
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
