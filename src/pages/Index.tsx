import React, { useState, useEffect } from 'react';
import { ScanProgress, CameraResult, ScanTarget, ScanSettings } from '@/types/scanner';
import { Toaster } from '@/components/ui/toaster';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import CommandPalette from '@/components/CommandPalette';
import { toast } from '@/components/ui/use-toast';
import { useRealTime } from '@/contexts/RealTimeContext';
import RealTimeStatus from '@/components/RealTimeStatus';

// Import refactored components
import ScanController from '@/components/dashboard/ScanController';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import ScanNotifications from '@/components/dashboard/ScanNotifications';
import ScanPanel from '@/components/dashboard/ScanPanel';

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
  
  const imperialArmyBanner = `
    ██╗███╗   ███╗██████╗ ███████╗██████╗ ██╗ █████╗ ██╗          █████╗ ██████╗ ███╗   ███╗██╗   ██╗
    ██║████╗ ████║██╔══██╗██╔════╝██╔══██╗██║██╔══██╗██║         ██╔══██╗██╔══██╗████╗ ████║╚██╗ ██╔╝
    ██║██╔████╔██║██████╔╝█████╗  ██████╔╝██║███████║██║         ███████║██████╔╝██╔████╔██║ ╚████╔╝ 
    ██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗██║██╔══██║██║         ██╔══██║██╔══██╗██║╚██╔╝██║  ╚██╔╝  
    ██║██║ ╚═╝ ██║██║     ███████╗██║  ██║██║██║  ██║███████╗    ██║  ██║██║  ██║██║ ╚═╝ ██║   ██║   
    ╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝   ╚═╝   
  `;

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

  const handleRealTimeStartScan = (target: ScanTarget, settings: ScanSettings) => {
    // If connected to real-time, use that for starting scan
    if (isConnected) {
      realtimeStartScan({ target, settings });
    } else {
      // Fall back to regular method
      handleStartScan();
    }
  };

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

  // Function to start Imperial Server
  const handleServerStart = () => {
    if (window.startImperialServer) {
      const success = window.startImperialServer();
      setServerStarted(true);
      
      // Try to connect to real-time after server start
      if (success) {
        setTimeout(async () => {
          try {
            await connect();
          } catch (error) {
            console.error("Failed to connect to WebSocket:", error);
          }
        }, 2000); // Give server time to start up
      }
      
      toast({
        title: success ? "Imperial Server Started" : "Server Start Failed",
        description: success 
          ? "All systems initialized and operational" 
          : "Please launch the server manually",
        variant: success ? "default" : "destructive"
      });
    } else {
      toast({
        title: "Desktop App Required",
        description: "Auto-start requires the desktop application",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <main className="container mx-auto py-6 px-4">
        {/* Imperial Army ASCII banner */}
        {showAscii && (
          <div className="mx-auto mt-2 mb-4">
            <div className="bg-scanner-dark p-4 rounded-md overflow-x-auto w-full">
              <pre className="text-[#ea384c] text-xs font-mono">{imperialArmyBanner}</pre>
            </div>
          </div>
        )}
        
        {/* Header with real-time status */}
        <div className="flex justify-between items-center mb-4">
          <DashboardHeader />
          <RealTimeStatus />
        </div>
        
        {/* Startup Button */}
        <div className="flex justify-center mt-4 mb-6">
          <Button 
            onClick={handleServerStart}
            className="bg-scanner-primary hover:bg-scanner-primary/80 text-white py-3 px-6 rounded-md flex items-center gap-2 shadow-lg hover:shadow-red-900/20 transition-all"
            size="lg"
          >
            <Play className="h-5 w-5" />
            <span className="font-bold">IMPERIAL STARTUP</span>
          </Button>
        </div>
        
        <ScanNotifications error={error} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-1">
            <ScanPanel 
              onStartScan={handleRealTimeStartScan}
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
