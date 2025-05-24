import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Scan } from 'lucide-react';
import { toast } from 'sonner';
import {
  executeNmapONVIF,
  executeMasscan
} from '@/utils/osintUtilsConnector';

const ONVIFSearchTool: React.FC = () => {
  const [target, setTarget] = useState('');
  const [ports, setPorts] = useState('80,554,8000,8080');
  const [saveResults, setSaveResults] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleNmapScan = async () => {
    if (!target) {
      toast.error('Please enter a target IP address or range.');
      return;
    }

    setIsScanning(true);
    setResults(null);

    try {
      const result = await executeNmapONVIF({
        tool: 'nmapONVIF',
        target,
        ports: ports.split(','),
        timeout: 30,
        saveResults: true
      });

      const masscanResult = await executeMasscan({
        tool: 'masscan',
        targets: [target],
        ports,
        timeout: 30,
        saveResults: true
      });

      if (result.success && masscanResult.success) {
        setResults({
          nmap: result.data,
          masscan: masscanResult.data
        });
        toast.success('ONVIF scan completed successfully!');
      } else {
        toast.error('ONVIF scan failed. Check console for details.');
      }
    } catch (error) {
      console.error('ONVIF scan error:', error);
      toast.error('ONVIF scan failed. Check console for details.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="target">Target IP or Range</Label>
          <Input
            id="target"
            type="text"
            placeholder="e.g., 192.168.1.0/24 or 192.168.1.100"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ports">Ports to Scan (comma-separated)</Label>
          <Input
            id="ports"
            type="text"
            placeholder="e.g., 80,554,8000,8080"
            value={ports}
            onChange={(e) => setPorts(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="save-results"
            checked={saveResults}
            onCheckedChange={(checked) => setSaveResults(!!checked)}
            className="peer h-5 w-5 bg-scanner-dark-alt border-gray-700"
          />
          <Label
            htmlFor="save-results"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-400"
          >
            Save Results
          </Label>
        </div>
        <Button
          onClick={handleNmapScan}
          disabled={isScanning}
          className="bg-scanner-primary"
        >
          {isScanning ? (
            <>
              <Scan className="h-4 w-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Scan className="h-4 w-4 mr-2" />
              Scan for ONVIF Devices
            </>
          )}
        </Button>
        {results && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Scan Results:</h3>
            <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-96 p-4 bg-scanner-dark rounded-md border border-gray-700">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ONVIFSearchTool;
