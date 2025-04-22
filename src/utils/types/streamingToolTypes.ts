
/**
 * Type definitions for streaming tools
 */

export interface StreamedianParams {
  rtspUrl: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  width?: number | string;
  height?: number | string;
  transport?: 'tcp' | 'udp';
  preserveDrawingBuffer?: boolean;
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

export interface WebRTCStreamerParams {
  rtspUrl: string;
  webrtcPort?: number;
  iceServers?: string[];
  allowedOrigins?: string[];
  videoCodec?: string;
  audioCodec?: string;
  enableTLS?: boolean;
}

export interface LiveStreamParams {
  streamUrl: string;
  streamType: 'rtsp' | 'webrtc' | 'hls' | 'websocket';
  playerType: 'streamedian' | 'jsmpeg' | 'webrtc' | 'hls' | 'auto';
  credentials?: {
    username: string;
    password: string;
  };
  transport?: 'tcp' | 'udp';
  autoplay?: boolean;
  muted?: boolean;
  onConnect?: () => void;
  onError?: (error: any) => void;
}

export interface RTSPServerParams {
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

export interface RTSPProxyParams {
  sourceUrl: string;
  targetPort?: number;
  credentials?: {
    username: string;
    password: string;
  };
  allowedIps?: string[];
  convertToHls?: boolean;
  convertToWebRtc?: boolean;
}

export interface FFmpegStreamParams {
  input: string;
  output?: string;
  inputOptions?: string[];
  outputOptions?: string[];
  format?: string;
  videoBitrate?: string;
  audioBitrate?: string;
  videoCodec?: string;
  audioCodec?: string;
  duration?: number;
  onProgress?: (progress: number) => void;
}
