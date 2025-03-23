
import React, { useState, useEffect } from 'react';
import { ScanProgress, CameraResult } from '@/types/scanner';
import { Toaster } from '@/components/ui/toaster';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import CommandPalette from '@/components/CommandPalette';

// Import refactored components
import ScanController from '@/components/dashboard/ScanController';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import ScanNotifications from '@/components/dashboard/ScanNotifications';
import ScanPanel from '@/components/dashboard/ScanPanel';

const Index = () => {
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
  
  const imperialArmyBanner = `
    ██╗███╗   ███╗██████╗ ███████╗██████╗ ██╗ █████╗ ██╗          █████╗ ██████╗ ███╗   ███╗██╗   ██╗
    ██║████╗ ████║██╔══██╗██╔════╝██╔══██╗██║██╔══██╗██║         ██╔══██╗██╔══██╗████╗ ████║╚██╗ ██╔╝
    ██║██╔████╔██║██████╔╝█████╗  ██████╔╝██║███████║██║         ███████║██████╔╝██╔████╔██║ ╚████╔╝ 
    ██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗██║██╔══██║██║         ██╔══██║██╔══██╗██║╚██╔╝██║  ╚██╔╝  
    ██║██║ ╚═╝ ██║██║     ███████╗██║  ██║██║██║  ██║███████╗    ██║  ██║██║  ██║██║ ╚═╝ ██║   ██║   
    ╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝   ╚═╝   
  `;

  useEffect(() => {
    setActiveTab('map');
  }, []);

  useEffect(() => {
    if (scanProgress.status === 'running') {
      setActiveTab('map');
    }
  }, [scanProgress.status]);

  const { handleStartScan } = ScanController({
    onScanProgressUpdate: setScanProgress,
    onResultsUpdate: setResults,
    onErrorOccurred: setError
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
        {showAscii && (
          <div className="mx-auto mt-2 mb-4">
            <div className="bg-scanner-dark p-4 rounded-md overflow-x-auto w-full">
              <pre className="text-[#ea384c] text-xs font-mono">{imperialArmyBanner}</pre>
            </div>
          </div>
        )}
        
        {/* Navigation Menu moved under the ASCII banner */}
        <DashboardHeader />
        
        {/* Startup Button */}
        <div className="flex justify-center mt-4 mb-6">
          <Button 
            onClick={() => setCommandOpen(true)}
            className="bg-scanner-primary hover:bg-scanner-primary/80 text-white py-3 px-6 rounded-md flex items-center gap-2 shadow-lg hover:shadow-red-900/20 transition-all animate-pulse"
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
              onStartScan={handleStartScan}
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
