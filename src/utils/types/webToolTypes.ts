
export interface WebCheckParams {
  url: string;
  options?: {
    checkSecurity?: boolean;
    checkPerformance?: boolean;
    checkSEO?: boolean;
    checkTechnologies?: boolean;
  };
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
      severity: 'low' | 'medium' | 'high';
      description: string;
      recommendation: string;
    }[];
  };
  message?: string;
}

export interface WebhackParams {
  url: string;
  options?: {
    checkXSS?: boolean;
    checkSQLi?: boolean;
    checkCSRF?: boolean;
    checkClickjacking?: boolean;
  };
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

export interface BackHackParams {
  url: string;
  options?: any;
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

export interface PhotonParams {
  url: string;
  options?: {
    threads?: number;
    timeout?: number;
    delay?: number;
    cookies?: string;
    user_agent?: string;
    exclude?: string[];
  };
}

export interface PhotonResult {
  url: string;
  urls: string[];
  emails: string[];
  social: {
    platform: string;
    url: string;
  }[];
  files: {
    type: string;
    url: string;
  }[];
  message?: string;
}

export interface TorBotParams {
  url: string;
  options?: {
    mode?: 'standard' | 'deep' | 'destructive';
    verbose?: boolean;
    savefile?: string;
  };
}

export interface TorBotResult {
  url: string;
  onions: string[];
  emails: string[];
  bitcoin_addresses: string[];
  message?: string;
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
