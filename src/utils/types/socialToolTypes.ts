
/**
 * Social media and OSINT tool types
 */

export interface TwintParams {
  username?: string;
  search?: string;
  limit?: number;
}

export interface OSINTParams {
  target: string;
  type?: string;
  depth?: string;
}

export interface ShieldAIParams {
  target: string;
  mode?: string;
  depth?: string;
  aiModel?: string;
}
