// This file contains the ComprehensiveCCTVScanner component
// We need to fix the specific error in the handleScan method where it's calling toast()

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, Camera } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { executeCCTV } from '@/utils/osintTools';
import { executeHackCCTV } from '@/utils/osintUtilsConnector';

interface ComprehensiveCCTVScannerProps {
  onScanComplete?: (results: any) => void;
}

const ComprehensiveCCTVScanner: React.FC<ComprehensiveCCTVScannerProps> = ({ onScanComplete }) => {
  const { toast } = useToast();
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('standard');
  const [timeout, setTimeout] = useState('30000');
  const [bruteforceAuth, setBruteforceAuth] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);

  // Function to handle scanning
  const handleScan = async () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target",
        variant: "destructive"
      });
      return;
    }
    
    setIsScanning(true);
    setScanResults(null);
    
    try {
      const scanFunction = scanType === 'standard' ? executeCCTV : executeHackCCTV;
      const result = await scanFunction({
        target,
        timeout: parseInt(timeout),
        bruteforce: bruteforceAuth
      });
      
      if (result && result.success) {
        setScanResults(result.data);
        
        if (onScanComplete) {
          onScanComplete(result.data);
        }
        
        toast({
          title: "Scan Complete",
          description: `Found ${result.data.cameras?.length || 0} cameras`
        });
      } else {
        toast({
          title: "Scan Failed",
          description: "Failed to complete the scan",
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
      setIsScanning(false);
    }
  };

  // Function to handle hacking
  const handleHack = async () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target",
        variant: "destructive"
      });
      return;
    }
    
    setIsScanning(true);
    setScanResults(null);
    
    try {
      const result = await executeHackCCTV({
        target,
        timeout: parseInt(timeout),
        bruteforce: true
      });
      
      if (result && result.success) {
        setScanResults(result.data);
        
        if (onScanComplete) {
          onScanComplete(result.data);
        }
        
        toast({
          title: "Hack Complete",
          description: `Found ${result.data.cameras?.length || 0} vulnerable cameras`,
        });
      } else {
        toast({
          title: "Hack Failed",
          description: "Failed to hack target",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during hack:", error);
      toast({
        title: "Hack Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="h-5 w-5 mr-2" />
          Comprehensive CCTV Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="target">Target IP/URL</Label>
          <Input
            id="target"
            placeholder="e.g., 192.168.1.100 or example.com"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            disabled={isScanning}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="scan-type">Scan Type</Label>
          <Select
            value={scanType}
            onValueChange={setScanType}
            disabled={isScanning}
          >
            <SelectTrigger id="scan-type">
              <SelectValue placeholder="Select scan type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timeout">Timeout (ms)</Label>
          <Input
            id="timeout"
            type="number"
            value={timeout}
            onChange={(e) => setTimeout(e.target.value)}
            disabled={isScanning}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="bruteforce-auth"
            checked={bruteforceAuth}
            onCheckedChange={(checked) => setBruteforceAuth(!!checked)}
            disabled={isScanning}
          />
          <Label htmlFor="bruteforce-auth">Bruteforce Authentication</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleScan}
            disabled={isScanning}
            variant="default"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Scan
              </>
            )}
          </Button>
          
          <Button
            onClick={handleHack}
            disabled={isScanning}
            variant="destructive"
          >
            {isScanning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Hacking...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Hack
              </>
            )}
          </Button>
        </div>
        
        {scanResults && scanResults.cameras && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Found Cameras:</h3>
            {scanResults.cameras.length > 0 ? (
              <ul className="text-xs space-y-2">
                {scanResults.cameras.map((camera: any, index: number) => (
                  <li key={index} className="p-2 bg-gray-800 rounded">
                    <div><span className="font-medium">IP:</span> {camera.ip}</div>
                    {camera.manufacturer && <div><span className="font-medium">Make:</span> {camera.manufacturer}</div>}
                    {camera.model && <div><span className="font-medium">Model:</span> {camera.model}</div>}
                    {camera.url && <div className="truncate"><span className="font-medium">URL:</span> {camera.url}</div>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">No cameras found.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComprehensiveCCTVScanner;
