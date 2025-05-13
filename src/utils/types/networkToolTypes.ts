
/**
 * Type definitions for ONVIF and network scanning tools
 */

export interface ONVIFScanParams {
  subnet: string;
  timeout?: number;
  credentials?: {
    username: string;
    password: string;
  };
  saveResults?: boolean;
  scanMode?: 'quick' | 'deep' | 'stealth';
  interface?: string;
  bruteforce?: boolean;
}

export interface ONVIFDevice {
  id: string;
  ip: string;
  port: number;
  manufacturer?: string;
  model?: string;
  firmwareVersion?: string;
  serialNumber?: string;
  hardwareId?: string;
  onvifVersion?: string;
  mediaProfiles?: ONVIFMediaProfile[];
  ptzCapabilities?: boolean;
  audioCapabilities?: boolean;
  snapshotUri?: string;
  streamUri?: string;
}

export interface ONVIFMediaProfile {
  name: string;
  token: string;
  videoSourceToken?: string;
  videoEncoderToken?: string;
  streamUri?: string;
  snapshotUri?: string;
  resolution?: {
    width: number;
    height: number;
  };
  framerate?: number;
  bitrate?: number;
  encoding?: string;
}

export interface MasscanParams {
  target: string;
  ports: string;
  rate?: number;
  timeout?: number;
  aggressive?: boolean;
  saveResults?: boolean;
}

export interface ZGrabParams {
  target: string;
  port?: number;
  protocol?: 'http' | 'https' | 'rtsp';
  saveResults?: boolean;
}

export interface HydraParams {
  target: string;
  service: 'http-get' | 'rtsp' | 'ftp' | 'telnet' | 'ssh';
  userList?: string[];
  passList?: string[];
  threads?: number;
  timeout?: number;
  saveResults?: boolean;
}

export interface MotionParams {
  streamUrl: string;
  threshold?: number;
  detectMotion?: boolean;
  saveFrames?: boolean;
  recordOnMotion?: boolean;
  notifyOnMotion?: boolean;
  outputPath?: string;
}

export interface MotionEyeParams {
  cameraId?: string;
  streamUrl?: string;
  resolution?: string;
  framerate?: number;
  recordingMode?: 'motion' | 'continuous' | 'manual';
  retentionDays?: number;
}

export interface DeepstackParams {
  streamUrl: string;
  detectionType?: 'object' | 'face' | 'scene';
  confidence?: number;
  interval?: number;
  returnImage?: boolean;
}

export interface FaceRecognitionParams {
  image: string;
  knownFaces?: boolean;
  detectAge?: boolean;
  detectGender?: boolean;
  detectEmotion?: boolean;
  minConfidence?: number;
}

export interface GSoapParams {
  target: string;
  operation: string;
  timeout?: number;
}

export interface GstRTSPServerParams {
  listenIp: string;
  listenPort: number;
  pipeline?: string;
  credentials?: {
    username: string;
    password: string;
  };
}

export interface GortsplibParams {
  url: string;
  output?: string;
  protocol?: 'tcp' | 'udp';
  timeout?: number;
}

export interface RtspSimpleServerParams {
  listenIp?: string;
  listenPort?: number;
  rtmpEnabled?: boolean;
  hlsEnabled?: boolean;
  paths?: {
    name: string;
    source: string;
    credentials?: {
      username: string;
      password: string;
    };
  }[];
}

export interface SenseCamDiscoParams {
  timeout?: number;
  interface?: string;
  scanMode?: 'quick' | 'deep';
  protocols?: ('onvif' | 'upnp' | 'mdns' | 'ssdp')[];
}

export interface BotExploitsParams {
  target: string;
  botType: 'telegram' | 'discord' | 'slack' | 'any';
  scanType: 'keys' | 'tokens' | 'all';
  timeout?: number;
}

export interface WebHackParams {
  url: string;
  scanType: 'basic' | 'full';
  timeout: number;
  checkVulnerabilities: boolean;
  checkSubdomains: boolean;
  userAgent?: string;
  saveResults: boolean;
  target?: string; // Added for backward compatibility
  method?: string; // Added for backward compatibility
}

// Adding missing types
export interface PhotonParams {
  url: string;
  depth?: number;
  timeout?: number;
  threads?: number;
  delay?: number;
  userAgent?: string;
  saveResults?: boolean;
}

export interface ONVIFFuzzerParams {
  target: string;
  port?: number;
  timeout?: number;
  protocol?: 'soap' | 'http';
  method?: string;
  payloadSize?: number;
  iterations?: number;
}
