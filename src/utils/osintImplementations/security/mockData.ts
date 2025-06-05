
export const mockSecurityFindings = [
  {
    id: 'sec-001',
    type: 'vulnerability',
    severity: 'high' as const,
    description: 'Outdated firmware version detected',
    recommendation: 'Update to latest firmware version',
    impact: 'Remote code execution possible'
  },
  {
    id: 'sec-002',
    type: 'configuration',
    severity: 'medium' as const,
    description: 'Default credentials in use',
    recommendation: 'Change default passwords',
    impact: 'Unauthorized access possible'
  }
];

export const mockSecurityPatches = [
  {
    id: 'patch-001',
    name: 'Security Update KB-2023-001',
    status: 'success' as const,
    description: 'Applied critical security patch'
  }
];

export const generateMockFindings = () => mockSecurityFindings;

export const generateMockPatches = () => mockSecurityPatches;

export const mockSecurityAdminData_check = {
  status: 'completed',
  message: 'Security check completed successfully',
  reportUrl: '/reports/security-check-001.pdf'
};

export const mockSecurityAdminData_patch = {
  status: 'completed',
  message: 'Security patches applied successfully',
  patchedItems: ['CVE-2023-1234', 'CVE-2023-5678']
};

export const mockSecurityAdminData_report = {
  status: 'completed',
  message: 'Security report generated successfully',
  reportUrl: '/reports/security-report-001.pdf'
};

export const mockShieldAIData_scan = {
  scanId: 'ai-scan-001',
  status: 'completed' as const,
  summary: 'AI security scan completed with 2 vulnerabilities found',
  vulnerabilities: mockSecurityFindings,
  threatsDetected: [
    {
      id: 'threat-001',
      type: 'malware',
      severity: 'high',
      description: 'Suspicious network activity detected'
    }
  ]
};
