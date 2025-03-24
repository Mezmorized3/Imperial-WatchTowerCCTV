
/**
 * Advanced tool types for security and media processing
 */

export interface RapidPayloadParams {
  targetOS: string;
  payloadType: string;
  options?: Record<string, any>;
  format?: string;
  lhost?: string;
  lport?: number;
  encode?: boolean;
  encryption?: string;
  outputPath?: string;
}

export interface HackingToolParams {
  tool: string;
  options?: Record<string, any>;
  category?: string;
  toolCategory?: string;
}

export interface SecurityAdminParams {
  command: string;
  options?: Record<string, any>;
  scanType?: string;
  target?: string;
  fixVulnerabilities?: boolean;
  reportFormat?: string;
}

export interface FFmpegParams {
  input: string;
  output?: string;
  videoCodec?: string;
  audioCodec?: string;
  resolution?: string;
  bitrate?: string;
  framerate?: string;
  filters?: string[];
  options?: Record<string, any>;
  inputStream?: string;
  outputPath?: string;
  outputFormat?: string;
  duration?: string; // Add duration property to fix missing property error
}
