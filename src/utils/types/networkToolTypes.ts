
/**
 * Network-related tool types for OSINT tools
 */

export interface BotExploitsParams {
  target: string;
  port?: number;
  attackType?: string;
  scanType?: string;
  timeout?: number;
}

export interface ImperialOculusParams {
  target: string;
  ports?: string;
  scanType?: string;
}

export interface ImperialShieldParams {
  target: string;
  mode: string;
  targetUrl?: string;
  protocol?: string;
  validateCert?: boolean;
  options?: Record<string, any>;
}

export interface ImperialShieldResult {
  data: {
    vulnerabilities: any[];
    score: number;
    recommendations: string[];
    message?: string;
    timestamp?: string;
    protocol?: string;
    target?: string;
  };
  shieldStatus: 'active' | 'inactive' | 'breached';
  securityRating: number;
  responseTime?: number;
  success: boolean;
  error?: string;
  simulatedData?: boolean;
}
