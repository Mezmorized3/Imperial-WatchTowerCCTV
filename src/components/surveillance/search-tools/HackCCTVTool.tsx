
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Search, ShieldAlert, Wifi } from 'lucide-react';
import { executeHackCCTV } from '@/utils/osintImplementations/hackCCTVTools';
import { toast } from '@/components/ui/use-toast';
import { ScanResult, CameraResult } from '@/utils/types/cameraTypes';
import { convertToScannerFormat } from '@/utils/scanner/cameraConverter';
import { CameraResult as ScannerCameraResult } from '@/types/scanner';

const HackCCTVTool = () => {
  const [target, setTarget] = useState('');
  const [bruteforce, setBruteforce] = useState(true);
  const [deepScan, setDeepScan] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScannerCameraResult[]>([]);

  const handleScan = async () => {
    if (!target) {
      toast({
        title: "No Target Specified",
        description: "Please enter an IP address or IP range to scan",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanResults([]);

    try {
      toast({
        title: "Scan Started",
        description: `Scanning ${target} for vulnerable CCTV cameras`,
      });

      const results: ScanResult = await executeHackCCTV({
        target,
        bruteforce,
        deepScan,
      });

      if (results.success) {
        // Convert OSINT camera results to scanner format
        const convertedResults = results.data.cameras.map(camera => 
          convertToScannerFormat(camera)
        );
        
        setScanResults(convertedResults);
        
        toast({
          title: "Scan Complete",
          description: `Found ${results.data.cameras.length} cameras`,
        });
      } else if (results.error) {
        toast({
          title: "Scan Error",
          description: results.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to execute HackCCTV:', error);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="target" className="text-gray-400 mb-1 block">Target IP or Range (CIDR notation)</Label>
          <Input
            id="target"
            placeholder="e.g. 192.168.1.1 or 192.168.1.0/24"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div className="flex flex-col justify-end space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="bruteforce"
              checked={bruteforce}
              onCheckedChange={(checked) => setBruteforce(!!checked)}
            />
            <Label htmlFor="bruteforce" className="cursor-pointer">Bruteforce</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="deepScan"
              checked={deepScan}
              onCheckedChange={(checked) => setDeepScan(!!checked)}
            />
            <Label htmlFor="deepScan" className="cursor-pointer">Deep Scan</Label>
          </div>
        </div>
        <div className="md:col-span-1">
          <Button 
            onClick={handleScan} 
            disabled={isScanning || !target} 
            className="w-full h-full"
          >
            {isScanning ? (
              <>Scanning...</>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Start Scan
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {scanResults.length > 0 && (
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardContent className="pt-4">
            <h3 className="mb-4 font-medium flex items-center">
              <ShieldAlert className="w-4 h-4 text-red-400 mr-2" />
              Found {scanResults.length} camera{scanResults.length > 1 ? 's' : ''}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {scanResults.map((camera) => (
                <div 
                  key={camera.id} 
                  className="border border-gray-700 rounded p-3 bg-scanner-dark"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Wifi className="w-4 h-4 text-scanner-primary mr-2" />
                      <span className="font-medium text-white">{camera.ip}:{camera.port}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      camera.status === 'vulnerable' ? 'bg-red-900 text-red-300' : 
                      camera.status === 'online' ? 'bg-green-900 text-green-300' : 
                      'bg-gray-800 text-gray-300'
                    }`}>
                      {camera.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                    <div>
                      <span className="text-gray-500">Model:</span> {camera.model || 'Unknown'}
                    </div>
                    <div>
                      <span className="text-gray-500">Manufacturer:</span> {camera.manufacturer || 'Unknown'}
                    </div>
                    {camera.geolocation && (
                      <>
                        <div>
                          <span className="text-gray-500">Country:</span> {camera.geolocation.country}
                        </div>
                        {camera.geolocation.city && (
                          <div>
                            <span className="text-gray-500">City:</span> {camera.geolocation.city}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {camera.credentials && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <div className="text-sm text-red-400 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        <span>Compromised Credentials</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                        <div><span className="text-gray-500">Username:</span> {camera.credentials.username}</div>
                        <div><span className="text-gray-500">Password:</span> {camera.credentials.password}</div>
                      </div>
                    </div>
                  )}
                  
                  {camera.rtspUrl && (
                    <div className="mt-2 text-xs text-gray-400">
                      <span className="text-gray-500">RTSP URL:</span> {camera.rtspUrl}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HackCCTVTool;
