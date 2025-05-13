
export interface CameraResult {
  id: string;
  ip: string;
  port?: number;
  manufacturer?: string;
  model?: string;
  status?: 'online' | 'offline' | 'vulnerable' | 'authenticated';
  location?: string | {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  accessLevel?: string;
  lastSeen?: string;
  firmwareVersion?: string;
  url?: string;
  credentials?: {
    username: string;
    password: string;
  };
  vulnerabilities?: {
    name: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
  }[];
}

export interface AlertConfig {
  id: string;
  name: string;
  type: string;
  severity: string;
  enabled: boolean;
  triggeredBy: string[];
  level: string;
  action: string;
  createdAt: string;
  notificationMethod: string;
}
