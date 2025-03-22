
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
  type?: string;
  protocol?: string;
  rtspUrl?: string;
  credentials?: {
    username: string;
    password: string;
  } | null;
  geolocation?: {
    country: string;
    city?: string;
    coordinates?: [number, number];
  };
  vulnerabilities?: Array<{
    name: string;
    severity: string;
    description: string;
  }>;
  accessible?: boolean;
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
  region?: string;  // Making optional
  limit?: number;
  saveResults?: boolean;
  country?: string;
  type?: string;
}

export interface TorBotParams extends ToolParams {
  url: string;
  level?: number;
  dumpData?: boolean;
  mode?: string;
  depth?: number;
}

export interface WebHackParams extends ToolParams {
  target?: string;
  mode?: string;
  url?: string;
  scanType?: string;
  findVulnerabilities?: boolean;
  checkHeaders?: boolean;
  testXss?: boolean;
  testSql?: boolean;
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
  scanType?: string;
  timeout?: number;
}

export interface CamerattackParams extends ToolParams {
  target: string;
  sessions?: number;
  timeout?: number;
  mode?: string;
  duration?: number;
  rate?: number;
}

export interface BackHackParams extends ToolParams {
  url?: string;
  extractData?: boolean;
  target?: string;
  scanType?: string;
}

export interface ImperialOculusParams extends ToolParams {
  target: string;
  ports?: string;
  scanType?: string;
}

// New tool parameter types
export interface RapidPayloadParams extends ToolParams {
  targetOS?: string;
  payloadType: string;
  options?: Record<string, any>;
  format?: string;
  lhost?: string;
  lport?: number;
  encode?: boolean;
  encryption?: string;
  outputPath?: string;
}

export interface HackingToolParams extends ToolParams {
  category?: string;
  tool?: string;
  options?: Record<string, any>;
  toolCategory?: string;
  target?: string;
}

export interface FFmpegParams extends ToolParams {
  input?: string;
  output?: string;
  options?: Record<string, any>;
  inputStream?: string;
  outputFormat?: string;
  videoCodec?: string;
  audioCodec?: string;
  resolution?: string;
  bitrate?: string;
  framerate?: string;
  filters?: string[];
  outputPath?: string;
}

export interface SecurityAdminParams extends ToolParams {
  command?: string;
  options?: Record<string, any>;
  scanType?: string;
  target?: string;
  fixVulnerabilities?: boolean;
  reportFormat?: string;
}

// Imperial Shield Protocol types
export interface ImperialShieldParams extends ToolParams {
  targetUrl: string;
  protocol: string;
  validateCert: boolean;
}

export interface ImperialShieldResult {
  success: boolean;
  responseTime?: number;
  shieldStatus: 'active' | 'inactive' | 'breached';
  securityRating: number;
  error?: string;
  data?: any;
}
