
export interface ONVIFScanParams {
  target: string | string[];
  port?: number;
  username?: string;
  password?: string;
  timeout?: number;
  options?: any;
}

export interface ONVIFDeviceInfo {
  ip: string;
  port: number;
  manufacturer: string;
  model: string;
  firmwareVersion: string;
  serialNumber: string;
  mac?: string;
  profiles?: ONVIFProfile[];
}

export interface ONVIFProfile {
  name: string;
  token: string;
  videoSourceToken?: string;
  videoEncoderToken?: string;
  ptzToken?: string;
  streamUri?: string;
}

export interface ONVIFScanResult {
  devices: ONVIFDeviceInfo[];
  message?: string;
}

export interface ONVIFCredential {
  username: string;
  password: string;
}

export interface ONVIFFuzzerParams {
  target: string;
  port?: number;
  username?: string;
  password?: string;
  method?: string;
  templates?: string[];
  fuzzTypes?: string[];
  options?: any;
}

export interface ONVIFFuzzerResult {
  vulnerabilities: {
    id: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    details: any;
  }[];
  message?: string;
  rawOutput?: string;
}
