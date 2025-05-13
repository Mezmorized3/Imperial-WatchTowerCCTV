
export interface RtspBruteOptions {
  targets: string[];
  userlist: string[];
  passlist: string[];
  workers: number;
  timeout: number;
  useTor?: boolean;
  bypassTechniques?: boolean;
  stealthMode?: boolean;
  smartCredentials?: boolean;
  vendor?: string;
}

export interface RtspCredential {
  ip: string;
  port?: number;
  username?: string;
  password?: string;
  url?: string;
  valid: boolean;
}
