
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { scanNetwork } from '@/utils/networkScanner';
import { ScanTarget, ScanSettings, ScanProgress, CameraResult } from '@/types/scanner';
import { getRandomGeoLocation } from '@/utils/osintUtils';

interface ScanControllerProps {
  onScanProgressUpdate: (progress: ScanProgress) => void;
  onResultsUpdate: (results: CameraResult[]) => void;
  onErrorOccurred: (error: string | null) => void;
}

const ScanController = ({ 
  onScanProgressUpdate, 
  onResultsUpdate, 
  onErrorOccurred 
}: ScanControllerProps) => {
  const { toast } = useToast();
  const cleanupFunctionRef = useRef<(() => void) | null>(null);
  const scanInProgressRef = useRef<boolean>(false);

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

  const getTargetCountry = (value: string): string => {
    if (value.toLowerCase().includes('country:')) {
      const match = value.match(/country:["']?([a-zA-Z\s]+)["']?/i);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    const countries = [
      'United States', 'Germany', 'France', 'Netherlands', 
      'United Kingdom', 'Japan', 'Singapore', 'Australia',
      'Brazil', 'Canada', 'Italy', 'Spain'
    ];
    
    return countries[Math.floor(Math.random() * countries.length)];
  };

  const handleStartScan = async (target: ScanTarget, settings: ScanSettings) => {
    if (scanInProgressRef.current && cleanupFunctionRef.current) {
      cleanupFunctionRef.current();
      toast({
        title: "Previous Scan Terminated",
        description: "The previous scan was terminated to start a new one.",
      });
    }

    onResultsUpdate([]);
    onErrorOccurred(null);
    scanInProgressRef.current = true;
    
    let ipRange = target.value;
    
    let targetsTotal = 1;
    if (target.type === 'range') {
      const cidrMatch = target.value.match(/\/(\d+)$/);
      if (cidrMatch) {
        const cidrPrefix = parseInt(cidrMatch[1]);
        if (cidrPrefix <= 32) {
          targetsTotal = Math.pow(2, 32 - cidrPrefix);
          if (targetsTotal > 2048) {
            targetsTotal = settings.aggressive ? 2048 : 1024;
          }
        }
      }
    } else if (['shodan', 'zoomeye', 'censys'].includes(target.type)) {
      targetsTotal = Math.floor(Math.random() * 20) + 10;
      toast({
        title: `${target.type.charAt(0).toUpperCase() + target.type.slice(1)} Query`,
        description: `Scanning using ${target.type} query: ${target.value}`,
      });
    }
    
    const targetCountry = getTargetCountry(target.value);
    
    const initialProgress: ScanProgress = {
      status: 'running', // Ensuring status is not optional
      targetsTotal,
      targetsScanned: 0,
      camerasFound: 0,
      startTime: new Date(),
      scanTarget: target,
      scanSettings: settings,
      currentTarget: target.value,
      targetCountry
    };
    
    onScanProgressUpdate(initialProgress);
    
    toast({
      title: "Scan Started",
      description: `Starting scan of ${target.value} with ${settings.aggressive ? 'aggressive' : 'standard'} settings`,
    });
    
    toast({
      title: "Browser Limitation Notice",
      description: "This demo uses simulation since browsers don't allow direct network scanning. In a real application, this would connect to a backend service.",
      duration: 8000,
      variant: "default",
    });
    
    try {
      const abortController = new AbortController();
      
      cleanupFunctionRef.current = () => {
        console.log("Scan cleanup called");
        abortController.abort();
        scanInProgressRef.current = false;
      };
      
      await scanNetwork(
        ipRange,
        settings,
        (progress) => {
          if (abortController.signal.aborted) return;
          
          // Create a new object that includes all previous state and the new progress data
          const updatedProgress: ScanProgress = {
            ...progress,
            status: progress.status || 'running', // Ensure status is always defined
            targetCountry
          };
          onScanProgressUpdate(updatedProgress);
        },
        (camera) => {
          if (abortController.signal.aborted) return;
          
          // Get current results and add the new camera
          const newResults = [...results, camera];
          onResultsUpdate(newResults);
          
          // Update scan progress with new camera count
          const updatedProgress: ScanProgress = {
            ...scanProgress,
            status: scanProgress.status, // Ensure status is copied
            camerasFound: scanProgress.camerasFound + 1
          };
          onScanProgressUpdate(updatedProgress);
        },
        target.type,
        abortController.signal
      );
      
      if (!abortController.signal.aborted) {
        // Create final progress state for completed scan
        const completedProgress: ScanProgress = {
          ...scanProgress,
          status: 'completed',
          targetsScanned: scanProgress.targetsTotal,
          endTime: new Date()
        };
        
        onScanProgressUpdate(completedProgress);
        
        const elapsedTime = calculateElapsedTime(completedProgress.startTime!);
        
        setTimeout(() => {
          toast({
            title: "Scan Completed",
            description: `Found ${completedProgress.camerasFound} cameras in ${elapsedTime}.`,
            variant: "default",
          });
        }, 0);
        
        scanInProgressRef.current = false;
      }
      
    } catch (err) {
      if (scanInProgressRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error during scan';
        onErrorOccurred(errorMessage);
        
        // Create error progress state
        const errorProgress: ScanProgress = {
          ...scanProgress,
          status: 'failed',
          error: errorMessage,
          endTime: new Date()
        };
        
        onScanProgressUpdate(errorProgress);
        
        toast({
          title: "Scan Failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        scanInProgressRef.current = false;
      }
    }
  };

  // These state variables were missing but are used in the code
  const [results, setResults] = useState<CameraResult[]>([]);
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    status: 'idle',
    targetsTotal: 0,
    targetsScanned: 0,
    camerasFound: 0
  });

  return { handleStartScan };
};

export default ScanController;
