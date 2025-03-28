
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import scanNetwork from '@/utils/networkScanner';
import { ScanTarget, ScanProgress, CameraResult, ScanSettings } from '@/types/scanner';
import { getIpGeolocation } from '@/utils/osintUtils';
import { ProxyConfig } from '@/utils/types/baseTypes';
import { CameraResult as OsintCameraResult } from '@/utils/types/cameraTypes';
import { getCountryIpRanges, getRandomIpInRange } from '@/utils/ipRangeUtils';
import { convertToScannerFormat } from '@/utils/scanner/cameraConverter';

interface ScanControllerProps {
  onScanProgressUpdate: (progress: ScanProgress) => void;
  onResultsUpdate: (results: CameraResult[]) => void;
  onErrorOccurred: (error: string | null) => void;
  proxyConfig?: ProxyConfig;
}

const ScanController = ({ 
  onScanProgressUpdate, 
  onResultsUpdate, 
  onErrorOccurred,
  proxyConfig
}: ScanControllerProps) => {
  const { toast } = useToast();
  const cleanupFunctionRef = useRef<(() => void) | null>(null);
  const scanInProgressRef = useRef<boolean>(false);
  const [results, setResults] = useState<CameraResult[]>([]);
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    status: 'idle',
    targetsTotal: 0,
    targetsScanned: 0,
    camerasFound: 0
  });

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
    
    if (value.includes('5.152.') || value.includes('31.146.') || value.includes('37.110.16')) {
      return 'Georgia';
    } else if (value.includes('5.2.') || value.includes('5.12.') || value.includes('31.5.')) {
      return 'Romania';
    } else if (value.includes('5.1.0.') || value.includes('5.58.') || value.includes('5.105.')) {
      return 'Ukraine';
    } else if (value.includes('5.3.') || value.includes('5.8.') || value.includes('5.16.')) {
      return 'Russia';
    }
    
    const countries = [
      'United States', 'Germany', 'France', 'Netherlands', 
      'United Kingdom', 'Japan', 'Singapore', 'Australia',
      'Brazil', 'Canada', 'Italy', 'Spain',
      'Georgia', 'Romania', 'Ukraine', 'Russia'
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

    setResults([]);
    onResultsUpdate([]);
    onErrorOccurred(null);
    scanInProgressRef.current = true;
    
    let ipRange = target.value;
    let countryCode = '';
    
    const lowerValue = target.value.toLowerCase();
    if (lowerValue.includes('georgia') || lowerValue.includes('ge:')) {
      countryCode = 'ge';
    } else if (lowerValue.includes('romania') || lowerValue.includes('ro:')) {
      countryCode = 'ro';
    } else if (lowerValue.includes('ukraine') || lowerValue.includes('ua:')) {
      countryCode = 'ua';
    } else if (lowerValue.includes('russia') || lowerValue.includes('ru:')) {
      countryCode = 'ru';
    }
    
    if (countryCode && !ipRange.includes('/')) {
      const countryRanges = getCountryIpRanges(countryCode);
      if (countryRanges.length > 0) {
        const randomRangeIndex = Math.floor(Math.random() * countryRanges.length);
        ipRange = countryRanges[randomRangeIndex].range;
        
        toast({
          title: `Selected IP Range for ${countryCode.toUpperCase()}`,
          description: `Using range: ${ipRange} - ${countryRanges[randomRangeIndex].description}`,
        });
      }
    }
    
    let targetsTotal = 1;
    if (target.type === 'range') {
      const cidrMatch = ipRange.match(/\/(\d+)$/);
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
    
    const targetCountry = getTargetCountry(ipRange);
    
    const initialProgress: ScanProgress = {
      status: 'running',
      targetsTotal,
      targetsScanned: 0,
      camerasFound: 0,
      startTime: new Date(),
      scanTarget: target,
      scanSettings: settings,
      currentTarget: ipRange,
      targetCountry
    };
    
    onScanProgressUpdate(initialProgress);
    setScanProgress(initialProgress);
    
    let scanDescription = `Starting scan of ${ipRange}`;
    if (countryCode) {
      scanDescription += ` in ${targetCountry}`;
    }
    scanDescription += ` with ${settings.aggressive ? 'aggressive' : 'standard'} settings`;
    
    toast({
      title: "Scan Started",
      description: scanDescription,
    });
    
    if (proxyConfig?.enabled) {
      toast({
        title: "Proxy Active",
        description: `Using ${proxyConfig.type.toUpperCase()} proxy at ${proxyConfig.host}:${proxyConfig.port}`,
        duration: 5000,
      });
    } else {
      toast({
        title: "Browser Limitation Notice",
        description: "This demo uses simulation since browsers don't allow direct network scanning. In a real application, this would connect to a backend service.",
        duration: 8000,
        variant: "default",
      });
    }
    
    try {
      const abortController = new AbortController();
      
      cleanupFunctionRef.current = () => {
        console.log("Scan cleanup called");
        abortController.abort();
        scanInProgressRef.current = false;
      };
      
      const networkSettings = {
        ...settings,
        regionFilter: Array.isArray(settings.regionFilter) ? settings.regionFilter : [settings.regionFilter],
      };
      
      const scanResult = await scanNetwork(
        ipRange,
        networkSettings,
        (progress) => {
          if (abortController.signal.aborted) return;
          
          const updatedProgress: ScanProgress = {
            ...progress,
            status: progress.status || 'running',
            targetCountry
          };
          onScanProgressUpdate(updatedProgress);
          setScanProgress(updatedProgress);
        },
        (camera) => {
          if (abortController.signal.aborted) return;
          
          const convertedCamera = typeof camera.lastSeen === 'object' && camera.lastSeen instanceof Date 
            ? {
                ...camera,
                lastSeen: camera.lastSeen.toISOString()
              }
            : camera;
          
          const newResults = [...results, convertedCamera];
          setResults(newResults);
          onResultsUpdate(newResults);
          
          const updatedProgress: ScanProgress = {
            ...scanProgress,
            status: scanProgress.status,
            camerasFound: scanProgress.camerasFound + 1
          };
          onScanProgressUpdate(updatedProgress);
          setScanProgress(updatedProgress);
        },
        target.type,
        abortController.signal,
        proxyConfig
      );
      
      if (!abortController.signal.aborted) {
        const completedProgress: ScanProgress = {
          ...scanProgress,
          status: 'completed',
          targetsScanned: scanProgress.targetsTotal,
          endTime: new Date()
        };
        
        onScanProgressUpdate(completedProgress);
        setScanProgress(completedProgress);
        
        const convertedCameras: CameraResult[] = scanResult.data.cameras 
          ? scanResult.data.cameras.map((camera: any) => {
              if (typeof camera.lastSeen === 'object' && camera.lastSeen instanceof Date) {
                return {
                  ...camera,
                  lastSeen: camera.lastSeen.toISOString()
                };
              }
              return camera;
            })
          : [];
        
        setResults(convertedCameras);
        onResultsUpdate(convertedCameras);
        
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
        
        const errorProgress: ScanProgress = {
          ...scanProgress,
          status: 'failed',
          error: errorMessage,
          endTime: new Date()
        };
        
        onScanProgressUpdate(errorProgress);
        setScanProgress(errorProgress);
        
        toast({
          title: "Scan Failed",
          description: errorMessage,
          variant: "destructive",
        });
        
        scanInProgressRef.current = false;
      }
    }
  };

  return { handleStartScan };
};

export default ScanController;
