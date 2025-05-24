
import { BaseToolParams } from './osintToolTypes';

export interface ShieldAIParams extends BaseToolParams {
  targetSystem: string;
  scanType: 'vulnerability' | 'compliance' | 'threat_detection';
  policyFile?: string;
}

export interface ShieldAIData {
  scanId: string;
  status: 'running' | 'completed' | 'failed';
  summary?: string;
  vulnerabilities?: any[];
  complianceReport?: any;
  threatsDetected?: any[];
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
