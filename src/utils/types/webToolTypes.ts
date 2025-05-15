import { BaseToolParams } from './osintToolTypes';

export interface WebCheckParams extends BaseToolParams {
  url: string;
  scanType?: 'basic' | 'full' | 'security';
  screenshot?: boolean;
  saveResults?: boolean;
  timeout?: number;
}

export interface WebCheckData {
  url: string;
  status: number;
  title?: string;
  technologies?: string[];
  headers?: Record<string, string>;
}

export interface WebCheckResult {
  url: string;
  security: {
    score: number;
    issues: {
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      recommendation: string;
    }[];
  };
  performance: {
    score: number;
    metrics: {
      name: string;
      value: number;
      unit: string;
    }[];
  };
  technologies: {
    name: string;
    version?: string;
    category: string;
  }[];
  seo: {
    score: number;
    issues: {
      severity: 'low' | 'medium';
      description: string;
      recommendation: string;
    }[];
  };
  message?: string;
}

export interface WebhackParams extends BaseToolParams {
  url: string;
  scanType: 'basic' | 'full' | 'xss' | 'sqli';
  timeout?: number;
  checkVulnerabilities?: boolean;
  checkSubdomains?: boolean;
}

export interface WebhackData {
  vulnerabilities: { name: string; severity: string; cwe: string }[];
  subdomains?: string[];
}

export interface WebhackResult {
  url: string;
  vulnerabilities: {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    evidence?: string;
    recommendation?: string;
  }[];
  message?: string;
}

export interface BackHackParams extends BaseToolParams {
  target: string;
  mode: 'info_gathering' | 'vulnerability_scan' | 'exploit_attempt';
  modules?: string[];
}

export interface BackHackData {
  findings: any[];
  log: string;
}

export interface BackHackResult {
  url: string;
  findings: {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    details?: string;
  }[];
  message?: string;
}

export interface PhotonParams extends BaseToolParams {
  url: string;
  depth?: number;
  timeout?: number;
  threads?: number;
  delay?: number;
  userAgent?: string;
  saveResults?: boolean;
  extract?: ('links' | 'emails' | 'files' | 'subdomains')[];
}

export interface PhotonData {
  links?: string[];
  emails?: string[];
  files?: string[];
  subdomains?: string[];
  intel?: any;
}

export interface TorBotParams extends BaseToolParams {
  query: string;
  searchEngine?: 'ahmia' | 'duckduckgo_onion';
  pages?: number;
}

export interface TorBotData {
  results: { title: string; url: string; description?: string }[];
}

export interface UsernameSearchParams {
  username: string;
  options?: {
    timeout?: number;
    platforms?: string[];
    save_json?: boolean;
    save_csv?: boolean;
  };
}

export interface UsernameSearchResult {
  username: string;
  found: {
    platform: string;
    url: string;
    exists: boolean;
    notes?: string;
  }[];
  message?: string;
}

export interface TwintParams {
  query: string;
  options?: {
    limit?: number;
    since?: string;
    until?: string;
    geocode?: string;
    near?: string;
    filter?: string;
    save_json?: boolean;
    save_csv?: boolean;
  };
}

export interface TwintResult {
  query: string;
  tweets: {
    id: string;
    date: string;
    username: string;
    text: string;
    hashtags: string[];
    mentions: string[];
    replies: number;
    retweets: number;
    likes: number;
    link?: string;
  }[];
  message?: string;
}

export interface OSINTParams {
  target: string;
  options?: {
    mode?: 'domain' | 'email' | 'username' | 'phone' | 'ip';
    timeout?: number;
    save_json?: boolean;
  };
}

export interface OSINTResult {
  target: string;
  findings: {
    source: string;
    type: string;
    data: any;
  }[];
  message?: string;
}
