
/**
 * Camera types for OSINT and camera discovery
 */

import { ThreatIntelData, FirmwareData } from './threatIntelTypes';

export type CameraStatus = 'online' | 'offline' | 'unknown' | 'vulnerable' | 'secure' | 'compromised' | 'authenticated';
export type AccessLevel = 'none' | 'limited' | 'full' | 'admin' | 'unknown' | 'view' | 'control';

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
  coordinates?: [number, number]; // Added for compatibility with cameraSearchUtils
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
  brand?: string; // Added for compatibility
  status: CameraStatus;
  lastSeen?: string | Date;
  accessLevel: AccessLevel;
  rtspUrl?: string;
  httpUrl?: string;
  url?: string; // Added for compatibility with scanner.ts
  snapshotUrl?: string; // Added for compatibility with scanner.ts
  credentials?: Credentials | null; // Made nullable for compatibility
  vulnerabilities?: Vulnerability[];
  geolocation?: Geolocation;
  location?: { // Added for compatibility with scanner.ts
    country: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  firmware?: FirmwareData;
  firmwareVersion?: string; // Added for compatibility
  firmwareAnalysis?: any; // Added for compatibility
  threatIntel?: ThreatIntelData;
  responseTime?: number; // Added for compatibility
  accessible?: boolean; // Flag indicating if the camera is directly accessible
  services?: string[]; // Added for compatibility
  firstSeen?: string; // Added for compatibility
  monitoringEnabled?: boolean; // Added for compatibility
}

export interface ScanResult {
  success: boolean;
  total: number;
  found: number;
  results: CameraResult[];
  data: any;
  simulatedData?: boolean;
  timestamp?: string;
}

export interface BackHackParams {
  target: string;
  url?: string;
  scanType?: 'basic' | 'full';
  timeout?: number;
  userAgent?: string;
  extractData?: boolean;
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
  rate?: number; // Added for compatibility
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

export interface EyePwnParams {
  target: string;
  method: 'rtsp' | 'onvif' | 'web' | 'all';
  bruteforce?: boolean;
  timeout?: number;
  country?: string;
}

export interface IngramParams {
  target: string;
  scanType: 'quick' | 'deep' | 'stealth';
  outputFormat?: 'json' | 'csv' | 'txt';
  includeSnapshots?: boolean;
  country?: string;
}
