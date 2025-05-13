
export interface BotExploitsParams {
  target: string;
  botType: 'telegram' | 'discord' | 'slack' | 'any';
  scanType: 'keys' | 'tokens' | 'all';
  timeout?: number;
}

export interface WebHackParams {
  url: string;
  scanType: 'basic' | 'full';
  timeout: number;
  checkVulnerabilities: boolean;
  checkSubdomains: boolean;
  userAgent?: string;
  saveResults: boolean;
}

export interface ZGrabOptions {
  target: string;
  port: number;
  protocol: 'http' | 'https' | 'rtsp';
  timeout?: number;
  saveResults?: boolean;
}

export interface ZGrabResult {
  success: boolean;
  error?: string;
  data?: {
    target: string;
    port: number;
    protocol: string;
    banner?: string;
    headers?: Record<string, string>;
    responseCode?: number;
    responseBody?: string;
    certificateInfo?: any;
    timestamp: string;
  };
}

export interface PhotonParams {
  url: string;
  depth?: number;
  timeout?: number;
  threads?: number;
  delay?: number;
  userAgent?: string;
  saveResults?: boolean;
}

export interface FFmpegParams {
  input: string;
  output: string;
  duration?: string;
  videoCodec?: string;
  audioCodec?: string;
  options?: Record<string, string>;
}
