
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Terminal, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface ImperialOculusResult {
  target: string;
  services: { port: number; service: string; banner: string }[];
  os: string;
  response_time: string;
  open_ports: number[];
  scan_time: string;
}

export const ImperialOculusTool: React.FC = () => {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('quick');
  const [ports, setPorts] = useState('1-1000');
  const [timeout, setTimeoutValue] = useState(5000);
  const [scanTechniques, setScanTechniques] = useState<string[]>([]);
  const [outputFormat, setOutputFormat] = useState('json');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImperialOculusResult | null>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!target) {
      toast({
        title: 'Error',
        description: 'Please enter a target IP or domain.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    // Simulate scan execution
    setTimeout(() => {
      const mockResult: ImperialOculusResult = {
        target: target,
        services: [
          { port: 80, service: 'HTTP', banner: 'nginx/1.18.0' },
          { port: 443, service: 'HTTPS', banner: 'nginx/1.18.0' },
          { port: 22, service: 'SSH', banner: 'OpenSSH 8.2p1' },
        ],
        os: 'Linux 5.4.x',
        response_time: '53ms',
        open_ports: [22, 80, 443, 8080],
        scan_time: '2.4s',
      };

      setResult(mockResult);
      setIsLoading(false);

      toast({
        title: 'Scan Complete',
        description: `Imperial Oculus scan completed for ${target}.`,
      });
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Terminal className="mr-2 h-4 w-4" /> Imperial Oculus
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target">Target IP or Domain</Label>
            <Input
              id="target"
              placeholder="Enter target IP or domain"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="bg-scanner-dark"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scan-type">Scan Type</Label>
              <Select value={scanType} onValueChange={setScanType}>
                <SelectTrigger id="scan-type" className="bg-scanner-dark">
                  <SelectValue placeholder="Select scan type" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark">
                  <SelectItem value="quick">Quick</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="stealth">Stealth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ports">Ports (e.g., 1-1000, 22,80,443)</Label>
              <Input
                id="ports"
                placeholder="Enter port range or list"
                value={ports}
                onChange={(e) => setPorts(e.target.value)}
                className="bg-scanner-dark"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeout">Timeout (ms)</Label>
            <Input
              id="timeout"
              type="number"
              placeholder="Enter timeout in milliseconds"
              value={timeout.toString()}
              onChange={(e) => setTimeoutValue(parseInt(e.target.value))}
              className="bg-scanner-dark"
            />
          </div>

          <Button
            onClick={handleScan}
            disabled={isLoading}
            className="w-full"
            variant="destructive"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Terminal className="mr-2 h-4 w-4" />
                Start Scan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" /> Scan Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Target:</span> {result.target}
            </div>
            <div className="text-sm">
              <span className="font-medium">OS:</span> {result.os}
            </div>
            <div className="text-sm">
              <span className="font-medium">Response Time:</span> {result.response_time}
            </div>
            <div className="text-sm">
              <span className="font-medium">Scan Time:</span> {result.scan_time}
            </div>
            <div className="text-sm">
              <span className="font-medium">Open Ports:</span> {result.open_ports.join(', ')}
            </div>
            <div className="text-sm">
              <span className="font-medium">Services:</span>
              <ul>
                {result.services.map((service) => (
                  <li key={service.port}>
                    {service.port}: {service.service} ({service.banner})
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
