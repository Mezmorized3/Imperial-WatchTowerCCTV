
export interface CameraResult {
  id: string;
  ip: string;
  port?: number;
  model?: string;
  manufacturer?: string;
  location?: {
    country: string;
    city?: string;
    coordinates?: [number, number];
  };
  status?: string;
  type?: string;
  protocol?: string;
  rtspUrl?: string;
  httpUrl?: string;
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
    id?: string;
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }>;
  accessible?: boolean;
  threatIntel?: {
    associatedMalware?: string[];
    knownExploits?: string[];
    lastUpdated?: string;
  };
  firmware?: {
    version?: string;
    vulnerabilities?: string[];
    updateAvailable?: boolean;
    lastChecked?: string;
  };
  firmwareVersion?: string; // Making this explicitly defined
  lastSeen?: string;
  accessLevel?: 'none' | 'view' | 'control' | 'admin';
}

export interface ScanSettings {
  detailed?: boolean;
  aggressive?: boolean;
  targetSubnet?: string;
  portRange?: string;
  timeout?: number;
  testCredentials?: boolean;
  checkVulnerabilities?: boolean;
  saveSnapshots?: boolean;
  regionFilter?: string;
  threadsCount?: number;
}

export interface ScanResult {
  success: boolean;
  data: {
    cameras?: CameraResult[];
    total?: number;
    vulnerabilities?: any[];
  };
  error?: string;
  simulatedData?: boolean;
}
