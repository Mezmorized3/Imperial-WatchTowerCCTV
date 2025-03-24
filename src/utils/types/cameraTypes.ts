/**
 * Camera types for OSINT and camera discovery
 */

import { ThreatIntelData, FirmwareData } from './threatIntelTypes';

export type CameraStatus = 'online' | 'offline' | 'unknown' | 'vulnerable' | 'secure' | 'compromised';
export type AccessLevel = 'none' | 'limited' | 'full' | 'admin' | 'unknown';

export interface Credentials {
  username: string;
  password: string;
  isDefault?: boolean;
}

export interface Vulnerability {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  cve?: string;
  exploitable?: boolean;
  details?: string;
}

export interface Geolocation {
  country: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  coordinates?: [number, number]; // Added to support cameraSearchUtils
}

export interface CCTVParams {
  country: string;
  region?: string;
  city?: string;
  limit?: number;
  brand?: string;
  saveResults?: boolean;
}

export interface CameraResult {
  id: string;
  ip: string;
  port: number;
  model?: string;
  manufacturer?: string;
  status: CameraStatus;
  lastSeen?: string | Date;
  accessLevel: AccessLevel;
  rtspUrl?: string;
  httpUrl?: string;
  credentials?: Credentials;
  vulnerabilities?: Vulnerability[];
  geolocation?: Geolocation;
  firmware?: FirmwareData;
  threatIntel?: ThreatIntelData;
  accessible?: boolean; // Flag indicating if the camera is directly accessible
}

export interface ScanResult {
  success: boolean;
  total: number;
  found: number;
  results: CameraResult[];
  data: any;
  simulatedData?: boolean;
}

export interface BackHackParams {
  target: string;
  url?: string;
  scanType?: 'basic' | 'full';
  timeout?: number;
  userAgent?: string;
}

export interface SpeedCameraParams {
  target: string;
  threshold?: number;
  region?: string;
  saveFrames?: boolean;
}

export interface CamerattackParams {
  target: string;
  port?: number;
  method?: string;
  timeout?: number;
}

export interface HackCCTVParams {
  target: string;
  method?: 'default-credentials' | 'exploit' | 'brute-force' | 'rtsp-discovery';
  timeout?: number;
  proxy?: string;
  userAgent?: string;
  country?: string;
  deepScan?: boolean;
  bruteforce?: boolean;
  manufacturer?: string;
  saveResults?: boolean;
}

export interface CCTVExplorerParams {
  country: string;
  region?: string;
  limit?: number;
  saveResults?: boolean;
}

export interface CamDumperParams {
  target: string;
  method: 'scan' | 'exploit' | 'dump';
  outputDir?: string;
  timeout?: number;
  country?: string;
}

export interface OpenCCTVParams {
  target: string;
  scanMode: 'quick' | 'deep' | 'stealth';
  saveOutput?: boolean;
  proxyEnabled?: boolean;
}
