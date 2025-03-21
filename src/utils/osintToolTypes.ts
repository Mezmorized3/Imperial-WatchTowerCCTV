
/**
 * Type definitions for OSINT and camera discovery tools
 */

export type ToolParams = {
  target?: string;
  url?: string;
  domain?: string;
  username?: string;
  subnet?: string;
  depth?: string | number;
  type?: string;
  mode?: string;
  country?: string;
  limit?: number | string;
};

export type ToolResult = {
  success: boolean;
  data: any;
  simulatedData?: boolean;
  message?: string;
  error?: string;
};

export type ScanResult = {
  ip: string;
  hostname?: string;
  ports: {
    port: number;
    protocol: string;
    service: string;
    state: string;
  }[];
  cves?: {
    id: string;
    severity: string;
    description: string;
  }[];
  geolocation?: {
    country: string;
    city: string;
    coordinates: [number, number];
  };
};

export type UsernameResult = {
  platform: string;
  url: string;
  username: string;
  found: boolean;
  profileData?: {
    name?: string;
    bio?: string;
    followers?: number;
    following?: number;
    images?: string[];
  };
};

export type CameraResult = {
  ip: string;
  port: number;
  type: string;
  protocol?: string;
  manufacturer?: string;
  model?: string;
  credentials?: {
    username: string;
    password: string;
  } | null;
  rtspUrl?: string;
  vulnerabilities?: {
    name: string;
    severity: string;
    description: string;
    cve?: string;
  }[];
  geolocation?: {
    country: string;
    city: string;
    coordinates: [number, number];
  };
};

export type CCTVParams = {
  country: string;
  type?: string;
  limit?: number;
};

export type TorBotParams = {
  url: string;
  mode?: string;
  depth?: number;
};

export type WebhackParams = {
  url: string;
  scanType?: string;
};

export type SpeedCameraParams = {
  source: string;
  threshold?: number;
};

export type WebCheckParams = {
  url: string;
};

export type TwintParams = {
  username?: string;
  search?: string;
  since?: string;
  until?: string;
  limit?: string;
  verified?: boolean;
};

export type OSINTParams = {
  target: string;
  type?: string;
  depth?: string;
};

export type ShieldAIParams = {
  target: string;
  mode?: string;
  depth?: string;
};

export type BotExploitsParams = {
  target: string;
  scanType?: string;
};

export type CamerattackParams = {
  target: string;
  mode?: string;
};

export type BackHackParams = {
  target: string;
  scanType?: string;
};
