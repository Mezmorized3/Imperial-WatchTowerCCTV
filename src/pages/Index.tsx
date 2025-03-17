
import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import ScanForm from '@/components/ScanForm';
import StatusBar from '@/components/StatusBar';
import ResultsTable from '@/components/ResultsTable';
import { ScanTarget, ScanSettings, ScanProgress, CameraResult } from '@/types/scanner';
import { startMockScan, MOCK_CAMERA_RESULTS } from '@/utils/mockData';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [results, setResults] = useState<CameraResult[]>([]);
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    status: 'idle',
    targetsTotal: 0,
    targetsScanned: 0,
    camerasFound: 0
  });

  const handleStartScan = (target: ScanTarget, settings: ScanSettings) => {
    // Reset current results
    setResults([]);
    
    // Calculate total targets (this would be more complex in a real app)
    let targetsTotal = 1;
    if (target.type === 'range') {
      // Simple CIDR calculation for /24 - would be more complex in real app
      if (target.value.endsWith('/24')) {
        targetsTotal = 256;
      } else if (target.value.endsWith('/16')) {
        targetsTotal = 65536;
      }
    }
    
    // Start progress tracking
    setScanProgress({
      status: 'running',
      targetsTotal,
      targetsScanned: 0,
      camerasFound: 0,
      startTime: new Date()
    });
    
    toast({
      title: "Scan Started",
      description: `Starting scan of ${target.value} with ${settings.aggressive ? 'aggressive' : 'standard'} settings`,
    });
    
    // Start mock scan
    const stopScan = startMockScan(
      (progressPercentage, camerasFound) => {
        setScanProgress(prev => ({
          ...prev,
          targetsScanned: Math.floor((progressPercentage / 100) * targetsTotal),
          camerasFound
        }));
      },
      (results) => {
        setResults(results);
        setScanProgress(prev => ({
          ...prev,
          status: 'completed',
          targetsScanned: targetsTotal,
          camerasFound: results.length,
          endTime: new Date()
        }));
        
        toast({
          title: "Scan Completed",
          description: `Found ${results.length} cameras in ${calculateElapsedTime(prev.startTime!)}`,
          variant: "default",
        });
      }
    );
    
    // This would clean up the scan if needed (i.e. component unmounting)
    return () => stopScan();
  };
  
  const calculateElapsedTime = (startTime: Date) => {
    const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <DashboardHeader />
      
      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ScanForm 
              onStartScan={handleStartScan}
              isScanning={scanProgress.status === 'running'}
            />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <StatusBar progress={scanProgress} />
            <ResultsTable results={results} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
