
/**
 * Advanced tools types for OSINT and hacking tools
 */

import { ToolParams } from './baseTypes';

export interface RapidPayloadParams extends ToolParams {
  platform: string;
  payloadType: string;
  options?: {
    bind?: boolean;
    secure?: boolean;
    encoder?: string;
    format?: string;
    lhost?: string;
    lport?: number;
  };
  output?: string;
  targetOS?: string;
  encode?: boolean;
  encryption?: string;
}

export interface HackingToolParams extends ToolParams {
  target?: string;
  tool: string;
  options?: {
    [key: string]: any;
  };
}

export interface SecurityAdminParams extends ToolParams {
  target?: string;
  tool: string;
  mode?: string;
  command?: string;
  scanType?: string;
  options?: {
    [key: string]: any;
  };
}

export interface FFmpegParams extends ToolParams {
  input: string;
  output?: string;
  videoCodec?: string;
  audioCodec?: string;
  duration?: number;
  options?: {
    [key: string]: any;
  };
}

export interface ImperialShieldParams extends ToolParams {
  target: string;
  mode?: 'analyze' | 'defend' | 'monitor' | 'test';
  options?: {
    scanLevel?: 'basic' | 'advanced' | 'royal';
    alertThreshold?: number;
    autoDefend?: boolean;
    [key: string]: any;
  };
}

// Add additional tool types for the imported hacking tools
export interface CamDumperParams extends ToolParams {
  target: string;
  method: 'scan' | 'exploit' | 'dump';
  outputDir?: string;
  timeout?: number;
  country?: string;
}

export interface OpenCCTVParams extends ToolParams {
  target: string;
  scanMode: 'quick' | 'deep' | 'stealth';
  saveOutput?: boolean;
  proxyEnabled?: boolean;
}
