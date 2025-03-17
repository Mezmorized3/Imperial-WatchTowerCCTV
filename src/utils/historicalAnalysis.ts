
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
 * Generate mock historical data for a camera
 */
export const getHistoricalData = async (cameraId: string, days: number = 30): Promise<HistoricalDataPoint[]> => {
  console.log(`Fetching historical data for camera ${cameraId} over ${days} days`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const results: HistoricalDataPoint[] = [];
  
  // Create a data point for each day
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Randomly determine status with some consistency
    const statusOptions = ['online', 'offline', 'vulnerable'];
    const statusIndex = Math.floor(Math.random() * 10) % 3;
    const status = statusOptions[statusIndex];
    
    // Generate response time with some variation but consistency
    const baseResponseTime = 200 + (Math.random() * 400);
    const responseTime = status === 'offline' ? undefined : Math.floor(baseResponseTime);
    
    // Generate port data
    const basePorts = [80, 443, 554];
    const additionalPorts = Math.random() > 0.7 ? [22, 23, 8080].slice(0, Math.floor(Math.random() * 3)) : [];
    const openPorts = status === 'offline' ? undefined : [...basePorts, ...additionalPorts];
    
    // Generate vulnerability count with some consistency
    const baseVulnerabilityCount = Math.floor(Math.random() * 3);
    const vulnerabilityCount = status === 'vulnerable' ? baseVulnerabilityCount + Math.floor(Math.random() * 3) : baseVulnerabilityCount;
    
    // Generate access attempts
    const baseAccessAttempts = Math.floor(Math.random() * 5);
    const accessAttempts = baseAccessAttempts + (i % 7 === 0 ? Math.floor(Math.random() * 20) : 0); // Spike on certain days
    
    results.push({
      timestamp: date.toISOString(),
      status,
      responseTime,
      openPorts,
      vulnerabilityCount: status === 'offline' ? undefined : vulnerabilityCount,
      accessAttempts
    });
  }
  
  return results;
};

/**
 * Analyze trends in historical data
 */
