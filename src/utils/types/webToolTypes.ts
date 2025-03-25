
/**
 * Web tool types
 */

export interface WebCheckParams {
  url: string;
  timeout?: number;
  checkSecurity?: boolean;
  checkHeaders?: boolean;
  checkWhois?: boolean;
  checkTracker?: boolean;
  checkCookies?: boolean;
  userAgent?: string;
  saveResults?: boolean;
}

export interface WebHackParams {
  url: string;
  scanType?: 'basic' | 'full';
  timeout?: number;
  checkVulnerabilities?: boolean;
  checkSubdomains?: boolean;
  userAgent?: string;
  saveResults?: boolean;
  target?: string; // Add target property
  method?: string; // Add method property
}

export interface WebHackResult {
  url: string;
  scanType: string;
  vulnerabilities: {
    id: string;
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    location?: string;
    details?: string;
    remediation?: string;
  }[];
  headers: Record<string, string>;
  technologies: string[];
  cookies: any[];
  subdomains: string[];
  ports: number[];
  timestamp: string;
}

export interface PhotonParams {
  url: string;
  depth?: number;
  timeout?: number;
  threads?: number;
  delay?: number;
  userAgent?: string;
  cookies?: string;
  saveResults?: boolean;
}

// Add alias for backward compatibility
export type WebhackParams = WebHackParams;

// Re-export BackHackParams from cameraTypes using export type
export type { BackHackParams } from './cameraTypes';
