
/**
 * Base types for OSINT tools
 */

export interface ToolParams {
  target?: string;
  timeout?: number;
  saveResults?: boolean;
  verbose?: boolean;
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  simulatedData?: boolean; // Added this for compatibility
}

export interface UsernameResult {
  platform: string;
  username: string;
  url: string;
  accountFound: boolean;
  profileName?: string;
  profilePic?: string;
  bio?: string;
  followers?: number;
  following?: number;
  posts?: number;
  lastUpdated?: string;
}

export interface ScanResult {
  success: boolean;
  timestamp: string;
  total: number;
  found: number;
  data: any;
  results: any[];
  error?: string;
  simulatedData?: boolean; // Added this for compatibility
}

export interface ProxyConfig {
  enabled: boolean;
  type: 'http' | 'socks4' | 'socks5';
  host: string;
  port: number;
  username?: string;
  password?: string;
  country?: string;
  testUrl?: string;
  // Additional properties needed for compatibility
  useAuthentication?: boolean;
  autoReconnect?: boolean;
  dnsProtection?: boolean;
  forceTls?: boolean;
  rotationEnabled?: boolean;
  rotationInterval?: number;
  proxyList?: {host: string; port: number; country?: string}[];
  useTor?: boolean;
}

// Re-export ThreatIntelData to maintain compatibility
export interface ThreatIntelData {
  ipReputation: number;
  lastReportedMalicious?: string;
  associatedMalware: string[];
  reportedBy?: string[];
  firstSeen?: string;
  tags?: string[];
  confidenceScore: number;
  source: 'virustotal' | 'abuseipdb' | 'threatfox' | 'other';
  lastUpdated: string;
  externalIp?: string;
}
