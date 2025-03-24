
/**
 * Custom hook to integrate WebSocket functionality into React components
 */

import { useEffect, useState, useCallback } from 'react';
import { websocketService, WebSocketEventType, ConnectionState } from '@/utils/websocketService';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  serverUrl?: string;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: any) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    autoConnect = true,
    serverUrl = 'ws://localhost:8080',
    onOpen,
    onClose,
    onError
  } = options;
  
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  
  // Initialize connection
  useEffect(() => {
    const checkConnection = () => {
      const currentState = websocketService.getConnectionState();
      setConnectionState(currentState);
      setIsConnected(currentState === 'connected');
    };
    
    // Check initial connection state
    checkConnection();
    
    // Set up interval to check connection status
    const intervalId = setInterval(checkConnection, 2000);
    
    // Auto-connect if specified
    if (autoConnect) {
      connectToServer();
    }
    
    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [autoConnect, serverUrl]);
  
  // Connect to WebSocket server
  const connectToServer = useCallback(async (): Promise<boolean> => {
    try {
      const success = await websocketService.connect(serverUrl);
      setIsConnected(success);
      if (success && onOpen) {
        onOpen();
      } else if (!success && onClose) {
        onClose();
      }
      return success;
    } catch (error) {
      console.error('Error connecting to WebSocket server:', error);
      if (onError) {
        onError(error);
      }
      return false;
    }
  }, [serverUrl, onOpen, onClose, onError]);
  
  // Disconnect from WebSocket server
  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);
  
  // Subscribe to WebSocket events
  const subscribe = useCallback((eventType: WebSocketEventType, callback: (data: any) => void) => {
    websocketService.addEventListener(eventType, callback);
    
    // Return unsubscribe function
    return () => {
      websocketService.removeEventListener(eventType, callback);
    };
  }, []);
  
  // Send WebSocket message
  const sendMessage = useCallback((type: WebSocketEventType, data: any) => {
    return websocketService.sendMessage(type, data);
  }, []);
  
  return {
    isConnected,
    connectionState,
    connect: connectToServer,
    disconnect,
    subscribe,
    sendMessage
  };
}
