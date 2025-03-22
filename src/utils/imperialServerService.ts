
import { toast } from 'sonner';
import { imperialAuthService } from './imperial/authService';

/**
 * Imperial Server Service
 * Provides a centralized service for interacting with the Imperial Server
 */
class ImperialServerService {
  /**
   * Authenticate with the Imperial Server
   * @param token Admin token for authentication
   * @returns Promise resolving to authentication success
   */
  async authenticate(token: string): Promise<boolean> {
    try {
      const response = await imperialAuthService.authenticate(token);
      
      if (response.success) {
        console.log('Authentication successful');
        return true;
      } else {
        console.error('Authentication failed:', response.error);
        toast.error('Authentication failed');
        return false;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Failed to connect to Imperial Server');
      return false;
    }
  }
  
  /**
   * Check if user is authenticated with the Imperial Server
   * @returns Boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    return imperialAuthService.isAuthenticated();
  }
  
  /**
   * Log out from the Imperial Server
   */
  logout(): void {
    imperialAuthService.clearAuthToken();
  }
  
  /**
   * Get Imperial Server status
   * @returns Promise resolving to server status
   */
  async getServerStatus(): Promise<any> {
    try {
      const authToken = imperialAuthService.getAuthToken();
      
      const headers: HeadersInit = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response = await fetch('http://localhost:5001/v1/api/status', {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting server status:', error);
      throw error;
    }
  }
  
  /**
   * Execute an OSINT tool
   * @param toolName Name of the tool to execute
   * @param params Parameters for the tool
   * @returns Promise resolving to tool results
   */
  async executeOsintTool(toolName: string, params: any): Promise<any> {
    const authToken = imperialAuthService.getAuthToken();
    
    if (!authToken) {
      toast.error('Not authenticated. Please log in first.');
      throw new Error('Authentication required');
    }
    
    const response = await fetch(`http://localhost:5001/v1/api/osint/${toolName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Tool execution failed: ${errorText}`);
    }
    
    return await response.json();
  }
  
  /**
   * Convert RTSP stream to HLS
   * @param rtspUrl RTSP URL to convert
   * @returns Promise resolving to conversion results
   */
  async convertRtspToHls(rtspUrl: string): Promise<any> {
    const authToken = imperialAuthService.getAuthToken();
    
    if (!authToken) {
      toast.error('Not authenticated. Please log in first.');
      throw new Error('Authentication required');
    }
    
    const response = await fetch('http://localhost:5001/v1/api/stream/convert', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ rtspUrl })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Stream conversion failed: ${errorText}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      // Format the URL to point to the media server
      result.fullUrl = `http://localhost:8000${result.accessUrl}`;
    }
    
    return result;
  }
  
  /**
   * Start recording a stream
   * @param streamUrl URL of the stream to record
   * @param duration Optional duration in seconds
   * @returns Promise resolving to recording info
   */
  async startRecording(streamUrl: string, duration?: number): Promise<any> {
    const authToken = imperialAuthService.getAuthToken();
    
    if (!authToken) {
      toast.error('Not authenticated. Please log in first.');
      throw new Error('Authentication required');
    }
    
    const params: any = { streamUrl };
    if (duration) {
      params.duration = duration;
    }
    
    const response = await fetch('http://localhost:5001/v1/api/stream/record/start', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start recording: ${errorText}`);
    }
    
    return await response.json();
  }
  
  /**
   * Stop a recording in progress
   * @param recordingId ID of the recording to stop
   * @returns Promise resolving to recording results
   */
  async stopRecording(recordingId: string): Promise<any> {
    const authToken = imperialAuthService.getAuthToken();
    
    if (!authToken) {
      toast.error('Not authenticated. Please log in first.');
      throw new Error('Authentication required');
    }
    
    const response = await fetch('http://localhost:5001/v1/api/stream/record/stop', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recordingId })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to stop recording: ${errorText}`);
    }
    
    return await response.json();
  }
  
  /**
   * Get list of recordings
   * @returns Promise resolving to recordings list
   */
  async getRecordings(): Promise<any> {
    const authToken = imperialAuthService.getAuthToken();
    
    if (!authToken) {
      toast.error('Not authenticated. Please log in first.');
      throw new Error('Authentication required');
    }
    
    const response = await fetch('http://localhost:5001/v1/api/stream/recordings', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get recordings: ${errorText}`);
    }
    
    return await response.json();
  }
}

// Export a singleton instance
export const imperialServerService = new ImperialServerService();
