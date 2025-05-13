import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Shield, Network, Search, Lock, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeCameradar, executeHackCCTV } from '@/utils/osintUtilsConnector';

interface ComprehensiveCCTVScannerProps {
  onActionComplete?: (results: any) => void;
}

const ComprehensiveCCTVScanner: React.FC<ComprehensiveCCTVScannerProps> = ({ onActionComplete }) => {
  const { toast } = useToast();
  const [subnet, setSubnet] = useState('192.168.1.0/24');
  const [scanPorts, setScanPorts] = useState('80,554,8080');
  const [useCustomCredentials, setUseCustomCredentials] = useState(false);
  const [customCredentials, setCustomCredentials] = useState({ username: 'admin', password: 'password' });
  const [camerasFound, setCamerasFound] = useState<any[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isHacking, setIsHacking] = useState(false);
  const [hackResults, setHackResults] = useState<any>(null);

  const handleCameraScan = async () => {
    if (!subnet) {
      toast({
        title: "Error",
        description: "Please enter a subnet to scan",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setCamerasFound([]);

    try {
      const result = await executeCameradar({
        target: subnet,
        options: {
          ports: scanPorts,
          credentials: useCustomCredentials ? customCredentials : undefined
        }
      });
      
      if (result && result.success) {
        setCamerasFound(result.data?.cameras || []);
        toast({
          title: "Scan Complete",
          description: `Found ${result.data?.cameras?.length || 0} cameras.`
        });
      } else {
        toast({
          title: "Scan Failed", 
          description: result?.data?.message || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during camera scan:", error);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleCameraHack = async () => {
    if (!selectedCamera) {
      toast({
        title: "Error",
        description: "Please select a camera to hack",
        variant: "destructive"
      });
      return;
    }

    setIsHacking(true);
    setHackResults(null);

    try {
      const result = await executeHackCCTV({
        target: selectedCamera.ip,
        method: 'exploit',
        bruteforce: true
      });
      
      if (result && result.success) {
        const hackedCamera = result.data?.cameras?.[0];
        if (hackedCamera) {
          // Handle success
          toast({
            title: "Hack Successful",
            description: `Gained access to ${hackedCamera.manufacturer || ''} camera.`
          });
        } else {
          toast({
            title: "Hack Failed",
            description: "Could not exploit camera."
          });
        }
      } else {
        toast({
          title: "Operation Failed",
          description: result?.data?.message || "Unknown error occurred", 
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during camera hack:", error);
      toast({
        title: "Operation Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsHacking(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Comprehensive CCTV Scanner
        </CardTitle>
        <CardDescription>
          Scan and attempt to exploit IP cameras on your network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subnet">Network Subnet</Label>
            <Input
              id="subnet"
              placeholder="e.g., 192.168.1.0/24"
              value={subnet}
              onChange={(e) => setSubnet(e.target.value)}
              disabled={isScanning}
            />
            <p className="text-xs text-gray-500">Enter IP range in CIDR notation (e.g., 192.168.1.0/24)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scanPorts">Scan Ports</Label>
            <Input
              id="scanPorts"
              placeholder="e.g., 80,554,8080"
              value={scanPorts}
              onChange={(e) => setScanPorts(e.target.value)}
              disabled={isScanning}
            />
            <p className="text-xs text-gray-500">Comma-separated ports to scan (e.g., 80,554,8080)</p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="useCustomCredentials"
              checked={useCustomCredentials}
              onCheckedChange={(checked) => setUseCustomCredentials(checked === true)}
              disabled={isScanning}
            />
            <Label htmlFor="useCustomCredentials">Use Custom Credentials</Label>
          </div>

          {useCustomCredentials && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Username"
                    value={customCredentials.username}
                    onChange={(e) => setCustomCredentials({ ...customCredentials, username: e.target.value })}
                    disabled={isScanning}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={customCredentials.password}
                    onChange={(e) => setCustomCredentials({ ...customCredentials, password: e.target.value })}
                    disabled={isScanning}
                  />
                </div>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleCameraScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Start Camera Scan
              </>
            )}
          </Button>

          {camerasFound.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold">Cameras Found</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {camerasFound.map((camera, index) => (
                  <Card key={index} className="border-gray-700 bg-scanner-dark-alt">
                    <CardContent className="space-y-2">
                      <h4 className="text-sm font-medium">{camera.ip}</h4>
                      <p className="text-xs text-gray-400">
                        {camera.manufacturer || 'Unknown Manufacturer'} - {camera.model || 'Unknown Model'}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCamera(camera)}
                      >
                        Select
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {selectedCamera && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold">Selected Camera</h3>
              <Textarea
                readOnly
                value={JSON.stringify(selectedCamera, null, 2)}
                className="min-h-32 font-mono text-sm bg-scanner-dark-alt border-gray-700"
              />
              <Button
                className="w-full"
                onClick={handleCameraHack}
                disabled={isHacking}
              >
                {isHacking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Hacking...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Attempt Camera Hack
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComprehensiveCCTVScanner;
