
import { CameraResult, ThreatIntelData } from '@/types/scanner';

/**
 * Maps a camera object from an external source to the internal CameraResult model.
 */
export const mapCameraToModel = (camera: any): CameraResult => {
  let threatIntel: ThreatIntelData | undefined;
  if (camera.threatData) {
    const sources = ['virustotal', 'abuseipdb', 'threatfox', 'other'] as const;
    threatIntel = {
      ipReputation: camera.threatData.riskScore || 50,
      confidenceScore: camera.threatData.riskScore || 50,
      source: sources[Math.floor(Math.random() * sources.length)],
      associatedMalware: camera.threatData.associatedThreats || [],
      lastReportedMalicious: camera.threatData.lastReportDate,
      lastUpdated: new Date().toISOString()
    };
  }
  
  // Fix firmware
  let firmware;
  if (camera.firmwareData) {
    firmware = {
      version: camera.firmwareData.version,
      vulnerabilities: camera.firmwareData.vulnerabilities ? 
        Array.isArray(camera.firmwareData.vulnerabilities) ? 
          camera.firmwareData.vulnerabilities : [camera.firmwareData.vulnerabilities] : [],
      updateAvailable: camera.firmwareData.updateAvailable,
      lastChecked: new Date().toISOString()
    };
  }

  return {
    id: camera.id || camera.ip,
    ip: camera.ip,
    port: camera.port || 80,
    brand: camera.brand,
    model: camera.model,
    status: camera.status || 'online',
    accessLevel: camera.accessLevel || 'none',
    location: camera.location,
    lastSeen: camera.lastSeen || new Date().toISOString(),
    firstSeen: camera.firstSeen || new Date().toISOString(),
    firmwareVersion: camera.firmwareVersion,
    vulnerabilities: camera.vulnerabilities || [],
    responseTime: camera.responseTime,
    monitoringEnabled: camera.monitoringEnabled,
    threatIntel: threatIntel,
    firmwareAnalysis: firmware,
    url: camera.url,
    snapshotUrl: camera.snapshotUrl
  };
};

/**
 * Converts a scanner format camera to OSINT format
 */
export const convertToOsintFormat = (camera: CameraResult): any => {
  return {
    id: camera.id,
    ip: camera.ip,
    port: camera.port,
    manufacturer: camera.brand,
    model: camera.model,
    status: camera.status,
    accessLevel: camera.accessLevel,
    location: camera.location,
    lastSeen: camera.lastSeen,
    firstSeen: camera.firstSeen,
    version: camera.firmwareVersion,
    vulnerabilities: camera.vulnerabilities,
    responseTime: camera.responseTime,
    streamUrl: camera.url,
    snapshotUrl: camera.snapshotUrl,
    threatIntelligence: camera.threatIntel
  };
};

/**
 * Converts an OSINT format camera to scanner format
 */
export const convertToScannerFormat = (camera: any): CameraResult => {
  return {
    id: camera.id || `cam-${Math.random().toString(36).substring(2, 11)}`,
    ip: camera.ip,
    port: camera.port || 80,
    brand: camera.manufacturer || camera.brand,
    model: camera.model,
    status: camera.status || 'online',
    accessLevel: camera.accessLevel || 'none',
    location: camera.location,
    lastSeen: camera.lastSeen || new Date().toISOString(),
    firstSeen: camera.firstSeen || new Date().toISOString(),
    firmwareVersion: camera.version || camera.firmwareVersion,
    vulnerabilities: camera.vulnerabilities || [],
    responseTime: camera.responseTime,
    monitoringEnabled: camera.monitoringEnabled || false,
    threatIntel: camera.threatIntelligence,
    url: camera.streamUrl || camera.url,
    snapshotUrl: camera.snapshotUrl
  };
};
