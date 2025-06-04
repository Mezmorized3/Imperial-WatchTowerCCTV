
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { Camera, Shield, MapPin, Video, AlertTriangle } from 'lucide-react';
import { executeCCTVScan, executeCCTVHacked } from '@/utils/osintUtilsConnector';

interface ComprehensiveCCTVScannerProps {
  onCamerasFound?: (cameras: any[]) => void;
}

const ComprehensiveCCTVScanner: React.FC<ComprehensiveCCTVScannerProps> = ({ onCamerasFound }) => {
  const [target, setTarget] = useState('');
  const [timeout, setTimeout] = useState(30);
  const [bruteforce, setBruteforce] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [hackedResults, setHackedResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('scanner');

  const executeCCTVScanInternal = async () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target IP, range, or country code",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setResults([]);

    try {
      const result = await executeCCTVScan({
        tool: 'cctvScan',
        target,
        timeout,
        bruteforce
      });

      if (result.success) {
        const cameras = result.data.results?.cameras || [];
        setResults(cameras);
        
        if (onCamerasFound) {
          onCamerasFound(cameras);
        }
        
        toast({
          title: "CCTV Scan Complete",
          description: `Found ${cameras.length} cameras`,
        });
      } else {
        toast({
          title: "Scan Failed",
          description: result.error || "Failed to complete CCTV scan",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("CCTV scan error:", error);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
      setScanProgress(100);
    }
  };

  const executeCCTVHackedInternal = async () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target IP, range, or country code",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setHackedResults([]);

    try {
      const result = await executeCCTVHacked({
        tool: 'cctvHacked',
        target,
        timeout,
        bruteforce
      });

      if (result.success) {
        const cameras = result.data.results?.cameras || [];
        setHackedResults(cameras);
        
        toast({
          title: "Hacked CCTV Scan Complete",
          description: `Found ${cameras.length} compromised cameras`,
        });
      } else {
        toast({
          title: "Scan Failed",
          description: result.error || "Failed to complete hacked CCTV scan",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Hacked CCTV scan error:", error);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
      setScanProgress(100);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-700 bg-scanner-dark shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="h-5 w-5 text-scanner-success mr-2" />
            Comprehensive CCTV Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="target">Target (IP/Range/Country)</Label>
            <Input
              id="target"
              placeholder="192.168.1.0/24, 8.8.8.8, or country:US"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeout">Timeout (seconds)</Label>
              <Input
                id="timeout"
                type="number"
                value={timeout}
                onChange={(e) => setTimeout(parseInt(e.target.value) || 30)}
                className="bg-scanner-dark-alt border-gray-700"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bruteforce"
                checked={bruteforce}
                onCheckedChange={(checked) => setBruteforce(!!checked)}
              />
              <Label htmlFor="bruteforce">Enable Bruteforce</Label>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={executeCCTVScanInternal}
              disabled={isScanning}
              className="bg-scanner-primary flex-1"
            >
              <Camera className="h-4 w-4 mr-2" />
              {isScanning ? "Scanning..." : "Scan CCTV"}
            </Button>
            
            <Button
              onClick={executeCCTVHackedInternal}
              disabled={isScanning}
              variant="destructive"
              className="flex-1"
            >
              <Shield className="h-4 w-4 mr-2" />
              {isScanning ? "Scanning..." : "Scan Hacked"}
            </Button>
          </div>
          
          {isScanning && (
            <div>
              <Progress value={scanProgress} className="w-full" />
              <p className="text-xs text-gray-400 mt-1">Scanning in progress...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {(results.length > 0 || hackedResults.length > 0) && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-scanner-dark-alt">
            <TabsTrigger value="results" className="data-[state=active]:bg-scanner-info/20">
              <Camera className="h-4 w-4 mr-2" />
              CCTV Results ({results.length})
            </TabsTrigger>
            <TabsTrigger value="hacked" className="data-[state=active]:bg-red-500/20">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Hacked ({hackedResults.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="results">
            <div className="grid gap-4">
              {results.map((camera: any, index: number) => (
                <Card key={index} className="border-gray-700 bg-scanner-dark-alt">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-scanner-success">
                          {camera.ip}:{camera.port}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {camera.manufacturer} {camera.model}
                        </p>
                        {camera.location && (
                          <div className="flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="text-xs text-gray-400">
                              {camera.location.country}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="text-scanner-success border-scanner-success">
                        {camera.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="hacked">
            <div className="grid gap-4">
              {hackedResults.map((camera: any, index: number) => (
                <Card key={index} className="border-red-500/50 bg-red-950/20">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-red-400">
                          {camera.ip}:{camera.port}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {camera.manufacturer} {camera.model}
                        </p>
                        <p className="text-xs text-red-400">
                          Access Level: {camera.accessLevel}
                        </p>
                      </div>
                      <Badge variant="destructive">
                        Compromised
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ComprehensiveCCTVScanner;
