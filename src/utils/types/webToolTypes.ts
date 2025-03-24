
/**
 * Web tools types for OSINT and web scanning
 */

import { ToolParams } from './baseTypes';

export interface WebCheckParams extends ToolParams {
  domain: string;
  checkSsl?: boolean;
  checkDns?: boolean;
  checkHeaders?: boolean;
  checkTechnologies?: boolean;
}

export interface WebHackParams extends ToolParams {
  target: string;
  scanType?: string;
  depth?: number;
  cookies?: string;
  headers?: Record<string, string>;
  proxy?: string;
}

export interface BackHackParams extends ToolParams {
  target: string;
  mode?: string;
  depth?: number;
  proxy?: string;
  checkFirewall?: boolean;
  saveResults?: boolean;
}

export interface ChromeExtensionParams extends ToolParams {
  command: 'authenticate' | 'scan' | 'monitor' | 'defend';
  extensionId?: string;
  token?: string;
  options?: {
    [key: string]: any;
  };
}
