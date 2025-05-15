import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Shield, Server, FileWarning, Camera } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { executeBackHack } from '@/utils/osintUtilsConnector';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BackHackParams, BackHackData, HackingToolResult } from '@/utils/types/osintToolTypes';

const BackHackTool = () => {
  const [target, setTarget] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [scanMode, setScanMode] = useState<'basic' | 'full'>('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BackHackData | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResults(null);
    
    try {
      let urlValue = '';
      if (targetUrl) {
        urlValue = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
      }
      
      const params: BackHackParams = {
        tool: 'backHack',
        targetUrl: urlValue,
        mode: scanMode,
        // target: target || undefined,
      };

      const result: HackingToolResult<BackHackData> = await executeBackHack(params);
      
      if (result.success) {
        setResults(result.data.results);
        toast({
          title: "Hack Complete", 
          description: `Found ${result.data.results?.cameras?.length || 0} cameras and ${result.data.results?.backupFiles?.length || 0} backup files.`
        });
      } else {
        toast({
          title: "Operation Failed",
          description: result.error || (result.data as any)?.message || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during back hack:", error);
      toast({
        title: "Operation Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Enter target URL (e.g., example.com)"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !targetUrl}
            className="w-full"
          >
            {isLoading ? (
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
              <Label className="text-sm text-gray-400">Scan Mode</Label>
              <div className="mt-1">
                <Tabs value={scanMode} onValueChange={(value) => setScanMode(value as 'basic' | 'full')} className="w-full">
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
            <TabsTrigger value="cameras" className="flex items-center">
              <Camera className="mr-2 h-4 w-4" />
              Cameras
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
                {results.adminPanel && (
                  <div className="mb-4 p-3 bg-scanner-dark rounded-md border border-gray-700">
                    <Label className="text-sm text-gray-400">Admin Panel Found:</Label>
                    <p className="text-blue-400 break-all">{results.adminPanel}</p>
                  </div>
                )}

                {results.backupFiles && results.backupFiles.length > 0 ? (
                  <div className="p-3 bg-scanner-dark rounded-md border border-gray-700">
                    <Label className="text-sm text-gray-400">Backup Files Found:</Label>
                    <ul className="list-disc list-inside mt-1">
                      {results.backupFiles.map((file: string, index: number) => (
                        <li key={index} className="text-blue-400 break-all">{file}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <FileWarning className="h-12 w-12 mx-auto mb-2" />
                    <p>No backup files or admin panel found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cameras" className="pt-4">
            <Card className="bg-scanner-dark-alt border-gray-700">
              <CardContent className="pt-4">
                {results.cameras && results.cameras.length > 0 ? (
                  <div className="space-y-4">
                    {results.cameras.map((cam: any, index: number) => (
                      <div key={index} className="p-3 bg-scanner-dark rounded-md border border-gray-700">
                        <p><span className="font-medium">ID:</span> {cam.id}</p>
                        <p><span className="font-medium">IP:</span> {cam.ip}:{cam.port}</p>
                        <p><span className="font-medium">Model:</span> {cam.model}</p>
                        <p><span className="font-medium">URL:</span> <a href={cam.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{cam.url}</a></p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p>No cameras found</p>
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

export default BackHackTool;
