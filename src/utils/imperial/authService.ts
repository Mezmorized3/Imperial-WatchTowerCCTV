
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
      // First check if token works by attempting to get status
      const response = await fetch(`http://localhost:7443/v1/admin/status`, {
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
