
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
