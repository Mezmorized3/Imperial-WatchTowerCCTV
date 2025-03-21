
import { toast } from "sonner";

/**
 * Authentication service for the Imperial Server
 */
export class ImperialAuthService {
  private authToken: string | null = localStorage.getItem('imperialToken');
  
  /**
   * Authenticate with the Imperial Server
   */
  async authenticate(token: string): Promise<boolean> {
    try {
      // Instead of connecting directly to localhost, use a simulated authentication
      // This allows the app to work in a browser environment
      console.log("Authenticating with token:", token);
      
      // Simulate authentication by validating the token against config.json
      const configResponse = await fetch('/server/config.json');
      if (!configResponse.ok) {
        throw new Error('Failed to fetch server configuration');
      }
      
      const config = await configResponse.json();
      
      // Validate the provided token against the one in config
      if (token === config.adminToken) {
        // Store token and return success
        this.authToken = token;
        localStorage.setItem('imperialToken', token);
        toast.success("Imperial authentication successful");
        return true;
      } else {
        throw new Error('Invalid authentication token');
      }
    } catch (error) {
      console.error('Imperial authentication error:', error);
      toast.error("Authentication failed: Invalid token");
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
   * Get the current auth token
   */
  getAuthToken(): string | null {
    return this.authToken;
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
export const imperialAuthService = new ImperialAuthService();
