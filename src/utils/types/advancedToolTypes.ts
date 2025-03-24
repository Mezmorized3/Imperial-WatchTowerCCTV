
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
  mode?: 'analyze' | 'defend' | 'monitor';
  options?: {
    scanLevel?: 'basic' | 'advanced' | 'royal';
    alertThreshold?: number;
    autoDefend?: boolean;
    [key: string]: any;
  };
}
