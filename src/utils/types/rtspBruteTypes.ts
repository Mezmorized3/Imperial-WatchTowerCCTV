
export interface RtspBruteParams {
  targets: string | string[];
  userlist?: string[];
  passlist?: string[];
  workers?: number;
  timeout?: number;
  output?: string;
  proxy?: string;
  useragent?: string;
  target?: string; // For compatibility
}

export interface RtspCredential {
  username: string;
  password: string;
  found: boolean;
  streamUrl?: string;
}

export interface RtspBruteResult {
  success: boolean;
  credentials?: RtspCredential[];
  errors?: string[];
  message?: string;
}
