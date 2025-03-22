
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
  accessible: boolean;
  stream_url?: string;
  protocol?: string;
  manufacturer?: string;
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
  mode?: string; // Added mode parameter
}

export interface PhotonParams {
  url: string;
  depth?: number;
  timeout?: number; // Added timeout parameter
}

export interface TwintParams {
  username?: string;
  search?: string;
  since?: string;
  until?: string;
  limit?: number;
  verified?: boolean; // Added verified parameter
}

export interface IPCamSearchParams {
  subnet: string;
  protocols?: string[];
  timeout?: number;
}

export interface BotExploitsParams {
  target: string;
  botType?: string;
  scanType?: string; // Added scanType parameter
  timeout?: number; // Added timeout parameter
}

export interface CamerattackParams {
  target: string;
  method?: string;
  mode?: string; // Added mode parameter
  duration?: number; // Added duration parameter
  rate?: number; // Added rate parameter
}

export interface BackHackParams {
  target: string;
  scanType?: string;
}

export interface WebHackParams {
  url: string;
  scanType?: string;
  findVulnerabilities?: boolean;
  checkHeaders?: boolean; // Added checkHeaders parameter
}

export interface SpeedCameraParams {
  location?: string;
  threshold?: number;
  source?: string; // Added source parameter
}

export interface CCTVParams {
  region?: string;
  type?: string;
  country?: string; // Added country parameter
  limit?: number; // Added limit parameter
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
  aiModel?: string; // Added aiModel parameter
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
