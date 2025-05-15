
/**
 * Types for network-related tools
 */

export interface ONVIFFuzzerParams {
  target: string;
  port?: number;
  protocol?: string;
  timeout?: number;
  fuzzerType?: 'standard' | 'aggressive' | 'stealth';
  saveResults?: boolean;
}

export interface ZMapParams {
  target: string;
  port: number[];
  bandwidth?: string;
  timeout?: number;
  outputFormat?: 'csv' | 'json' | 'text';
  blacklist?: string[];
  whitelist?: string[];
}

export interface MetasploitParams {
  target: string;
  module: string;
  options?: Record<string, any>;
  payload?: string;
  runAsJob?: boolean;
  timeout?: number;
}

export interface ONVIFScanParams {
  target: string;
  port?: number;
  username?: string;
  password?: string;
  timeout?: number;
  saveResults?: boolean;
}

export interface MotionParams {
  input: string;
  sensitivity?: number;
  threshold?: number;
  outputPath?: string;
  detectionArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
