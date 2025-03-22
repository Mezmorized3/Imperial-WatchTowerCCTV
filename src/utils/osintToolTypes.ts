
/**
 * Type definitions for OSINT and security tools
 */

// Base types
export interface ToolParams {}
export interface ToolResult {
  success: boolean;
  data: any;
  error?: string;
  simulatedData?: boolean;
}

// Camera discovery tools
export interface CameraResult {
  id: string;
  ip: string;
  model?: string;
  manufacturer?: string;
  location?: string;
  port?: number;
  status?: string;
}

export interface ScanResult extends ToolResult {
  data: {
    cameras?: CameraResult[];
    total?: number;
    vulnerabilities?: any[];
  };
}

// Username OSINT tools
export interface UsernameResult extends ToolResult {
  data: {
    sites: Array<{
      name: string;
      url: string;
      found: boolean;
      accountUrl?: string;
    }>;
    totalFound: number;
  };
}

// Parameter types for specific tools
export interface CCTVParams extends ToolParams {
  region: string;
  limit?: number;
  saveResults?: boolean;
}

export interface TorBotParams extends ToolParams {
  url: string;
  level?: number;
  dumpData?: boolean;
}

export interface WebHackParams extends ToolParams {
  target: string;
  mode?: string;
}

export interface SpeedCameraParams extends ToolParams {
  sensitivity?: number;
  resolution?: string;
  threshold?: number;
}

export interface WebCheckParams extends ToolParams {
  domain: string;
  checks?: string[];
}

export interface TwintParams extends ToolParams {
  username?: string;
  search?: string;
  limit?: number;
}

export interface OSINTParams extends ToolParams {
  target: string;
  type?: string;
  depth?: string;
}

export interface ShieldAIParams extends ToolParams {
  target: string;
  mode?: string;
  depth?: string;
  aiModel?: string;
}

export interface BotExploitsParams extends ToolParams {
  target: string;
  port?: number;
  attackType?: string;
}

export interface CamerattackParams extends ToolParams {
  target: string;
  sessions?: number;
  timeout?: number;
}

export interface BackHackParams extends ToolParams {
  url: string;
  extractData?: boolean;
}

export interface ImperialOculusParams extends ToolParams {
  target: string;
  ports?: string;
}

// New tool parameter types
export interface RapidPayloadParams extends ToolParams {
  targetOS: string;
  payloadType: string;
  options?: Record<string, any>;
}

export interface HackingToolParams extends ToolParams {
  category: string;
  tool: string;
  options?: Record<string, any>;
}

export interface FFmpegParams extends ToolParams {
  input: string;
  output?: string;
  options?: Record<string, any>;
}

export interface SecurityAdminParams extends ToolParams {
  command: string;
  options?: Record<string, any>;
}
