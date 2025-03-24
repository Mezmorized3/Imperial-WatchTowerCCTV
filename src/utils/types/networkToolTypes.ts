
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
  level?: string; // Added for compatibility
  dumpData?: boolean; // Added for compatibility
  mode?: string; // Added for compatibility
}

export interface BotExploitsParams {
  target: string;
  botType: 'telegram' | 'discord' | 'slack' | 'any';
  scanType?: 'keys' | 'tokens' | 'all';
  timeout?: number;
  saveResults?: boolean;
  // Add missing properties used in code
  port?: number;
  attackType?: string;
}

export interface ChromeExtensionParams {
  extensionId: string;
  analyzePermissions?: boolean;
  downloadSource?: boolean;
  checkVulnerabilities?: boolean;
}

export interface ImperialOculusParams {
  target: string;
  scanType: 'full' | 'quick' | 'stealth' | 'basic'; // Added 'basic' to match usage
  saveResults?: boolean;
  timeout?: number;
}
