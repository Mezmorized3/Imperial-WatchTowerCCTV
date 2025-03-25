import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { ImperialOculusParams } from '@/utils/types/networkToolTypes';
import { Loader2, Wifi, AlertCircle, ArrowRight, Server } from 'lucide-react';

interface ImperialOculusToolProps {
  onScanComplete?: (results: any) => void;
}

// Mock function for the Imperial Oculus functionality
const mockExecuteImperialOculus = async (params: ImperialOculusParams): Promise<any> => {
  console.log("Imperial Oculus: executing with params", params);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // For demo, return simulated data
  return {
    success: true,
    timestamp: new Date().toISOString(),
    scanType: params.scanType,
    target: params.target,
    domain: params.target,
    networkInformation: {
      ipAddresses: ["192.168.1.1", "192.168.1.100", "192.168.1.254"],
      subdomains: ["mail", "admin", "api", "static"],
      openPorts: [80, 443, 22, 3389, 8080],
      services: ["HTTP", "HTTPS", "SSH", "RDP", "Proxy"],
      securityRating: "medium",
      vulnerabilities: [
        {
          severity: "high",
          description: "Outdated SSL certificate",
          remediation: "Update SSL certificate to latest standard"
        },
        {
          severity: "medium", 
          description: "Remote administration ports open",
          remediation: "Restrict access to administrative ports"
        }
      ]
    },
    simulatedData: true
  };
};

const ImperialOculusTool: React.FC<ImperialOculusToolProps> = ({ onScanComplete }) => {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState<'full' | 'quick' | 'stealth' | 'basic'>('quick');
  const [saveResults, setSaveResults] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const handleScan = async () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target domain or IP",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setProgress(0);
    setResults(null);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 200);

    try {
      const params: ImperialOculusParams = {
        target,
        scanType,
        saveResults,
        timeout: 60
      };

      // Execute Imperial Oculus scan
      const result = await mockExecuteImperialOculus(params);
      setResults(result);

      if (onScanComplete) {
        onScanComplete(result);
      }

      toast({
        title: "Scan Complete",
        description: `Imperial Oculus completed the ${scanType} scan`,
      });
    } catch (error) {
      console.error("Error during Imperial Oculus scan:", error);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => setIsScanning(false), 500);
    }
  };

  const renderSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5" />
          Imperial Oculus
        </CardTitle>
        <CardDescription>
          Advanced network reconnaissance and domain analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target">Target Domain or IP</Label>
            <Input
              id="target"
              placeholder="example.com or 192.168.1.1"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={isScanning}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scanType">Scan Type</Label>
            <Select
              value={scanType}
              onValueChange={(value) => setScanType(value as 'full' | 'quick' | 'stealth' | 'basic')}
              disabled={isScanning}
            >
              <SelectTrigger id="scanType">
                <SelectValue placeholder="Select scan type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quick">Quick Scan</SelectItem>
                <SelectItem value="full">Full Scan</SelectItem>
                <SelectItem value="stealth">Stealth Scan</SelectItem>
                <SelectItem value="basic">Basic Scan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveResults"
              checked={saveResults}
              onCheckedChange={(checked) => setSaveResults(checked === true)}
              disabled={isScanning}
            />
            <Label htmlFor="saveResults">Save Results to Database</Label>
          </div>

          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scanning...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>

        {results && (
          <div className="space-y-4 pt-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-900/30 text-blue-300">
                {results.scanType}
              </Badge>
              <Badge variant="outline" className="bg-gray-900/30 text-gray-300">
                {new Date(results.timestamp).toLocaleString()}
              </Badge>
            </div>

            <Separator className="my-2" />

            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Server className="h-4 w-4" />
                Network Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Security Rating</h4>
                  <div className="mt-1">
                    {results.networkInformation.securityRating === "low" && (
                      <Badge variant="destructive">Low Security</Badge>
                    )}
                    {results.networkInformation.securityRating === "medium" && (
                      <Badge variant="secondary">Medium Security</Badge>
                    )}
                    {results.networkInformation.securityRating === "high" && (
                      <Badge variant="outline" className="bg-green-900/30 text-green-300">
                        High Security
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400">Open Ports</h4>
                  <p className="mt-1 text-sm">
                    {results.networkInformation.openPorts.join(", ")}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400">Services</h4>
                <p className="mt-1 text-sm">
                  {results.networkInformation.services.join(", ")}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400">Subdomains</h4>
                <div className="mt-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                  {results.networkInformation.subdomains.map((subdomain: string, index: number) => (
                    <div key={index} className="text-sm bg-gray-800 rounded p-1 px-2">
                      {subdomain}.{results.domain}
                    </div>
                  ))}
                </div>
              </div>

              {results.networkInformation.vulnerabilities && 
               results.networkInformation.vulnerabilities.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    Vulnerabilities
                  </h4>
                  <div className="mt-2 space-y-3">
                    {results.networkInformation.vulnerabilities.map((vuln: any, index: number) => (
                      <div key={index} className="bg-gray-800/50 p-3 rounded-md">
                        <div className="flex justify-between">
                          <div className="font-medium">{vuln.description}</div>
                          {renderSeverityBadge(vuln.severity)}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          {vuln.remediation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleScan}
          disabled={isScanning || !target}
        >
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Imperial Oculus...
            </>
          ) : (
            <>
              Scan with Imperial Oculus
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImperialOculusTool;
