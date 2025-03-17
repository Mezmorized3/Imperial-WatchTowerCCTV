
import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import ScanForm from '@/components/ScanForm';
import StatusBar from '@/components/StatusBar';
import ResultsTable from '@/components/ResultsTable';
import { ScanTarget, ScanSettings, ScanProgress, CameraResult } from '@/types/scanner';
import { scanNetwork } from '@/utils/networkScanner';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const Index = () => {
  const { toast } = useToast();
  const [results, setResults] = useState<CameraResult[]>([]);
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    status: 'idle',
    targetsTotal: 0,
    targetsScanned: 0,
    camerasFound: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [cleanupFunction, setCleanupFunction] = useState<(() => void) | null>(null);

  const handleStartScan = async (target: ScanTarget, settings: ScanSettings) => {
    // Reset current results and errors
    setResults([]);
    setError(null);
    
    let ipRange = target.value;
    
    // Calculate total targets (this would be more complex in a real app)
    let targetsTotal = 1;
    if (target.type === 'range') {
      // Enhanced CIDR calculation
      const cidrMatch = target.value.match(/\/(\d+)$/);
      if (cidrMatch) {
        const cidrPrefix = parseInt(cidrMatch[1]);
        if (cidrPrefix <= 32) {
          // Calculate number of IPs in the range
          targetsTotal = Math.pow(2, 32 - cidrPrefix);
          // Limit large scans for UI purposes
          if (targetsTotal > 1000000) targetsTotal = 1000000;
        }
      }
    } else if (target.type === 'shodan') {
      toast({
        title: "Shodan Support",
        description: "Shodan scanning requires API credentials, please configure in settings.",
        variant: "destructive",
      });
      return;
    }
    
    // Start progress tracking with enhanced metadata
    setScanProgress({
      status: 'running',
      targetsTotal,
      targetsScanned: 0,
      camerasFound: 0,
      startTime: new Date(),
      scanTarget: target,
      scanSettings: settings
    });
    
    toast({
      title: "Real Network Scan Started",
      description: `Starting scan of ${target.value} with ${settings.aggressive ? 'aggressive' : 'standard'} settings`,
    });
    
    try {
      // Start real network scan
      await scanNetwork(
        ipRange,
        settings,
        (progress) => {
          setScanProgress(prevState => ({
            ...prevState,
            ...progress
          }));
        },
        (camera) => {
          setResults(prev => [...prev, camera]);
          setScanProgress(prev => ({
            ...prev,
            camerasFound: prev.camerasFound + 1
          }));
        }
      );
      
      // Scan completed successfully
      setScanProgress(prevState => {
        const updatedState: ScanProgress = {
          ...prevState,
          status: 'completed',
          targetsScanned: targetsTotal,
          endTime: new Date()
        };
        
        const elapsedTime = calculateElapsedTime(updatedState.startTime!);
        toast({
          title: "Scan Completed",
          description: `Found ${results.length} cameras in ${elapsedTime}.`,
          variant: "default",
        });
        
        return updatedState;
      });
      
      // Provide cleanup function
      setCleanupFunction(() => () => {
        console.log("Scan cleanup called");
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error during scan';
      setError(errorMessage);
      setScanProgress(prevState => ({
        ...prevState,
        status: 'failed',
        error: errorMessage,
        endTime: new Date()
      }));
      
      toast({
        title: "Scan Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  
  // Clean up scan when component unmounts
  useEffect(() => {
    return () => {
      if (cleanupFunction) {
        cleanupFunction();
        toast({
          title: "Scan Terminated",
          description: "The scan was terminated before completion.",
        });
      }
    };
  }, [cleanupFunction, toast]);
  
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
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Scan Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
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
      
      <Toaster />
    </div>
  );
};

export default Index;
