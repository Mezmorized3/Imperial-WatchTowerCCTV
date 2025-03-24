
/**
 * Utility to convert between different camera result formats
 */

import { CameraResult as OsintCameraResult } from '../types/cameraTypes';
import { CameraResult as ScannerCameraResult } from '@/types/scanner';

/**
 * Convert from OSINT tool camera format to scanner format
 */
export const convertToScannerFormat = (camera: OsintCameraResult): ScannerCameraResult => {
  return {
    id: camera.id,
    ip: camera.ip,
    port: camera.port,
    model: camera.model || '',
    manufacturer: camera.manufacturer || '',
    status: camera.status as any, // Type casting needed due to different status enums
    lastSeen: typeof camera.lastSeen === 'string' 
      ? camera.lastSeen 
      : camera.lastSeen instanceof Date 
        ? camera.lastSeen.toISOString() 
        : camera.lastSeen || '',
    accessLevel: camera.accessLevel || 'none',
    rtspUrl: camera.rtspUrl || '',
    httpUrl: camera.httpUrl || '',
    credentials: camera.credentials,
    vulnerabilities: camera.vulnerabilities || [],
    location: camera.geolocation 
      ? { country: camera.geolocation.country, city: camera.geolocation.city || '' } 
      : { country: 'Unknown', city: '' },
    firmware: camera.firmware || undefined,
    threatIntel: camera.threatIntel
  };
};

/**
 * Convert from scanner format to OSINT tool camera format
 */
export const convertToOsintFormat = (camera: ScannerCameraResult): OsintCameraResult => {
  return {
    id: camera.id,
    ip: camera.ip,
    port: camera.port,
    model: camera.model,
    manufacturer: camera.manufacturer || '',
    status: camera.status as any, // Type casting needed due to different status enums
    lastSeen: camera.lastSeen,
    accessLevel: camera.accessLevel as any, // Type casting needed due to different access level enums
    rtspUrl: camera.rtspUrl || '',
    httpUrl: camera.httpUrl || '',
    credentials: camera.credentials,
    vulnerabilities: camera.vulnerabilities || [],
    geolocation: { 
      country: camera.location?.country || 'Unknown',
      city: camera.location?.city 
    },
    firmware: camera.firmware,
    threatIntel: camera.threatIntel
  };
};
