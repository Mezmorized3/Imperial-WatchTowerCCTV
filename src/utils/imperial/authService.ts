
/**
 * Imperial Server Authentication Service
 * Handles authentication and token management for interacting with the Imperial Server
 */

import { toast } from "sonner";

export type ImperialAPIResponse = {
  success: boolean;
  message?: string;
  token?: string;
  data?: any;
  error?: string;
};

class ImperialAuthService {
  private TOKEN_KEY = 'imperial_auth_token';
  
  /**
   * Authenticate with the Imperial Server
   */
  async authenticate(token: string): Promise<ImperialAPIResponse> {
    try {
      // Check for development environment first
      if (window.location.hostname !== 'localhost' && import.meta.env.DEV) {
        console.log('Development mode detected, skipping server authentication');
        // In development or preview environments, auto-authenticate without server
        this.setAuthToken(token);
        return {
          success: true,
          token: token,
          message: 'Development authentication successful'
        };
      }
      
      // If running locally, try to connect to the server
      const response = await fetch('http://localhost:5001/v1/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      // Check for successful response status
      if (!response.ok) {
        // For development environment, simulate success
        if (import.meta.env.DEV) {
          this.setAuthToken(token);
          return {
            success: true,
            token: token,
            message: 'Development authentication successful'
          };
        }
        throw new Error(`Authentication failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.token) {
        this.setAuthToken(data.token);
        return {
          success: true,
          token: data.token,
          message: 'Authentication successful'
        };
      } else {
        // Fall back to development mode authentication if possible
        if (import.meta.env.DEV) {
          this.setAuthToken(token);
          return {
            success: true,
            token: token,
            message: 'Development authentication successful'
          };
        }
        return {
          success: false,
          error: data.message || 'Authentication failed'
        };
      }
    } catch (error) {
      console.error('Imperial authentication error:', error);
      
      // For development, simulate successful authentication
      if (import.meta.env.DEV) {
        console.log('Simulating successful authentication in development mode');
        this.setAuthToken(token);
        toast.success('Development mode: Authentication simulated');
        return {
          success: true,
          token: token,
          message: 'Development authentication successful'
        };
      }
      
      toast.error('Failed to connect to Imperial Server');
      return {
        success: false,
        error: 'Connection to Imperial Server failed'
      };
    }
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
  
  /**
   * Get the stored auth token
   */
  getAuthToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  /**
   * Set the auth token
   */
  setAuthToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  
  /**
   * Clear the auth token (logout)
   */
  clearAuthToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
  
  /**
   * Log out from Imperial Server
   */
  logout(): void {
    this.clearAuthToken();
    toast.success('Logged out from Imperial Server');
  }
  
  /**
   * Get Imperial Server status
   */
  async getImperialStatus(): Promise<ImperialAPIResponse> {
    const token = this.getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'Not authenticated'
      };
    }
    
    try {
      const response = await fetch('http://localhost:5001/v1/admin/status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error getting Imperial status:', error);
      return {
        success: false,
        error: 'Failed to get Imperial Server status'
      };
    }
  }
  
  /**
   * Issue a decree to the Imperial Server
   */
  async issueDecree(port: number, command: string): Promise<ImperialAPIResponse> {
    const token = this.getAuthToken();
    
    if (!token) {
      return {
        success: false,
        error: 'Not authenticated'
      };
    }
    
    try {
      const response = await fetch(`http://localhost:5001/v1/admin/decree/${port}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command })
      });
      
      const data = await response.json();
      return {
        success: data.status < 400,
        data,
        message: data.decree
      };
    } catch (error) {
      console.error('Error issuing decree:', error);
      return {
        success: false,
        error: 'Failed to issue decree to Imperial Server'
      };
    }
  }
  
  /**
   * Get server status
   */
  async getServerStatus(): Promise<ImperialAPIResponse> {
    try {
      // Non-authenticated endpoint for basic status
      const response = await fetch('http://localhost:5001/v1/status', {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
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
        error: 'Failed to connect to Imperial Server'
      };
    }
  }
}

// Export a singleton instance
export const imperialAuthService = new ImperialAuthService();
