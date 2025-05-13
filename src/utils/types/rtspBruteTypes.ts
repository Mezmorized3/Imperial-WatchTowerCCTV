
export interface RtspCredential {
  ip: string;
  port: number;
  username: string;
  password: string;
  manufacturer?: string;
  model?: string;
  firmware?: string;
}

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

export interface RtspBruteResult {
  success: boolean;
  found: RtspCredential[];
  scanDetails: {
    targetsScanned: number;
    credentialsAttempted: number;
    timeElapsed: string;
  };
}
