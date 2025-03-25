
/**
 * Network tools type definitions
 */

export interface TorBotParams {
  url: string;
  level?: number;
  depth?: number;
  timeout?: number | string;
  dumpData?: boolean;
  savePath?: string;
  mode?: string; // Add mode parameter
}

export interface BotExploitsParams {
  target: string;
  port?: number;
  botType?: string;
  scanType?: string;
  attackType?: string;
  timeout?: number; // Add timeout parameter
}

export interface ImperialOculusParams {
  target: string;
  scanType?: string;
  ports?: string;
  timeout?: number;
  scanTechniques?: string[];
  outputFormat?: string;
  saveResults?: boolean; // Add saveResults parameter
}

export interface NetworkScanParams {
  target: string;
  ports?: string;
  scanType?: string;
  timeout?: number;
  techniques?: string[];
  outputFormat?: string;
}

export interface ChromeExtensionParams {
  extensionId: string;
  checkPermissions?: boolean;
  checkReviews?: boolean;
  checkCode?: boolean;
}

export interface PhotonParams {
  url: string;
  depth?: number;
  timeout?: number;
  threads?: number;
  delay?: number;
  userAgent?: string;
  saveResults?: boolean;
  outputFormat?: 'json' | 'text' | 'html';
}
