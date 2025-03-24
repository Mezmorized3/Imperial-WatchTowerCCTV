import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FileWarning, Search, Shield, Server } from 'lucide-react';
import { executeBackHack } from '@/utils/osintImplementations';
import { useToast } from '@/hooks/use-toast';

export const BackHackTool: React.FC = () => {
  const [targetUrl, setTargetUrl] = useState('');
  const [scanType, setScanType] = useState('basic');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!targetUrl) {
      toast({
        title: "Target Required",
        description: "Please enter a target URL or IP to scan",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    toast({
      title: "BackHack Scan Initiated",
      description: `Scanning ${targetUrl}...`,
    });

    try {
      const result = await executeBackHack({
        target: url,
        url: url,
        scanType: scanType as 'basic' | 'full'
      });

      setResults(result);
      toast({
        title: "Scan Complete",
        description: result?.simulatedData
          ? "Showing simulated results (dev mode)"
          : "BackHack scan completed successfully",
      });
    } catch (error) {
      console.error('BackHack scan error:', error);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Enter target URL or IP (e.g., example.com)"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div>
          <Button
            onClick={handleScan}
            disabled={isScanning || !targetUrl}
            className="w-full"
          >
            {isScanning ? (
              <>Scanning...</>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Start Scan
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-400">Scan Type</Label>
              <div className="mt-1">
                <Tabs value={scanType} onValueChange={setScanType} className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="basic" className="flex-1">Basic</TabsTrigger>
                    <TabsTrigger value="full" className="flex-1">Full Scan</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Tabs defaultValue="vulnerabilities" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="vulnerabilities" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Vulnerabilities
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center">
              <Server className="mr-2 h-4 w-4" />
              Information
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vulnerabilities" className="pt-4">
            <Card className="bg-scanner-dark-alt border-gray-700">
              <CardContent className="pt-4">
                {results.vulnerabilities && results.vulnerabilities.length > 0 ? (
                  <div className="space-y-4">
                    {results.vulnerabilities.map((vuln: any, index: number) => (
                      <div key={index} className="p-3 bg-scanner-dark rounded-md border border-gray-700">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <FileWarning className="h-5 w-5 text-red-500 mr-2" />
                            <span className="font-medium">{vuln.type}</span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-400">
                          <p><span className="font-medium">URL:</span> {vuln.url}</p>
                          <p><span className="font-medium">Parameter:</span> {vuln.parameter}</p>
                          <p><span className="font-medium">Severity:</span> {vuln.severity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Shield className="h-12 w-12 mx-auto mb-2" />
                    <p>No vulnerabilities detected</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="pt-4">
            <Card className="bg-scanner-dark-alt border-gray-700">
              <CardContent className="pt-4">
                {results.adminPanel ? (
                  <div className="mb-4">
                    <Label className="text-sm text-gray-400">Admin Panel Found:</Label>
                    <p className="text-blue-400">{results.adminPanel}</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Server className="h-12 w-12 mx-auto mb-2" />
                    <p>No admin panel found</p>
                  </div>
                )}

                {results.backupFiles && results.backupFiles.length > 0 ? (
                  <div>
                    <Label className="text-sm text-gray-400">Backup Files Found:</Label>
                    <ul>
                      {results.backupFiles.map((file: string, index: number) => (
                        <li key={index} className="text-blue-400">{file}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <FileWarning className="h-12 w-12 mx-auto mb-2" />
                    <p>No backup files found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
