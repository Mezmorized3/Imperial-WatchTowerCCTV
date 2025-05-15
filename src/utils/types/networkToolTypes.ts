import { BaseToolParams, HackingToolResult } from './osintToolTypes';

export interface ScapyParams extends BaseToolParams {
  target: string;
  packetType: 'TCP' | 'UDP' | 'ICMP';
  count?: number;
  filter?: string;
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
  protocol: 'http' | 'tls' | 'ssh';
}
export interface ZGrabData {
  ip: string;
  port: number;
  protocol: string;
  banner?: string;
  tlsLog?: any;
}

export interface MasscanParams extends BaseToolParams {
  targets: string;
  ports: string;
  rate?: number;
  outputFile?: string;
}
export interface MasscanData {
  openPorts: { ip: string; port: number; proto: string; status: string; reason: string; ttl: number; banner?: string }[];
}

export interface HydraParams extends BaseToolParams {
  target: string;
  service: string;
  username?: string;
  password?: string;
  userList?: string;
  passList?: string;
  options?: string;
}
export interface HydraData {
  foundCredentials: { host: string; port: number; service: string; login: string; pass: string }[];
}

export interface GSoapParams extends BaseToolParams {
  endpoint: string;
  operation: string;
  requestXml: string;
}
export interface GSoapData {
  responseXml: string;
}

export interface GstRTSPServerParams extends BaseToolParams {
  listenIp?: string;
  listenPort?: number;
  pipeline: string;
  mountPoint: string;
}
export interface GstRTSPServerData {
  serverUrl: string;
  status: string;
}

export interface GortsplibParams extends BaseToolParams {
  sourceUrl: string;
  destinationUrl?: string;
  protocol?: 'udp' | 'tcp';
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
  discoveredCameras: any[];
}

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

export interface ONVIFScanParams extends BaseToolParams {
  target: string;
  port?: number;
  timeout?: number;
  credentials?: { user: string; pass: string }[];
  subnet?: string;
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

export interface MotionParams extends BaseToolParams {
  configFile: string;
  daemon?: boolean;
}
export interface MotionData {
  status: string;
  pid?: number;
}

export interface MotionEyeParams extends BaseToolParams {
  port?: number;
  configDir?: string;
}
export interface MotionEyeData {
  url: string;
  camerasConfigured: number;
}

export interface DeepstackParams extends BaseToolParams {
  imagePath: string;
  apiKey?: string;
  endpoint?: string;
  mode: 'detection' | 'recognition' | 'scene';
}
export interface DeepstackData {
  success: boolean;
  predictions?: any[];
  error?: string;
}

export interface FaceRecognitionParams extends BaseToolParams {
  knownImagesDir: string;
  unknownImagePath: string;
  tolerance?: number;
}
export interface FaceRecognitionData {
  matches: { name: string; distance: number }[];
}

export interface RtspServerParams extends BaseToolParams {
  source: string;
  mountPoint: string;
  port?: number;
}
export interface RtspServerData {
  serverUrl: string;
  status: string;
}

export interface ZoneMinderParams extends BaseToolParams {
  apiUrl: string;
  username?: string;
  password?: string;
  action: 'getMonitors' | 'getEvents';
  monitorId?: number;
}
export interface ZoneMinderData {
  monitors?: any[];
  events?: any[];
}

export interface NmapONVIFParams extends BaseToolParams {
  target: string;
  scriptArgs?: string;
}
export interface NmapONVIFData {
  devices: ONVIFDevice[];
}

export interface OpenCVParams extends BaseToolParams {
  imagePath: string;
  operation: 'edge_detection' | 'face_detection' | 'object_detection';
  cascadeFile?: string;
}
export interface OpenCVData {
  resultImagePath?: string;
  details?: any;
}
