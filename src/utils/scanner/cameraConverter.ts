
/**
 * Utility for converting between different camera result formats
 */
import { CameraResult as ScannerCameraResult } from '@/types/scanner';
import { CameraResult as OsintCameraResult } from '@/utils/types/cameraTypes';
import { ThreatIntelData } from '@/utils/types/baseTypes';

/**
 * Converts an OSINT camera result to a Scanner camera result
 */
export const convertToScannerFormat = (camera: OsintCameraResult): ScannerCameraResult => {
  const mapSeverity = (sev: string): 'low' | 'medium' | 'high' | 'critical' => {
    switch (sev.toLowerCase()) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      default: return 'low';
    }
  };

  const mapAccessLevel = (level: 'none' | 'view' | 'control' | 'admin'): 'none' | 'view' | 'control' | 'admin' => {
    return level;
  };

  const mapStatus = (status: string): 'online' | 'vulnerable' | 'authenticated' | 'offline' | 'unknown' => {
    switch (status.toLowerCase()) {
      case 'online': return 'online';
      case 'vulnerable': return 'vulnerable';
      case 'authenticated': return 'authenticated';
      case 'offline': return 'offline';
      default: return 'unknown';
    }
  };

  const normalizedLocation = typeof camera.location === 'string' 
    ? { country: camera.location } 
    : camera.location && 'country' in camera.location
      ? {
          country: camera.location.country,
          city: camera.location.city,
          latitude: camera.location.coordinates?.[0],
          longitude: camera.location.coordinates?.[1],
        }
      : camera.geolocation
        ? {
            country: camera.geolocation.country,
            city: camera.geolocation.city,
            latitude: camera.geolocation.coordinates?.[0],
            longitude: camera.geolocation.coordinates?.[1],
          }
        : undefined;

  const threatIntel: any = camera.threatIntelligence || camera.threatIntel;
  let normalizedThreatIntel: ScannerCameraResult['threatIntel'] | undefined;
  
  if (threatIntel) {
    normalizedThreatIntel = {
      ipReputation: threatIntel.ipReputation,
      lastReportedMalicious: threatIntel.lastReportedMalicious,
      associatedMalware: threatIntel.associatedMalware || [],
      reportedBy: threatIntel.reportedBy,
      firstSeen: threatIntel.firstSeen,
      tags: threatIntel.tags,
      confidenceScore: threatIntel.confidenceScore,
      source: (threatIntel.source === 'virustotal' || 
               threatIntel.source === 'abuseipdb' || 
               threatIntel.source === 'threatfox') 
        ? threatIntel.source 
        : 'other',
      lastUpdated: threatIntel.lastUpdated || new Date().toISOString()
    };
  }

  return {
    id: camera.id,
    ip: camera.ip,
    port: camera.port,
    brand: camera.manufacturer || camera.brand,
    model: camera.model,
    url: camera.rtspUrl || camera.url,
    snapshotUrl: camera.snapshotUrl,
    status: mapStatus(camera.status),
    credentials: camera.credentials,
    vulnerabilities: camera.vulnerabilities?.map(v => ({
      name: v.name,
      severity: mapSeverity(v.severity),
      description: v.description
    })),
    location: normalizedLocation,
    lastSeen: typeof camera.lastSeen === 'string' ? camera.lastSeen : new Date().toISOString(),
    accessLevel: mapAccessLevel(camera.accessLevel),
    responseTime: undefined,
    monitoringEnabled: undefined,
    threatIntel: normalizedThreatIntel,
    firmwareVersion: camera.firmware?.version
  };
};

/**
 * Converts a Scanner camera result to an OSINT camera result
 */
export const convertToOsintFormat = (camera: ScannerCameraResult): OsintCameraResult => {
  const location = camera.location 
    ? {
        country: camera.location.country,
        city: camera.location.city,
        coordinates: camera.location.latitude && camera.location.longitude 
          ? [camera.location.latitude, camera.location.longitude] as [number, number]
          : undefined
      }
    : undefined;

  const threatIntel = camera.threatIntel 
    ? {
        ipReputation: camera.threatIntel.ipReputation,
        lastReportedMalicious: camera.threatIntel.lastReportedMalicious,
        associatedMalware: camera.threatIntel.associatedMalware || [],
        reportedBy: camera.threatIntel.reportedBy,
        firstSeen: camera.threatIntel.firstSeen,
        tags: camera.threatIntel.tags,
        confidenceScore: camera.threatIntel.confidenceScore,
        source: camera.threatIntel.source || 'other',
        lastUpdated: camera.threatIntel.lastUpdated || new Date().toISOString()
      }
    : undefined;

  return {
    id: camera.id,
    ip: camera.ip,
    port: camera.port,
    model: camera.model,
    manufacturer: camera.brand,
    status: camera.status,
    rtspUrl: camera.url,
    url: camera.url,
    snapshotUrl: camera.snapshotUrl,
    credentials: camera.credentials,
    vulnerabilities: camera.vulnerabilities?.map(v => ({
      name: v.name,
      severity: v.severity,
      description: v.description
    })),
    geolocation: location,
    location,
    accessLevel: camera.accessLevel,
    lastSeen: camera.lastSeen,
    threatIntelligence: threatIntel,
    threatIntel
  };
};
