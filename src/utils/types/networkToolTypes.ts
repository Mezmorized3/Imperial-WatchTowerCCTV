
/**
 * Network tools types for OSINT and network discovery
 */

import { ToolParams } from './baseTypes';

export interface TorBotParams extends ToolParams {
  url: string;
  depth?: number;
  saveResults?: boolean;
  proxy?: string;
  limit?: number;
}

export interface BotExploitsParams extends ToolParams {
  target: string;
  exploitType?: string;
  timeout?: number;
  proxy?: string;
  useWordlist?: boolean;
  wordlistPath?: string;
}

export interface ImperialOculusParams extends ToolParams {
  target: string;
  mode?: string;
  depth?: number;
  timeout?: number;
  proxy?: string;
  saveResults?: boolean;
}

export interface ShieldAIParams extends ToolParams {
  target: string;
  mode?: 'analyze' | 'defend' | 'monitor';
  scanType?: string;
  options?: {
    [key: string]: any;
  };
}

export interface ProxyRotatorParams extends ToolParams {
  type: 'http' | 'socks4' | 'socks5' | 'tor';
  country?: string;
  anonymity?: 'transparent' | 'anonymous' | 'elite';
  testUrl?: string;
  rotationInterval?: number;
}

export interface TokenBlacklistParams extends ToolParams {
  action: 'add' | 'check' | 'remove';
  token: string;
  expiry?: number;
}

export interface ChromeExtensionParams extends ToolParams {
  command: 'authenticate' | 'scan' | 'monitor' | 'defend';
  extensionId?: string;
  token?: string;
  options?: {
    [key: string]: any;
  };
}

// Specifically for hacking CCTV cameras
export interface HackCCTVParams extends ToolParams {
  target: string;
  method: 'default-credentials' | 'exploit' | 'brute-force' | 'rtsp-discovery';
  timeout?: number;
  proxy?: string;
  userAgent?: string;
  country?: string;
  manufacturer?: string;
  saveResults?: boolean;
}
