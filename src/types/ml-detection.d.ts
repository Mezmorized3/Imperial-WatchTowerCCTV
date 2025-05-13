
export interface AnomalyDetectionResult {
  id: string;
  cameraId: string;
  timestamp: string;
  score: number;
  type: 'configuration' | 'behavior' | 'network' | 'access';
  description: string;
  confidence: number;
  relatedEvents?: {
    eventType: string;
    timestamp: string;
    description: string;
  }[];
}

export interface BehavioralPattern {
  id: string;
  cameraId: string;
  name: string;
  description: string;
  pattern: {
    type: 'traffic' | 'access' | 'uptime' | 'scanning' | 'commands';
    normalRangeMin: number;
    normalRangeMax: number;
    currentValue: number;
    unit: string;
  };
  lastUpdated: string;
  isAnomaly: boolean;
  anomalyScore?: number;
}
