
export type AnomalyDetectionResult = {
  id: string;
  cameraId: string;
  timestamp: string;
  score: number; // 0-100 score, higher means more anomalous
  type: 'configuration' | 'behavior' | 'network' | 'access';
  description: string;
  confidence: number; // 0-100
  relatedEvents?: {
    eventType: string;
    timestamp: string;
    description: string;
  }[];
};

export type BehavioralPattern = {
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
};

export type MLModelInfo = {
  id: string;
  name: string;
  description: string;
  version: string;
  lastTrained: string;
  accuracy: number; // 0-100
  supportedDevices: string[];
  features: string[];
  isActive: boolean;
};

export type MLPrediction = {
  modelId: string;
  timestamp: string;
  prediction: string;
  confidence: number; // 0-100
  input: Record<string, any>;
  explanation?: string[];
};
