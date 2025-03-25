
/**
 * Threat intelligence types
 */

export interface ThreatIntelData {
  ipReputation: number;
  lastReportedMalicious?: string;
  associatedMalware: string[];
  reportedBy?: string[];
  firstSeen?: string;
  tags?: string[];
  confidenceScore: number;
  source: 'virustotal' | 'abuseipdb' | 'threatfox' | 'other';
  lastUpdated: string;
  externalIp?: string;
}

export interface FirmwareData {
  version: string;
  vulnerabilities?: {
    id: string;
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    cve?: string;
    published?: string;
    fixed?: boolean;
  }[];
  updateAvailable?: boolean;
  lastChecked?: string;
}

export interface FirmwareAnalysisResult {
  version: string;
  outdated: boolean;
  vulnerabilityCount: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  mediumVulnerabilities: number;
  lowVulnerabilities: number;
  latestVersion?: string;
  updateUrl?: string;
  vulnerabilities: {
    id: string;
    name: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    cve?: string;
    published?: string;
    fixed?: boolean;
  }[];
}

export interface ThreatAssessment {
  overallThreatLevel: 'low' | 'medium' | 'high' | 'critical';
  ipReputation: number;
  malwareIndicators: string[];
  vulnerabilityScore: number;
  recommendedActions: string[];
  lastUpdated: string;
}

// Import the ImperialShieldResult interface from advancedToolTypes
// to avoid duplication and conflict
import { ImperialShieldResult as AdvancedImperialShieldResult } from './advancedToolTypes';

// Re-export it 
export type ImperialShieldResult = AdvancedImperialShieldResult;
