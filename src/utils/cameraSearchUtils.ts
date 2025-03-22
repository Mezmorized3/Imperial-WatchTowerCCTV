
/**
 * Utilities for camera search functions
 */
import { simulateNetworkDelay } from './networkUtils';
import { CameraResult } from '@/utils/osintToolTypes';

/**
 * Search for cameras based on Google dorks and other techniques
 */
export const searchCameras = async (
  searchType: string,
  keywords: string[],
  country?: string
): Promise<CameraResult[]> => {
  await simulateNetworkDelay(1500);
  
  // Number of results to generate
  const numResults = Math.floor(Math.random() * 8) + 3;
  const results: CameraResult[] = [];
  
  // Camera manufacturers and models
  const manufacturers = [
    { name: 'Hikvision', models: ['DS-2CD2032-I', 'DS-2CD2142FWD-I', 'DS-2CD2042WD-I'] },
    { name: 'Dahua', models: ['IPC-HDW4431C-A', 'IPC-HDBW4631R-S', 'DH-IPC-HFW4431E-SE'] },
    { name: 'Axis', models: ['M3015', 'P1448-LE', 'P3225-LV Mk II'] },
    { name: 'Samsung', models: ['SNH-V6410PN', 'SNH-P6410BN', 'SND-L6083R'] },
    { name: 'Bosch', models: ['DINION IP 4000 HD', 'FLEXIDOME IP outdoor 4000 IR', 'TINYON IP 2000 WI'] }
  ];
  
  // Generate random port numbers for cameras
  const cameraPorts = [80, 8080, 8000, 81, 82, 88, 8081, 9000, 37777, 554];
  
  // List of potential vulnerabilities
  const vulnerabilities = [
    { name: 'Default credentials', severity: 'critical', description: 'Device uses factory default credentials' },
    { name: 'Outdated firmware', severity: 'high', description: 'Device running outdated firmware with known vulnerabilities' },
    { name: 'Unauthenticated access', severity: 'critical', description: 'No authentication required to access camera stream' },
    { name: 'Insecure protocols', severity: 'medium', description: 'Device using insecure communication protocols' },
    { name: 'Information disclosure', severity: 'medium', description: 'Device exposing sensitive information in web interface' },
    { name: 'Command injection', severity: 'critical', description: 'Device vulnerable to command injection attacks' },
    { name: 'Cross-site scripting', severity: 'medium', description: 'Web interface vulnerable to XSS attacks' }
  ];
  
  // Countries for geolocation
  const countries = [
    { name: 'United States', code: 'US', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] },
    { name: 'United Kingdom', code: 'GB', cities: ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'] },
    { name: 'Germany', code: 'DE', cities: ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt'] },
    { name: 'France', code: 'FR', cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'] },
    { name: 'Japan', code: 'JP', cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Sapporo'] }
  ];
  
  // If country is specified, filter the countries list
  const countryList = country 
    ? countries.filter(c => c.code.toLowerCase() === country.toLowerCase() || c.name.toLowerCase().includes(country.toLowerCase()))
    : countries;
  
  // Generate random results
  for (let i = 0; i < numResults; i++) {
    // Generate a random IP address
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    
    // Select a random manufacturer and model
    const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
    const model = manufacturer.models[Math.floor(Math.random() * manufacturer.models.length)];
    
    // Random port
    const port = cameraPorts[Math.floor(Math.random() * cameraPorts.length)];
    
    // Random protocol
    const protocol = ['rtsp', 'http', 'https'][Math.floor(Math.random() * 3)];
    
    // Random credentials (30% chance of having credentials)
    const hasCredentials = Math.random() < 0.3;
    const credentials = hasCredentials ? {
      username: ['admin', 'root', 'user'][Math.floor(Math.random() * 3)],
      password: ['admin', 'password', '12345', ''][Math.floor(Math.random() * 4)]
    } : null;
    
    // Random RTSP URL
    const rtspUrl = `rtsp://${credentials ? `${credentials.username}:${credentials.password}@` : ''}${ip}:${port === 80 ? 554 : port}/live/ch00_0`;
    
    // Random vulnerabilities (50% chance of having vulnerabilities)
    const hasVulnerabilities = Math.random() < 0.5;
    const numVulnerabilities = hasVulnerabilities ? Math.floor(Math.random() * 3) + 1 : 0;
    const cameraVulnerabilities = [];
    
    for (let j = 0; j < numVulnerabilities; j++) {
      const vulnerability = vulnerabilities[Math.floor(Math.random() * vulnerabilities.length)];
      // Avoid duplicates
      if (!cameraVulnerabilities.some(v => v.name === vulnerability.name)) {
        cameraVulnerabilities.push(vulnerability);
      }
    }
    
    // Random geolocation
    const selectedCountry = countryList[Math.floor(Math.random() * countryList.length)];
    const city = selectedCountry.cities[Math.floor(Math.random() * selectedCountry.cities.length)];
    
    // Generate random but plausible coordinates
    let lat, lon;
    switch (selectedCountry.code) {
      case 'US':
        lat = 37 + (Math.random() * 10) - 5;
        lon = -100 + (Math.random() * 50) - 25;
        break;
      case 'GB':
        lat = 54 + (Math.random() * 5) - 2.5;
        lon = -2 + (Math.random() * 3) - 1.5;
        break;
      case 'DE':
        lat = 51 + (Math.random() * 5) - 2.5;
        lon = 10 + (Math.random() * 5) - 2.5;
        break;
      case 'FR':
        lat = 47 + (Math.random() * 5) - 2.5;
        lon = 2 + (Math.random() * 5) - 2.5;
        break;
      case 'JP':
        lat = 36 + (Math.random() * 5) - 2.5;
        lon = 138 + (Math.random() * 5) - 2.5;
        break;
      default:
        lat = (Math.random() * 180) - 90;
        lon = (Math.random() * 360) - 180;
    }
    
    // Create the camera result
    const camera: CameraResult = {
      ip,
      port,
      type: searchType || ['Public', 'Traffic', 'Indoor', 'Outdoor'][Math.floor(Math.random() * 4)],
      protocol,
      manufacturer: manufacturer.name,
      model,
      credentials,
      rtspUrl,
      vulnerabilities: cameraVulnerabilities.length > 0 ? cameraVulnerabilities : undefined,
      geolocation: {
        country: selectedCountry.name,
        city,
        coordinates: [lat, lon]
      },
      accessible: Math.random() > 0.3
    };
    
    results.push(camera);
  }
  
  return results;
};

/**
 * Search for cameras using specific search terms
 */
export const searchCamerasByTerms = async (
  terms: string[],
  country?: string
): Promise<CameraResult[]> => {
  return searchCameras('Search', terms, country);
};

/**
 * Search for cameras using Google dorks
 */
export const searchCamerasByDorks = async (
  dorkType: string,
  country?: string
): Promise<CameraResult[]> => {
  const dorkTerms = {
    'Hikvision': ['hikvision', 'ds-2cd', 'webcomponents'],
    'Dahua': ['dahua', 'ipc-hdbw', 'web service'],
    'Axis': ['axis', 'mpeg4', 'view/view.shtml'],
    'Generic': ['intitle:webcamxp', 'inurl:/view/index.shtml', 'inurl:ViewerFrame?Mode=']
  };
  
  const terms = dorkTerms[dorkType as keyof typeof dorkTerms] || dorkTerms.Generic;
  return searchCameras(dorkType, terms, country);
};
