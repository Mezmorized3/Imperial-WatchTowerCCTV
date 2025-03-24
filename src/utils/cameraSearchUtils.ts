
/**
 * Utility functions for camera search and discovery
 */

import { CameraResult, CameraStatus, AccessLevel, Vulnerability } from './types/cameraTypes';
import { nanoid } from 'nanoid';

/**
 * Generate a random camera result for testing purposes
 */
export const createRandomCamera = (manufacturer?: string, model?: string): CameraResult => {
  const id = `camera-${nanoid(8)}`;
  const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  const port = [80, 443, 554, 8080, 8000, 8888][Math.floor(Math.random() * 6)];
  const status = ['online', 'offline', 'unknown', 'vulnerable'][Math.floor(Math.random() * 4)] as CameraStatus;
  const accessLevel = ['none', 'limited', 'full', 'admin', 'view', 'control'][Math.floor(Math.random() * 6)] as AccessLevel;

  return {
    id,
    ip,
    port,
    model: model || `Generic Camera Model ${Math.floor(Math.random() * 100)}`,
    manufacturer: manufacturer || 'Generic Manufacturer',
    status,
    lastSeen: new Date().toISOString(),
    accessLevel,
    accessible: Math.random() > 0.5,
    vulnerabilities: Math.random() > 0.7 ? [{
      id: `vuln-${nanoid(6)}`,
      name: 'Example Vulnerability',
      severity: 'high',
      description: 'A simulated vulnerability for testing'
    }] : undefined
  };
};

/**
 * Generate multiple random camera results
 */
export const generateRandomCameras = (count: number, manufacturer?: string, model?: string): CameraResult[] => {
  return Array.from({ length: count }, () => createRandomCamera(manufacturer, model));
};

/**
 * Get a random country from the focus countries (Ukraine, Russia, Georgia, Romania)
 */
export const getRandomFocusCountry = (): string => {
  const countries = ['Ukraine', 'Russia', 'Georgia', 'Romania'];
  return countries[Math.floor(Math.random() * countries.length)];
};

/**
 * Get a random city based on country
 */
export const getRandomCity = (country: string): string => {
  const cities: {[key: string]: string[]} = {
    'Ukraine': ['Kyiv', 'Lviv', 'Odesa', 'Kharkiv', 'Dnipro', 'Donetsk'],
    'Russia': ['Moscow', 'Saint Petersburg', 'Novosibirsk', 'Yekaterinburg', 'Kazan'],
    'Georgia': ['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi', 'Gori'],
    'Romania': ['Bucharest', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Constanța']
  };
  
  const defaultCities = ['New York', 'London', 'Paris', 'Tokyo', 'Berlin'];
  const countryCities = cities[country] || defaultCities;
  
  return countryCities[Math.floor(Math.random() * countryCities.length)];
};

/**
 * Create a camera result with geolocation data for specific countries
 */
export const createGeolocatedCamera = (
  country: string,
  manufacturer?: string,
  model?: string
): CameraResult => {
  const camera = createRandomCamera(manufacturer, model);
  const city = getRandomCity(country);
  
  // Get approximate coordinates based on country
  let latitude = 0;
  let longitude = 0;
  
  switch(country) {
    case 'Ukraine':
      latitude = 49.0 + (Math.random() * 2);
      longitude = 31.0 + (Math.random() * 4);
      break;
    case 'Russia':
      latitude = 55.0 + (Math.random() * 5);
      longitude = 37.0 + (Math.random() * 20);
      break;
    case 'Georgia':
      latitude = 41.5 + (Math.random() * 1.5);
      longitude = 43.5 + (Math.random() * 2);
      break;
    case 'Romania':
      latitude = 45.0 + (Math.random() * 2);
      longitude = 25.0 + (Math.random() * 3);
      break;
    default:
      latitude = (Math.random() * 180) - 90;
      longitude = (Math.random() * 360) - 180;
  }
  
  camera.geolocation = {
    country,
    city,
    latitude,
    longitude
  };
  
  return camera;
};

/**
 * Generate cameras specifically for focus countries
 */
export const generateFocusCountryCameras = (count: number = 20): CameraResult[] => {
  const cameras: CameraResult[] = [];
  
  // Ensure each focus country has some cameras
  const countPerCountry = Math.max(2, Math.floor(count / 4));
  
  ['Ukraine', 'Russia', 'Georgia', 'Romania'].forEach(country => {
    for (let i = 0; i < countPerCountry; i++) {
      cameras.push(createGeolocatedCamera(country));
    }
  });
  
  // Add remaining random cameras if needed
  const remaining = count - (countPerCountry * 4);
  for (let i = 0; i < remaining; i++) {
    const country = getRandomFocusCountry();
    cameras.push(createGeolocatedCamera(country));
  }
  
  return cameras;
};

/**
 * Simulate a vulnerability scan result for a camera
 */
export const simulateVulnerabilityScan = (camera: CameraResult): CameraResult => {
  const vulnerabilityTypes: Vulnerability[] = [
    {
      id: `vuln-${nanoid(6)}`,
      name: 'Default Credentials',
      severity: 'high',
      description: 'Camera is using factory default username and password.'
    },
    {
      id: `vuln-${nanoid(6)}`,
      name: 'Outdated Firmware',
      severity: 'medium',
      description: 'Camera firmware has known security vulnerabilities.'
    },
    {
      id: `vuln-${nanoid(6)}`,
      name: 'Insecure RTSP Stream',
      severity: 'medium',
      description: 'RTSP stream is accessible without authentication.'
    },
    {
      id: `vuln-${nanoid(6)}`,
      name: 'Command Injection',
      severity: 'critical',
      description: 'Web interface is vulnerable to command injection attacks.'
    }
  ];
  
  // 70% chance to have at least one vulnerability
  if (Math.random() > 0.3) {
    // Pick 1-3 random vulnerabilities
    const vulnCount = Math.floor(Math.random() * 3) + 1;
    const selectedVulns: Vulnerability[] = [];
    
    for (let i = 0; i < vulnCount; i++) {
      const randomIndex = Math.floor(Math.random() * vulnerabilityTypes.length);
      selectedVulns.push({...vulnerabilityTypes[randomIndex]});
    }
    
    camera.vulnerabilities = selectedVulns;
    
    // If critical vulnerability found, mark as vulnerable
    if (selectedVulns.some(v => v.severity === 'critical')) {
      camera.status = 'vulnerable';
    }
  }
  
  return camera;
};
