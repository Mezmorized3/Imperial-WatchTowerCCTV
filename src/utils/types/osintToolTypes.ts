
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

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  simulatedData?: boolean;
}

// Geolocation interface with consistent properties
export interface Geolocation {
  country: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

// Vulnerability interface with required properties
export interface Vulnerability {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

// Encoder/Decoder types
export interface EncoderDecoderParams extends BaseToolParams {
  text: string;
  action: "encode" | "decode";
  type: "base64" | "url" | "html" | "rot13" | "hex" | "uri" | "uriComponent";
}

export interface EncoderDecoderData {
  encodedText: string;
}

// Shell types
export interface ReverseShellParams extends BaseToolParams {
  ip: string;
  port: string;
  type: string;
}

export interface ReverseShellData {
  command: string;
}

// Payload types
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

// SQL Injection types
export interface SqliPayloadParams extends BaseToolParams {
  target_url: string;
  payload: string;
}

export interface SqliPayloadData {
  target_url: string;
  payload_used: string;
  vulnerable: boolean;
  response_time_ms: number;
  status_code: number;
  details: string;
  recommendation: string;
  log: string;
}

// XSS types
export interface XssPayloadParams extends BaseToolParams {
  searchTerm: string;
}

export interface XssPayloadsSuccessData {
  results: string[];
}

// Password tools
export interface PasswordCrackerParams extends BaseToolParams {
  target: string;
  method: 'dictionary' | 'bruteforce' | 'custom';
  dictionary?: string;
  customDictionary?: string;
  bruteforceCharset?: string;
  bruteforceMinLength?: number;
  bruteforceMaxLength?: number;
}

export interface PasswordCrackerSuccessData {
  results: string[];
}

export interface PasswordGeneratorParams extends BaseToolParams {
  length: number;
  charset: 'alphanumeric' | 'numeric' | 'alphabetic' | 'custom';
  count: number;
}

export interface PasswordGeneratorSuccessData {
  results: string[];
}

// Network tools
export interface IpInfoParams extends BaseToolParams {
  ip_address: string;
}

export interface IpInfoData {
  ip: string;
  country: string;
  city: string;
  ISP: string;
}

export interface DnsLookupParams extends BaseToolParams {
  domain: string;
  record_type: "A" | "AAAA" | "MX" | "TXT" | "NS" | "CNAME" | "SOA" | "SRV" | "ANY";
}

export interface DnsLookupData {
  domain: string;
  record_type: string;
  records: string[];
}

export interface PortScanParams extends BaseToolParams {
  target_host: string;
  ports_to_scan: string[];
  scan_type: 'TCP_CONNECT' | 'TCP_SYN' | 'UDP';
  timeout?: number;
  service_detection?: boolean;
}

export interface PortScanData {
  target_host: string;
  open_ports: { port: number; service_name: string; protocol: string; state: string }[];
}

export interface TracerouteParams extends BaseToolParams {
  target_host: string;
  max_hops?: number;
  timeout_ms?: number;
}

export interface TracerouteData {
  target_host: string;
  hops: { hop: number; ip: string; rtt_ms: number }[];
}

export interface SubnetScanParams extends BaseToolParams {
  subnet_cidr: string;
  ports_to_scan?: number[];
  scan_method?: string;
  timeout_ms?: number;
}

export interface SubnetScanData {
  subnet_cidr: string;
  active_hosts: { ip: string; open_ports: number[] }[];
}

export interface WhoisLookupParams extends BaseToolParams {
  query: string;
}

export interface WhoisLookupData {
  query: string;
  raw_data: string;
}

export interface HttpHeadersParams extends BaseToolParams {
  url: string;
  method?: string;
  user_agent?: string;
}

export interface HttpHeadersData {
  url: string;
  status_code: number;
  headers: { [key: string]: string };
}

// Bot exploit types
export interface BotExploitsParams extends BaseToolParams {
  targetService: string;
  credentials?: Record<string, string>;
}

export interface BotExploitsData {
  tokens: { id: string; value: string; type: string; expiration: string }[];
  apis: { id: string; endpoint: string; method: string; authentication: boolean }[];
  message: string;
}

// CCTV types with all required properties
export interface CCTVCamera {
  id: string;
  ip: string;
  port: number;
  manufacturer?: string;
  model?: string;
  status: 'online' | 'offline' | 'vulnerable';
  url?: string;
  credentials?: {
    username: string;
    password: string;
  };
  location?: Geolocation;
  vulnerabilities?: Vulnerability[];
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

export interface CCTVHackedParams extends BaseToolParams {
  target: string;
  country?: string;
  exploitType?: 'default_creds' | 'known_vuln';
}

export interface CCTVScanParams extends BaseToolParams {
  query?: string;
  brand?: string;
  country?: string;
  limit?: number;
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
  operation?: 'scan' | 'audit' | 'monitor';
  scope?: string;
  depth?: 'basic' | 'comprehensive';
  target: string;
  action: 'check' | 'patch' | 'report';
}

export interface ShieldAIParams extends BaseToolParams {
  targetSystem: string;
  scanType: 'vulnerability' | 'compliance' | 'threat_detection';
  analysisDepth?: string;
  policyFile?: string;
}

// FFmpeg types
export interface FFmpegParams extends BaseToolParams {
  operation: 'convert' | 'stream' | 'record' | 'analyze';
  input: string;
  output?: string;
  format?: string;
  quality?: string;
  inputStream?: string;
  outputPath?: string;
  outputFormat?: string;
  bitrate?: string;
  framerate?: string;
  filters?: string[];
  duration?: number | string;
  videoCodec?: string;
  audioCodec?: string;
  resolution?: string;
  options?: Record<string, string>;
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
