
/**
 * Types for OSINT and camera discovery tools
 */

// Basic tool parameter and result interfaces
export interface ToolParams {
  [key: string]: any;
}

export interface ToolResult {
  success: boolean;
  data: any;
  error?: string;
  simulatedData?: boolean;
  shieldStatus?: string;
  securityRating?: number;
}

export interface ScanResult {
  success: boolean;
  total: number;
  found: number;
  results: any[];
  data?: any;
  simulatedData?: boolean;
  cameras?: CameraResult[];
}

export interface UsernameResult {
  sites?: any[];
  success: boolean;
  error?: string;
  totalFound?: number;
  simulatedData?: boolean;
  data?: any;
}

export interface CameraResult {
  id: string;
  ip: string;
  port?: number;
  model?: string;
  manufacturer?: string;
  location?: string;
  status?: string;
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
  threatIntelligence?: {
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
  // Required by some implementations
  threatIntel?: {
    associatedMalware?: string[];
    knownExploits?: string[];
    lastUpdated?: string;
  };
  country?: string;
  brand?: string;
  accessLevel?: 'none' | 'view' | 'control' | 'admin';
  lastSeen?: Date | string;
  url?: string;
  snapshotUrl?: string;
}

// Proxy configuration for tools that need to hide their identity
export interface ProxyConfig {
  type: 'http' | 'socks4' | 'socks5' | 'tor';
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  useTor?: boolean;
  enabled?: boolean;
  useAuthentication?: boolean;
  rotationEnabled?: boolean;
  rotationInterval?: number;
  proxyList?: string[];
  dnsProtection?: boolean;
  forceTls?: boolean;
  autoReconnect?: boolean;
  connectionTimeout?: number;
  maxRetries?: number;
  lastKnownExternalIp?: string;
}

// Add ImperialShield interfaces
export interface ImperialShieldParams {
  target: string;
  mode: string;
  targetUrl?: string;
  protocol?: string;
  validateCert?: boolean;
  options?: Record<string, any>;
}

export interface ImperialShieldResult extends ToolResult {
  data: {
    vulnerabilities: any[];
    score: number;
    recommendations: string[];
    message?: string;
    timestamp?: string;
    protocol?: string;
    target?: string;
  };
  shieldStatus?: string;
  securityRating?: number;
  responseTime?: number;
}

// Additional interfaces for new tools
export interface HackCCTVParams {
  target: string;
  mode?: string;
  region?: string;
  country?: string;
  limit?: number;
  timeout?: number;
  scanType?: string;
}

// Specific tool parameter interfaces
export interface CCTVParams {
  region: string;
  limit?: number;
  saveResults?: boolean;
  type?: string;
  country?: string;
}

export interface TorBotParams {
  url: string;
  level?: number;
  dumpData?: boolean;
  mode?: string;
  depth?: number;
}

export interface WebHackParams {
  target: string;
  mode?: string;
  url?: string;
  scanType?: string;
}

export interface SpeedCameraParams {
  sensitivity?: number;
  resolution?: string;
  threshold?: number;
  rtspUrl?: string;
}

export interface WebCheckParams {
  domain: string;
  checks?: string[];
}

export interface TwintParams {
  username?: string;
  search?: string;
  limit?: number;
}

export interface OSINTParams {
  target: string;
  type?: string;
  depth?: string;
}

export interface ShieldAIParams {
  target: string;
  mode?: string;
  depth?: string;
  aiModel?: string;
}

export interface BotExploitsParams {
  target: string;
  port?: number;
  attackType?: string;
  scanType?: string;
  timeout?: number;
}

export interface CamerattackParams {
  target: string;
  sessions?: number;
  timeout?: number;
  mode?: string;
  rate?: number;
}

export interface BackHackParams {
  url: string;
  extractData?: boolean;
  target?: string;
  scanType?: string;
}

export interface ImperialOculusParams {
  target: string;
  ports?: string;
  scanType?: string;
}

export interface RapidPayloadParams {
  targetOS: string;
  payloadType: string;
  options?: Record<string, any>;
  format?: string;
  lhost?: string;
}

export interface HackingToolParams {
  tool: string;
  options?: Record<string, any>;
  category?: string;
  toolCategory?: string;
}

export interface SecurityAdminParams {
  command: string;
  options?: Record<string, any>;
  scanType?: string;
  target?: string;
}

export interface FFmpegParams {
  input?: string;
  output?: string;
  inputStream?: string;
  outputPath?: string;
  outputFormat?: string;
  videoCodec?: string;
  audioCodec?: string;
  resolution?: string;
  bitrate?: string;
  framerate?: string;
  filters?: string[];
  options?: Record<string, any>;
}

// Additional type for threat intelligence data
export interface ThreatIntelData {
  ipReputation?: number; // 0-100, higher is better
  lastReportedMalicious?: string; // ISO date string
  associatedMalware?: string[]; // List of malware names
  reportedBy?: string[]; // List of sources
  firstSeen?: string; // ISO date string
  tags?: string[]; // Tags associated with the IP
  confidenceScore?: number; // 0-100
  source?: string; // Source of the threat intel
}
