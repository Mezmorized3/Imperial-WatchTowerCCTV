
import { BaseToolParams, HackingToolResult } from './osintToolTypes';

export interface ScapyParams extends BaseToolParams {
  target: string;
  packetType: 'TCP' | 'UDP' | 'ICMP';
  count?: number;
}
export interface ScapyData {
  summary: string;
  packetsSent: number;
  packetsReceived: number;
}

export interface ZMapParams extends BaseToolParams {
  targetSubnet: string;
  port: number;
  rate?: number;
  outputFile?: string;
}
export interface ZMapData {
  hostsFound: number;
  scanDuration: number;
}

export interface ZGrabParams extends BaseToolParams {
  ip: string;
  port: number;
  protocol: 'http' | 'tls' | 'ssh'; // Example protocols
}
export interface ZGrabData {
  ip: string;
  port: number;
  protocol: string;
  banner?: string;
  tlsLog?: any; // Specific structure for TLS data
}


export interface MasscanParams extends BaseToolParams {
  targets: string; // e.g., "10.0.0.0/8" or "192.168.1.1-192.168.1.255"
  ports: string; // e.g., "80,443" or "0-65535"
  rate?: number;
  outputFile?: string;
}
export interface MasscanData {
  openPorts: { ip: string; port: number; proto: string; status: string; reason: string; ttl: number; banner?: string }[];
}

export interface HydraParams extends BaseToolParams {
  target: string;
  service: string; // e.g., "ftp", "ssh", "http-post-form"
  username?: string;
  password?: string;
  userList?: string;
  passList?: string;
  options?: string; // Additional Hydra options
}
export interface HydraData {
  foundCredentials: { host: string; port: number; service: string; login: string; pass: string }[];
}

// For advancedOnvifTools.ts
export interface GSoapParams extends BaseToolParams {
  endpoint: string;
  operation: string; // Added missing property
  requestXml: string;
}
export interface GSoapData {
  responseXml: string;
}

export interface GstRTSPServerParams extends BaseToolParams {
  listenIp?: string;    // Added
  listenPort?: number;  // Added
  pipeline: string;     // Added
  mountPoint: string;
}
export interface GstRTSPServerData {
  serverUrl: string;
  status: string;
}

export interface GortsplibParams extends BaseToolParams {
  sourceUrl: string;
  destinationUrl?: string;
  protocol?: 'udp' | 'tcp'; // Added
  action: 'proxy' | 'record' | 'publish';
}
export interface GortsplibData {
  status: string;
  message: string;
}

export interface RtspSimpleServerParams extends BaseToolParams {
  configPath?: string;
  apiEndpoint?: string;
}
export interface RtspSimpleServerData {
  paths: any[];
  sessions: any[];
}

export interface SenseCamDiscoParams extends BaseToolParams {
  targetRange: string;
  outputFile?: string;
}
export interface SenseCamDiscoData {
  discoveredCameras: any[]; // Define more specifically if possible
}

// For onvifFuzzerTools.ts
export interface ONVIFFuzzerParams extends BaseToolParams {
  target: string;
  port?: number;
  fuzzType: 'discovery' | 'ptz' | 'media';
  intensity?: 'low' | 'medium' | 'high';
}
export interface ONVIFFuzzerData {
  vulnerabilitiesFound: { type: string; description: string; severity: string }[];
  log: string;
}

// Shared ONVIFScanParams
export interface ONVIFScanParams extends BaseToolParams {
  target: string; // Can be IP, range, or subnet
  port?: number;
  timeout?: number;
  credentials?: { user: string; pass: string }[];
  subnet?: string; // Added missing property
}

export interface ONVIFDevice {
  ip: string;
  port: number;
  xaddrs: string[];
  scopes: string[];
  types: string[];
  manufacturer?: string;
  model?: string;
  firmwareVersion?: string;
  serialNumber?: string;
  hardwareId?: string;
}
export interface ONVIFScanData {
  devices: ONVIFDevice[];
}

