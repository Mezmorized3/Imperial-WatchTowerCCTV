
export interface SecurityScanParams {
  target: string;
  action?: 'check' | 'patch' | 'report';
  scope?: 'system' | 'network' | 'device';
  depth?: 'quick' | 'normal' | 'deep';
}

export interface SecurityVulnerability {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation?: string;
  impact?: string;
  cve?: string;
}

export interface SecurityScanResult {
  success: boolean;
  timestamp: string;
  error?: string;
  findings?: SecurityVulnerability[];
  patchesApplied?: string[];
  summary?: {
    total: number;
    successful: number;
    failed: number;
  };
}
