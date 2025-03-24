
/**
 * WebSocket Service for Imperial Server
 * 
 * Handles real-time communication between the client and Imperial Server
 */

import { toast } from "@/components/ui/use-toast";

// Event types for WebSocket messages
export type WebSocketEventType = 
  | 'camera_status'
  | 'scan_progress' 
  | 'server_status'
  | 'threat_alert'
  | 'recording_status'
  | 'stream_status'
  | 'notification';

// WebSocket message structure
export interface WebSocketMessage {
  type: WebSocketEventType;
  data: any;
  timestamp: number;
}

// WebSocket connection states
export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

// Event listener type definition
type EventListener = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number = 2000; // Start with 2 seconds
  private eventListeners: Map<WebSocketEventType, EventListener[]> = new Map();
  private connectionState: ConnectionState = 'disconnected';
  private isAutoReconnect = true;
  private url: string = '';

  // Connect to WebSocket server
  connect(serverUrl: string = 'ws://localhost:8080'): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        this.url = serverUrl;
        this.connectionState = 'connecting';
        console.log('Connecting to WebSocket server:', serverUrl);
        
        this.socket = new WebSocket(serverUrl);
        
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          this.connectionState = 'connected';
          this.reconnectAttempts = 0;
          this.dispatchEvent('notification', { 
            message: 'Real-time connection established',
            level: 'success' 
          });
          resolve(true);
        };
        
        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data) as WebSocketMessage;
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        this.socket.onclose = () => {
          this.connectionState = 'disconnected';
          console.log('WebSocket connection closed');
          
          if (this.isAutoReconnect) {
            this.attemptReconnect();
          }
          resolve(false);
        };
        
        this.socket.onerror = (error) => {
          this.connectionState = 'error';
          console.error('WebSocket error:', error);
          resolve(false);
        };
      } catch (error) {
        console.error('Failed to connect to WebSocket server:', error);
        this.connectionState = 'error';
        resolve(false);
      }
    });
  }

  // Handle reconnection attempts
  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum reconnection attempts reached');
      this.dispatchEvent('notification', { 
        message: 'Could not reconnect to server after multiple attempts',
        level: 'error' 
      });
      return;
    }
    
    this.reconnectAttempts++;
    const timeout = this.reconnectTimeout * Math.pow(1.5, this.reconnectAttempts - 1);
    console.log(`Attempting to reconnect in ${timeout / 1000} seconds. Attempt ${this.reconnectAttempts} of ${this.maxReconnectAttempts}`);
    
    setTimeout(() => {
      if (this.connectionState !== 'connected') {
        this.connect(this.url);
      }
    }, timeout);
  }

  // Handle incoming WebSocket messages
  private handleMessage(message: WebSocketMessage) {
    // Debug message
    console.log('Received WebSocket message:', message);
    
    // Dispatch to registered listeners
    this.dispatchEvent(message.type, message.data);
  }

  // Register event listener
  addEventListener(eventType: WebSocketEventType, callback: EventListener) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    
    const listeners = this.eventListeners.get(eventType);
    if (listeners && !listeners.includes(callback)) {
      listeners.push(callback);
    }
  }

  // Remove event listener
  removeEventListener(eventType: WebSocketEventType, callback: EventListener) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Dispatch event to registered listeners
  private dispatchEvent(eventType: WebSocketEventType, data: any) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in ${eventType} event listener:`, error);
        }
      });
    }
  }

  // Send message to WebSocket server
  sendMessage(type: WebSocketEventType, data: any) {
    if (this.connectionState !== 'connected' || !this.socket) {
      console.warn('Cannot send message: WebSocket not connected');
      return false;
    }
    
    try {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: Date.now()
      };
      
      this.socket.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }

  // Disconnect from WebSocket server
  disconnect() {
    this.isAutoReconnect = false;
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.connectionState = 'disconnected';
    console.log('WebSocket disconnected');
  }

  // Get current connection state
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export { websocketService };
