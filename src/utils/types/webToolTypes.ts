
/**
 * Web-related tool types for OSINT tools
 */

export interface WebCheckParams {
  domain: string;
  checks?: string[];
}

export interface WebHackParams {
  target: string;
  mode?: string;
  url?: string;
  scanType?: string;
  findVulnerabilities?: boolean;
  checkHeaders?: boolean;
  testXss?: boolean;
  testSql?: boolean;
}

export interface TorBotParams {
  url: string;
  level?: number;
  dumpData?: boolean;
  mode?: string;
  depth?: number;
}

export interface BackHackParams {
  url: string;
  extractData?: boolean;
  target?: string;
  scanType?: string;
}
