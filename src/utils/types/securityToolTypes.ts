
import { BaseToolParams } from './osintToolTypes';

export interface ShieldAIParams extends BaseToolParams {
  targetSystem: string; // e.g., IP, hostname, or system ID
  scanType: 'vulnerability' | 'compliance' | 'threat_detection';
  policyFile?: string; // Path to compliance policy
}
export interface ShieldAIData {
  scanId: string;
  status: 'running' | 'completed' | 'failed';
  summary?: string;
  vulnerabilities?: any[]; // Define more specifically
  complianceReport?: any; // Define more specifically
  threatsDetected?: any[]; // Define more specifically
}

export interface SecurityAdminParams extends BaseToolParams {
  target: string;
  action: 'check' | 'patch' | 'report';
  scope?: 'system' | 'network' | 'application';
  level?: 'basic' | 'advanced';
  timeout?: number;
}

export interface SecurityAdminData {
    status: string;
    message: string;
    reportUrl?: string;
    patchedItems?: string[];
}

