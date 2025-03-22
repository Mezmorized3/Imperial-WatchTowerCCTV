
/**
 * Types for OSINT tools and their parameters
 */

// General result type for all OSINT tools
export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  simulatedData?: boolean;
}

// Common type for all OSINT tool parameters
export interface ToolParams {
  [key: string]: any;
}

// Specific result types
export interface ScanResult {
  success: boolean;
  findings: string[];
  target: string;
}

export interface UsernameResult {
  platform: string;
  url: string;
  username: string;
  found: boolean;
  profileData?: any;
}

export interface CameraResult {
  ip: string;
  port: number;
  type: string;
  accessible?: boolean;
  stream_url?: string;
  rtspUrl?: string;
  protocol?: string;
  manufacturer?: string;
  model?: string;
  credentials?: {
    username: string;
    password: string;
  } | null;
  vulnerabilities?: {
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }[];
  geolocation?: {
    country: string;
    city?: string;
    coordinates: [number, number];
  };
}

// OSINT tool parameters

export interface CameradarParams {
  target: string;
  ports?: string;
  scanType?: 'standard' | 'deep' | 'quick'; 
}

export interface WebCheckParams {
  url: string;
  followRedirects?: boolean;
}

export interface SherlockParams {
  username: string;
  platforms?: string[];
}

export interface TorBotParams {
  url: string;
  depth?: number;
  mode?: string;
}

export interface PhotonParams {
  url: string;
  depth?: number;
  timeout?: number;
}

export interface TwintParams {
  username?: string;
  search?: string;
  since?: string;
  until?: string;
  limit?: number;
  verified?: boolean;
}

export interface IPCamSearchParams {
  subnet: string;
  protocols?: string[];
  timeout?: number;
}

export interface BotExploitsParams {
  target: string;
  botType?: string;
  scanType?: string;
  timeout?: number;
}

export interface CamerattackParams {
  target: string;
  method?: string;
  mode?: string;
  duration?: number;
  rate?: number;
}

export interface BackHackParams {
  target: string;
  scanType?: string;
}

export interface WebHackParams {
  url: string;
  scanType?: string;
  findVulnerabilities?: boolean;
  checkHeaders?: boolean;
  testXss?: boolean;
  testSql?: boolean;
}

export interface SpeedCameraParams {
  location?: string;
  threshold?: number;
  source?: string;
}

export interface CCTVParams {
  region?: string;
  type?: string;
  country?: string;
  limit?: number;
}

export interface ImperialOculusParams {
  target: string;
  scanType?: 'basic' | 'full' | 'stealth';
  ports?: string;
  timeout?: number;
}

// OSINT parameters
export interface OSINTParams {
  target: string;
  type?: string;
  depth?: string;
}

// Shield AI parameters
export interface ShieldAIParams {
  target: string;
  mode?: string;
  depth?: string;
  aiModel?: string;
}

// Imperial Shield parameters
export interface ImperialShieldParams {
  targetUrl: string;
  port?: number;
  protocol?: string;
  authToken?: string;
  validateCert?: boolean;
  method?: string;
  body?: any;
}

export interface ImperialShieldResult {
  success: boolean;
  data?: any;
  error?: string;
  responseTime?: number;
  shieldStatus?: 'active' | 'breached' | 'inactive';
  securityRating?: number;
}
