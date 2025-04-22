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
  target?: string; // Added for compatibility with osintToolTypes
  mode?: string; // Added for compatibility with osintToolTypes
  timeout?: number; // Added for compatibility with osintToolTypes
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
  error?: string; // Added error property to fix the TypeScript errors
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

// Add missing CamDumperParams interface
export interface CamDumperParams {
  target: string;
  region?: string;
  manufacturer?: string;
  country?: string;
  method?: string;
  timeout?: number;
}

// Add missing HackCCTVParams interface
export interface HackCCTVParams {
  target: string;
  method?: string;
  bruteforce?: boolean;
  deepScan?: boolean;
  country?: string;
  timeout?: number;
}

// Add missing OpenCCTVParams interface
export interface OpenCCTVParams {
  target: string;
  scanMode?: 'quick' | 'deep' | 'full';
  timeout?: number;
}

// Add missing EyePwnParams interface
export interface EyePwnParams {
  target: string;
  method?: string;
  bruteforce?: boolean;
  country?: string;
  timeout?: number;
}

// Add missing IngramParams interface
export interface IngramParams {
  target: string;
  scanType?: string;
  country?: string;
  timeout?: number;
}
