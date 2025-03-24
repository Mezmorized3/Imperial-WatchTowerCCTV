
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
    status: camera.status || 'unknown',
    lastSeen: typeof camera.lastSeen === 'object' && camera.lastSeen instanceof Date 
      ? camera.lastSeen.toISOString() 
      : camera.lastSeen,
    accessLevel: camera.accessLevel || 'none',
    rtspUrl: camera.rtspUrl,
    httpUrl: camera.httpUrl,
    credentials: camera.credentials,
    vulnerabilities: camera.vulnerabilities,
    geolocation: camera.geolocation || { country: 'Unknown' },
    firmware: camera.firmware
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
    manufacturer: camera.manufacturer,
    status: camera.status as any,
    lastSeen: camera.lastSeen,
    accessLevel: camera.accessLevel as any,
    rtspUrl: camera.rtspUrl,
    httpUrl: camera.httpUrl,
    credentials: camera.credentials,
    vulnerabilities: camera.vulnerabilities,
    geolocation: typeof camera.geolocation === 'object' 
      ? camera.geolocation 
      : { country: camera.geolocation || 'Unknown' },
    firmware: camera.firmware
  };
};
