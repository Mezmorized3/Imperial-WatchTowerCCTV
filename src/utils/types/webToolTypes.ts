
export interface PhotonParams {
  url: string;
  depth?: number;
  timeout?: number;
  threads?: number;
  delay?: number;
  userAgent?: string;
  saveResults?: boolean;
}

export interface WebHackParams {
  url: string;
  scanType: 'basic' | 'full';
  timeout: number;
  checkVulnerabilities: boolean;
  checkSubdomains: boolean;
  userAgent?: string;
  saveResults: boolean;
  target?: string;
  method?: string;
}
