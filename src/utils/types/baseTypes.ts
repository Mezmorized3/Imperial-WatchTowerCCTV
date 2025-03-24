
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
}
