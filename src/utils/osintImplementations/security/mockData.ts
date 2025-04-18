
import { SecurityFinding, SecurityPatch } from './types';

export const generateMockFindings = (scope: string): SecurityFinding[] => {
  const findings: SecurityFinding[] = [];
  
  if (scope === 'system' || scope === 'network') {
    findings.push({
      id: 'SEC-001',
      type: 'vulnerability',
      severity: 'high',
      description: 'Outdated firmware with known vulnerabilities',
      recommendation: 'Update firmware to latest version',
      cve: 'CVE-2023-1234'
    });
    
    findings.push({
      id: 'SEC-002',
      type: 'configuration',
      severity: 'medium',
      description: 'Default credentials still in use',
      recommendation: 'Change default credentials',
      impact: 'Unauthorized access to system'
    });
  }
  
  if (scope === 'network') {
    findings.push({
      id: 'SEC-003',
      type: 'exposure',
      severity: 'high',
      description: 'Unnecessary ports exposed to the internet',
      recommendation: 'Close unused ports and implement firewall rules',
      impact: 'Increased attack surface'
    });
  }
  
  if (scope === 'application') {
    findings.push({
      id: 'SEC-004',
      type: 'vulnerability',
      severity: 'critical',
      description: 'SQL Injection vulnerability in login form',
      recommendation: 'Implement proper input validation and parameterized queries',
      impact: 'Data breach and unauthorized access',
      cve: 'CVE-2023-5678'
    });
  }
  
  return findings;
};

export const generateMockPatches = (scope: string): SecurityPatch[] => {
  const patches: SecurityPatch[] = [];
  
  if (scope === 'system') {
    patches.push({
      id: 'PATCH-001',
      name: 'Firmware Security Update',
      status: 'success',
      description: 'Applied latest security patches to firmware'
    });
    
    patches.push({
      id: 'PATCH-002',
      name: 'Default Credential Remediation',
      status: Math.random() > 0.3 ? 'success' : 'failed',
      description: 'Attempted to change default credentials'
    });
  }
  
  if (scope === 'network') {
    patches.push({
      id: 'PATCH-003',
      name: 'Firewall Rules Update',
      status: 'success',
      description: 'Applied restrictive firewall rules'
    });
  }
  
  if (scope === 'application') {
    patches.push({
      id: 'PATCH-004',
      name: 'SQL Injection Fix',
      status: Math.random() > 0.2 ? 'success' : 'failed',
      description: 'Applied patch for SQL injection vulnerability'
    });
  }
  
  return patches;
};
