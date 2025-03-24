
/**
 * Network tool types
 */

export interface NetworkScanParams {
  target: string;
  ports?: string;
  timeout?: number;
  scanType?: 'tcp' | 'udp' | 'all';
  concurrency?: number;
  saveResults?: boolean;
}

export interface TorBotParams {
  url: string;
  depth?: number;
  timeout?: number;
  saveResults?: boolean;
  excludePattern?: string;
  includePattern?: string;
}

export interface BotExploitsParams {
  target: string;
  botType: 'telegram' | 'discord' | 'slack' | 'any';
  scanType?: 'keys' | 'tokens' | 'all';
  timeout?: number;
  saveResults?: boolean;
}

export interface ChromeExtensionParams {
  extensionId: string;
  analyzePermissions?: boolean;
  downloadSource?: boolean;
  checkVulnerabilities?: boolean;
}

export interface ImperialOculusParams {
  target: string;
  scanType: 'full' | 'quick' | 'stealth';
  saveResults?: boolean;
  timeout?: number;
}
