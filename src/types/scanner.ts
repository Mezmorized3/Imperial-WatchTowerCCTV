
export interface ScanSettings {
  scanSpeed?: 'slow' | 'normal' | 'fast';
  portsToScan?: string[];
  scanTimeout?: number;
  vulnerabilityCheck?: boolean;
  bruteforceCredentials?: boolean;
  torNetworkScan?: boolean;
  // Additional properties needed by components
  regionFilter?: string[];
  aggressive?: boolean;
  detailed?: boolean;
  targetSubnet?: string;
  portRange?: string;
  timeout?: number;
  testCredentials?: boolean;
  checkVulnerabilities?: boolean;
  saveSnapshots?: boolean;
  threadsCount?: number;
  enableRealTimeMonitoring?: boolean;
  alertThreshold?: 'low' | 'medium' | 'high' | 'critical';
  checkThreatIntel?: boolean;
  ports?: string[];
  limit?: number;
}

export interface ScanProgress {
  status: 'idle' | 'running' | 'completed' | 'failed';
  targetsTotal: number;
  targetsScanned: number;
  camerasFound?: number;
  error?: string;
  // Additional properties needed by components
  startTime?: Date;
  endTime?: Date;
  scanTarget?: ScanTarget;
  scanSettings?: ScanSettings;
  currentTarget?: string;
  targetCountry?: string;
}

export interface ScanTarget {
  type: 'ip' | 'range' | 'file' | 'search' | 'shodan' | 'zoomeye' | 'censys';
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
  error?: string;
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
  status: 'online' | 'offline' | 'unknown' | 'vulnerable' | 'authenticated' | 'secure' | 'compromised';
  accessLevel: 'admin' | 'view' | 'none' | 'limited' | 'full' | 'unknown' | 'control';
  location?: CameraLocation;
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
  services?: string[];
  accessible?: boolean;
  manufacturer?: string;
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
  simulatedData?: boolean;
  timestamp?: string;
}

export interface CCTVParams {
  target: string;
  mode?: string;
  country?: string;
  timeout?: number;
  region?: string;
  limit?: number;
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
  port?: number;
  rate?: number;
  method?: string;
}

export interface AlertConfig {
  id: string;
  name: string;
  enabled: boolean;
  triggeredBy: string[];
  level: 'low' | 'medium' | 'high' | 'critical';
  action: 'notify' | 'email' | 'sms' | 'webhook';
  recipients?: string[];
  webhookUrl?: string;
  createdAt: string;
  type?: string;
  severity?: string;
  notificationMethod?: string;
}

export interface RTSPBruteParams {
  targets: string | string[];
  ports?: number[];
  credentials?: { username: string; password: string }[];
  routes?: string[];
  threads?: number;
  timeout?: number;
  captureScreenshots?: boolean;
  saveReport?: boolean;
  outputFormat?: 'json' | 'csv' | 'text';
  useML?: boolean;
  scanMode?: 'quick' | 'thorough' | 'stealth';
}

export interface RTSPBruteResult {
  success: boolean;
  targetsScanned: number;
  streamsFound: number;
  accessibleStreams: number;
  results: RTSPStreamResult[];
  executionTime: number;
  reportPath?: string;
  error?: string;
}

export interface RTSPStreamResult {
  id: string;
  target: string;
  port: number;
  accessible: boolean;
  protocol: 'rtsp' | 'rtsps';
  route?: string;
  credentials?: {
    username: string;
    password: string;
    default?: boolean;
  };
  streamUrl?: string;
  screenshotPath?: string;
  metadata?: {
    resolution?: string;
    fps?: number;
    codec?: string;
    bitrate?: string;
  };
  responseTime?: number;
  discoveredAt: string;
}
