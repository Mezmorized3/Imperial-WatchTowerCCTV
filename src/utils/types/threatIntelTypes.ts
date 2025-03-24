
/**
 * Threat intelligence data types
 */

export interface ThreatIntelData {
  ipReputation: number;
  confidenceScore: number;
  source: 'virustotal' | 'abuseipdb' | 'threatfox' | 'other';
  associatedMalware: string[];
  lastReportedMalicious?: string;
  reportedBy?: string[];
  firstSeen?: string;
  tags?: string[];
  lastUpdated: string;
}

export interface FirmwareData {
  version: string;
  releaseDate?: string;
  vulnerabilities: Array<{
    id: string;
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    cve?: string;
    published?: string;
    fixed?: boolean;
  }>;
  updateAvailable: boolean;
  lastChecked: string;
}

export interface ExploitData {
  id: string;
  name: string;
  description: string;
  cve?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  published: string;
  type: 'web' | 'firmware' | 'network' | 'hardware' | 'other';
  status: 'verified' | 'unverified' | 'patched';
  details?: string;
  references?: string[];
}

// Updated ImperialShieldResult to include all needed properties
export interface ImperialShieldResult {
  id: string;
  target: string;
  status: 'vulnerable' | 'secure' | 'unknown';
  timestamp: string;
  findings: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    remediation?: string;
  }>;
  score: number;
  mode: 'analyze' | 'defend' | 'monitor' | 'test';
  // Add missing properties needed by ImperialShieldMatrix component
  shieldStatus?: 'active' | 'inactive' | 'breached';
  securityRating?: number;
  success?: boolean;
  error?: string;
}
