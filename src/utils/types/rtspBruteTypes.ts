
/**
 * Types for RTSP brute force tools
 */

export interface RtspBruteParams {
  targets: string | string[];
  userlist?: string[];
  passlist?: string[];
  workers?: number;
  timeout?: number;
  output?: string;
  proxy?: string;
  useragent?: string;
  target?: string; // For compatibility
}

export interface RtspCredential {
  username: string;
  password: string;
  found: boolean;
  streamUrl?: string;
  target?: string; // Adding this to fix the error
}

export interface RtspBruteResult {
  success: boolean;
  credentials?: RtspCredential[];
  errors?: string[];
  message?: string;
}
