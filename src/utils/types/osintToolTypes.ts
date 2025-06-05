
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

// Security tools
export interface SecurityAdminParams extends BaseToolParams {
  target: string;
  action: 'check' | 'patch' | 'report';
  scope?: 'system' | 'network' | 'application';
  level?: 'basic' | 'advanced';
  timeout?: number;
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
