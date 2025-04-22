
/**
 * Type definitions for RTSP Brute-forcing tool
 */

export interface RtspBruteParams {
  targets: string | string[];
  userlist?: string[];
  passlist?: string[];
  workers?: number;
  timeout?: number;
  outputFile?: string;
  useTor?: boolean;
  bypassTechniques?: boolean;
  vendor?: 'any' | 'hikvision' | 'dahua' | 'axis' | 'bosch';
  proxyList?: string[];
  stealthMode?: boolean;
  maxAttempts?: number;
  smartCredentials?: boolean;
  userAgent?: string;
}

export interface RtspBruteResult {
  success: boolean;
  found: RtspCredential[];
  error?: string;
  scanDetails?: {
    targetsScanned: number;
    attemptsPerTarget: number;
    timeElapsed: string;
    targetType: string;
  };
}

export interface RtspCredential {
  target: string;
  user: string;
  pass: string;
  vendor?: string;
  port?: number;
  streamUrl?: string;
  timestamp?: string;
}
