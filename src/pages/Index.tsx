
import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { ScanProgress, CameraResult } from '@/types/scanner';
import { Toaster } from '@/components/ui/toaster';

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
  const [activeTab, setActiveTab] = useState<string>('globe');

  useEffect(() => {
    setActiveTab('globe');
  }, []);

  useEffect(() => {
    if (scanProgress.status === 'running') {
      setActiveTab('globe');
    }
  }, [scanProgress.status]);

  const { handleStartScan } = ScanController({
    onScanProgressUpdate: setScanProgress,
    onResultsUpdate: setResults,
    onErrorOccurred: setError
  });

  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <DashboardHeader />
      
      <main className="container mx-auto py-6 px-4">
        <ScanNotifications error={error} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
