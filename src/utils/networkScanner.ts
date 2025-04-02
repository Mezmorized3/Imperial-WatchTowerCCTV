
/**
 * Network scanner utilities
 */

import { CameraResult, ScanSettings, ThreatIntelData } from '@/types/scanner';
import { mapCameraToModel } from './scanner/cameraConverter';

// Export ScanSettings type for external use
export type { ScanSettings };

/**
 * Real network scan implementation
 */
export const simulateNetworkScan = async (
  target: string,
  settings: ScanSettings
): Promise<{ cameras: CameraResult[]; total: number }> => {
  // For faster development, we'll use the real scan function
  const scanResult = await scanNetwork(
    target,
    settings,
    undefined,
    undefined,
    'network',
    undefined,
    undefined
  );
  
  return scanResult.data;
};

/**
 * Generates a random IP address within a given CIDR range.
 */
const generateRandomIP = (cidr: string): string => {
  const [baseIP, prefixLengthStr] = cidr.split('/');
  const prefixLength = parseInt(prefixLengthStr, 10);

  if (prefixLength < 0 || prefixLength > 32) {
    throw new Error('Invalid CIDR prefix length');
  }

  const baseIPParts = baseIP.split('.').map(Number);
  if (baseIPParts.length !== 4 || baseIPParts.some(isNaN)) {
    throw new Error('Invalid base IP address');
  }

  let randomIP = '';
  let remainingBits = 32 - prefixLength;

  for (let i = 0; i < 4; i++) {
    let part = baseIPParts[i];

    if (prefixLength >= 8 * (i + 1)) {
      // Use the base IP part directly
      randomIP += part;
    } else if (prefixLength > 8 * i) {
      // Mix base IP with random bits
      let bitsFromBase = prefixLength - 8 * i;
      let mask = (1 << bitsFromBase) - 1;
      let randomBits = Math.floor(Math.random() * (1 << (8 - bitsFromBase)));
      part = (part & mask) | (randomBits << bitsFromBase);
      randomIP += part;
      remainingBits -= (8 - bitsFromBase);
    } else {
      // Generate fully random part
      part = Math.floor(Math.random() * 256);
      randomIP += part;
      remainingBits -= 8;
    }

    if (i < 3) {
      randomIP += '.';
    }
  }

  return randomIP;
};

/**
 * Tests a proxy connection.
 */
export const testProxyConnection = async (proxyConfig: any): Promise<{ success: boolean; latency?: number; error?: string }> => {
  console.log('Testing proxy connection:', proxyConfig);
  
  try {
    const start = Date.now();
    
    // Create request with proxy configuration
    const response = await fetch('/api/proxy/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(proxyConfig)
    });
    
    const latency = Date.now() - start;
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Proxy test failed');
    }
    
    return {
      success: true,
      latency
    };
  } catch (error) {
    console.error('Proxy test error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown proxy test error'
    };
  }
};

/**
 * Rotates through a list of proxies.
 */
export const rotateProxy = async (proxyList: string[], currentProxy?: string): Promise<string | null> => {
  if (!proxyList || proxyList.length === 0) {
    return null;
  }
  
  let nextIndex = 0;
  
  if (currentProxy) {
    const currentIndex = proxyList.indexOf(currentProxy);
    if (currentIndex !== -1) {
      nextIndex = (currentIndex + 1) % proxyList.length;
    }
  }
  
  return proxyList[nextIndex];
};

/**
 * Scans a network and returns a list of cameras
 */
const scanNetwork = async (
  ipRange: string,
  settings: ScanSettings,
  progressCallback?: (progress: any) => void,
  cameraCallback?: (camera: any) => void,
  scanType?: string,
  abortSignal?: AbortSignal,
  proxyConfig?: any
) => {
  console.log(`Scanning network: ${ipRange} with settings:`, settings);

  // Initialize progress
  if (progressCallback) {
    progressCallback({
      status: 'initializing',
      targetsTotal: 100,
      targetsScanned: 0,
      camerasFound: 0
    });
  }

  try {
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ipRange,
        settings,
        scanType,
        proxy: proxyConfig
      }),
      signal: abortSignal
    });

    if (!response.ok) {
      throw new Error(`Scan failed: ${response.status}`);
    }

    // For streaming responses - read the response as a stream
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body not available');
    }

    const decoder = new TextDecoder();
    let cameras: CameraResult[] = [];
    let done = false;
    let counter = 0;

    // Process the stream data
    while (!done && !abortSignal?.aborted) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      if (value) {
        const chunk = decoder.decode(value, { stream: !done });
        // Split by newlines to handle multiple JSON objects
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            
            if (data.type === 'progress') {
              // Handle progress update
              if (progressCallback) {
                progressCallback(data.progress);
              }
            } else if (data.type === 'camera') {
              // Handle camera discovery
              counter++;
              const camera = mapCameraToModel(data.camera);
              cameras.push(camera);
              
              if (cameraCallback) {
                cameraCallback(camera);
              }
              
              // Update progress to include the newly found camera
              if (progressCallback) {
                progressCallback({
                  camerasFound: counter
                });
              }
            } else if (data.type === 'error') {
              console.error('Scan error:', data.error);
            }
          } catch (jsonError) {
            console.error('Error parsing scan data:', jsonError);
          }
        }
      }
    }

    // Signal completion if not aborted
    if (!abortSignal?.aborted && progressCallback) {
      progressCallback({
        status: 'completed',
        targetsScanned: 100,
        camerasFound: cameras.length
      });
    }

    return {
      success: true,
      data: {
        cameras,
        total: cameras.length
      }
    };
  } catch (error) {
    // Check if this was an abort error
    if (abortSignal?.aborted) {
      console.log('Scan aborted by user');
      return {
        success: false,
        data: { cameras: [], total: 0 },
        error: 'Scan aborted'
      };
    }
    
    console.error('Network scan error:', error);
    
    if (progressCallback) {
      progressCallback({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown scan error'
      });
    }
    
    return {
      success: false,
      data: { cameras: [], total: 0 },
      error: error instanceof Error ? error.message : 'Unknown scan error'
    };
  }
};

export default scanNetwork;

// Export the utility functions
export {
  generateRandomIP,
  mapCameraToModel
};
