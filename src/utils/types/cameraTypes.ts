
/**
 * Camera-related types for OSINT and camera discovery tools
 */

import { ThreatIntelData } from './baseTypes';
import { ScanResult } from './baseTypes';

export interface CameraResult {
  id: string;
  ip: string;
  port: number;
  model?: string;
  manufacturer?: string;
  location?: string | {
    country: string;
    city?: string;
    coordinates?: [number, number];
  };
  status: string;
  type?: string;
  protocol?: string;
  rtspUrl?: string;
  credentials?: {
    username: string;
    password: string;
  } | null;
  geolocation?: {
    country: string;
    city?: string;
    coordinates?: [number, number];
  };
  vulnerabilities?: Array<{
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }>;
  accessible?: boolean;
  threatIntelligence?: ThreatIntelData;
  firmware?: {
    version?: string;
    vulnerabilities?: string[];
    updateAvailable?: boolean;
    lastChecked?: string;
  };
  threatIntel?: ThreatIntelData;
  country?: string;
  brand?: string;
  accessLevel: 'none' | 'view' | 'control' | 'admin';
  lastSeen: string;
  url?: string;
  snapshotUrl?: string;
}

// Re-export ScanResult from baseTypes
export { ScanResult } from './baseTypes';

// Camera tool parameters
export interface CCTVParams {
  region: string;
  limit?: number;
  saveResults?: boolean;
  type?: string;
  country?: string;
}

export interface SpeedCameraParams {
  sensitivity?: number;
  resolution?: string;
  threshold?: number;
  rtspUrl?: string;
}

export interface CamerattackParams {
  target: string;
  sessions?: number;
  timeout?: number;
  mode?: string;
  rate?: number;
}

export interface HackCCTVParams {
  target: string;
  mode?: string;
  region?: string;
  country?: string;
  limit?: number;
  timeout?: number;
  scanType?: string;
  deepScan?: boolean;
  bruteforce?: boolean;
  exploitType?: string;
  ports?: string;
}
