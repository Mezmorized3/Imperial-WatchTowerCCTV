
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Network, Globe, Search, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { executeONVIFScan, executeNmapONVIF, executeMasscan } from '@/utils/osintTools';

interface ONVIFSearchToolProps {
  onScanComplete?: (results: any) => void;
}

const ONVIFSearchTool: React.FC<ONVIFSearchToolProps> = ({ onScanComplete }) => {
  const [subnet, setSubnet] = useState('192.168.1.0/24');
  const [scanType, setScanType] = useState<string>('onvifscan');
  const [port, setPort] = useState<string>('80,554,5000');
  const [username, setUsername] = useState<string>('admin');
  const [password, setPassword] = useState<string>('admin');
  const [bruteforce, setBruteforce] = useState<boolean>(false);
  const [saveResults, setSaveResults] = useState<boolean>(false);
  const [timeout, setTimeout] = useState<number>(5000);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);

  const handleScan = async () => {
    if (!subnet) {
      toast({
        title: "Error",
        description: "Please enter a subnet to scan",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setResults(null);

    try {
      let result;
      
      switch (scanType) {
        case 'onvifscan':
          result = await executeONVIFScan({
            subnet,
            timeout,
            credentials: {
              username,
              password
            },
            bruteforce,
            saveResults
          });
          break;
        case 'nmaponvif':
          result = await executeNmapONVIF({
            target: subnet,
            ports: port,
            timeout,
            saveResults
          });
          break;
        case 'masscan':
          result = await executeMasscan({
            target: subnet,
            ports: port,
            timeout,
            saveResults
          });
          break;
        default:
          throw new Error(`Unknown scan type: ${scanType}`);
      }

      if (result && result.success) {
        setResults(result.data);

        if (onScanComplete) {
          onScanComplete(result.data);
        }

        toast({
          title: "Scan Complete",
          description: `Found ${result.found} devices on ${subnet}`
        });
      } else {
        toast({
          title: "Scan Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during ONVIF scan:", error);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          ONVIF Camera Discovery
        </CardTitle>
        <CardDescription>
          Scan your network for ONVIF-compatible IP cameras
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
            <Label htmlFor="scanType">Scan Method</Label>
            <Select
              value={scanType}
              onValueChange={setScanType}
              disabled={isScanning}
            >
              <SelectTrigger id="scanType">
                <SelectValue placeholder="Select scan method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onvifscan">ONVIF Scanner</SelectItem>
                <SelectItem value="nmaponvif">Nmap ONVIF Script</SelectItem>
                <SelectItem value="masscan">Masscan (Port Scan)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="port">Ports</Label>
            <Input
              id="port"
              placeholder="e.g., 80,554,5000"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              disabled={isScanning || scanType === 'onvifscan'}
            />
            <p className="text-xs text-gray-500">Comma-separated ports (e.g., 80,554,5000)</p>
          </div>

          {(scanType === 'onvifscan') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Default username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isScanning}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Default password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isScanning}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bruteforce"
                  checked={bruteforce}
                  onCheckedChange={(checked) => setBruteforce(checked === true)}
                  disabled={isScanning}
                />
                <Label htmlFor="bruteforce">Try common credentials</Label>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="timeout">Timeout (ms)</Label>
            <Input
              id="timeout"
              type="number"
              value={timeout}
              onChange={(e) => setTimeout(parseInt(e.target.value))}
              disabled={isScanning}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveResults"
              checked={saveResults}
              onCheckedChange={(checked) => setSaveResults(checked === true)}
              disabled={isScanning}
            />
            <Label htmlFor="saveResults">Save Results</Label>
          </div>

          {results && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold">Scan Results</h3>
              <Textarea
                readOnly
                value={JSON.stringify(results, null, 2)}
                className="min-h-32 font-mono text-sm bg-scanner-dark-alt border-gray-700"
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleScan}
          disabled={isScanning || !subnet}
        >
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Start ONVIF Scan
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ONVIFSearchTool;