export const analyzeTrends = async (cameraId: string, historicalData: HistoricalDataPoint[]): Promise<TrendAnalysisResult[]> => {
  console.log(`Analyzing trends for camera ${cameraId}`);
  
  // Simulate API delay for analysis
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const results: TrendAnalysisResult[] = [];
  
  // Analyze uptime trend
  const uptimeData = historicalData.map(point => ({
    timestamp: point.timestamp,
    value: point.status === 'online' ? 1 : 0
  }));
  
  const uptimeFirst = uptimeData.slice(0, Math.floor(uptimeData.length / 2))
    .reduce((acc, point) => acc + point.value, 0) / Math.floor(uptimeData.length / 2);
  const uptimeLast = uptimeData.slice(Math.floor(uptimeData.length / 2))
    .reduce((acc, point) => acc + point.value, 0) / (uptimeData.length - Math.floor(uptimeData.length / 2));
  
  const uptimeChange = ((uptimeLast - uptimeFirst) / uptimeFirst) * 100;
  
  results.push({
    id: `trend-uptime-${Date.now()}`,
    cameraId,
    metric: 'Device Uptime',
    trend: uptimeChange > 5 ? 'increasing' : uptimeChange < -5 ? 'decreasing' : 'stable',
    percentChange: Math.round(uptimeChange * 10) / 10,
    timeRange: `${historicalData.length} days`,
    significance: Math.abs(uptimeChange) > 15 ? 'high' : Math.abs(uptimeChange) > 5 ? 'medium' : 'low',
    dataPoints: uptimeData.map(point => ({
      x: new Date(point.timestamp).toLocaleDateString(),
      y: point.value * 100 // Convert to percentage
    }))
  });
  
  // Analyze response time trend
  const responseTimeData = historicalData
    .filter(point => point.responseTime !== undefined)
    .map(point => ({
      timestamp: point.timestamp,
      value: point.responseTime!
    }));
  
  if (responseTimeData.length > 0) {
    const responseTimeFirst = responseTimeData.slice(0, Math.floor(responseTimeData.length / 2))
      .reduce((acc, point) => acc + point.value, 0) / Math.floor(responseTimeData.length / 2);
    const responseTimeLast = responseTimeData.slice(Math.floor(responseTimeData.length / 2))
      .reduce((acc, point) => acc + point.value, 0) / (responseTimeData.length - Math.floor(responseTimeData.length / 2));
    
    const responseTimeChange = ((responseTimeLast - responseTimeFirst) / responseTimeFirst) * 100;
    
    results.push({
      id: `trend-responsetime-${Date.now()}`,
      cameraId,
      metric: 'Response Time',
      trend: responseTimeChange > 10 ? 'increasing' : responseTimeChange < -10 ? 'decreasing' : 'stable',
      percentChange: Math.round(responseTimeChange * 10) / 10,
      timeRange: `${historicalData.length} days`,
      significance: Math.abs(responseTimeChange) > 25 ? 'high' : Math.abs(responseTimeChange) > 10 ? 'medium' : 'low',
      dataPoints: responseTimeData.map(point => ({
        x: new Date(point.timestamp).toLocaleDateString(),
        y: point.value
      }))
    });
  }
  
  // Analyze vulnerability count trend
  const vulnerabilityData = historicalData
    .filter(point => point.vulnerabilityCount !== undefined)
    .map(point => ({
      timestamp: point.timestamp,
      value: point.vulnerabilityCount!
    }));
  
  if (vulnerabilityData.length > 0) {
    const vulnerabilityFirst = vulnerabilityData.slice(0, Math.floor(vulnerabilityData.length / 2))
      .reduce((acc, point) => acc + point.value, 0) / Math.floor(vulnerabilityData.length / 2);
    const vulnerabilityLast = vulnerabilityData.slice(Math.floor(vulnerabilityData.length / 2))
      .reduce((acc, point) => acc + point.value, 0) / (vulnerabilityData.length - Math.floor(vulnerabilityData.length / 2));
    
    const vulnerabilityChange = ((vulnerabilityLast - vulnerabilityFirst) / (vulnerabilityFirst || 1)) * 100;
    
    results.push({
      id: `trend-vulnerabilities-${Date.now()}`,
      cameraId,
      metric: 'Vulnerability Count',
      trend: vulnerabilityChange > 10 ? 'increasing' : vulnerabilityChange < -10 ? 'decreasing' : 'stable',
      percentChange: Math.round(vulnerabilityChange * 10) / 10,
      timeRange: `${historicalData.length} days`,
      significance: Math.abs(vulnerabilityChange) > 25 ? 'high' : Math.abs(vulnerabilityChange) > 10 ? 'medium' : 'low',
      dataPoints: vulnerabilityData.map(point => ({
        x: new Date(point.timestamp).toLocaleDateString(),
        y: point.value
      }))
    });
  }
  
  // Analyze access attempts trend
  const accessData = historicalData
    .filter(point => point.accessAttempts !== undefined)
    .map(point => ({
      timestamp: point.timestamp,
      value: point.accessAttempts!
    }));
  
  if (accessData.length > 0) {
    const accessFirst = accessData.slice(0, Math.floor(accessData.length / 2))
      .reduce((acc, point) => acc + point.value, 0) / Math.floor(accessData.length / 2);
    const accessLast = accessData.slice(Math.floor(accessData.length / 2))
      .reduce((acc, point) => acc + point.value, 0) / (accessData.length - Math.floor(accessData.length / 2));
    
    const accessChange = ((accessLast - accessFirst) / (accessFirst || 1)) * 100;
    
    results.push({
      id: `trend-access-${Date.now()}`,
      cameraId,
      metric: 'Access Attempts',
      trend: accessChange > 20 ? 'increasing' : accessChange < -20 ? 'decreasing' : 
        (Math.max(...accessData.map(d => d.value)) - Math.min(...accessData.map(d => d.value)) > accessLast * 2) ? 'fluctuating' : 'stable',
      percentChange: Math.round(accessChange * 10) / 10,
      timeRange: `${historicalData.length} days`,
      significance: Math.abs(accessChange) > 50 ? 'high' : Math.abs(accessChange) > 20 ? 'medium' : 'low',
      dataPoints: accessData.map(point => ({
        x: new Date(point.timestamp).toLocaleDateString(),
        y: point.value
      }))
    });
  }
  
  return results;
};
