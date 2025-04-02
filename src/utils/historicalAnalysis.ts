
import { CameraResult } from '@/types/scanner';

export type HistoricalDataPoint = {
  timestamp: string;
  status: string;
  responseTime?: number;
  openPorts?: number[];
  vulnerabilityCount?: number;
  accessAttempts?: number;
};

export type TrendAnalysisResult = {
  id: string;
  cameraId: string;
  metric: string;
  trend: 'increasing' | 'decreasing' | 'stable' | 'fluctuating';
  percentChange: number;
  timeRange: string;
  significance: 'high' | 'medium' | 'low';
  dataPoints: {
    x: string; // timestamp
    y: number; // value
  }[];
};

/**
 * Get historical data for a camera - now returns empty data instead of mock data
 */
export const getHistoricalData = async (cameraId: string, days: number = 30): Promise<HistoricalDataPoint[]> => {
  console.log(`Fetching historical data for camera ${cameraId} over ${days} days`);
  
  // Return empty array instead of mock data
  return [];
};

/**
 * Analyze trends in historical data - now returns empty data
 */
export const analyzeTrends = async (cameraId: string, historicalData: HistoricalDataPoint[]): Promise<TrendAnalysisResult[]> => {
  console.log(`Analyzing trends for camera ${cameraId}`);
  
  // Return empty array instead of mock data
  return [];
};
