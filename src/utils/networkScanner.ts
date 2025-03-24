/**
 * Network scanner utilities
 */

import { CameraResult, ScanSettings, ThreatIntelData } from '@/types/scanner';
import { simulateNetworkDelay } from './networkUtils';
import { getRandomGeoLocation } from './osintUtils';

/**
 * Simulates a network scan to discover cameras and assess their security.
 */
export const simulateNetworkScan = async (
  target: string,
  settings: ScanSettings
): Promise<{ cameras: CameraResult[]; total: number }> => {
  console.log(`Starting simulated network scan on target: ${target} with settings:`, settings);
  await simulateNetworkDelay(1500);

  const numCameras = Math.floor(Math.random() * 5) + 1;
  const cameras: CameraResult[] = [];

  for (let i = 0; i < numCameras; i++) {
    cameras.push(generateSimulatedCamera(target, i, settings));
  }

  return {
    cameras: cameras,
    total: numCameras * 3 // Simulate scanning multiple ports/protocols per IP
  };
};

/**
 * Generates a simulated camera object with randomized properties.
 */
const generateSimulatedCamera = (target: string, index: number, settings: ScanSettings): CameraResult => {
  const ip = target.includes('/') ? generateRandomIP(target) : target;
  const port = [80, 554, 8080][Math.floor(Math.random() * 3)];
  const location = getRandomGeoLocation(settings.regionFilter?.[0]);
  const status = ['online', 'offline', 'vulnerable'][Math.floor(Math.random() * 3)];
  const accessLevel = ['none', 'view', 'control', 'admin'][Math.floor(Math.random() * 4)];
  const brand = ['Axis', 'Dahua', 'Hikvision', 'Nest', 'Arlo'][Math.floor(Math.random() * 5)];
  const model = [`Cam ${index + 1}`, 'Pro', 'Ultra', 'HD'][Math.floor(Math.random() * 4)];
  const firmwareVersion = `v${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`;
  const lastSeen = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
  const firstSeen = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString();

  const camera: CameraResult = {
    id: `simulated-${ip}-${port}-${index}`,
    ip: ip,
    port: port,
    brand: brand,
    model: model,
    status: status,
    accessLevel: accessLevel,
    location: {
      country: location.country,
      city: location.city,
      latitude: location.latitude,
      longitude: location.longitude
    },
    lastSeen: lastSeen,
    firstSeen: firstSeen,
    firmwareVersion: firmwareVersion,
    vulnerabilities: settings.checkVulnerabilities ? generateSimulatedVulnerabilities() : [],
    responseTime: Math.floor(Math.random() * 200) + 50,
    monitoringEnabled: Math.random() > 0.5,
    threatIntel: settings.checkThreatIntel ? generateSimulatedThreatIntel() : undefined,
    firmwareAnalysis: settings.checkVulnerabilities ? generateSimulatedFirmwareAnalysis(firmwareVersion) : undefined
  };

  return camera;
};

/**
 * Generates a random IP address within a given CIDR range.
 */
const generateRandomIP = (cidr: string): string => {
  const [baseIP, prefixLengthStr] = cidr.split('/');
  const prefixLength = parseInt(prefixLengthStr, 10);

  if (prefixLength < 0 || prefixLength > 32) {
    throw new Error('Invalid CIDR prefix length');
  }

  const baseIPParts = baseIP.split('.').map(Number);
  if (baseIPParts.length !== 4 || baseIPParts.some(isNaN)) {
    throw new Error('Invalid base IP address');
  }

  let randomIP = '';
  let remainingBits = 32 - prefixLength;

  for (let i = 0; i < 4; i++) {
    let part = baseIPParts[i];

    if (prefixLength >= 8 * (i + 1)) {
      // Use the base IP part directly
      randomIP += part;
    } else if (prefixLength > 8 * i) {
      // Mix base IP with random bits
      let bitsFromBase = prefixLength - 8 * i;
      let mask = (1 << bitsFromBase) - 1;
      let randomBits = Math.floor(Math.random() * (1 << (8 - bitsFromBase)));
      part = (part & mask) | (randomBits << bitsFromBase);
      randomIP += part;
      remainingBits -= (8 - bitsFromBase);
    } else {
      // Generate fully random part
      part = Math.floor(Math.random() * 256);
      randomIP += part;
      remainingBits -= 8;
    }

    if (i < 3) {
      randomIP += '.';
    }
  }

  return randomIP;
};

/**
 * Generates simulated vulnerability data for a camera.
 */
const generateSimulatedVulnerabilities = (): { name: string; severity: string; description: string; }[] => {
  const numVulnerabilities = Math.floor(Math.random() * 3);
  const vulnerabilities: { name: string; severity: string; description: string; }[] = [];

  for (let i = 0; i < numVulnerabilities; i++) {
    vulnerabilities.push({
      name: `CVE-${2023 + i}-${Math.floor(Math.random() * 10000)}`,
      severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
      description: 'Simulated vulnerability description'
    });
  }

  return vulnerabilities;
};

/**
 * Generates simulated threat intelligence data for a camera.
 */
const generateSimulatedThreatIntel = (): ThreatIntelData => {
  return {
    ipReputation: Math.floor(Math.random() * 100),
    lastReportedMalicious: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    associatedMalware: ['Mirai', 'Hajime', 'Mozi'].slice(0, Math.floor(Math.random() * 3)),
    reportedBy: ['AbuseIPDB', 'VirusTotal', 'AlienVault'].slice(0, Math.floor(Math.random() * 3)),
    firstSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['iot', 'camera', 'botnet'].slice(0, Math.floor(Math.random() * 3)),
    confidenceScore: Math.floor(Math.random() * 100),
    source: ['virustotal', 'abuseipdb', 'threatfox', 'other'][Math.floor(Math.random() * 4)] as any
  };
};

/**
 * Generates simulated firmware analysis data for a camera.
 */
const generateSimulatedFirmwareAnalysis = (firmwareVersion: string): any => {
  const numVulnerabilities = Math.floor(Math.random() * 3);
  const knownVulnerabilities: string[] = [];

  for (let i = 0; i < numVulnerabilities; i++) {
    knownVulnerabilities.push(`CVE-${2023 + i}-${Math.floor(Math.random() * 10000)}`);
  }

  return {
    knownVulnerabilities: knownVulnerabilities,
    outdated: Math.random() > 0.5,
    lastUpdate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    recommendedVersion: `v${parseInt(firmwareVersion.split('.')[0], 10) + 1}.0`
  };
};

/**
 * Maps a camera object from an external source to the internal CameraResult model.
 */
const mapCameraToModel = (camera: any): CameraResult => {
  let threatIntel: ThreatIntelData | undefined;
  if (camera.threatData) {
    threatIntel = {
      ipReputation: camera.threatData.riskScore || 50,
      confidenceScore: camera.threatData.riskScore || 50,
      source: 'scanner',
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
        [camera.firmwareData.vulnerabilities] : [],
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

export default {
  simulateNetworkScan,
  generateSimulatedCamera,
  generateRandomIP,
  generateSimulatedVulnerabilities,
  generateSimulatedThreatIntel,
  generateSimulatedFirmwareAnalysis,
  mapCameraToModel
};
