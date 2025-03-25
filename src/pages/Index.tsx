
import React, { useState, useEffect } from 'react';
import { ScanProgress, CameraResult, ScanTarget, ScanSettings } from '@/types/scanner';
import { Toaster } from '@/components/ui/toaster';
import DashboardHeader from '@/components/DashboardHeader';
import CommandPalette from '@/components/CommandPalette';
import { useRealTime } from '@/contexts/RealTimeContext';
import RealTimeStatus from '@/components/RealTimeStatus';

// Import refactored components
import ScanController from '@/components/dashboard/ScanController';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import ScanNotifications from '@/components/dashboard/ScanNotifications';
import ScanPanel from '@/components/dashboard/ScanPanel';
import ImperialBanner from '@/components/dashboard/ImperialBanner';
import ImperialStartup from '@/components/dashboard/ImperialStartup';
import { useIntegratedScanHandler } from '@/components/dashboard/IntegratedScanHandler';

const Index = () => {
  // Get real-time data from context
  const { 
    isConnected, 
    connect,
    scanProgress: realtimeScanProgress, 
    cameras: realtimeCameras,
    startScan: realtimeStartScan 
  } = useRealTime();
  
  const [results, setResults] = useState<CameraResult[]>([]);
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    status: 'idle',
    targetsTotal: 0,
    targetsScanned: 0,
    camerasFound: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('map');
  const [showAscii, setShowAscii] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);
  const [serverStarted, setServerStarted] = useState(false);

  // Sync with real-time data when available
  useEffect(() => {
    if (isConnected) {
      setScanProgress(realtimeScanProgress);
    }
  }, [isConnected, realtimeScanProgress]);

  useEffect(() => {
    if (isConnected && realtimeCameras.length > 0) {
      setResults(realtimeCameras);
    }
  }, [isConnected, realtimeCameras]);

  useEffect(() => {
    setActiveTab('map');
  }, []);

  useEffect(() => {
    if (scanProgress.status === 'running') {
      setActiveTab('map');
    }
  }, [scanProgress.status]);

  // Configure scan controller
  const { handleStartScan } = ScanController({
    onScanProgressUpdate: (progress) => {
      setScanProgress(progress);
      // If we're connected to real-time, send scan progress update
      if (isConnected) {
        // This would be handled by the real-time context
      }
    },
    onResultsUpdate: (newResults) => {
      setResults(newResults);
    },
    onErrorOccurred: setError
  });

  // Use the integrated scan handler
  const { handleIntegratedScan } = useIntegratedScanHandler({
    isConnected,
    realtimeStartScan,
    setScanProgress,
    setResults,
    handleStartScan
  });

  const toggleAscii = () => {
    setShowAscii(!showAscii);
  };

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <main className="container mx-auto py-6 px-4">
        {/* Imperial Army ASCII banner */}
        <ImperialBanner showAscii={showAscii} toggleAscii={toggleAscii} />
        
        {/* Header with real-time status */}
        <div className="flex justify-between items-center mb-4">
          <DashboardHeader />
          <RealTimeStatus />
        </div>
        
        {/* Startup Button */}
        <ImperialStartup setServerStarted={setServerStarted} connect={connect} />
        
        <ScanNotifications error={error} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-1">
            <ScanPanel 
              onStartScan={handleIntegratedScan}
              isScanning={scanProgress.status === 'running'} 
              scanProgress={scanProgress}
            />
          </div>
          
          <div className="lg:col-span-2">
            <DashboardTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              results={results}
              scanProgress={scanProgress}
            />
          </div>
        </div>
      </main>
      
      <CommandPalette open={commandOpen} setOpen={setCommandOpen} />
      <Toaster />
    </div>
  );
};

export default Index;
