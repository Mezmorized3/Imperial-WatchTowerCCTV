import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Network, Shield } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { executeImperialOculus } from '@/utils/osintTools';

interface ImperialOculusToolProps {
  onScanComplete?: (results: any) => void;
}

const ImperialOculusTool: React.FC<ImperialOculusToolProps> = ({ onScanComplete }) => {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState<'basic' | 'full' | 'stealth'>('basic');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [saveResults, setSaveResults] = useState(false);
  const [timeout, setTimeout] = useState('60');
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await executeImperialOculus({
        target,
        scanType: scanType as 'full' | 'quick' | 'stealth',
        saveResults,
        timeout: parseInt(timeout)
      });
      
      if (result && result.success) {
        setResults(result.data);
        
        if (onScanComplete) {
          onScanComplete(result.data);
        }
        
        toast({
          title: "Scan Complete",
          description: `Scan completed successfully`
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

  const getScanTypeBadge = (type: string) => {
    switch (type) {
      case 'full':
        return <Badge className="bg-blue-600">Full Scan</Badge>;
      case 'stealth':
        return <Badge className="bg-purple-600">Stealth Scan</Badge>;
      default:
        return <Badge className="bg-green-600">Basic Scan</Badge>;
    }
  };

  const getPortSeverity = (port: number) => {
    const highRiskPorts = [21, 23, 3389, 445, 135, 139];
    const mediumRiskPorts = [22, 80, 443, 8080, 8443, 3306, 5432];
    
    if (highRiskPorts.includes(port)) return 'high';
    if (mediumRiskPorts.includes(port)) return 'medium';
    return 'low';
  };

  const getPortBadge = (port: number, service: string) => {
    const severity = getPortSeverity(port);
    let className = "ml-1";
    
    switch (severity) {
      case 'high':
        className += " bg-red-600";
        break;
      case 'medium':
        className += " bg-yellow-600";
        break;
      default:
        className += " bg-blue-600";
    }
    
    return <Badge className={className}>{port} ({service})</Badge>;
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Imperial Oculus Network Scanner
        </CardTitle>
        <CardDescription>
          Scan networks to identify devices and open ports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target">Target Network (CIDR format)</Label>
            <Input
              id="target"
              placeholder="192.168.1.0/24"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={isScanning}
            />
            <p className="text-xs text-muted-foreground">
              Enter a network address in CIDR notation (e.g., 192.168.1.0/24)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scanType">Scan Type</Label>
            <Select 
              value={scanType} 
              onValueChange={(value) => setScanType(value as 'basic' | 'full' | 'stealth')}
              disabled={isScanning}
            >
              <SelectTrigger id="scanType">
                <SelectValue placeholder="Select scan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic (Fast)</SelectItem>
                <SelectItem value="full">Full (Detailed)</SelectItem>
                <SelectItem value="stealth">Stealth (Low Detection)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="saveResults">Save Results</Label>
            <Checkbox
              id="saveResults"
              checked={saveResults}
              onCheckedChange={(checked) => setSaveResults(checked === true)}
              disabled={isScanning}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeout">Timeout (seconds)</Label>
            <Input
              id="timeout"
              type="number"
              value={timeout}
              onChange={(e) => setTimeout(e.target.value)}
              disabled={isScanning}
            />
          </div>

          {isScanning && (
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Scanning network...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {results && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Scan Results</h3>
                <div className="flex items-center gap-2">
                  {getScanTypeBadge(results.scan_type)}
                  <Badge variant="outline">{results.total_hosts} Hosts</Badge>
                  <Badge variant="outline">{results.total_ports} Ports</Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                {results.devices.map((device: any, index: number) => (
                  <div key={index} className="border rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{device.ip}</span>
                        {device.hostName && (
                          <span className="text-sm text-muted-foreground ml-2">
                            ({device.hostName})
                          </span>
                        )}
                      </div>
                      {device.manufacturer && (
                        <Badge variant="outline">{device.manufacturer}</Badge>
                      )}
                    </div>
                    
                    {device.macAddress && (
                      <div className="text-xs text-muted-foreground mt-1">
                        MAC: {device.macAddress}
                      </div>
                    )}
                    
                    <div className="mt-2">
                      <div className="text-sm flex items-center gap-1 mb-1">
                        <Shield className="h-3 w-3" />
                        <span>Open Ports:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {device.openPorts.map((port: any, pidx: number) => (
                          <span key={pidx}>
                            {getPortBadge(port.port, port.service)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {device.openPorts.some((p: any) => getPortSeverity(p.port) === 'high') && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-red-500">
                        <AlertCircle className="h-3 w-3" />
                        <span>High-risk ports detected</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-muted-foreground mt-2">
                Scan completed in {results.scan_time} • {new Date(results.timestamp).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleScan}
          disabled={isScanning || !target}
        >
          {isScanning ? 'Scanning...' : 'Start Network Scan'}
          {!isScanning && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImperialOculusTool;
