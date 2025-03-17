
export type ScanTarget = {
  type: 'ip' | 'range' | 'file' | 'shodan' | 'zoomeye' | 'censys';
  value: string;
};

export type ScanSettings = {
  aggressive: boolean;
  testCredentials: boolean;
  checkVulnerabilities: boolean;
  saveSnapshots: boolean;
  regionFilter: string[];
  threadsCount: number;
  timeout: number;
  enableRealTimeMonitoring?: boolean;
  alertThreshold?: 'low' | 'medium' | 'high' | 'critical';
};

export type CameraStatus = 'online' | 'vulnerable' | 'authenticated' | 'offline' | 'unknown';

export type CameraResult = {
  id: string;
  ip: string;
  port: number;
  brand?: string;
  model?: string;
  url?: string;
  snapshotUrl?: string;
  status: CameraStatus;
  credentials?: {
    username: string;
    password: string;
  } | null;
  vulnerabilities?: {
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }[];
  location?: {
    country: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  lastSeen: string;
  accessLevel: 'none' | 'view' | 'control' | 'admin';
  responseTime?: number;
  monitoringEnabled?: boolean;
};

export type ScanStatus = 'idle' | 'running' | 'completed' | 'failed';

export type ScanProgress = {
  status: ScanStatus;
  targetsTotal: number;
  targetsScanned: number;
  camerasFound: number;
  startTime?: Date;
  endTime?: Date;
  error?: string;
  scanTarget?: ScanTarget;
  scanSettings?: ScanSettings;
  currentTarget?: string;
  scanSpeed?: number;
};

export type AlertConfig = {
  enabled: boolean;
  type: 'status_change' | 'new_vulnerability' | 'connection_loss' | 'access_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  notificationMethod: 'in_app' | 'email' | 'webhook';
};

export type VulnerabilityAssessmentResult = {
  cameraId: string;
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  lastChecked: Date;
  findings: {
    category: string;
    details: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    recommendation: string;
  }[];
};
