
/**
 * Social tools types for OSINT and social media discovery
 */

import { ToolParams } from './baseTypes';

export interface UsernameParams extends ToolParams {
  username: string;
  platforms?: string[];
  timeout?: number;
  proxy?: string;
}

export interface TwintParams extends ToolParams {
  username?: string;
  search?: string;
  limit?: number;
  since?: string;
  until?: string;
  saveResults?: boolean;
}

export interface OSINTParams extends ToolParams {
  target: string;
  mode?: string;
  saveResults?: boolean;
  depth?: number;
  timeout?: number;
}
