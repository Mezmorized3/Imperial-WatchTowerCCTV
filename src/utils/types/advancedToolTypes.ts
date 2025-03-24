
/**
 * Advanced tool types for specialized functionalities
 */

export interface RapidPayloadParams {
  platform: string;
  targetOS: 'windows' | 'linux' | 'macos' | 'android' | 'web';
  payloadType: 'windows' | 'linux' | 'macos' | 'android' | 'web';
  format: string;
  lhost: string;
  lport: number;
  encode: boolean;
  encryption: string;
}

export interface HackingToolParams {
  tool: string;
  target?: string;
  options?: Record<string, any>;
  silent?: boolean;
  saveResults?: boolean;
}

export interface SecurityAdminParams {
  tool: string;
  command: string;
  scanType: 'full' | 'users' | 'permissions' | 'services';
  target: string;
  fixVulnerabilities?: boolean;
  reportFormat?: 'html' | 'text' | 'json';
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
}

export interface ImperialShieldResult {
  shieldStatus: 'active' | 'inactive' | 'compromised';
  securityRating: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  recommendations: string[];
  details: any;
  success?: boolean;
  error?: string;
}
