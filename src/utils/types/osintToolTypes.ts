
// Core OSINT tool types - consolidated and corrected
export interface BaseToolParams {
  tool: string;
  target?: string;
  timeout?: number;
  saveResults?: boolean;
  verbose?: boolean;
  [key: string]: any;
}

export interface HackingToolSuccessData<R = any> {
  results: R;
  message?: string;
}

export interface HackingToolErrorData {
  message: string;
  results?: any[];
}

export type HackingToolResult<R = any> = 
  | { success: true; data: HackingToolSuccessData<R>; error?: never }
  | { success: false; error: string; data?: HackingToolErrorData };

// Camera and CCTV types
export interface CCTVCamera {
  id: string;
  ip: string;
  port: number;
  manufacturer?: string;
  model?: string;
  status: 'online' | 'offline' | 'vulnerable';
  credentials?: {
    username: string;
    password: string;
  };
  location?: {
    country: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  vulnerabilities?: Array<{
    id: string;
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }>;
}

export interface CCTVHackedCamera extends CCTVCamera {
  accessLevel: 'admin' | 'user' | 'view';
  exploits?: string[];
  compromiseDate?: string;
}

export interface CCTVScanData {
  cameras: CCTVCamera[];
  totalFound: number;
  scanDuration: number;
}

export interface CCTVHackedData {
  cameras: CCTVHackedCamera[];
  totalCompromised: number;
  scanDuration: number;
}

// Web tool types
export interface WebhackData {
  vulnerabilities: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    evidence?: string;
  }>;
  subdomains?: string[];
  technologies?: string[];
}

export interface BackHackData {
  vulnerabilities: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    url?: string;
  }>;
  endpoints?: string[];
  technologies?: string[];
}

// Social media types
export interface TwintData {
  posts: Array<{
    id: string;
    username: string;
    content: string;
    timestamp: string;
    likes?: number;
    retweets?: number;
  }>;
  tweets?: Array<{
    id: string;
    username: string;
    content: string;
    timestamp: string;
    likes?: number;
    retweets?: number;
  }>;
  totalPosts: number;
}

export interface UsernameSearchData {
  profiles: Array<{
    platform: string;
    url: string;
    exists: boolean;
    profileData?: any;
  }>;
  totalFound: number;
}

// Network scanning types
export interface MasscanData {
  openPorts: Array<{
    ip: string;
    port: number;
    protocol: string;
    status: string;
  }>;
  totalHosts: number;
}

export interface NmapONVIFData {
  devices: Array<{
    ip: string;
    port: number;
    services: string[];
    manufacturer?: string;
    model?: string;
  }>;
  totalDevices: number;
}

// Payload generation types
export interface RapidPayloadParams extends BaseToolParams {
  platform: 'windows' | 'linux' | 'macos' | 'android' | 'python' | 'php' | 'bash' | 'powershell';
  payloadType: string;
  lhost: string;
  lport: number;
  format: string;
  encode?: boolean;
  encryption?: string;
  options?: {
    encoder?: string;
    iterations?: number;
    bad_chars?: string;
    nops?: number;
  };
}

export interface RapidPayloadData {
  payload: string;
}

// Computer Vision types
export interface OpenCVParams extends BaseToolParams {
  operation: 'detect' | 'track' | 'analyze';
  inputType: 'image' | 'video' | 'stream';
  source: string;
}

export interface DeepstackParams extends BaseToolParams {
  operation: 'face_detection' | 'object_detection' | 'scene_recognition';
  image: string;
  confidence?: number;
}

export interface FaceRecognitionParams extends BaseToolParams {
  operation: 'encode' | 'compare' | 'identify';
  image: string;
  database?: string;
}

export interface MotionParams extends BaseToolParams {
  operation: 'detect' | 'track' | 'record';
  source: string;
  sensitivity?: number;
}

// Security tools
export interface SecurityAdminParams extends BaseToolParams {
  operation: 'scan' | 'audit' | 'monitor';
  scope: string;
  depth?: 'basic' | 'comprehensive';
}

// FFmpeg types
export interface FFmpegParams extends BaseToolParams {
  operation: 'convert' | 'stream' | 'record' | 'analyze';
  input: string;
  output?: string;
  format?: string;
  quality?: string;
}

// Proxy configuration
export interface ProxyConfig {
  enabled: boolean;
  type: 'http' | 'socks4' | 'socks5';
  host: string;
  port: number;
  username?: string;
  password?: string;
  country?: string;
  testUrl?: string;
  useAuthentication?: boolean;
  autoReconnect?: boolean;
  dnsProtection?: boolean;
  forceTls?: boolean;
  rotationEnabled?: boolean;
  rotationInterval?: number;
  proxyList?: {host: string; port: number; country?: string}[];
  useTor?: boolean;
}
