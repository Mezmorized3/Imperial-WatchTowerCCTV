
/**
 * Imperial Server API Service
 * 
 * This utility provides a centralized way to access the Imperial Server's API endpoints,
 * including the OSINT tools and security analysis features.
 */

interface ImperialAPIResponse {
  success: boolean;
  data: any;
  error?: string;
  simulatedData?: boolean;
}

/**
 * Base URL for the Imperial Server API - should match your server configuration
 */
export const IMPERIAL_API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/v1/api' // Production path
  : 'http://localhost:5001/v1/api'; // Development server

/**
 * Get authentication token for the Imperial Server API
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('imperialToken') || null;
};

/**
 * Set authentication token for the Imperial Server API
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('imperialToken', token);
};

/**
 * Clear authentication token for the Imperial Server API
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem('imperialToken');
};

/**
 * Authenticate with the Imperial Server API
 */
export const authenticate = async (token: string): Promise<ImperialAPIResponse> => {
  try {
    const response = await fetch(`${IMPERIAL_API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.token) {
      setAuthToken(data.token);
      return {
        success: true,
        data
      };
    } else {
      return {
        success: false,
        data: null,
        error: data.message || 'Authentication failed'
      };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Execute an OSINT tool on the Imperial Server
 * @param toolName The name of the tool to execute
 * @param params Parameters to pass to the tool
 * @returns Promise with the tool's response
 */
export const executeOsintTool = async (
  toolName: string, 
  params: Record<string, any>
): Promise<ImperialAPIResponse> => {
  try {
    console.log(`Executing ${toolName} with params:`, params);
    
    // For development, use simulated data
    if (process.env.NODE_ENV !== 'production') {
      return simulateToolResponse(toolName, params);
    }
    
    const token = getAuthToken();
    if (!token) {
      return {
        success: false,
        data: null,
        error: 'Not authenticated. Please authenticate first.'
      };
    }
    
    const response = await fetch(`${IMPERIAL_API_BASE_URL}/osint/${toolName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error(`Error executing ${toolName}:`, error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Get the status of the Imperial Server
 */
export const getServerStatus = async (): Promise<ImperialAPIResponse> => {
  try {
    const token = getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${IMPERIAL_API_BASE_URL}/status`, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error getting server status:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Simulate tool responses for development mode
 */
const simulateToolResponse = (toolName: string, params: Record<string, any>): ImperialAPIResponse => {
  // Generate a simulated response based on the tool name
  switch (toolName) {
    case 'sherlock':
      return {
        success: true,
        simulatedData: true,
        data: {
          username: params.username,
          platforms: [
            { name: 'Twitter', exists: true, url: `https://twitter.com/${params.username}` },
            { name: 'GitHub', exists: true, url: `https://github.com/${params.username}` },
            { name: 'Instagram', exists: Math.random() > 0.5, url: `https://instagram.com/${params.username}` },
            { name: 'Reddit', exists: Math.random() > 0.5, url: `https://reddit.com/user/${params.username}` }
          ]
        }
      };
      
    case 'cameradar':
      return {
        success: true,
        simulatedData: true,
        data: {
          target: params.target,
          streams: Array(Math.floor(Math.random() * 3) + 1).fill(null).map((_, i) => ({
            address: params.target,
            port: 554,
            route: `/stream${i + 1}`,
            service_name: 'rtsp',
            ids: {
              username: 'admin',
              password: 'admin123'
            },
            device_type: 'IP Camera',
            is_authenticated: true
          }))
        }
      };
      
    case 'imperial-pawn':
      return {
        success: true,
        simulatedData: true,
        data: {
          targets: params.targets,
          results: Array(Math.floor(Math.random() * 2) + 1).fill(null).map(() => ({
            ip: Array.isArray(params.targets) ? params.targets[0] : params.targets,
            username: 'admin',
            password: 'admin123'
          }))
        }
      };
      
    case 'imperial-shinobi':
      return {
        success: true,
        simulatedData: true,
        data: {
          module: params.module,
          target: params.target,
          findings: generateToolFindings(params.module, params),
          status: 'success'
        }
      };
      
    default:
      return {
        success: true,
        simulatedData: true,
        data: {
          message: `Simulated response for ${toolName}`,
          params
        }
      };
  }
};

/**
 * Generate simulated findings for different tools
 */
const generateToolFindings = (moduleName: string, params: Record<string, any>): any[] => {
  switch (moduleName) {
    case 'shield-ai':
      return [
        'Detected vulnerable firmware version',
        'Default credentials found: admin:admin123',
        'RTSP stream accessible without authentication',
        'Web interface susceptible to XSS attacks'
      ];
      
    case 'botexploit':
      return [
        'Device identified as Hikvision IP Camera',
        'Vulnerable to CVE-2021-36260 (command injection)',
        'Telnet service running on port 23',
        'ONVIF service misconfigured'
      ];
      
    case 'webhack':
      return [
        'SQL injection vulnerability in login form',
        'Cross-site scripting in search parameter',
        'Outdated Apache server (version 2.4.29)',
        'Directory listing enabled at /backup/'
      ];
      
    case 'camerattack':
      return [
        'Successfully bypassed authentication',
        'Extracted admin credentials',
        'Accessed camera feed without authorization',
        'Modified camera configuration'
      ];
      
    case 'backhack':
      return [
        'Admin panel discovered at /admin/',
        'Backup files found at /db_backup.sql',
        'PHP version disclosure in HTTP headers',
        'File upload vulnerability detected'
      ];
      
    default:
      return [
        `Simulated finding 1 for ${moduleName}`,
        `Simulated finding 2 for ${moduleName}`,
        `Simulated finding 3 for ${moduleName}`
      ];
  }
};

/**
 * Export a service object for easier imports
 */
export const imperialServerService = {
  authenticate,
  executeOsintTool,
  getServerStatus,
  setAuthToken,
  clearAuthToken
};
