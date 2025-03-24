/**
 * Utility functions for camera search and discovery
 */

import { CameraResult } from './types/cameraTypes';

/**
 * Generate a random camera result for testing purposes
 */
export const createRandomCamera = (manufacturer?: string, model?: string): CameraResult => {
  const id = `camera-${Math.random().toString(36).substring(2, 15)}`;
  const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  const port = Math.floor(Math.random() * 65535);
  const status = ['online', 'offline', 'unknown'][Math.floor(Math.random() * 3)];
  const accessLevel = ['none', 'limited', 'full', 'admin'][Math.floor(Math.random() * 4)];

  return {
    id,
    ip,
    port,
    model: model || `Generic Camera Model ${Math.floor(Math.random() * 100)}`,
    manufacturer: manufacturer || 'Generic Manufacturer',
    status: status as any,
    lastSeen: new Date().toISOString(),
    accessLevel: accessLevel as any,
    accessible: Math.random() > 0.5,
    vulnerabilities: Math.random() > 0.7 ? [{
      id: `vuln-${Math.random().toString(36).substring(2, 15)}`,
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
 * Create a camera result with geolocation data
 */
export const createGeolocatedCamera = (
  country: string, 
  city: string,
  latitude: number,
  longitude: number,
  manufacturer?: string,
  model?: string
) => {
  const camera = createRandomCamera(manufacturer, model);
  
  camera.geolocation = {
    country,
    city,
    latitude,
    longitude
  };
  
  return camera;
};

/**
 * Simulate search engine results for cameras
 */
export const simulateCameraSearchResults = (query: string, count: number = 10): CameraResult[] => {
  const cameras = generateRandomCameras(count);
  return cameras.map(camera => ({
    ...camera,
    model: `Search Result: ${query} - ${camera.model}`,
  }));
};

/**
 * Simulate a camera search with specific criteria
 */
export const simulateAdvancedCameraSearch = (
  country: string,
  city?: string,
  manufacturer?: string,
  model?: string,
  count: number = 5
): CameraResult[] => {
  const cameras: CameraResult[] = [];
  for (let i = 0; i < count; i++) {
    const camera = createRandomCamera(manufacturer, model);
    camera.geolocation = {
      country: country,
      city: city || 'Unknown',
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180,
    };
    cameras.push(camera);
  }
  return cameras;
};

/**
 * Simulate a camera scan result
 */
export const simulateCameraScan = (target: string, count: number = 3): CameraResult[] => {
  const cameras = generateRandomCameras(count);
  return cameras.map(camera => ({
    ...camera,
    ip: target,
    status: 'online' as any,
  }));
};

/**
 * Simulate a vulnerability scan result for a camera
 */
export const simulateVulnerabilityScan = (camera: CameraResult): CameraResult => {
  const hasVulnerability = Math.random() > 0.5;
  if (hasVulnerability) {
    camera.vulnerabilities = [{
      id: `vuln-${Math.random().toString(36).substring(2, 15)}`,
      name: 'Simulated Vulnerability',
      severity: 'medium',
      description: 'This is a simulated vulnerability for demonstration purposes.'
    }];
  }
  return camera;
};
