
/**
 * RTSPBrute Utility Functions
 */

import { RTSPBruteParams, RTSPBruteResult, RTSPStreamResult } from '@/types/scanner';
import { simulateNetworkDelay } from '../networkUtils';

/**
 * Execute RTSP brute force scan
 */
export const executeRTSPBrute = async (params: RTSPBruteParams): Promise<RTSPBruteResult> => {
  console.log('Executing RTSPBrute with params:', params);
  
  // Add a delay to simulate the scan process
  const simulatedExecutionTime = params.scanMode === 'quick' ? 5000 : 
                               params.scanMode === 'thorough' ? 15000 : 30000;
  
  await simulateNetworkDelay(simulatedExecutionTime);
  
  // Parse and format targets
  const targets = Array.isArray(params.targets) ? params.targets : 
    params.targets.split('\n').filter(Boolean).map(t => t.trim());
  
  // Generate simulated results
  const simResults: RTSPStreamResult[] = generateSimulatedResults(targets, params);
  const accessibleCount = simResults.filter(s => s.accessible).length;
  
  // Return the results
  return {
    success: true,
    targetsScanned: targets.length,
    streamsFound: simResults.length,
    accessibleStreams: accessibleCount,
    results: simResults,
    executionTime: simulatedExecutionTime,
    reportPath: params.saveReport ? `/reports/rtsp-scan-${Date.now()}.pdf` : undefined
  };
};

/**
 * Generate simulated results for RTSP scan
 */
const generateSimulatedResults = (targets: string[], params: RTSPBruteParams): RTSPStreamResult[] => {
  const results: RTSPStreamResult[] = [];
  
  // Common routes for RTSP cameras
  const defaultRoutes = [
    '/live',
    '/live/main',
    '/live/ch01',
    '/cam/realmonitor',
    '/h264/ch1/main/av_stream',
    '/streaming/channels/1',
    '/video1',
    '/media/video1',
    '/videostream.cgi'
  ];
  
  // Use provided routes or defaults
  const routes = params.routes && params.routes.length > 0 ? params.routes : defaultRoutes;
  
  // Common credentials for cameras
  const defaultCredentials = [
    { username: 'admin', password: 'admin', default: true },
    { username: 'admin', password: '12345', default: true },
    { username: 'admin', password: 'password', default: true },
    { username: 'root', password: 'root', default: true },
    { username: 'user', password: 'user', default: true }
  ];
  
  // Use provided credentials or defaults
  const credentialsList = params.credentials && params.credentials.length > 0 ? 
    params.credentials.map(c => ({ ...c, default: false })) : 
    defaultCredentials;
  
  // For each target, generate a camera result
  targets.forEach((target, targetIndex) => {
    // Generate 1-3 random ports for each target
    const targetPorts = params.ports && params.ports.length > 0 ? 
      params.ports : [554, 8554];
    
    targetPorts.forEach((port, portIndex) => {
      // Determine if this camera is accessible based on a random chance
      // More thorough scans have better chance of finding accessible cameras
      const accessProb = params.scanMode === 'quick' ? 0.3 : 
                         params.scanMode === 'thorough' ? 0.5 : 0.7;
      
      const isAccessible = Math.random() < accessProb;
      
      // Only generate up to 3 stream entries per target for readability
      if (portIndex > 2) return;
      
      // Pick a random route
      const routeIndex = Math.floor(Math.random() * routes.length);
      const route = routes[routeIndex];
      
      // For accessible cameras, pick credentials
      let credentials = undefined;
      if (isAccessible) {
        const credIndex = Math.floor(Math.random() * credentialsList.length);
        credentials = {
          ...credentialsList[credIndex],
          default: credentialsList[credIndex].default || false
        };
      }
      
      // Generate a unique ID
      const id = `stream-${Date.now()}-${targetIndex}-${portIndex}`;
      
      // Stream URL
      const streamUrl = isAccessible ? 
        `rtsp://${credentials?.username}:${credentials?.password}@${target}:${port}${route}` : 
        undefined;
      
      // Generate metadata for accessible streams
      const metadata = isAccessible ? {
        resolution: ['640x480', '1280x720', '1920x1080'][Math.floor(Math.random() * 3)],
        fps: [15, 24, 30][Math.floor(Math.random() * 3)],
        codec: ['H.264', 'H.265', 'MJPEG'][Math.floor(Math.random() * 3)],
        bitrate: ['500kbps', '1Mbps', '2Mbps', '4Mbps'][Math.floor(Math.random() * 4)]
      } : undefined;
      
      // Create the result
      const result: RTSPStreamResult = {
        id,
        target,
        port,
        accessible: isAccessible,
        protocol: 'rtsp',
        route,
        credentials,
        streamUrl,
        screenshotPath: isAccessible && params.captureScreenshots ? 
          `/screenshots/${id}.jpg` : undefined,
        metadata,
        responseTime: Math.random() * 500 + 100, // 100-600ms
        discoveredAt: new Date().toISOString()
      };
      
      results.push(result);
    });
  });
  
  return results;
};

/**
 * Analyzes RTSP stream to extract metadata
 */
export const analyzeRtspStream = async (streamUrl: string): Promise<any> => {
  await simulateNetworkDelay(2000);
  
  return {
    resolution: '1920x1080',
    fps: 30,
    codec: 'H.264',
    bitrate: '2Mbps',
    audioCodec: 'AAC',
    latency: '145ms'
  };
};

/**
 * Takes a screenshot from an RTSP stream
 */
export const captureStreamScreenshot = async (streamUrl: string): Promise<string> => {
  await simulateNetworkDelay(1500);
  
  // In a real implementation, this would use ffmpeg to capture a frame
  return `/screenshots/stream-${Date.now()}.jpg`;
};

/**
 * Tests RTSP stream connection
 */
export const testRtspConnection = async (
  target: string,
  port: number,
  route: string,
  credentials?: { username: string; password: string }
): Promise<boolean> => {
  await simulateNetworkDelay(500);
  
  // In a real implementation, this would attempt to connect to the RTSP stream
  return Math.random() > 0.5;
};

/**
 * Implements ML-based credential optimization
 */
export const optimizeCredentialsList = (
  previousResults: RTSPStreamResult[],
  defaultCredentials: { username: string; password: string }[]
): { username: string; password: string }[] => {
  // Start with the defaults
  const optimizedList = [...defaultCredentials];
  
  // In a real implementation, this would analyze patterns in successful credentials
  // and generate new combinations based on those patterns
  
  // For simulation, we'll just add a few "optimized" credentials
  const successfulCredentials = previousResults
    .filter(r => r.accessible && r.credentials)
    .map(r => r.credentials!);
  
  if (successfulCredentials.length > 0) {
    // Add some variations based on successful credentials
    successfulCredentials.forEach(cred => {
      // Add variations with numbers appended
      optimizedList.push({ username: cred.username, password: `${cred.password}123` });
      optimizedList.push({ username: cred.username, password: `${cred.password}2023` });
      
      // Add variations with capitalization changes
      if (cred.password) {
        optimizedList.push({ 
          username: cred.username, 
          password: cred.password.charAt(0).toUpperCase() + cred.password.slice(1) 
        });
      }
    });
  }
  
  // Return unique credentials only
  return optimizedList.filter((cred, index, self) => 
    index === self.findIndex(c => c.username === cred.username && c.password === cred.password)
  );
};

export default {
  executeRTSPBrute,
  analyzeRtspStream,
  captureStreamScreenshot,
  testRtspConnection,
  optimizeCredentialsList
};
