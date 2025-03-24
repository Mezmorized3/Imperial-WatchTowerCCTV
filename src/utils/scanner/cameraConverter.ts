
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
    // Only include manufacturer if it exists in the target type
    ...(camera.manufacturer && { manufacturer: camera.manufacturer }),
    status: camera.status as any, // Type casting needed due to different status enums
    lastSeen: typeof camera.lastSeen === 'string' 
      ? camera.lastSeen 
      : camera.lastSeen instanceof Date 
        ? camera.lastSeen.toISOString() 
        : camera.lastSeen || '',
    accessLevel: (camera.accessLevel === 'unknown' ? 'none' : camera.accessLevel) as any,
    // Only include these properties if they exist in the target type
    ...(camera.rtspUrl && { rtspUrl: camera.rtspUrl }),
    ...(camera.httpUrl && { httpUrl: camera.httpUrl }),
    credentials: camera.credentials ? {
      username: camera.credentials.username || '',
      password: camera.credentials.password || ''
    } : undefined,
    vulnerabilities: camera.vulnerabilities ? camera.vulnerabilities.map(v => ({
      id: v.id,
      name: v.name,
      severity: v.severity,
      description: v.description,
      cve: v.cve
    })) : [],
    location: camera.geolocation 
      ? { country: camera.geolocation.country, city: camera.geolocation.city || '' } 
      : { country: 'Unknown', city: '' },
    firmware: camera.firmware ? {
      version: camera.firmware.version,
      vulnerabilities: camera.firmware.vulnerabilities?.map(v => typeof v === 'string' ? v : v.id),
      updateAvailable: camera.firmware.updateAvailable,
      lastChecked: camera.firmware.lastChecked
    } : undefined,
    ...(camera.threatIntel && { threatIntel: camera.threatIntel })
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
    model: camera.model || '',
    // Only include manufacturer if it exists in the source
    ...(camera.manufacturer && { manufacturer: camera.manufacturer }),
    status: camera.status as any, // Type casting needed due to different status enums
    lastSeen: camera.lastSeen || '',
    accessLevel: camera.accessLevel as any, // Type casting needed due to different access level enums
    // Only include these properties if they exist in the source
    ...(camera.rtspUrl && { rtspUrl: camera.rtspUrl }),
    ...(camera.httpUrl && { httpUrl: camera.httpUrl }),
    credentials: camera.credentials ? {
      username: camera.credentials.username,
      password: camera.credentials.password
    } : undefined,
    vulnerabilities: camera.vulnerabilities ? camera.vulnerabilities.map(v => ({
      id: v.id || `vuln-${Math.random().toString(36).substring(2, 11)}`,
      name: v.name,
      severity: v.severity as 'low' | 'medium' | 'high' | 'critical',
      description: v.description
    })) : [],
    geolocation: { 
      country: camera.location?.country || 'Unknown',
      city: camera.location?.city 
    },
    firmware: camera.firmware ? {
      version: camera.firmware.version || 'Unknown',
      updateAvailable: camera.firmware.updateAvailable,
      lastChecked: camera.firmware.lastChecked
    } : undefined,
    threatIntel: camera.threatIntel ? {
      ipReputation: camera.threatIntel.ipReputation,
      confidenceScore: camera.threatIntel.confidenceScore,
      source: camera.threatIntel.source as any,
      associatedMalware: camera.threatIntel.associatedMalware || [],
      lastUpdated: camera.threatIntel.lastUpdated || new Date().toISOString()
    } : undefined
  };
};
