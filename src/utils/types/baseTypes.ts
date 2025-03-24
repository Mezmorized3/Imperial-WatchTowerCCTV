
/**
 * Base types for OSINT and camera discovery tools
 */

import { CameraResult as ScannerCameraResult } from '@/types/scanner';

// Basic tool parameter and result interfaces
export interface ToolParams {
  [key: string]: any;
}

export interface ToolResult {
  success: boolean;
  data: any;
  error?: string;
  simulatedData?: boolean;
  shieldStatus?: 'active' | 'inactive' | 'breached';
  securityRating?: number;
}

export interface ScanResult {
  success: boolean;
  total: number;
  found: number;
  results: any[];
  data?: {
    cameras?: ScannerCameraResult[];
    total?: number;
    vulnerabilities?: any[];
  };
  simulatedData?: boolean;
  cameras?: ScannerCameraResult[];
}

export interface UsernameResult {
  sites?: any[];
  success: boolean;
  error?: string;
  totalFound?: number;
  simulatedData?: boolean;
  data?: any;
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

// Additional type for threat intelligence data
export interface ThreatIntelData {
  ipReputation: number; // 0-100, higher is better
  lastReportedMalicious?: string; // ISO date string
  associatedMalware: string[]; // List of malware names
  reportedBy?: string[]; // List of sources
  firstSeen?: string; // ISO date string
  tags?: string[]; // Tags associated with the IP
  confidenceScore: number; // 0-100
  source: string; // Source of the threat intel
  lastUpdated: string; // Last update timestamp
}

// ScrapyParams and ScrapyResult interfaces
export interface ScrapyParams {
  url: string;
  depth?: number;
  output?: string;
}

export interface ScrapyResult extends ScanResult {
  data: any;
}
