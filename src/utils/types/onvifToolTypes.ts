
import { BaseToolParams, HackingToolResult } from './osintToolTypes';

// Re-exporting from networkToolTypes for ONVIF context if they are used directly by onvif tools
export * from './networkToolTypes'; // This will bring MasscanParams, HydraParams etc. if they are here

// Specific ONVIF tool types if they differ or extend base types
export interface MotionParams extends BaseToolParams {
  configFile?: string;
  daemon?: boolean;
  logLevel?: number;
}
export interface MotionData {
  status: string;
  detectedEvents: number;
}

export interface MotionEyeParams extends BaseToolParams {
  action: 'add_camera' | 'list_cameras' | 'start_server';
  cameraUrl?: string;
  cameraName?: string;
}
export interface MotionEyeData {
  cameras?: any[];
  serverStatus?: string;
}

export interface DeepstackParams extends BaseToolParams {
  imagePath: string;
  mode: 'object' | 'face' | 'scene';
  apiKey?: string;
  port?: number;
}
export interface DeepstackData {
  predictions: any[]; // Structure depends on the mode
}

export interface FaceRecognitionParams extends BaseToolParams {
  knownFacesDir: string;
  imageToCheck: string;
  tolerance?: number;
}
export interface FaceRecognitionData {
  matches: { name: string; distance: number }[];
}

export interface RtspServerParams extends BaseToolParams { // Distinct from RtspSimpleServerParams
  source: string; // e.g., webcam, video file
  streamName: string;
}
export interface RtspServerData {
  streamUrl: string;
}

export interface ZoneMinderParams extends BaseToolParams {
  action: 'get_monitors' | 'get_events';
  monitorId?: number;
  startTime?: string; // ISO date
  endTime?: string;   // ISO date
}
export interface ZoneMinderData {
  monitors?: any[];
  events?: any[];
}

export interface NmapONVIFParams extends BaseToolParams {
  target: string; // IP or range
  scriptArgs?: string; // e.g., "onvif.user=admin,onvif.pass=admin123"
}
export interface NmapONVIFData {
  rawOutput: string;
  discoveredDevices?: { ip: string; port: number; services: any[] }[];
}

export interface OpenCVParams extends BaseToolParams {
  imagePath: string;
  operation: 'edge_detection' | 'face_detection' | 'object_tracking_init'; // etc.
  videoSource?: string; // for tracking
}
export interface OpenCVData {
  resultImage?: string; // Base64 encoded or path
  detectedObjects?: any[];
}
