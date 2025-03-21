
/**
 * Types for OSINT tools and their parameters
 */

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
}

export interface IPCamSearchParams {
  subnet: string;
  protocols?: string[];
  timeout?: number;
}

export interface BotExploitsParams {
  target: string;
  botType?: string;
}

export interface CamerattackParams {
  target: string;
  method?: string;
}

export interface BackHackParams {
  target: string;
  scanType?: string;
}

export interface WebHackParams {
  url: string;
  scanType?: string;
}

export interface SpeedCameraParams {
  location?: string;
  threshold?: number;
}

export interface CCTVParams {
  region?: string;
  type?: string;
}

// OSINT tool result types

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
