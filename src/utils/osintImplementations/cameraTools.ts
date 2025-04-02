
/**
 * Camera discovery OSINT tools implementations
 * These now connect to the real GitHub repos via our API:
 * - github.com/Ullaakut/cameradar
 * - github.com/hmgle/ipcam_search_protocol
 * - github.com/Err0r-ICA/CCTV
 * - github.com/pageauc/speed-camera
 * - github.com/Ullaakut/camerattack
 */

import { 
  ScanResult,
  CameraResult,
  CCTVParams, 
  SpeedCameraParams,
  CamerattackParams,
  Vulnerability
} from '../types/cameraTypes';

import { PYTHON_API_BASE_URL, executePythonTool } from '../pythonIntegration';

// Parse IP range into individual IPs
const parseIpRange = (ipRange: string): string[] => {
  // Basic implementation to parse CIDR notation
  if (ipRange.includes('/')) {
    const [baseIp, cidrPart] = ipRange.split('/');
    const cidr = parseInt(cidrPart);
    
    // For simplicity, return a few IPs in the range for simulation
    const ipParts = baseIp.split('.');
    const results: string[] = [];
    
    // Generate 10 IPs in the range
    for (let i = 0; i < 10; i++) {
      const lastOctet = parseInt(ipParts[3]) + i;
      if (lastOctet <= 255) {
        results.push(`${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${lastOctet}`);
      }
    }
    
    return results;
  }
  
  // Single IP
  return [ipRange];
};

// Execute Cameradar tool (github.com/Ullaakut/cameradar)
export const executeCameradar = async (params: { target: string, ports?: string }): Promise<ScanResult> => {
  console.log('Executing Cameradar:', params);

  try {
    // Format parameters for the API
    const apiParams = {
      target: params.target,
      ports: params.ports || '554,8554,8080,80',
      timeout: 5000,
      bruteforce: true
    };
    
    const response = await fetch(`${PYTHON_API_BASE_URL}/cameradar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiParams)
    });

    if (!response.ok) {
      throw new Error(`Cameradar API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Map the results to our format
    return {
      success: true,
      total: data.results?.length || 0,
      found: data.results?.length || 0,
      results: data.results || [],
      data: { 
        cameras: data.results || [],
        total: data.results?.length || 0
      }
    };
  } catch (error) {
    console.error('Cameradar execution error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      total: 0,
      found: 0,
      results: [],
      data: { cameras: [], total: 0 }
    };
  }
};

// Execute IP Cam Search tool (github.com/hmgle/ipcam_search_protocol)
export const executeIPCamSearch = async (params: { subnet: string, protocols?: string[] }): Promise<ScanResult> => {
  console.log('Executing IP Cam Search:', params);
  
  try {
    // Format parameters for the API
    const apiParams = {
      subnet: params.subnet,
      protocols: params.protocols || ['onvif', 'rtsp', 'http'],
      timeout: 3000
    };
    
    const response = await fetch(`${PYTHON_API_BASE_URL}/ipcamsearch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiParams)
    });

    if (!response.ok) {
      throw new Error(`IPCamSearch API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Map the results to our format
    return {
      success: true,
      total: data.results?.length || 0,
      found: data.results?.length || 0,
      results: data.results || [],
      data: { 
        cameras: data.results || [],
        total: data.results?.length || 0
      }
    };
  } catch (error) {
    console.error('IPCamSearch execution error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      total: 0,
      found: 0,
      results: [],
      data: { cameras: [], total: 0 }
    };
  }
};

// Execute CCTV tool (github.com/Err0r-ICA/CCTV)
export const executeCCTV = async (params: CCTVParams): Promise<ScanResult> => {
  console.log('Executing CCTV tool:', params);
  
  try {
    // Format parameters for the API
    const apiParams = {
      target: params.target,
      mode: params.mode || 'default',
      country: params.country,
      timeout: params.timeout || 5000
    };
    
    const response = await fetch(`${PYTHON_API_BASE_URL}/cctv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiParams)
    });

    if (!response.ok) {
      throw new Error(`CCTV API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Map the results to our format
    return {
      success: true,
      total: data.results?.length || 0,
      found: data.results?.length || 0,
      results: data.results || [],
      data: { 
        cameras: data.results || [],
        total: data.results?.length || 0
      }
    };
  } catch (error) {
    console.error('CCTV execution error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      total: 0,
      found: 0,
      results: [],
      data: { cameras: [], total: 0 }
    };
  }
};

// Execute Speed Camera tool (github.com/pageauc/speed-camera)
export const executeSpeedCamera = async (params: SpeedCameraParams): Promise<ScanResult> => {
  console.log('Executing Speed Camera:', params);
  
  try {
    // Format parameters for the API
    const apiParams = {
      target: params.target,
      mode: params.mode || 'scan',
      sensitivity: params.sensitivity || 'medium',
      timeout: params.timeout || 5000
    };
    
    const response = await fetch(`${PYTHON_API_BASE_URL}/speedcamera`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiParams)
    });

    if (!response.ok) {
      throw new Error(`Speed Camera API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Map the results to our format
    return {
      success: true,
      total: data.results?.length || 0,
      found: data.results?.length || 0,
      results: data.results || [],
      data: { 
        cameras: data.results || [],
        total: data.results?.length || 0
      }
    };
  } catch (error) {
    console.error('Speed Camera execution error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      total: 0,
      found: 0,
      results: [],
      data: { cameras: [], total: 0 }
    };
  }
};

// Execute Camerattack tool (github.com/Ullaakut/camerattack)
export const executeCamerattack = async (params: CamerattackParams): Promise<ScanResult> => {
  console.log('Executing Camerattack:', params);
  
  try {
    // Format parameters for the API
    const apiParams = {
      target: params.target,
      mode: params.mode || 'scan',
      timeout: params.timeout || 5000,
      attackType: params.attackType || 'default'
    };
    
    const response = await fetch(`${PYTHON_API_BASE_URL}/camerattack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiParams)
    });

    if (!response.ok) {
      throw new Error(`Camerattack API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Format vulnerabilities properly
    const vulnerabilities: Vulnerability[] = data.vulnerabilities?.map((vuln: any) => ({
      id: vuln.id || `VULN-${Math.random().toString(36).substring(2, 11)}`,
      name: vuln.name || 'Unknown vulnerability',
      description: vuln.description || 'No description provided',
      severity: vuln.severity || 'unknown',
      cve: vuln.cve,
      exploitable: !!vuln.exploitable,
      details: vuln.details || {},
      discoveredAt: vuln.discoveredAt || new Date().toISOString()
    })) || [];
    
    // Map the results to our format
    return {
      success: true,
      total: data.results?.length || 0,
      found: data.results?.length || 0,
      results: data.results || [],
      data: { 
        cameras: data.results || [],
        vulnerabilities,
        total: data.results?.length || 0
      }
    };
  } catch (error) {
    console.error('Camerattack execution error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      total: 0,
      found: 0,
      results: [],
      data: { cameras: [], vulnerabilities: [], total: 0 }
    };
  }
};
