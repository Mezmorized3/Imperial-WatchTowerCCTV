import { BaseToolParams } from './osintToolTypes';

export interface WebCheckParams extends BaseToolParams {
  url: string;
  options?: {
    checkSecurity?: boolean;
    checkPerformance?: boolean;
    checkSEO?: boolean;
    checkTechnologies?: boolean;
  };
}

export interface WebCheckData {
  status: number;
  title?: string;
  headers?: Record<string, string>;
  technologies?: string[];
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
  options?: {
    checkXSS?: boolean;
    checkSQLi?: boolean;
    checkCSRF?: boolean;
    checkClickjacking?: boolean;
  };
}

export interface WebhackData {
  vulnerable?: boolean;
  details?: string;
  response?: any;
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
  url: string;
  options?: {
    target?: string;
    scanType?: 'basic' | 'full';
    timeout?: number;
  };
}

export interface BackHackData {
  adminPanels?: string[];
  backupFiles?: string[];
  configFiles?: string[];
  vulnerabilities?: Array<{
    type: string;
    url: string;
    parameter?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  message?: string;
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
}

export interface PhotonData {
  links?: string[];
  emails?: string[];
  subdomains?: string[];
  files?: string[];
  intel?: any;
  js_files?: string[];
  robots?: string[];
}

export interface TorBotParams extends BaseToolParams {
  query: string;
  pages?: number;
}

export interface TorBotData {
  onionLinks?: string[];
  relatedInfo?: any;
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
