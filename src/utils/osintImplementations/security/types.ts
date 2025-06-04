
import { ToolResult } from '@/utils/types/osintToolTypes';

export interface SecurityFinding {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
  impact?: string;
  cve?: string;
}

export interface SecurityPatch {
  id: string;
  name: string;
  status: 'success' | 'failed';
  description: string;
}

export interface SecurityAnalysisResult extends ToolResult {
  findings?: SecurityFinding[];
  patchesApplied?: SecurityPatch[];
  summary?: {
    total: number;
    successful: number;
    failed: number;
  };
}
