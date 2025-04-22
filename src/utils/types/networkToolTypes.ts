
/**
 * Network tools type definitions
 */

export interface TorBotParams {
  url: string;
  level?: number;
  depth?: number;
  timeout?: number | string;
  dumpData?: boolean;
  savePath?: string;
  mode?: string;
}

export interface BotExploitsParams {
  target: string;
  port?: number;
  botType?: string;
  scanType?: string;
  attackType?: string;
  timeout?: number;
}

export interface ImperialOculusParams {
  target: string;
  scanType?: string;
  ports?: string;
  timeout?: number;
  scanTechniques?: string[];
  outputFormat?: string;
  saveResults?: boolean;
}

export interface NetworkScanParams {
  target: string;
  ports?: string;
  scanType?: string;
  timeout?: number;
  techniques?: string[];
  outputFormat?: string;
}

export interface ChromeExtensionParams {
  extensionId: string;
  checkPermissions?: boolean;
  checkReviews?: boolean;
  checkCode?: boolean;
}

export interface PhotonParams {
  url: string;
  depth?: number;
  timeout?: number;
  threads?: number;
  delay?: number;
  userAgent?: string;
  saveResults?: boolean;
  outputFormat?: 'json' | 'text' | 'html';
}

// Add new interfaces for network scanning tools
export interface ZMapParams {
  target: string;
  port?: number | number[];
  bandwidth?: string;
  timeout?: number;
  saveResults?: boolean;
  outputFormat?: string;
}

export interface EasySNMPParams {
  target: string;
  community?: string;
  version?: '1' | '2c' | '3';
  oids?: string[];
  credentials?: {
    username: string;
    password?: string;
    privPassword?: string;
    authProtocol?: string;
    privProtocol?: string;
  };
  timeout?: number;
}

export interface ScapyParams {
  target: string;
  packetType?: 'tcp' | 'udp' | 'icmp' | 'arp' | 'custom';
  payload?: string;
  count?: number;
  timeout?: number;
  interface?: string;
  saveResults?: boolean;
}

export interface MitmProxyParams {
  listenPort?: number;
  mode?: 'regular' | 'transparent' | 'socks5' | 'reverse';
  targetHost?: string;
  targetPort?: number;
  sslInsecure?: boolean;
  dumpTraffic?: boolean;
  filterExpr?: string;
  scripts?: string[];
}

export interface StreamedianParams {
  rtspUrl: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  width?: number | string;
  height?: number | string;
  transport?: 'tcp' | 'udp';
}

export interface JSMpegParams {
  wsUrl: string;
  canvas?: HTMLCanvasElement | string;
  audio?: boolean;
  video?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  preserveDrawingBuffer?: boolean;
  progressive?: boolean;
}

export interface WebRTCParams {
  rtspUrl: string;
  webrtcUrl?: string;
  iceServers?: RTCIceServer[];
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export interface AgentDVRParams {
  action: 'start' | 'stop' | 'add-camera' | 'remove-camera' | 'get-settings' | 'discover';
  cameraParams?: {
    url: string;
    name?: string;
    type?: string;
    motionDetection?: boolean;
    recordingSettings?: any;
  };
  configPath?: string;
  target?: string;
  scanRange?: string;
  username?: string;
  password?: string;
  cameraUrl?: string;
  cameraName?: string;
  motionDetection?: boolean;
}

export interface MetasploitParams {
  target: string;
  module: string;
  options?: Record<string, string>;
  payload?: string;
  payloadOptions?: Record<string, string>;
  exploitMode?: 'check' | 'run';
  timeout?: number;
  checkMode?: boolean;
}

export interface LiveStreamParams {
  streamUrl: string;
  streamType: 'rtsp' | 'websocket' | 'webrtc' | 'hls' | 'dash';
  playerType: 'auto' | 'streamedian' | 'jsmpeg' | 'webrtc' | 'hls';
  autoplay?: boolean;
  muted?: boolean;
  transport?: 'tcp' | 'udp';
}

export interface ONVIFFuzzerParams {
  target: string;
  port?: number;
  username?: string;
  password?: string;
  timeout?: number;
  testType?: 'all' | 'command-injection' | 'overflow' | 'xml-entity' | 'auth-bypass';
  iterations?: number;
}

// New types for the added tools
export interface GSoapParams {
  target: string;
  operation: string;
  requestXml?: string;
  timeout?: number;
  saveResponse?: boolean;
}

export interface GstRTSPServerParams {
  listenPort?: number;
  mediaPath?: string;
  auth?: boolean;
  credentials?: {
    username: string;
    password: string;
  };
  enableTls?: boolean;
  logLevel?: 'error' | 'warning' | 'info' | 'debug';
}

export interface GortsplibParams {
  mode: 'client' | 'server';
  url?: string;
  listenPort?: number;
  enableRtcp?: boolean;
  protocols?: ('udp' | 'tcp')[];
  credentials?: {
    username: string;
    password: string;
  };
}

export interface RtspSimpleServerParams {
  listenIp?: string;
  listenPort?: number;
  sourcePath?: string;
  credentials?: {
    username: string;
    password: string;
  };
  enableTls?: boolean;
  enableProxy?: boolean;
  rtmpEnabled?: boolean;
  hlsEnabled?: boolean;
}

export interface SenseCamDiscoveryParams {
  subnet: string;
  timeout?: number;
  saveResults?: boolean;
  scanMode?: 'quick' | 'deep';
}

export interface OrebroONVIFScannerParams {
  subnet: string;
  scanMode?: 'quick' | 'deep' | 'complete';
  deepScan?: boolean;
  timeout?: number;
  username?: string;
  password?: string;
}

export interface ONVIFCliParams {
  target: string;
  command: string;
  username?: string;
  password?: string;
  timeout?: number;
}

export interface NodeONVIFParams {
  target: string;
  operation?: string;
  username?: string;
  password?: string;
  timeout?: number;
  deepScan?: boolean;
}

export interface PyONVIFParams {
  target: string;
  operation?: string;
  username?: string;
  password?: string;
  timeout?: number;
  deepScan?: boolean;
}

export interface PythonONVIFZeepParams {
  target: string;
  operation?: string;
  username?: string;
  password?: string;
  timeout?: number;
  deepScan?: boolean;
}

export interface ONVIFScoutParams {
  subnet: string;
  scanMode?: 'quick' | 'deep' | 'complete';
  deepScan?: boolean;
  timeout?: number;
  username?: string;
  password?: string;
}

export interface PythonWSDiscoveryParams {
  timeout?: number;
  types?: string[];
  scope?: string;
  saveResults?: boolean;
}

export interface ValkkaONVIFParams {
  target: string;
  operation?: string;
  username?: string;
  password?: string;
  timeout?: number;
}

export interface FoscamExploitParams {
  target: string;
  port?: number;
  exploit?: string;
  username?: string;
  password?: string;
  timeout?: number;
}
