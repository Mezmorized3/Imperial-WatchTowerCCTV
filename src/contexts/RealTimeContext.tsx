
/**
 * Real-Time Context Provider
 * 
 * Provides real-time state and WebSocket communication to the application
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ScanProgress, CameraResult } from '@/types/scanner';
import { useWebSocket } from '@/hooks/useWebSocket';
import { toast } from '@/components/ui/use-toast';

interface ServerStatus {
  status: 'online' | 'offline' | 'degraded';
  message?: string;
  lastUpdated: Date;
}

interface Alert {
  id: string;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  read: boolean;
}

interface RealTimeContextValue {
  // Connection state
  isConnected: boolean;
  connectionState: string;
  connect: () => Promise<boolean>;  // Modified to return a Promise<boolean>
  disconnect: () => void;
  
  // Real-time data
  serverStatus: ServerStatus;
  scanProgress: ScanProgress;
  alerts: Alert[];
  cameras: CameraResult[];
  
  // Actions
  markAlertAsRead: (alertId: string) => void;
  startScan: (options: any) => void;
  updateCameraStatus: (cameraId: string, status: string) => void;
}

// Default context values
const defaultContext: RealTimeContextValue = {
  isConnected: false,
  connectionState: 'disconnected',
  connect: async () => false,  // Default now returns false
  disconnect: () => {},
  
  serverStatus: {
    status: 'offline',
    lastUpdated: new Date()
  },
  
  scanProgress: {
    status: 'idle',
    targetsTotal: 0,
    targetsScanned: 0,
    camerasFound: 0
  },
  
  alerts: [],
  cameras: [],
  
  markAlertAsRead: () => {},
  startScan: () => {},
  updateCameraStatus: () => {}
};

// Create the context
const RealTimeContext = createContext<RealTimeContextValue>(defaultContext);

// Custom hook to use the context
export const useRealTime = () => useContext(RealTimeContext);

interface RealTimeProviderProps {
  children: ReactNode;
  serverUrl?: string;
}

// Context provider component
export const RealTimeProvider: React.FC<RealTimeProviderProps> = ({ 
  children,
  serverUrl = 'ws://localhost:8080'
}) => {
  // State for real-time data
  const [serverStatus, setServerStatus] = useState<ServerStatus>(defaultContext.serverStatus);
  const [scanProgress, setScanProgress] = useState<ScanProgress>(defaultContext.scanProgress);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [cameras, setCameras] = useState<CameraResult[]>([]);
  
  // Get WebSocket functionality from our hook
  const {
    isConnected,
    connectionState,
    connect: connectToServer,
    disconnect,
    subscribe,
    sendMessage
  } = useWebSocket({
    serverUrl,
    autoConnect: true,
    onOpen: () => {
      console.log('WebSocket connection opened');
      toast({
        title: "Real-time Connection Established",
        description: "You are now receiving live updates from the Imperial Server",
      });
    },
    onClose: () => {
      console.log('WebSocket connection closed');
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to establish real-time connection to the server",
        variant: "destructive"
      });
    }
  });
  
  // Connect to the WebSocket server
  const connect = async (): Promise<boolean> => {
    return await connectToServer();
  };
  
  // Subscribe to WebSocket events when connected
  useEffect(() => {
    if (!isConnected) return;
    
    // Server status updates
    const unsubServerStatus = subscribe('server_status', (data) => {
      setServerStatus({
        status: data.status,
        message: data.message,
        lastUpdated: new Date()
      });
    });
    
    // Scan progress updates
    const unsubScanProgress = subscribe('scan_progress', (data) => {
      setScanProgress(data);
    });
    
    // Camera status updates
    const unsubCameraStatus = subscribe('camera_status', (data) => {
      setCameras(currentCameras => {
        // Update the camera if it exists, otherwise add it
        const cameraIndex = currentCameras.findIndex(cam => cam.id === data.id);
        if (cameraIndex >= 0) {
          const updatedCameras = [...currentCameras];
          updatedCameras[cameraIndex] = { ...updatedCameras[cameraIndex], ...data };
          return updatedCameras;
        } else {
          return [...currentCameras, data];
        }
      });
    });
    
    // Threat alerts
    const unsubThreatAlert = subscribe('threat_alert', (data) => {
      const newAlert: Alert = {
        id: data.id || `alert-${Date.now()}`,
        type: data.type,
        message: data.message,
        severity: data.severity,
        timestamp: new Date(),
        read: false
      };
      
      setAlerts(currentAlerts => [newAlert, ...currentAlerts]);
      
      // Show toast for new alerts
      toast({
        title: `${data.severity.charAt(0).toUpperCase() + data.severity.slice(1)} Alert`,
        description: data.message,
        variant: data.severity === 'critical' || data.severity === 'high' ? "destructive" : "default",
      });
    });
    
    // General notifications
    const unsubNotification = subscribe('notification', (data) => {
      if (data.message) {
        toast({
          title: data.title || "Notification",
          description: data.message,
          variant: data.level === 'error' ? "destructive" : "default",
        });
      }
    });
    
    // Clean up subscriptions
    return () => {
      unsubServerStatus();
      unsubScanProgress();
      unsubCameraStatus();
      unsubThreatAlert();
      unsubNotification();
    };
  }, [isConnected, subscribe]);
  
  // Start a scan
  const startScan = (options: any) => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Cannot start scan: No connection to the server",
        variant: "destructive"
      });
      return;
    }
    
    sendMessage('scan_progress', { 
      command: 'start_scan',
      options 
    });
  };
  
  // Update camera status
  const updateCameraStatus = (cameraId: string, status: string) => {
    if (!isConnected) return;
    
    sendMessage('camera_status', {
      command: 'update_status',
      cameraId,
      status
    });
  };
  
  // Mark an alert as read
  const markAlertAsRead = (alertId: string) => {
    setAlerts(currentAlerts => 
      currentAlerts.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  };
  
  // Create the context value
  const contextValue: RealTimeContextValue = {
    isConnected,
    connectionState,
    connect,
    disconnect,
    
    serverStatus,
    scanProgress,
    alerts,
    cameras,
    
    markAlertAsRead,
    startScan,
    updateCameraStatus
  };
  
  return (
    <RealTimeContext.Provider value={contextValue}>
      {children}
    </RealTimeContext.Provider>
  );
};
