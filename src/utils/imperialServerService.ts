
/**
 * Service for interacting with the Imperial Server
 */
import { toast } from "sonner";
import { imperialShieldProtocol } from "./imperial/imperialShieldProtocol";

interface ImperialServerConfig {
  baseUrl: string;
  port: number;
  useHttps: boolean;
}

export class ImperialServerService {
  private config: ImperialServerConfig = {
    baseUrl: import.meta.env.VITE_IMPERIAL_SERVER_URL || 'localhost',
    port: parseInt(import.meta.env.VITE_IMPERIAL_SERVER_PORT || '5001'),
    useHttps: import.meta.env.VITE_IMPERIAL_SERVER_HTTPS === 'true'
  };
  
  private authToken: string | null = null;
  
  /**
   * Set the auth token for Imperial Server requests
   */
  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem('imperialServerToken', token);
  }
  
  /**
   * Get the current auth token
   */
  getAuthToken(): string | null {
    if (!this.authToken) {
      this.authToken = localStorage.getItem('imperialServerToken');
    }
    return this.authToken;
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
  
  /**
   * Logout from Imperial Server
   */
  logout(): void {
    this.authToken = null;
    localStorage.removeItem('imperialServerToken');
  }
  
  /**
   * Authenticate with the Imperial Server
   */
  async authenticate(token: string): Promise<boolean> {
    try {
      // In development mode, we'll allow direct authentication without server connection
      if (import.meta.env.DEV) {
        console.log('DEV mode authentication: simulating successful auth');
        this.setAuthToken(token);
        toast.success('Development authentication successful');
        return true;
      }
      
      // Construct the full URL for authentication
      const protocol = this.config.useHttps ? 'https' : 'http';
      const url = `${this.config.baseUrl}/v1/api/auth`;
      console.log(`Attempting to authenticate with URL: ${url}`);
      
      const result = await imperialShieldProtocol.request({
        targetUrl: `${this.config.baseUrl}/v1/api/auth`,
        port: this.config.port,
        protocol: this.config.useHttps ? 'https' : 'http',
        method: 'POST',
        body: { token }
      });
      
      if (result.success && result.data?.token) {
        this.setAuthToken(result.data.token);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Imperial authentication error:', error);
      
      // For development, allow authentication even on error
      if (import.meta.env.DEV) {
        console.log('DEV mode authentication after error: simulating successful auth');
        this.setAuthToken(token);
        return true;
      }
      
      return false;
    }
  }
  
  /**
   * Execute an OSINT tool via the Imperial Server
   */
  async executeOsintTool(toolName: string, params: Record<string, any>): Promise<any> {
    const authToken = this.getAuthToken();
    
    if (!authToken) {
      toast.error('Imperial authentication required');
      return { success: false, error: 'Authentication required' };
    }
    
    try {
      // In development, simulate responses
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return {
          success: true,
          data: {
            findings: [
              `Simulated ${toolName} result 1`,
              `Simulated ${toolName} result 2`,
              `Simulated ${toolName} result 3`
            ],
            status: 'success'
          }
        };
      }
      
      const result = await imperialShieldProtocol.request({
        targetUrl: `${this.config.baseUrl}/v1/api/osint/${toolName}`,
        port: this.config.port,
        protocol: this.config.useHttps ? 'https' : 'http',
        authToken
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error');
      }
      
      return result.data;
    } catch (error) {
      console.error(`Imperial OSINT tool error (${toolName}):`, error);
      toast.error(`Failed to execute ${toolName}`);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get Imperial Server status
   */
  async getImperialStatus(): Promise<any> {
    try {
      const result = await imperialShieldProtocol.request({
        targetUrl: `${this.config.baseUrl}/v1/admin/status`,
        port: this.config.port,
        protocol: this.config.useHttps ? 'https' : 'http',
        authToken: this.getAuthToken()
      });
      
      return result.data;
    } catch (error) {
      console.error('Error fetching Imperial Server status:', error);
      return null;
    }
  }
  
  /**
   * Issue a decree to the Imperial Server
   */
  async issueDecree(port: number, command: string): Promise<any> {
    try {
      const result = await imperialShieldProtocol.request({
        targetUrl: `${this.config.baseUrl}/v1/admin/decree/${port}`,
        port: this.config.port,
        protocol: this.config.useHttps ? 'https' : 'http',
        authToken: this.getAuthToken(),
        method: 'POST',
        body: { command }
      });
      
      return result.data;
    } catch (error) {
      console.error('Error issuing decree:', error);
      return null;
    }
  }
  
  /**
   * Initiate a camera scan
   */
  async initiateCameraScan(targetIP: string, scanType: string): Promise<any> {
    return this.executeOsintTool('cameradar', {
      target: targetIP,
      scanType: scanType
    });
  }

  /**
   * Search for IP cameras
   */
  async searchIPCameras(subnet: string, protocols: string[]): Promise<any> {
    return this.executeOsintTool('ipcamsearch', {
      subnet: subnet,
      protocols: protocols
    });
  }

  /**
   * Initiate a web check
   */
  async initiateWebCheck(url: string): Promise<any> {
    return this.executeOsintTool('webcheck', {
      url: url
    });
  }
  
  /**
   * Get server status
   */
  async getServerStatus(): Promise<any> {
    try {
      const result = await imperialShieldProtocol.request({
        targetUrl: `${this.config.baseUrl}/v1/admin/status`,
        port: this.config.port,
        protocol: this.config.useHttps ? 'https' : 'http',
        authToken: this.getAuthToken()
      });
      
      return result.data;
    } catch (error) {
      console.error('Error fetching Imperial Server status:', error);
      return null;
    }
  }

  /**
   * Execute Imperial Shinobi
   */
  async executeImperialShinobi(params: Record<string, any>): Promise<any> {
    return this.executeOsintTool('imperial-shinobi', params);
  }
}

// Export a singleton instance
export const imperialServerService = new ImperialServerService();
