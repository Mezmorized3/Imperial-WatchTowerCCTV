
/**
 * Types for camera-related tools
 */

import { ToolParams } from './baseTypes';

// Camera status types
export type CameraStatus = 'online' | 'offline' | 'vulnerable' | 'secure' | 'unknown';

// Camera access level types
export type CameraAccessLevel = 'none' | 'view' | 'control' | 'admin';

// Camera result type
export interface CameraResult {
  id: string;
  ip: string;
  port: number;
  model?: string;
  manufacturer?: string;
  status: CameraStatus;
  lastSeen: string;
  accessLevel: CameraAccessLevel;
  rtspUrl?: string;
  httpUrl?: string;
  credentials?: {
    username: string;
    password: string;
  };
  vulnerabilities?: Array<{
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }>;
  geolocation?: {
    country: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  location?: string;
  firmware?: {
    version: string;
    updateAvailable: boolean;
    vulnerabilities: any[];
    lastChecked: string;
  };
}

// Basic scan parameters
export interface CameradarParams extends ToolParams {
  target: string;
  ports?: string;
  timeout?: number;
  threads?: number;
  bruteforce?: boolean;
  dictionary?: boolean;
}

// IP Camera search parameters
export interface IPCamSearchParams extends ToolParams {
  subnet: string;
  protocols?: string[];
  timeout?: number;
  onvif?: boolean;
}

// Camerattack parameters
export interface CamerattackParams extends ToolParams {
  target: string;
  port?: number;
  username?: string;
  password?: string;
  timeout?: number;
}

// CCTV tool parameters
export interface CCTVParams extends ToolParams {
  region: string;
  country: string;
  limit?: number;
  type?: string;
}

// Speed camera parameters
export interface SpeedCameraParams extends ToolParams {
  location: string;
  range?: number;
  type?: string;
}

// HackCCTV parameters
export interface HackCCTVParams extends ToolParams {
  target: string;
  bruteforce?: boolean;
  deepScan?: boolean;
  usernames?: string[];
  passwords?: string[];
  saveResults?: boolean;
  timeout?: number;
}

// Scanner result type
export interface ScanResult {
  success: boolean;
  total: number;
  found: number;
  results: any[];
  data: {
    cameras: CameraResult[];
    total: number;
    vulnerabilities?: any[];
    [key: string]: any;
  };
  error?: string;
  simulatedData?: boolean;
}

// Export type for compatibility with TypeScript's "isolatedModules" mode
export type { CameraResult as CameraResultType };
