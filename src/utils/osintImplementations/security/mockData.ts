
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
