
/**
 * Implementation of RTSP brute-forcing tools
 */

import { simulateNetworkDelay } from '../networkUtils';
import { RtspBruteParams, RtspBruteResult, RtspCredential } from '../types/rtspBruteTypes';

// Global configuration
const USER_AGENTS = [
  'RTSP/1.0 (CCTV DVR)',
  'DSS/6.0.3 (Build/893)',
  'LIVE555 Streaming Media v2023.11.30',
  'IPCAM (Vendor/Model)'
];

const BYPASS_HEADERS = {
  'X-Forwarded-For': '127.0.0.1',
  'Client-Real-IP': '192.168.1.1',
  'Via': '1.1 google'
};

// Common default credentials prioritized
const PRIORITY_CREDENTIALS = [
  { user: 'admin', pass: 'admin' },
  { user: 'root', pass: 'root' },
  { user: 'admin', pass: '12345' },
  { user: 'admin', pass: '123456' },
  { user: 'admin', pass: 'password' },
  { user: 'admin', pass: '' },
  { user: 'root', pass: '12345' },
  { user: 'admin', pass: '1234' },
  { user: 'user', pass: 'user' },
  { user: 'guest', pass: 'guest' }
];

// Vendor-specific URL patterns
const VENDOR_URLS = {
  hikvision: ['/ISAPI/Streaming/Channels/101', '/ISAPI/Streaming/Channels/102'],
  dahua: ['/cam/realmonitor?channel=1&subtype=0', '/cam/realmonitor?channel=1&subtype=1'],
  axis: ['/axis-media/media.amp', '/axis-cgi/mjpg/video.cgi'],
  bosch: ['/rtsp_tunnel', '/video1'],
  any: ['/Streaming/Channels/101', '/cam/realmonitor', '/h264Preview_01_main', '/live/ch00_0', '/video1']
};

/**
 * Simulated RTSP brute-forcing implementation
 */
export const executeMegaRtspBruter = async (params: RtspBruteParams): Promise<RtspBruteResult> => {
  console.log('Executing MegaRTSPBruter with params:', params);
  
  // Simulate network delay based on the number of targets and credentials
  const targetCount = Array.isArray(params.targets) ? params.targets.length : 1;
  const delayFactor = params.stealthMode ? 2 : 1;
  
  // Calculate total delay based on the number of attempts that would be made
  const estimatedDelay = Math.min(
    targetCount * (params.smartCredentials ? 10 : 5) * delayFactor * 50,
    5000 // Cap at 5 seconds
  );
  
  await simulateNetworkDelay(estimatedDelay);
  
  // Validate parameters
  if (!params.targets || (Array.isArray(params.targets) && params.targets.length === 0)) {
    return {
      success: false,
      found: [],
      error: 'No targets specified'
    };
  }
  
  // Generate a random number of successful results for simulation
  const targets = Array.isArray(params.targets) ? params.targets : [params.targets];
  const successCount = Math.min(Math.floor(Math.random() * (targetCount + 1)), 5);
  
  // Generate simulated successful results
  const found: RtspCredential[] = [];
  const selectedTargets = targets.slice(0, successCount);
  
  for (let i = 0; i < selectedTargets.length; i++) {
    const target = selectedTargets[i];
    const cred = PRIORITY_CREDENTIALS[Math.floor(Math.random() * PRIORITY_CREDENTIALS.length)];
    const vendor = ['Hikvision', 'Dahua', 'Axis', 'Bosch', 'Generic'][Math.floor(Math.random() * 5)];
    
    found.push({
      target,
      user: cred.user,
      pass: cred.pass,
      vendor,
      port: 554,
      streamUrl: `rtsp://${cred.user}:${cred.pass}@${target}:554${VENDOR_URLS.any[0]}`,
      timestamp: new Date().toISOString()
    });
  }
  
  // Return simulated results
  return {
    success: true,
    found,
    scanDetails: {
      targetsScanned: targetCount,
      attemptsPerTarget: params.smartCredentials ? 10 : Math.floor(Math.random() * 20) + 5,
      timeElapsed: `${(Math.random() * 60).toFixed(2)}s`,
      targetType: Array.isArray(params.targets) ? 'multiple' : 'single'
    }
  };
};

/**
 * Helper function to generate a list of common RTSP users
 */
export const getCommonRtspUsers = (): string[] => {
  return [
    'admin', 'root', 'user', 'operator',
    'guest', 'supervisor', 'administrator',
    'viewer', 'service', 'tech',
    'camera', 'cctv', 'dvr', 'hikvision',
    'dahua', 'axis', 'bosch', 'panasonic',
    'samsung', 'sony', 'default'
  ];
};

/**
 * Helper function to generate a list of common RTSP passwords
 */
export const getCommonRtspPasswords = (): string[] => {
  return [
    'admin', '12345', '123456', 'password',
    '', 'root', 'pass', '1234',
    'user', 'qwerty', '111111', 'abc123',
    'guest', 'camera', 'cctv', 'dvr',
    'system', 'ipcam', 'admin123', 'default',
    'hikvision', 'dahua', '4321', '54321',
    '11111111', '00000000', '12345678', 'Admin888'
  ];
};
