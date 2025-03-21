
import { toast } from "sonner";
import { imperialAuthService } from "./authService";

const ADMIN_API_URL = 'http://localhost:7443/v1/admin';

/**
 * Interface for Imperial Server Legion Status
 */
export interface ImperialServerStatus {
  [port: string]: {
    status: string;
    lastActivation: string | null;
    operationalCapacity: string;
    role: string;
  };
}

/**
 * Interface for Diagnostics Response
 */
export interface DiagnosticsResponse {
  systemStatus: string;
  imperialResources: any;
  legionHealth: ImperialServerStatus;
  throneRoomMetrics: any[];
}

/**
 * Interface for Decree Response
 */
export interface DecreeResponse {
  status: number;
  decree: string;
}

/**
 * Status and diagnostics service for the Imperial Server
 */
export class ImperialStatusService {
  /**
   * Get the current status of all Imperial Legions
   */
  async getImperialStatus(): Promise<ImperialServerStatus | null> {
    const authToken = imperialAuthService.getAuthToken();
    
    if (!authToken) {
      toast.error('Imperial authentication required');
      return null;
    }

    try {
      const response = await fetch(`${ADMIN_API_URL}/status`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
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
    const authToken = imperialAuthService.getAuthToken();
    
    if (!authToken) {
      toast.error('Imperial authentication required');
      return null;
    }

    try {
      const response = await fetch(`${ADMIN_API_URL}/diagnostics`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
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
    const authToken = imperialAuthService.getAuthToken();
    
    if (!authToken) {
      toast.error('Imperial authentication required');
      return null;
    }

    try {
      const response = await fetch(`${ADMIN_API_URL}/decree/${port}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
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
    const authToken = imperialAuthService.getAuthToken();
    
    if (!authToken) {
      toast.error('Imperial authentication required');
      return null;
    }

    try {
      const response = await fetch(`${ADMIN_API_URL}/metrics`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
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
}

// Export a singleton instance
export const imperialStatusService = new ImperialStatusService();
