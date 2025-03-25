
/**
 * Advanced tool types for specialized functionalities
 */

export interface RapidPayloadParams {
  platform: 'windows' | 'linux' | 'macos' | 'android' | 'web';
  targetOS: 'windows' | 'linux' | 'macos' | 'android' | 'web';
  payloadType: 'windows' | 'linux' | 'macos' | 'android' | 'web';
  format: string;
  lhost: string;
  lport: number;
  encode: boolean;
  encryption: string;
  options?: Record<string, any>; // Add options field to match usage
}

export interface HackingToolParams {
  tool: string;
  target?: string;
  options?: Record<string, any>;
  silent?: boolean;
  saveResults?: boolean;
  category?: string; // Add category field to match usage
}

export interface SecurityAdminParams {
  tool: string;
  command: string;
  scanType: 'full' | 'users' | 'permissions' | 'services' | 'basic'; // Added 'basic' to match usage
  target: string;
  fixVulnerabilities?: boolean;
  reportFormat?: 'html' | 'text' | 'json';
  options?: Record<string, any>; // Add options field to match usage
}

export interface FFmpegParams {
  input: string;
  output: string;
  options?: string[];
  format?: string;
  videoCodec?: string;
  audioCodec?: string;
  videoBitrate?: string;
  audioBitrate?: string;
  resolution?: string;
  overwrite?: boolean;
  // Add missing properties used in code
  inputStream?: string;
  outputPath?: string;
  outputFormat?: string;
  bitrate?: string;
  framerate?: string;
  filters?: string[];
  duration?: number;
}

// Updated ImperialShieldResult interface
export interface ImperialShieldResult {
  id?: string; // Make id optional to fix conflicts
  status: 'active' | 'inactive' | 'compromised';
  targetIp?: string;
  lastScan?: string;
  shieldStatus?: 'active' | 'inactive' | 'compromised';
  securityRating?: number;
  vulnerabilities?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  vulnSummary?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  recommendations?: string[];
  details?: any;
  success?: boolean;
  error?: string;
}
