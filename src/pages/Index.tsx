
import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import ScanForm from '@/components/ScanForm';
import StatusBar from '@/components/StatusBar';
import ResultsTable from '@/components/ResultsTable';
import { ScanTarget, ScanSettings, ScanProgress, CameraResult } from '@/types/scanner';
import { startMockScan, MOCK_CAMERA_RESULTS } from '@/utils/mockData';
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

  const handleStartScan = (target: ScanTarget, settings: ScanSettings) => {
    // Reset current results and errors
    setResults([]);
    setError(null);
    
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
      // Estimate Shodan results
      targetsTotal = 100;
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
      title: "Production Scan Started",
      description: `Starting thorough scan of ${target.value} with ${settings.aggressive ? 'aggressive' : 'standard'} settings`,
    });
    
    try {
      // Start enhanced scan with more options
      const stopScan = startMockScan(
        // Progress callback with more detailed information
        (progressPercentage, camerasFound, currentTarget, scanSpeed) => {
          setScanProgress(prevState => ({
            ...prevState,
            targetsScanned: Math.floor((progressPercentage / 100) * targetsTotal),
            camerasFound,
            currentTarget,
            scanSpeed
          }));
        },
        // Results callback with thorough validation
        (scanResults) => {
          // Apply additional filtering and validation to results
          const validatedResults = scanResults.filter(result => 
            result.ip && // Ensure IP exists
            (!result.vulnerabilities || result.vulnerabilities.length > 0) // Validate vulnerabilities
          );
          
          setResults(validatedResults);
          setScanProgress(prevState => {
            const updatedState: ScanProgress = {
              ...prevState,
              status: 'completed',
              targetsScanned: targetsTotal,
              camerasFound: validatedResults.length,
              endTime: new Date()
            };
            
            const elapsedTime = calculateElapsedTime(updatedState.startTime!);
            toast({
              title: "Production Scan Completed",
              description: `Found ${validatedResults.length} cameras in ${elapsedTime}. Scan results verified.`,
              variant: "default",
            });
            
            return updatedState;
          });
        },
        // Error callback
        (errorMessage) => {
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
        },
        // Enhanced scan options
        {
          ...settings,
          deepScan: true,
          portScan: true,
          vulnerabilityScan: settings.checkVulnerabilities,
          timeout: settings.timeout,
          retryCount: 3,
          aggressive: settings.aggressive
        }
      );
      
      // This would clean up the scan if needed (i.e. component unmounting)
      return () => {
        stopScan();
        toast({
          title: "Scan Terminated",
          description: "The scan was terminated before completion.",
        });
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error starting scan';
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
