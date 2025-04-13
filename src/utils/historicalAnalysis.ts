
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
 * Get historical data for a camera from the database or API
 */
export const getHistoricalData = async (cameraId: string, days: number = 30): Promise<HistoricalDataPoint[]> => {
  console.log(`Fetching historical data for camera ${cameraId} over ${days} days`);
  
  try {
    const response = await fetch(`/api/cameras/${cameraId}/history?days=${days}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch historical data: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
};

/**
 * Analyze trends in historical data using statistical analysis
 */
export const analyzeTrends = async (cameraId: string, historicalData: HistoricalDataPoint[], days: number = 30): Promise<TrendAnalysisResult[]> => {
  console.log(`Analyzing trends for camera ${cameraId}`);
  
  if (historicalData.length < 2) {
    console.warn('Not enough historical data for trend analysis');
    return [];
  }
  
  try {
    // Extract metrics to analyze
    const metrics = extractMetrics(historicalData);
    const results: TrendAnalysisResult[] = [];
    
    // Analyze each metric
    for (const [metric, values] of Object.entries(metrics)) {
      if (values.length < 2) continue;
      
      const trend = determineTrend(values);
      const percentChange = calculatePercentChange(values);
      const significance = determineSignificance(percentChange, metric);
      
      results.push({
        id: `${cameraId}-${metric}-${Date.now()}`,
        cameraId,
        metric,
        trend,
        percentChange,
        timeRange: `${days} days`,
        significance,
        dataPoints: values.map((value, index) => ({
          x: historicalData[index].timestamp,
          y: value
        }))
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error analyzing trends:', error);
    return [];
  }
};

/**
 * Extract metrics from historical data
 */
const extractMetrics = (data: HistoricalDataPoint[]): Record<string, number[]> => {
  const metrics: Record<string, number[]> = {
    responseTime: [],
    vulnerabilityCount: [],
    accessAttempts: []
  };
  
  data.forEach(point => {
    if (point.responseTime !== undefined) {
      metrics.responseTime.push(point.responseTime);
    }
    
    if (point.vulnerabilityCount !== undefined) {
      metrics.vulnerabilityCount.push(point.vulnerabilityCount);
    }
    
    if (point.accessAttempts !== undefined) {
      metrics.accessAttempts.push(point.accessAttempts);
    }
  });
  
  return metrics;
};

/**
 * Determine trend direction
 */
const determineTrend = (values: number[]): 'increasing' | 'decreasing' | 'stable' | 'fluctuating' => {
  if (values.length < 2) return 'stable';
  
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const diff = secondAvg - firstAvg;
  const threshold = 0.1 * firstAvg; // 10% change threshold
  
  // Calculate standard deviation to detect fluctuation
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / mean;
  
  if (coefficientOfVariation > 0.25) {
    return 'fluctuating';
  }
  
  if (Math.abs(diff) < threshold) {
    return 'stable';
  }
  
  return diff > 0 ? 'increasing' : 'decreasing';
};

/**
 * Calculate percent change between first and last values
 */
const calculatePercentChange = (values: number[]): number => {
  if (values.length < 2) return 0;
  
  const first = values[0];
  const last = values[values.length - 1];
  
  if (first === 0) return last > 0 ? 100 : 0;
  
  return ((last - first) / first) * 100;
};

/**
 * Determine significance of change based on metric and percent change
 */
const determineSignificance = (percentChange: number, metric: string): 'high' | 'medium' | 'low' => {
  const absChange = Math.abs(percentChange);
  
  // Different thresholds for different metrics
  switch (metric) {
    case 'responseTime':
      if (absChange > 50) return 'high';
      if (absChange > 20) return 'medium';
      return 'low';
      
    case 'vulnerabilityCount':
      if (absChange > 20) return 'high';
      if (absChange > 5) return 'medium';
      return 'low';
      
    case 'accessAttempts':
      if (absChange > 100) return 'high';
      if (absChange > 30) return 'medium';
      return 'low';
      
    default:
      if (absChange > 50) return 'high';
      if (absChange > 20) return 'medium';
      return 'low';
  }
};
