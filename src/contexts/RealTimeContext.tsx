
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CameraResult, ScanProgress, ScanTarget, ScanSettings } from '@/types/scanner';

// Types for the context data
interface ServerStatus {
  status: 'online' | 'offline' | 'degraded' | 'pending';
  message?: string;
}

interface RealTimeContextType {
  isConnected: boolean;
  connectionState: 'connecting' | 'connected' | 'disconnected';
  serverStatus: ServerStatus;
  connect: () => Promise<void>;
  disconnect: () => void;
  // Added missing properties
  scanProgress: ScanProgress;
  cameras: CameraResult[];
  startScan: (target: ScanTarget, settings: ScanSettings) => Promise<void>;
}

// Default context values
const defaultContext: RealTimeContextType = {
  isConnected: false,
  connectionState: 'disconnected',
  serverStatus: { status: 'pending' },
  connect: async () => {},
  disconnect: () => {},
  // Added default values for the missing properties
  scanProgress: {
    status: 'idle',
    targetsTotal: 0,
    targetsScanned: 0,
    camerasFound: 0
  },
  cameras: [],
  startScan: async () => {}
};

// Create the context
const RealTimeContext = createContext<RealTimeContextType>(defaultContext);

// Custom hook to use the real-time context
export const useRealTime = () => useContext(RealTimeContext);

// Provider component
interface RealTimeProviderProps {
  children: ReactNode;
}

export const RealTimeProvider: React.FC<RealTimeProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [serverStatus, setServerStatus] = useState<ServerStatus>({ status: 'pending' });
  // Added state for cameras and scan progress
  const [cameras, setCameras] = useState<CameraResult[]>([]);
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    status: 'idle',
    targetsTotal: 0,
    targetsScanned: 0,
    camerasFound: 0
  });

  const connect = async () => {
    try {
      setConnectionState('connecting');
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful connection
      setIsConnected(true);
      setConnectionState('connected');
      setServerStatus({ status: 'online', message: 'Real-time updates active' });
      
      // Schedule periodic status updates
      startStatusChecks();
    } catch (error) {
      console.error('Connection error:', error);
      setIsConnected(false);
      setConnectionState('disconnected');
      setServerStatus({ status: 'offline', message: 'Failed to connect to server' });
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setConnectionState('disconnected');
    setServerStatus({ status: 'offline', message: 'Disconnected' });
  };

  const startScan = async (target: ScanTarget, settings: ScanSettings) => {
    try {
      setScanProgress({
        status: 'running',
        targetsTotal: 100,
        targetsScanned: 0,
        camerasFound: 0,
        startTime: new Date(),
        scanTarget: target,
        scanSettings: settings,
        currentTarget: target.value
      });

      // Simulate scan progress
      const interval = setInterval(() => {
        setScanProgress(prev => {
          const newScanned = Math.min(prev.targetsScanned + 5, prev.targetsTotal);
          const isComplete = newScanned >= prev.targetsTotal;
          
          return {
            ...prev,
            status: isComplete ? 'completed' : 'running',
            targetsScanned: newScanned,
            endTime: isComplete ? new Date() : undefined
          };
        });
      }, 1000);

      // Clean up interval after scan completes
      setTimeout(() => {
        clearInterval(interval);
        setScanProgress(prev => ({
          ...prev,
          status: 'completed',
          targetsScanned: prev.targetsTotal,
          endTime: new Date()
        }));
      }, 21000);

    } catch (error) {
      console.error('Scan error:', error);
      setScanProgress(prev => ({
        ...prev,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  const startStatusChecks = () => {
    // Simulate periodic status updates
    const interval = setInterval(() => {
      // Randomly determine server status for demonstration
      const statuses: ServerStatus[] = [
        { status: 'online', message: 'All systems operational' },
        { status: 'online', message: 'Connection stable' },
        { status: 'degraded', message: 'High server load, possible delays' },
      ];
      
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setServerStatus(randomStatus);
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  };

  // Auto-connect on component mount
  useEffect(() => {
    const autoConnect = async () => {
      // Check if auto-connect is enabled in local storage
      const autoConnectEnabled = localStorage.getItem('autoconnect') !== 'false';
      if (autoConnectEnabled) {
        await connect();
      }
    };
    
    autoConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    isConnected,
    connectionState,
    serverStatus,
    connect,
    disconnect,
    cameras,
    scanProgress,
    startScan
  };

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
};
