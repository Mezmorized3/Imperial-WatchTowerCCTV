
export interface NetworkScanParams {
  target: string;
  ports?: number[] | string;
  timeout?: number;
  scan_type?: string;
  options?: any;
}

export interface GstRTSPServerParams {
  port: number;
  stream_name: string;
  source: string;
}

export interface GSoapParams {
  target: string;
  port: number;
  options?: any;
}

export interface GortsplibParams {
  url: string;
  options?: any;
}

export interface ZMapParams {
  target: string;
  bandwidth?: string;
  probe_module?: string;
  output_fields?: string[];
  blacklist_file?: string;
  whitelist_file?: string;
}

export interface MasscanParams {
  target: string;
  ports: string;
  rate?: number;
  adapter?: string;
  wait?: number;
  http_user_agent?: string;
}

export interface ZGrabParams {
  target: string;
  port: number;
  protocol?: string;
  timeout?: number;
  tls?: boolean;
}

export interface ScapyParams {
  target: string;
  command: string;
  options?: any;
}

export interface HydraParams {
  target: string;
  service: string;
  usernames: string[];
  passwords: string[];
  options?: {
    tasks?: number;
    timeout?: number;
    attempts?: number;
  };
}
