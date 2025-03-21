
import React, { useState, useEffect } from 'react';
import { ScanProgress, CameraResult } from '@/types/scanner';
import { Toaster } from '@/components/ui/toaster';
import DashboardHeader from '@/components/DashboardHeader';

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
      
      <Toaster />
    </div>
  );
};

export default Index;
