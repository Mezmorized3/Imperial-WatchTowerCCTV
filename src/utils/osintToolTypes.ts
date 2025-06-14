export interface BaseToolParams {
  tool: string;
  [key: string]: any;
}

export type ToolExecutionFunction<T extends BaseToolParams, R> = (
  params: T
) => Promise<R>;

export interface HackingToolSuccessData<R = any> {
  results: R;
  message?: string; // Optional message for success cases
}

export interface HackingToolErrorData {
  message: string;
  results?: any[]; // Optional results even in error cases, e.g. partial results
}

export type HackingToolResult<R = any, EData = HackingToolErrorData> =
  | { success: true; data: HackingToolSuccessData<R> }
  | { success: false; error?: string; data?: EData };

export interface EncoderDecoderParams extends BaseToolParams {
  text: string;
  action: "encode" | "decode";
  type:
    | "base64"
    | "url"
    | "html"
    | "rot13"
    | "hex"
    | "uri"
    | "uriComponent";
}

export interface EncoderDecoderData {
  encodedText: string;
}

export interface ReverseShellParams extends BaseToolParams {
  ip: string;
  port: string;
  type: string;
}

export interface ReverseShellData {
  command: string;
}

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
  payload: string; // The actual payload string
}

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

export interface XssPayloadParams extends BaseToolParams {
  searchTerm: string;
}

export interface PasswordCrackerParams extends BaseToolParams {
  target: string;
  method: 'dictionary' | 'bruteforce' | 'custom';
  dictionary?: string;
  customDictionary?: string;
  bruteforceCharset?: string;
  bruteforceMinLength?: number;
  bruteforceMaxLength?: number;
}

export interface PasswordGeneratorParams extends BaseToolParams {
  length: number;
  charset: 'alphanumeric' | 'numeric' | 'alphabetic' | 'custom';
  count: number;
}

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
  record_type:
  | "A"
  | "AAAA"
  | "MX"
  | "TXT"
  | "NS"
  | "CNAME"
  | "SOA"
  | "SRV"
  | "ANY";
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

export type PasswordCrackerSuccessData = { results: string[] };
export type PasswordGeneratorSuccessData = { results: string[] };
export type XssPayloadsSuccessData = { results: string[] };

export interface BotExploitsParams extends BaseToolParams { // Added BotExploitsParams
    targetService: string; // e.g., 'discord', 'telegram_bot_api_key_check'
    credentials?: Record<string, string>; // e.g. { token: 'xxx' }
}

export interface BotExploitsData {
  tokens: { id: string; value: string; type: string; expiration: string }[];
  apis: { id: string; endpoint: string; method: string; authentication: boolean }[];
  message: string;
}

export type BotExploitsResult = 
  | { success: true; data: BotExploitsData }
  | { success: false; error: string };


export interface CCTVHackedCamera {
  id: string;
  ip: string;
  port: number;
  manufacturer: string;
  model: string;
  vulnerabilities: string[];
}

export interface CCTVHackedData {
  cameras: CCTVHackedCamera[];
  message: string;
}

export interface CCTVHackedParams extends BaseToolParams {
  target_query: string; // Changed from 'target' to match component usage
  scan_type: 'ip_scan' | 'exploit_db' | 'default_creds';
  exploit_name?: string;
  check_default_credentials?: boolean;
}

export type CCTVHackedResult = 
  | { success: true; data: CCTVHackedData }
  | { success: false; error: string };

export interface CCTVCamera {
  id: string;
  ip: string;
  port: number;
  manufacturer: string;
  model: string;
  url: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface CCTVScanData {
  cameras: CCTVCamera[];
}

export interface CCTVScanParams extends BaseToolParams {
  query?: string; // Search query (e.g., city, country, specific camera model)
  brand?: string;
  country?: string;
  limit?: number;
}

export type CCTVScanResult = 
  | { success: true; data: CCTVScanData }
  | { success: false; error: string };
