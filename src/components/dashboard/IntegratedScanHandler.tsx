
import React from 'react';
import { ScanTarget, ScanSettings, CameraResult } from '@/types/scanner';
import { toast } from '@/components/ui/use-toast';
import { executeSearch, findEasternEuropeanCameras, executeCameraSearch } from '@/utils/searchEngines';

interface IntegratedScanHandlerProps {
  isConnected: boolean;
  realtimeStartScan: (params: { target: ScanTarget; settings: ScanSettings }) => void;
  setScanProgress: React.Dispatch<React.SetStateAction<any>>;
  setResults: React.Dispatch<React.SetStateAction<CameraResult[]>>;
  handleStartScan: (target: ScanTarget, settings: ScanSettings) => void;
}

const useIntegratedScanHandler = ({
  isConnected,
  realtimeStartScan,
  setScanProgress,
  setResults,
  handleStartScan
}: IntegratedScanHandlerProps) => {
  
  const handleIntegratedScan = async (target: ScanTarget, settings: ScanSettings) => {
    // Start progress tracking
    const startTime = new Date();
    setScanProgress({
      status: 'running',
      targetsTotal: 100,
      targetsScanned: 0,
      camerasFound: 0,
      startTime,
      scanTarget: target,
      scanSettings: settings
    });
    
    try {
      // If connected to real-time server, use that for the scan
      if (isConnected) {
        realtimeStartScan({ target, settings });
        return;
      }
      
      let scanResults: CameraResult[] = [];
      
      // Use different methods based on the scan type
      if (target.type === 'shodan' || target.type === 'zoomeye' || target.type === 'censys') {
        // Use search engine integrations
        toast({
          title: `Using ${target.type.toUpperCase()} Integration`,
          description: `Searching for cameras with query: ${target.value}`
        });
        
        // Update progress
        setScanProgress(prev => ({
          ...prev,
          status: 'running',
          targetsScanned: 25,
        }));
        
        // Execute camera search
        const searchResult = await executeCameraSearch(
          { 
            country: settings.regionFilter?.[0],
            onlyVulnerable: settings.checkVulnerabilities,
            limit: 20
          }, 
          target.type as any
        );
        
        if (searchResult.cameras) {
          scanResults = searchResult.cameras;
        }
      } 
      else if (target.value.toLowerCase().includes('eastern:europe') || 
              (settings.regionFilter && 
               ['ua', 'ru', 'ge', 'ro', 'by', 'md'].includes(settings.regionFilter[0]))) {
        // Use specialized Eastern European camera search
        toast({
          title: "Eastern European Scanner",
          description: "Scanning for cameras in Eastern European networks"
        });
        
        // Update progress
        setScanProgress(prev => ({
          ...prev,
          status: 'running',
          targetsScanned: 30,
        }));
        
        // Find Eastern European cameras
        const searchResult = await findEasternEuropeanCameras(
          settings.aggressive ? 'scan' : 'osint',
          {
            country: settings.regionFilter?.[0],
            onlyVulnerable: settings.checkVulnerabilities,
            limit: settings.aggressive ? 25 : 15
          }
        );
        
        if (searchResult.cameras) {
          scanResults = searchResult.cameras;
        }
      }
      else {
        // Use traditional network scanner
        toast({
          title: "Network Scanner",
          description: `Scanning network: ${target.value}`
        });
        
        // Call the regular network scanner
        handleStartScan(target, settings);
        return; // The regular scanner handles its own progress updates
      }
      
      // Update final scan results
      setResults(scanResults);
      
      // Complete scan progress
      const endTime = new Date();
      const timeElapsed = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      
      setScanProgress({
        status: 'completed',
        targetsTotal: 100,
        targetsScanned: 100,
        camerasFound: scanResults.length,
        startTime,
        endTime,
        scanTarget: target,
        scanSettings: settings
      });
      
      toast({
        title: "Scan Completed",
        description: `Found ${scanResults.length} cameras in ${timeElapsed}s`
      });
      
    } catch (error) {
      console.error("Scan error:", error);
      
      setScanProgress({
        status: 'failed',
        targetsTotal: 100,
        targetsScanned: 0,
        camerasFound: 0,
        startTime,
        endTime: new Date(),
        error: error instanceof Error ? error.message : "Unknown error occurred"
      });
      
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred during scan",
        variant: "destructive"
      });
    }
  };

  return { handleIntegratedScan };
};

export { useIntegratedScanHandler };
