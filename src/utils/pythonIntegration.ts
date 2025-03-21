/**
 * This utility provides integration with Python-based OSINT tools running on the server
 */

interface PythonToolResponse {
  success: boolean;
  data: any;
  error?: string;
}

interface PythonToolRequest {
  tool: string;
  params: Record<string, any>;
}

/**
 * Base URL for the Python tools API - should match your server configuration
 * For development, we'll use a different port than the main app
 */
export const PYTHON_API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/v1/api/osint' // Production path
  : 'http://localhost:5001/v1/api/osint'; // Development server

/**
 * Execute a Python-based OSINT tool via API
 * @param toolName The name of the tool to execute (sherlock, searchcam, etc.)
 * @param params Parameters to pass to the tool
 * @returns Promise with the tool's response
 */
export const executePythonTool = async (
  toolName: string, 
  params: Record<string, any>
): Promise<PythonToolResponse> => {
  try {
    console.log(`Executing ${toolName} with params:`, params);
    
    const response = await fetch(`${PYTHON_API_BASE_URL}/${toolName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
 * Available Python OSINT tools
 */
export const PYTHON_TOOLS = {
  SHERLOCK: 'sherlock',
  SEARCHCAM: 'searchcam',
  CAMERADAR: 'cameradar',
  WEBCHECK: 'webcheck',
  INSECAM: 'insecam',
  IPCAMSEARCH: 'ipcamsearch',
  CCTVMAP: 'cctvmap',
  IMPERIAL_PAWN: 'imperial-pawn',
  IMPERIAL_SHINOBI: 'imperial-shinobi'
};

/**
 * Get status of Python OSINT API
 * @returns Promise with API status
 */
export const checkPythonApiStatus = async (): Promise<{
  available: boolean;
  tools: string[];
}> => {
  try {
    const response = await fetch(`${PYTHON_API_BASE_URL}/status`);
    if (!response.ok) {
      return { available: false, tools: [] };
    }
    
    const data = await response.json();
    return {
      available: true,
      tools: data.availableTools || []
    };
  } catch (error) {
    console.error('Error checking Python API status:', error);
    return { available: false, tools: [] };
  }
};

/**
 * Execute Imperial Pawn CCTV bruteforce tool
 * @param params Configuration for the Imperial Pawn tool
 * @returns Promise with the bruteforce results
 */
export const executeImperialPawn = async (params: {
  targets: string[] | string;
  usernames?: string[];
  passwords?: string[];
  generateLoginCombos?: boolean;
  threads?: number;
  timeout?: number;
  skipCameraCheck?: boolean;
}): Promise<PythonToolResponse> => {
  // Format the targets as an array if it's a string (could be IP range or single IP)
  const formattedParams = {
    ...params,
    targets: Array.isArray(params.targets) ? params.targets : [params.targets]
  };
  
  return executePythonTool(PYTHON_TOOLS.IMPERIAL_PAWN, formattedParams);
};

/**
 * Execute Imperial Shinobi tools for camera security
 * @param params Configuration for the Imperial Shinobi tools
 * @returns Promise with the operation results
 */
export const executeImperialShinobi = async (params: {
  module: string;
  target: string;
  scanType?: string;
  authType?: string;
  customParams?: string;
}): Promise<PythonToolResponse> => {
  return executePythonTool(PYTHON_TOOLS.IMPERIAL_SHINOBI, params);
};
