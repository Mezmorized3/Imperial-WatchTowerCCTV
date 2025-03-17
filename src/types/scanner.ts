
export type ScanTarget = {
  type: 'ip' | 'range' | 'file' | 'shodan';
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
};
