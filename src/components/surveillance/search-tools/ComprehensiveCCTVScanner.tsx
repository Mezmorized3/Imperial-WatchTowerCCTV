
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Camera,
  Globe,
  Search,
  Eye,
  Webcam,
  RotateCw
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { 
  executeCameradar,
  executeHackCCTV,
  executeCamDumper,
  executeOpenCCTV,
  executeEyePwn,
  executeIngram
} from '@/utils/osintTools';

interface ComprehensiveCCTVScannerProps {
  onScanComplete?: (results: any) => void;
}

const ComprehensiveCCTVScanner: React.FC<ComprehensiveCCTVScannerProps> = ({ onScanComplete }) => {
  const [target, setTarget] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedTool, setSelectedTool] = useState('cameradar');
  const [useBruteforce, setUseBruteforce] = useState(false);
  const [scanMode, setScanMode] = useState('quick');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const handleScan = async () => {
    if (!target && !selectedCountry) {
      toast({
        title: "Error",
        description: "Please enter a target or select a country",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      let result;
      
      switch (selectedTool) {
        case 'cameradar':
          result = await executeCameradar({
            target: target || "",
            ports: "554,8554,8000"
          });
          break;
          
        case 'hackCCTV':
          result = await executeHackCCTV({
            target: target || "",
            method: useBruteforce ? 'brute-force' : 'default-credentials',
            country: selectedCountry,
            bruteforce: useBruteforce,
            deepScan: scanMode === 'deep'
          });
          break;
          
        case 'camDumper':
          result = await executeCamDumper({
            target: target || "",
            method: 'scan',
            country: selectedCountry
          });
          break;
          
        case 'openCCTV':
          // Update scan mode to match the type: 'quick' | 'deep' | 'full'
          const openCctvScanMode = scanMode === 'stealth' ? 'deep' : scanMode as 'quick' | 'deep' | 'full';
          
          result = await executeOpenCCTV({
            target: target || "",
            scanMode: openCctvScanMode,
            saveOutput: true
          });
          break;
          
        case 'eyePwn':
          result = await executeEyePwn({
            target: target || "",
            method: 'all',
            country: selectedCountry,
            bruteforce: useBruteforce
          });
          break;
          
        case 'ingram':
          // Update to use properties that exist in IngramParams
          result = await executeIngram({
            target: target || "",
            scanType: scanMode,
            country: selectedCountry
          });
          break;
          
        default:
          result = await executeCameradar({
            target: target || "",
            ports: "554,8554,8000"
          });
      }
      
      if (result && result.success) {
        setResults(result.data);
        
        if (onScanComplete) {
          onScanComplete(result.data);
        }
        
        toast({
          title: "Scan Complete",
          description: `Found ${result.data?.cameras?.length || 0} cameras.`
        });
      } else {
        toast({
          title: "Scan Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during scan:", error);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const runCamDumper = async () => {
    setIsLoading(true);
    
    try {
      const result = await executeCamDumper({
        target: target || "",
        method: 'scan',
        country: selectedCountry
      });
      
      if (result && result.success) {
        setResults(result.data);
        toast({
          title: "CamDumper Scan Complete",
          description: `Found ${result.data?.cameras?.length || 0} cameras.`
        });
      } else {
        toast({
          title: "Scan Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during scan:", error);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runEyePwn = async () => {
    setIsLoading(true);
    
    try {
      const result = await executeEyePwn({
        target: target || "",
        method: 'all',
        country: selectedCountry,
        bruteforce: useBruteforce
      });
      
      if (result && result.success) {
        setResults(result.data);
        toast({
          title: "EyePwn Scan Complete",
          description: `Found ${result.data?.cameras?.length || 0} cameras.`
        });
      } else {
        toast({
          title: "Scan Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during scan:", error);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Webcam className="h-5 w-5 mr-2" />
          Comprehensive CCTV Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="target">Target IP/Range</Label>
            <Input
              id="target"
              placeholder="192.168.1.0/24"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>
          
          <div>
            <Label htmlFor="country">Country</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger id="country" className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="">Any Country</SelectItem>
                <SelectItem value="ukraine">Ukraine</SelectItem>
                <SelectItem value="russia">Russia</SelectItem>
                <SelectItem value="georgia">Georgia</SelectItem>
                <SelectItem value="romania">Romania</SelectItem>
                <SelectItem value="usa">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="china">China</SelectItem>
                <SelectItem value="japan">Japan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tool">Scanning Tool</Label>
            <Select value={selectedTool} onValueChange={setSelectedTool}>
              <SelectTrigger id="tool" className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select a tool" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="cameradar">Cameradar</SelectItem>
                <SelectItem value="hackCCTV">HackCCTV</SelectItem>
                <SelectItem value="camDumper">CamDumper</SelectItem>
                <SelectItem value="openCCTV">OpenCCTV</SelectItem>
                <SelectItem value="eyePwn">EyePwn</SelectItem>
                <SelectItem value="ingram">Ingram</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="scan-mode">Scan Mode</Label>
            <Select value={scanMode} onValueChange={setScanMode}>
              <SelectTrigger id="scan-mode" className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select scan mode" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="quick">Quick Scan</SelectItem>
                <SelectItem value="deep">Deep Scan</SelectItem>
                <SelectItem value="stealth">Stealth Scan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="bruteforce" 
            checked={useBruteforce} 
            onCheckedChange={(checked) => setUseBruteforce(checked as boolean)}
          />
          <Label htmlFor="bruteforce" className="cursor-pointer">
            Use bruteforce for credentials
          </Label>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleScan} 
            disabled={isLoading}
            className="bg-scanner-primary"
          >
            {isLoading ? (
              <>
                <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Start Scan
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={runCamDumper} 
            disabled={isLoading}
            className="border-gray-700"
          >
            <Camera className="h-4 w-4 mr-2" />
            CamDumper
          </Button>
          
          <Button 
            variant="outline" 
            onClick={runEyePwn} 
            disabled={isLoading}
            className="border-gray-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            EyePwn
          </Button>
        </div>
        
        {results && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Results</h3>
            <div className="bg-scanner-dark-alt border border-gray-700 rounded-md p-4">
              <p className="mb-2">Found {results.cameras?.length || 0} cameras</p>
              
              {results.cameras && results.cameras.length > 0 ? (
                <div className="space-y-2">
                  {results.cameras.slice(0, 5).map((camera: any, index: number) => (
                    <div key={index} className="p-2 border border-gray-700 rounded-md">
                      <p className="text-sm"><span className="font-medium">IP:</span> {camera.ip}</p>
                      <p className="text-sm"><span className="font-medium">Model:</span> {camera.model || 'Unknown'}</p>
                      <p className="text-sm"><span className="font-medium">Status:</span> {camera.status}</p>
                      {camera.credentials && (
                        <p className="text-sm text-green-400">
                          <span className="font-medium">Credentials:</span> {camera.credentials.username}:{camera.credentials.password}
                        </p>
                      )}
                    </div>
                  ))}
                  
                  {results.cameras.length > 5 && (
                    <p className="text-sm text-gray-400">
                      ...and {results.cameras.length - 5} more cameras
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No cameras found</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComprehensiveCCTVScanner;
