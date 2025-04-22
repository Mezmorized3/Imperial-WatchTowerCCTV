
/**
 * Shinobi CCTV service implementation
 */

import { toast } from "sonner";
import { imperialAuthService } from "./authService";

export interface ShinobiCameraConfig {
  id?: string;
  name: string;
  host: string;
  port: number;
  username?: string;
  password?: string;
  protocol: 'rtsp' | 'http' | 'mjpeg' | 'hls';
  path?: string;
  recording?: boolean;
  recordingRetention?: number;
  motionDetection?: boolean;
  objectDetection?: boolean;
}

export class ImperialShinobiService {
  private apiBaseUrl = 'http://localhost:5001/v1/api/shinobi';
  private mockCameras: ShinobiCameraConfig[] = [];
  
  constructor() {
    // Initialize with some mock cameras
    this.mockCameras = [
      {
        id: 'cam-1',
        name: 'Front Entrance',
        host: '192.168.1.101',
        port: 554,
        protocol: 'rtsp',
        path: '/stream1',
        recording: true,
        motionDetection: true
      },
      {
        id: 'cam-2',
        name: 'Back Yard',
        host: '192.168.1.102',
        port: 554,
        protocol: 'rtsp',
        path: '/stream1',
        recording: false,
        motionDetection: true
      },
      {
        id: 'cam-3',
        name: 'Hallway',
        host: '192.168.1.103',
        port: 8080,
        protocol: 'http',
        path: '/video',
        recording: true,
        objectDetection: true
      }
    ];
  }
  
  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<any> {
    const authToken = imperialAuthService.getAuthToken();
    
    if (!authToken) {
      toast.error('Authentication required');
      return null;
    }
    
    try {
      // Simulate API request
      console.log(`Simulating ${method} request to ${endpoint} with data:`, data);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Handle different endpoints with mock responses
      if (endpoint === 'cameras' && method === 'GET') {
        return { success: true, cameras: this.mockCameras };
      }
      
      else if (endpoint === 'cameras' && method === 'POST' && data) {
        const newCamera = { ...data, id: `cam-${Date.now()}` };
        this.mockCameras.push(newCamera);
        return { success: true, camera: newCamera };
      }
      
      else if (endpoint.startsWith('cameras/') && method === 'PUT') {
        const cameraId = endpoint.split('/')[1];
        const cameraIndex = this.mockCameras.findIndex(cam => cam.id === cameraId);
        
        if (cameraIndex >= 0) {
          this.mockCameras[cameraIndex] = { ...this.mockCameras[cameraIndex], ...data };
          return { success: true, camera: this.mockCameras[cameraIndex] };
        } else {
          return { success: false, error: 'Camera not found' };
        }
      }
      
      else if (endpoint.startsWith('cameras/') && method === 'DELETE') {
        const cameraId = endpoint.split('/')[1];
        const initialLength = this.mockCameras.length;
        this.mockCameras = this.mockCameras.filter(cam => cam.id !== cameraId);
        
        if (initialLength > this.mockCameras.length) {
          return { success: true, message: 'Camera deleted' };
        } else {
          return { success: false, error: 'Camera not found' };
        }
      }
      
      else if (endpoint === 'status') {
        return {
          success: true,
          status: {
            isRunning: true,
            uptime: 1234567,
            version: '2.0.0',
            cpuUsage: Math.random() * 100,
            memoryUsage: Math.random() * 100,
            totalCameras: this.mockCameras.length,
            activeCameras: this.mockCameras.filter(c => c.recording).length
          }
        };
      }
      
      return { success: false, error: 'Not implemented' };
      
    } catch (error) {
      console.error(`Shinobi service error (${endpoint}):`, error);
      toast.error(`Shinobi operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { success: false, error: 'Request failed' };
    }
  }
  
  async getCameras(): Promise<ShinobiCameraConfig[]> {
    const result = await this.makeRequest('cameras', 'GET');
    return result?.success ? result.cameras : [];
  }
  
  async addCamera(camera: ShinobiCameraConfig): Promise<ShinobiCameraConfig | null> {
    const result = await this.makeRequest('cameras', 'POST', camera);
    return result?.success ? result.camera : null;
  }
  
  async updateCamera(id: string, camera: Partial<ShinobiCameraConfig>): Promise<ShinobiCameraConfig | null> {
    const result = await this.makeRequest(`cameras/${id}`, 'PUT', camera);
    return result?.success ? result.camera : null;
  }
  
  async deleteCamera(id: string): Promise<boolean> {
    const result = await this.makeRequest(`cameras/${id}`, 'DELETE');
    return !!result?.success;
  }
  
  async getSystemStatus(): Promise<any> {
    const result = await this.makeRequest('status', 'GET');
    return result?.success ? result.status : null;
  }
  
  // Methods to control recording
  async startRecording(cameraId: string): Promise<boolean> {
    const result = await this.makeRequest(`cameras/${cameraId}/recording/start`, 'POST');
    
    if (result?.success) {
      // Update local state
      const cam = this.mockCameras.find(c => c.id === cameraId);
      if (cam) cam.recording = true;
    }
    
    return !!result?.success;
  }
  
  async stopRecording(cameraId: string): Promise<boolean> {
    const result = await this.makeRequest(`cameras/${cameraId}/recording/stop`, 'POST');
    
    if (result?.success) {
      // Update local state
      const cam = this.mockCameras.find(c => c.id === cameraId);
      if (cam) cam.recording = false;
    }
    
    return !!result?.success;
  }
}

// Export singleton instance
export const imperialShinobiService = new ImperialShinobiService();
