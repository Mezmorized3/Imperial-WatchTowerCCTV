
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
    baseUrl: process.env.IMPERIAL_SERVER_URL || 'localhost',
    port: parseInt(process.env.IMPERIAL_SERVER_PORT || '5001'),
    useHttps: process.env.IMPERIAL_SERVER_HTTPS === 'true'
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
   * Authenticate with the Imperial Server
   */
  async authenticate(token: string): Promise<boolean> {
    try {
      const result = await imperialShieldProtocol.request({
        targetUrl: `${this.config.baseUrl}/v1/api/auth`,
        port: this.config.port,
        protocol: this.config.useHttps ? 'https' : 'http',
        authToken: token
      });
      
      if (result.success && result.data?.token) {
        this.setAuthToken(result.data.token);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Imperial authentication error:', error);
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
      if (process.env.NODE_ENV === 'development') {
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
}

// Export a singleton instance
export const imperialServerService = new ImperialServerService();
