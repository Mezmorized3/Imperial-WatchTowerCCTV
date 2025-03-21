/**
 * Imperial Server Service
 * Provides communication with the Imperial Server for various operations
 */

import { toast } from "sonner";

const IMPERIAL_SERVER_BASE_URL = 'http://localhost:7443/v1';
const ADMIN_API_URL = `${IMPERIAL_SERVER_BASE_URL}/admin`;

interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
}

interface ImperialServerStatus {
  [port: string]: {
    status: string;
    lastActivation: string | null;
    operationalCapacity: string;
    role: string;
  };
}

interface DiagnosticsResponse {
  systemStatus: string;
  imperialResources: any;
  legionHealth: ImperialServerStatus;
  throneRoomMetrics: any[];
}

interface DecreeResponse {
  status: number;
  decree: string;
}

class ImperialServerService {
  private authToken: string | null = localStorage.getItem('imperialToken');

  /**
   * Authenticate with the Imperial Server
   */
  async authenticate(token: string): Promise<boolean> {
    try {
      // First check if token works by attempting to get status
      const response = await fetch(`${ADMIN_API_URL}/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        this.authToken = token;
        localStorage.setItem('imperialToken', token);
        return true;
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Imperial authentication error:', error);
      return false;
    }
  }

  /**
   * Check if we're authenticated with the Imperial Server
   */
  isAuthenticated(): boolean {
    return !!this.authToken;
  }

  /**
   * Get the current status of all Imperial Legions
   */
  async getImperialStatus(): Promise<ImperialServerStatus | null> {
    if (!this.authToken) {
      toast.error('Imperial authentication required');
      return null;
    }

    try {
      const response = await fetch(`${ADMIN_API_URL}/status`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Imperial status error:', error);
      toast.error('Failed to retrieve Imperial status');
      return null;
    }
  }

  /**
   * Get comprehensive diagnostics from the Imperial Server
   */
  async getImperialDiagnostics(): Promise<DiagnosticsResponse | null> {
    if (!this.authToken) {
      toast.error('Imperial authentication required');
      return null;
    }

    try {
      const response = await fetch(`${ADMIN_API_URL}/diagnostics`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Diagnostics check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Imperial diagnostics error:', error);
      toast.error('Failed to retrieve Imperial diagnostics');
      return null;
    }
  }

  /**
   * Issue a decree to mobilize or stand down a legion
   */
  async issueDecree(port: number, command: 'MOBILIZE' | 'STAND_DOWN'): Promise<DecreeResponse | null> {
    if (!this.authToken) {
      toast.error('Imperial authentication required');
      return null;
    }

    try {
      const response = await fetch(`${ADMIN_API_URL}/decree/${port}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Imperial decree error:', error);
      toast.error('Failed to issue Imperial decree');
      return null;
    }
  }

  /**
   * Get metrics from the Imperial Server
   */
  async getImperialMetrics(): Promise<any | null> {
    if (!this.authToken) {
      toast.error('Imperial authentication required');
      return null;
    }

    try {
      const response = await fetch(`${ADMIN_API_URL}/metrics`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Metrics check failed: ${response.status}`);
      }

      return await response.text(); // Prometheus metrics are returned as text
    } catch (error) {
      console.error('Imperial metrics error:', error);
      toast.error('Failed to retrieve Imperial metrics');
      return null;
    }
  }

  /**
   * Execute an OSINT tool via the Control Panel API server (port 5001)
   */
  async executeOsintTool(tool: string, params: Record<string, any>): Promise<any | null> {
    if (!this.authToken) {
      toast.error('Imperial authentication required');
      return null;
    }

    try {
      const response = await fetch(`http://localhost:5001/v1/api/osint/${tool}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error(`Tool execution failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Imperial OSINT tool error (${tool}):`, error);
      toast.error(`Failed to execute ${tool}`);
      return null;
    }
  }

  /**
   * Execute Imperial Pawn for CCTV camera bruteforcing
   */
  async executeImperialPawn(params: {
    targets: string[] | string;
    usernames?: string[];
    passwords?: string[];
    generateLoginCombos?: boolean;
    threads?: number;
    timeout?: number;
    skipCameraCheck?: boolean;
  }): Promise<any | null> {
    const formattedParams = {
      ...params,
      targets: Array.isArray(params.targets) ? params.targets : params.targets.split(',').map(t => t.trim())
    };
    
    return this.executeOsintTool('imperial-pawn', formattedParams);
  }

  /**
   * Initiate a camera scan using the server-side implementation
   */
  async initiateCameraScan(targetIP: string, scanType: string): Promise<any | null> {
    return this.executeOsintTool('cameradar', {
      target: targetIP,
      scanType: scanType
    });
  }

  /**
   * Initiate a web check using the server-side implementation
   */
  async initiateWebCheck(url: string): Promise<any | null> {
    return this.executeOsintTool('webcheck', {
      url: url
    });
  }

  /**
   * Perform username search across platforms
   */
  async searchUsername(username: string): Promise<any | null> {
    return this.executeOsintTool('sherlock', {
      username: username
    });
  }

  /**
   * Perform IP camera search using various protocols
   */
  async searchIPCameras(subnet: string, protocols: string[]): Promise<any | null> {
    return this.executeOsintTool('ipcamsearch', {
      subnet: subnet,
      protocols: protocols
    });
  }

  /**
   * Log out from the Imperial Server
   */
  logout(): void {
    this.authToken = null;
    localStorage.removeItem('imperialToken');
    toast.info('Imperial authentication revoked');
  }
}

// Export a singleton instance
export const imperialServerService = new ImperialServerService();
