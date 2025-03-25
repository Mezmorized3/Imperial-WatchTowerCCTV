
import { nanoid } from 'nanoid';
import { ImperialShieldResult } from '../types/threatIntelTypes';

/**
 * Utility functions for the Imperial Shield system
 */

/**
 * Generate a mock Imperial Shield scan result
 */
export const generateMockShieldResult = (ip: string): ImperialShieldResult => {
  const randomStatus = Math.random();
  let status: 'active' | 'inactive' | 'compromised';
  
  if (randomStatus < 0.6) {
    status = 'active';
  } else if (randomStatus < 0.8) {
    status = 'inactive';
  } else {
    status = 'compromised';
  }
  
  return {
    id: nanoid(), // Generate a unique ID for the result
    status,
    targetIp: ip,
    lastScan: new Date().toISOString(),
    vulnSummary: {
      critical: Math.floor(Math.random() * 3),
      high: Math.floor(Math.random() * 5),
      medium: Math.floor(Math.random() * 8),
      low: Math.floor(Math.random() * 12)
    }
  };
};

/**
 * Generate a detailed Imperial Shield scan result
 */
export const generateDetailedShieldResult = (ip: string): ImperialShieldResult => {
  const result = generateMockShieldResult(ip);
  
  return {
    ...result,
    id: nanoid(), // Generate a unique ID
    vulnSummary: {
      critical: 2,
      high: 4,
      medium: 7,
      low: 10
    }
  };
};

/**
 * Generate Imperial Shield monitoring data
 */
export const generateMonitoringData = (ips: string[]): ImperialShieldResult[] => {
  return ips.map(ip => generateMockShieldResult(ip));
};

/**
 * Generate Imperial Shield protection result
 */
export const generateProtectionResult = (ip: string): {
  success: boolean;
  message: string;
  protectionState: string;
} => {
  const success = Math.random() > 0.1;
  
  return {
    success,
    message: success 
      ? "Imperial Shield protection activated successfully" 
      : "Failed to activate protection, please check network connectivity",
    protectionState: success ? "active" : "inactive"
  };
};

/**
 * Generate Imperial Shield breach report
 */
export const generateBreachReport = (ip: string): {
  breachDetected: boolean;
  breachTime?: string;
  breachType?: string;
  attackerIp?: string;
  details?: string;
} => {
  const breachDetected = Math.random() > 0.7;
  
  if (!breachDetected) {
    return {
      breachDetected: false
    };
  }
  
  const breachTypes = [
    "Brute Force Attempt",
    "Unauthorized Access",
    "RTSP Stream Hijacking",
    "Firmware Exploitation",
    "Credential Theft"
  ];
  
  return {
    breachDetected: true,
    breachTime: new Date(Date.now() - Math.floor(Math.random() * 10 * 86400000)).toISOString(),
    breachType: breachTypes[Math.floor(Math.random() * breachTypes.length)],
    attackerIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    details: "Attack detected and blocked by Imperial Shield defensive measures."
  };
};

/**
 * Generate a list of recent alert events
 */
export const generateRecentAlerts = (count: number = 5): Array<{
  timestamp: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip: string;
  details: string;
}> => {
  const alertTypes = [
    "Unauthorized Access Attempt",
    "Credential Stuffing Attack",
    "Firmware Exploit Attempt",
    "Port Scan Detected",
    "RTSP Stream Access"
  ];
  
  const severities: Array<'low' | 'medium' | 'high' | 'critical'> = [
    'low', 'medium', 'high', 'critical'
  ];
  
  const alerts = [];
  
  for (let i = 0; i < count; i++) {
    alerts.push({
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 86400000)).toISOString(),
      type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      details: "Imperial Shield automatically blocked the attempt."
    });
  }
  
  return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

/**
 * Generate Imperial Shield system status
 */
export const generateSystemStatus = (): {
  status: 'active' | 'inactive' | 'compromised';
  activeSensors: number;
  protectedCameras: number;
  lastUpdate: string;
  batteryLevel?: number;
  alerts: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
} => {
  return {
    status: Math.random() > 0.8 ? 'compromised' : (Math.random() > 0.2 ? 'active' : 'inactive'),
    activeSensors: Math.floor(Math.random() * 20) + 5,
    protectedCameras: Math.floor(Math.random() * 50) + 10,
    lastUpdate: new Date().toISOString(),
    batteryLevel: Math.floor(Math.random() * 100),
    alerts: {
      critical: Math.floor(Math.random() * 3),
      high: Math.floor(Math.random() * 5),
      medium: Math.floor(Math.random() * 8),
      low: Math.floor(Math.random() * 12)
    }
  };
};

/**
 * Generate Imperial Shield device protection status
 */
export const generateDeviceProtectionStatus = (deviceId: string): ImperialShieldResult => {
  const status = Math.random() > 0.7 ? (Math.random() > 0.5 ? 'compromised' : 'inactive') : 'active';
  
  return {
    id: deviceId, // Use the provided deviceId
    status: status as 'active' | 'inactive' | 'compromised',
    targetIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    lastScan: new Date().toISOString(),
    vulnSummary: {
      critical: Math.floor(Math.random() * 3),
      high: Math.floor(Math.random() * 5),
      medium: Math.floor(Math.random() * 8),
      low: Math.floor(Math.random() * 12)
    }
  };
};
