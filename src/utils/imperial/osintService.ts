
import { toast } from "sonner";
import { imperialAuthService } from "./authService";

/**
 * OSINT tools service for the Imperial Server
 */
export class ImperialOsintService {
  /**
   * Execute an OSINT tool via the Control Panel API server
   */
  async executeOsintTool(tool: string, params: Record<string, any>): Promise<any | null> {
    const authToken = imperialAuthService.getAuthToken();
    
    if (!authToken) {
      toast.error('Imperial authentication required');
      return null;
    }

    try {
      const response = await fetch(`http://localhost:5001/v1/api/osint/${tool}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
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
   * Execute Imperial Shinobi for advanced camera security operations
   */
  async executeImperialShinobi(params: {
    module: string;
    target: string;
    scanType?: string;
    authType?: string;
    customParams?: string;
  }): Promise<any | null> {
    return this.executeOsintTool('imperial-shinobi', params);
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
}

// Export a singleton instance
export const imperialOsintService = new ImperialOsintService();
