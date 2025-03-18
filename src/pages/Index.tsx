
import React, { useState, useEffect, useRef } from 'react';
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
  const cleanupFunctionRef = useRef<(() => void) | null>(null);
  const scanInProgressRef = useRef<boolean>(false);

  const handleStartScan = async (target: ScanTarget, settings: ScanSettings) => {
    // If there's already a scan in progress, we need to clean it up first
    if (scanInProgressRef.current && cleanupFunctionRef.current) {
      cleanupFunctionRef.current();
      toast({
        title: "Previous Scan Terminated",
        description: "The previous scan was terminated to start a new one.",
      });
    }

    // Reset current results and errors
    setResults([]);
    setError(null);
    scanInProgressRef.current = true;
    
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
          
          // For UI purposes, we'll show a reasonable limit
          if (targetsTotal > 2048) {
            targetsTotal = settings.aggressive ? 2048 : 1024;
          }
        }
      }
    } else if (['shodan', 'zoomeye', 'censys'].includes(target.type)) {
      // For search engine queries, set an estimated number
      targetsTotal = 50;
      toast({
        title: `${target.type.charAt(0).toUpperCase() + target.type.slice(1)} Query`,
        description: `Scanning using ${target.type} query: ${target.value}`,
      });
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
      title: "Network Scan Started",
      description: `Starting scan of ${target.value} with ${settings.aggressive ? 'aggressive' : 'standard'} settings`,
    });
    
    try {
      // Create an AbortController for this scan
      const abortController = new AbortController();
      
      // Set up a cleanup function for this scan
      cleanupFunctionRef.current = () => {
        console.log("Scan cleanup called");
        abortController.abort();
        scanInProgressRef.current = false;
      };
      
      // Start real network scan with scan type
      await scanNetwork(
        ipRange,
        settings,
        (progress) => {
          if (abortController.signal.aborted) return;
          
          setScanProgress(prevState => ({
            ...prevState,
            ...progress
          }));
        },
        (camera) => {
          if (abortController.signal.aborted) return;
          
          setResults(prev => [...prev, camera]);
          setScanProgress(prev => ({
            ...prev,
            camerasFound: prev.camerasFound + 1
          }));
        },
        target.type, // Pass the scan type to the network scanner
        abortController.signal // Pass the abort signal to the scanner
      );
      
      // Only update state if the scan wasn't aborted
      if (!abortController.signal.aborted) {
        // Scan completed successfully
        setScanProgress(prevState => {
          const updatedState: ScanProgress = {
            ...prevState,
            status: 'completed',
            targetsScanned: prevState.targetsTotal,
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
        
        scanInProgressRef.current = false;
      }
      
    } catch (err) {
      if (scanInProgressRef.current) {
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
        
        scanInProgressRef.current = false;
      }
    }
  };
  
  // Clean up scan when component unmounts
  useEffect(() => {
    return () => {
      if (cleanupFunctionRef.current && scanInProgressRef.current) {
        cleanupFunctionRef.current();
        console.log("Component unmount: Scan terminated");
      }
    };
  }, []);
  
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
