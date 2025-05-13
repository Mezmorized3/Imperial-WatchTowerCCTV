
export interface WebCheckParams {
  url: string;
  scanType?: 'basic' | 'full';
  timeout?: number;
  userAgent?: string;
}

export interface WebCheckResult {
  success: boolean;
  error?: string;
  data?: {
    url: string;
    status: number;
    title?: string;
    description?: string;
    technologies?: string[];
    headers?: Record<string, string>;
    screenshot?: string;
    links?: string[];
    timestamp: string;
  };
}

export interface WebHackParams {
  url: string;
  scanType: 'basic' | 'full';
  timeout: number;
  checkVulnerabilities: boolean;
  checkSubdomains: boolean;
  userAgent?: string;
  saveResults: boolean;
}
