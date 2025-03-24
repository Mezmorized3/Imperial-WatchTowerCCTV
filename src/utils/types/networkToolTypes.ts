
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
  mode?: string;
  scanType?: string;
  options?: {
    [key: string]: any;
  };
}
