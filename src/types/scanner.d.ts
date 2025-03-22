
export interface CameraResult {
  id: string;
  ip: string;
  port?: number;
  brand?: string;
  model?: string;
  firmwareVersion?: string;
  firmwareAnalysis?: {
    outdated: boolean;
    lastUpdate?: string;
    recommendedVersion?: string;
    knownVulnerabilities: string[];
    securityScore?: number;
    recommendations?: string[];
  };
  status?: CameraStatus;
  vulnerabilities?: Array<{
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }>;
  services?: string[];
  location?: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  lastSeen?: string;
  firstSeen?: string;
  accessLevel?: 'none' | 'view' | 'control' | 'admin';
  responseTime?: number;
  threatIntel?: ThreatIntelData;
  url?: string;
}

export type CameraStatus = 'online' | 'offline' | 'vulnerable' | 'authenticated';

export interface ThreatIntelData {
  ipReputation: number;
  lastReportedMalicious?: string;
  associatedMalware?: string[];
  reportedBy?: string[];
  firstSeen?: string;
  tags?: string[];
  confidenceScore: number;
  source: 'virustotal' | 'abuseipdb' | 'threatfox' | 'other';
}

export interface SearchResult {
  query: string;
  engine: string;
  timestamp: string;
  results: CameraResult[];
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  engine: string;
  timestamp: string;
  count: number;
}

export interface FeedConfig {
  id: string;
  name: string;
  url: string;
  type: 'rtsp' | 'http' | 'hls' | 'webrtc';
  credentials?: {
    username: string;
    password: string;
  };
  tags?: string[];
  lastAccessed?: string;
}

export interface ZoomeyeResult {
  ip: string;
  port: number;
  service: string;
  app: string;
  banner: string;
  version?: string;
  os?: string;
  timestamp: string;
}

export interface ShodanResult {
  ip: string;
  hostnames: string[];
  domains: string[];
  country: string;
  org: string;
  isp: string;
  ports: number[];
  vulns?: string[];
}

export interface ShieldStatus {
  overallStatus: 'good' | 'warning' | 'critical';
  securityScore: number;
  vulnerabilities: number;
  openPorts: number;
  outdatedFirmware: number;
  unauthorizedAccess: number;
  lastScan: string;
  threatLevel: number;
}
