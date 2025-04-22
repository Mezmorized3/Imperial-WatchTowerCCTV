
/**
 * Type definitions for OSINT tool parameters
 */

export interface FFmpegParams {
  input: string;
  output?: string;
  duration?: string; // e.g. '30s', '1m', etc.
  videoCodec?: string;
  audioCodec?: string;
  options?: Record<string, string>; // Additional FFmpeg options
  // Adding missing properties
  inputStream?: string;
  resolution?: string;
  bitrate?: string;
  framerate?: number | string;
  filters?: string[];
  outputPath?: string;
  outputFormat?: string;
  // Add properties needed for StreamingTools.tsx
  segmentDuration?: number | string;
  playlistSize?: number | string;
  streamUrl?: string;
  format?: string;
  // Add properties for new tools
  inputOptions?: string[];
  outputOptions?: string[];
  videoBitrate?: string;
  audioBitrate?: string;
  onProgress?: (progress: number) => void;
}

export interface SherockParams {
  username: string;
  sites?: string[];
  outputType?: 'json' | 'csv' | 'terminal';
  folderPath?: string;
  timeout?: number;
}

export interface WebCheckParams {
  url: string;
  scanType?: 'basic' | 'full' | 'security';
  screenshot?: boolean;
  saveResults?: boolean;
  timeout?: number;
}

export interface OsintParams {
  target: string;
  type: 'username' | 'domain' | 'ip' | 'email' | 'phone';
  level?: number;
  timeout?: number;
  modules?: string[];
}

export interface RTSPParams {
  target: string | string[];
  port?: number | number[];
  timeout?: number;
  usernames?: string[];
  passwords?: string[];
  paths?: string[];
  threads?: number;
  outputFormat?: 'json' | 'csv' | 'text';
}

// Add missing ProxyConfig interface
export interface ProxyConfig {
  enabled: boolean;
  type: 'http' | 'socks4' | 'socks5';
  host: string;
  port: number;
  username?: string;
  password?: string;
  rotationEnabled?: boolean;
  rotationInterval?: number;
}

// Add missing ToolResult interface
export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  command?: string;
  timestamp?: string;
  simulatedData?: boolean;
  aiModel?: string;
  mode?: string;
  result?: any;
}

// Add missing SecurityAdminParams interface
export interface SecurityAdminParams {
  target: string;
  action: 'check' | 'patch' | 'report';
  scope?: 'system' | 'network' | 'application';
  level?: 'basic' | 'advanced';
  timeout?: number;
}

// Update CCTVParams to match the required properties from cameraTypes.ts
export interface CCTVParams {
  target: string;
  mode?: string;
  country: string; // Changed from optional to required
  timeout?: number;
  region?: string;
  limit?: number;
  // Adding missing properties
  saveResults?: boolean;
  brand?: string;
}
