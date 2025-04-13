
export interface ScanSettings {
  scanSpeed?: 'slow' | 'normal' | 'fast';
  portsToScan?: string[];
  scanTimeout?: number;
  vulnerabilityCheck?: boolean;
  bruteforceCredentials?: boolean;
  torNetworkScan?: boolean;
}

export interface ScanProgress {
  status: 'idle' | 'running' | 'completed' | 'failed';
  targetsTotal: number;
  targetsScanned: number;
  camerasFound?: number;
  error?: string;
}

export interface ScanTarget {
  type: 'ip' | 'range' | 'file' | 'search';
  value: string;
  country?: string;
}

export interface Vulnerability {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info' | string;
  cve?: string;
  exploitable?: boolean;
  details?: Record<string, any>;
  discoveredAt?: string;
}

export interface ThreatIntelData {
  ipReputation: number;
  confidenceScore: number;
  source: 'virustotal' | 'abuseipdb' | 'threatfox' | 'other';
  associatedMalware: string[];
  lastReportedMalicious?: string;
  firstSeen?: string;
  reportedBy?: string[];
  tags?: string[];
  blacklisted?: boolean;
  lastUpdated: string;
}

export interface FirmwareAnalysis {
  version: string;
  vulnerabilities: Vulnerability[];
  updateAvailable: boolean;
  lastChecked: string;
}

export interface CameraCredentials {
  username: string;
  password: string;
  type?: 'default' | 'custom' | 'bruteforced';
  discoveredAt?: string;
}

export interface CameraLocation {
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  timezone?: string;
}

export interface CameraResult {
  id: string;
  ip: string;
  port: number;
  brand?: string;
  model?: string;
  status: 'online' | 'offline' | 'unknown';
  accessLevel: 'admin' | 'view' | 'none';
  location?: CameraLocation | string;
  lastSeen?: string;
  firstSeen?: string;
  firmwareVersion?: string;
  vulnerabilities?: Vulnerability[];
  responseTime?: number;
  monitoringEnabled?: boolean;
  threatIntel?: ThreatIntelData;
  firmwareAnalysis?: FirmwareAnalysis;
  credentials?: CameraCredentials;
  url?: string;
  snapshotUrl?: string;
}

export interface ScanResult {
  success: boolean;
  total: number;
  found: number;
  results: any[];
  data: {
    cameras: any[];
    total: number;
    vulnerabilities?: Vulnerability[];
  };
  error?: string;
}

export interface CCTVParams {
  target: string;
  mode?: string;
  country?: string;
  timeout?: number;
}

export interface SpeedCameraParams {
  target: string;
  mode?: string;
  sensitivity?: string;
  timeout?: number;
}

export interface CamerattackParams {
  target: string;
  mode?: string;
  timeout?: number;
  attackType?: string;
}
