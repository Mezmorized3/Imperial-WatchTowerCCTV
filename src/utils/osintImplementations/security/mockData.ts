
import { SecurityAdminData, ShieldAIData } from '@/utils/types/securityToolTypes';

export const mockSecurityAdminData: Record<SecurityAdminParams['action'], SecurityAdminData> = {
  check: {
    status: "checked",
    message: "System check complete. No critical vulnerabilities found.",
  },
  patch: {
    status: "patched",
    message: "Critical vulnerabilities patched successfully.",
    patchedItems: ["CVE-2023-1234", "CVE-2023-5678"],
  },
  report: {
    status: "success", // Assuming 'success' for report generation
    message: "Security report generated.",
    reportUrl: "/reports/security_report_latest.pdf",
  },
};

export const mockShieldAIData: ShieldAIData = {
  scanId: "mock-shield-scan-001",
  status: "completed",
  summary: "ShieldAI mock scan found 2 medium vulnerabilities.",
  vulnerabilities: [
    { id: "VULN-001", severity: "medium", description: "Outdated software component." },
    { id: "VULN-002", severity: "medium", description: "Weak password policy detected." },
  ],
  complianceReport: { status: "partially_compliant", issues: 3 },
  threatsDetected: [],
};
