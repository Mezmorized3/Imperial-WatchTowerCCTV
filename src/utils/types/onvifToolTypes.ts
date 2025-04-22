
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
  detectionType: 'object' | 'face' | 'scene';
  confidence?: number;
  interval?: number;
  returnImage?: boolean;
  saveDetections?: boolean;
}

export interface FaceRecognitionParams {
  image: string | File;
  knownFaces?: boolean;
  detectAge?: boolean;
  detectGender?: boolean;
  detectEmotion?: boolean;
  minConfidence?: number;
}

export interface RtspServerParams {
  listenIp?: string;
  listenPort?: number;
  sourcePath?: string;
  recordPath?: string;
  credentials?: {
    username: string;
    password: string;
  };
  proxy?: boolean;
  enableTls?: boolean;
}

export interface ZoneMinderParams {
  action: 'monitor' | 'event' | 'frame' | 'status';
  monitorId?: number;
  eventId?: number;
  frameId?: number;
  enableRecording?: boolean;
  streamType?: 'jpeg' | 'mjpeg' | 'h264';
}

export interface NmapONVIFParams {
  target: string;
  ports?: string;
  timing?: number; // 0-5, where 5 is the most aggressive
  timeout?: number;
  saveResults?: boolean;
}

export interface OpenCVParams {
  source: string;
  operation: 'detect_faces' | 'detect_objects' | 'motion_detection' | 'text_recognition';
  confidence?: number;
  showProcessing?: boolean;
  saveResults?: boolean;
  outputFile?: string;
}
