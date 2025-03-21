import React, { useState, useEffect, useRef } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import ScanForm from '@/components/ScanForm';
import StatusBar from '@/components/StatusBar';
import ResultsTable from '@/components/ResultsTable';
import GlobeView from '@/components/GlobeView';
import CameraMap from '@/components/CameraMap';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScanTarget, ScanSettings, ScanProgress, CameraResult } from '@/types/scanner';
import { scanNetwork } from '@/utils/networkScanner';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, Info, Globe, Map, BarChart } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { getRandomGeoLocation } from '@/utils/osintUtils';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [results, setResults] = useState<CameraResult[]>([]);
  const [scanProgress, setScanProgress] = useState<ScanProgress>({
    status: 'idle',
    targetsTotal: 0,
    targetsScanned: 0,
    camerasFound: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('globe');
  const cleanupFunctionRef = useRef<(() => void) | null>(null);
  const scanInProgressRef = useRef<boolean>(false);

  useEffect(() => {
    setActiveTab('globe');
  }, []);

  useEffect(() => {
    if (scanProgress.status === 'running') {
      setActiveTab('globe');
    }
  }, [scanProgress.status]);

  const handleStartScan = async (target: ScanTarget, settings: ScanSettings) => {
    if (scanInProgressRef.current && cleanupFunctionRef.current) {
      cleanupFunctionRef.current();
      toast({
        title: "Previous Scan Terminated",
        description: "The previous scan was terminated to start a new one.",
      });
    }

    setResults([]);
    setError(null);
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
    
    setScanProgress({
      status: 'running',
      targetsTotal,
      targetsScanned: 0,
      camerasFound: 0,
      startTime: new Date(),
      scanTarget: target,
      scanSettings: settings,
      currentTarget: target.value,
      targetCountry
    });
    
    setActiveTab('globe');
    
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
          
          setScanProgress(prevState => ({
            ...prevState,
            ...progress,
            targetCountry
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
        target.type,
        abortController.signal
      );
      
      if (!abortController.signal.aborted) {
        setScanProgress(prevState => {
          const updatedState: ScanProgress = {
            ...prevState,
            status: 'completed',
            targetsScanned: prevState.targetsTotal,
            endTime: new Date()
          };
          
          const elapsedTime = calculateElapsedTime(updatedState.startTime!);
          const resultsLength = results.length;
          
          setTimeout(() => {
            toast({
              title: "Scan Completed",
              description: `Found ${resultsLength} cameras in ${elapsedTime}.`,
              variant: "default",
            });
          }, 0);
          
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

  const navigateToGlobe = () => {
    navigate('/globe');
  };

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
        
        <Alert variant="default" className="mb-6 border-scanner-info bg-scanner-dark-alt">
          <Info className="h-4 w-4 text-scanner-info" />
          <AlertTitle>Browser Limitation</AlertTitle>
          <AlertDescription>
            Real network scanning cannot be performed directly in a web browser due to security restrictions.
            This demo uses simulation to demonstrate the UI. In a production environment, scanning would be 
            performed by a backend service or desktop application.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ScanForm 
              onStartScan={handleStartScan}
              isScanning={scanProgress.status === 'running'}
            />
            
            <div className="mt-6">
              <StatusBar progress={scanProgress} />
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={navigateToGlobe}
                variant="outline"
                className="w-full flex items-center justify-center"
              >
                <Globe className="mr-2 h-4 w-4" />
                Open Full Globe View
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-scanner-dark-alt w-full justify-start">
                <TabsTrigger value="globe" className="data-[state=active]:bg-scanner-info/20">
                  <Globe className="h-4 w-4 mr-2" />
                  Interactive Globe
                </TabsTrigger>
                <TabsTrigger value="map" className="data-[state=active]:bg-scanner-info/20">
                  <Map className="h-4 w-4 mr-2" />
                  Location Map
                </TabsTrigger>
                <TabsTrigger value="table" className="data-[state=active]:bg-scanner-info/20">
                  <BarChart className="h-4 w-4 mr-2" />
                  Results Table
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="globe" className="pt-4">
                <GlobeView 
                  cameras={results}
                  scanInProgress={scanProgress.status === 'running'}
                  currentTarget={scanProgress.currentTarget}
                  targetCountry={scanProgress.targetCountry}
                />
              </TabsContent>
              
              <TabsContent value="map">
                <CameraMap 
                  cameras={results} 
                  onSelectCamera={(camera) => {
                    console.log('Selected camera:', camera);
                    toast({
                      title: `Camera ${camera.ip}`,
                      description: `${camera.brand || 'Unknown'} camera in ${camera.location?.country || 'Unknown location'}`,
                      duration: 3000,
                    });
                  }} 
                />
              </TabsContent>
              
              <TabsContent value="table">
                <ResultsTable results={results} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Toaster />
    </div>
  );
};

export default Index;
