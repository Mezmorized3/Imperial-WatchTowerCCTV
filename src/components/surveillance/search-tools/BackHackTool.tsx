
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileWarning, Server, Database, Code, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { executeBackHack } from '@/utils/osintTools';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export const BackHackTool: React.FC = () => {
  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('api');
  const [depth, setDepth] = useState('medium');
  const [timeout, setTimeout] = useState(30);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!target) {
      toast({
        title: "Target Required",
        description: "Please enter a target URL or domain to scan",
        variant: "destructive"
      });
      return;
    }
    
    // Validate URL format for web targets
    try {
      new URL(target.startsWith('http') ? target : `https://${target}`);
    } catch (e) {
      toast({
        title: "Invalid Target",
        description: "Please enter a valid URL or domain",
        variant: "destructive"
      });
      return;
    }
    
    setIsScanning(true);
    toast({
      title: "Backend Analysis Initiated",
      description: `Analyzing backend systems of ${target}...`,
    });
    
    try {
      const scanResults = await executeBackHack({
        target: target.startsWith('http') ? target : `https://${target}`,
        scanType,
        depth,
        timeout
      });
      
      setResults(scanResults);
      toast({
        title: "Analysis Complete",
        description: scanResults?.simulatedData 
          ? "Showing simulated results (dev mode)" 
          : "Backend analysis completed successfully",
      });
    } catch (error) {
      console.error('BackHack analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-scanner-dark border border-yellow-900">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-200">
              <p className="font-medium">Security Testing Tool</p>
              <p className="text-yellow-300/80">
                BackHack is designed for authorized security testing only. Using this tool against systems without permission is illegal and may result in legal consequences.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Enter target URL or domain (e.g., example.com)"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div>
          <Button 
            onClick={handleScan} 
            disabled={isScanning || !target}
            className="w-full"
            variant="destructive"
          >
            {isScanning ? (
              <>Analyzing...</>
            ) : (
              <>
                <FileWarning className="mr-2 h-4 w-4" />
                Analyze Backend
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="scan-type-select">Scan Type</Label>
              <Select value={scanType} onValueChange={setScanType}>
                <SelectTrigger id="scan-type-select" className="bg-scanner-dark">
                  <SelectValue placeholder="Select scan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="api">API Endpoints</SelectItem>
                  <SelectItem value="database">Database Analysis</SelectItem>
                  <SelectItem value="framework">Framework Detection</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">Type of backend analysis to perform</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="depth-select">Scan Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger id="depth-select" className="bg-scanner-dark">
                  <SelectValue placeholder="Select scan depth" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light (Faster)</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="deep">Deep (Thorough)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">Deeper scans find more but take longer</p>
            </div>
            
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="timeout-slider">Timeout: {timeout}s</Label>
              </div>
              <Slider 
                id="timeout-slider"
                min={10} 
                max={120} 
                step={5} 
                value={[timeout]} 
                onValueChange={(value) => setTimeout(value[0])}
              />
              <p className="text-xs text-gray-400">Maximum time to wait for responses</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {results && (
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardContent className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <FileWarning className="mr-2 h-5 w-5" />
                Backend Analysis Results
              </h3>
              <Badge className="capitalize">{results.scanType} Scan</Badge>
            </div>
            
            {results.scanType === 'api' && results.result?.endpoints && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium">API Endpoints</h4>
                  <div className="text-sm">
                    <span className="text-gray-400">Auth: </span>
                    <span>{results.result.authMechanism}</span>
                  </div>
                </div>
                
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {results.result.endpoints.map((endpoint: any, index: number) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-md border ${
                          endpoint.vulnerabilities ? 'bg-red-900/20 border-red-800' : 'bg-scanner-dark border-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Code className="h-4 w-4 mr-2 text-blue-400" />
                            <span className="font-mono text-sm">
                              {endpoint.method} {endpoint.path}
                            </span>
                          </div>
                          {endpoint.authenticated ? (
                            <Badge variant="outline" className="bg-scanner-dark">Auth Required</Badge>
                          ) : (
                            <Badge className="bg-yellow-600">Public</Badge>
                          )}
                        </div>
                        
                        {endpoint.vulnerabilities && (
                          <div className="mt-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-red-400 text-sm">{endpoint.vulnerabilities}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
            
            {results.scanType === 'database' && results.result?.databases && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium">Database Systems</h4>
                  {results.result.backupFiles > 0 && (
                    <Badge className="bg-yellow-600">
                      {results.result.backupFiles} Backup {results.result.backupFiles === 1 ? 'File' : 'Files'}
                    </Badge>
                  )}
                </div>
                
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {results.result.databases.map((db: any, index: number) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-md border ${
                          db.exposed ? 'bg-red-900/20 border-red-800' : 'bg-scanner-dark border-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Database className="h-4 w-4 mr-2 text-blue-400" />
                            <span className="font-medium">{db.type}</span>
                          </div>
                          <Badge className="bg-blue-600">v{db.version}</Badge>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-400">Tables: </span>
                            <span>{db.tables}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Exposed: </span>
                            {db.exposed ? (
                              <Badge className="bg-red-600">Yes</Badge>
                            ) : (
                              <Badge variant="outline">No</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
            
            {results.scanType === 'framework' && results.result?.framework && (
              <div className="p-4 bg-scanner-dark rounded-md border border-gray-700">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium flex items-center">
                    <Server className="h-4 w-4 text-blue-400 mr-2" />
                    Framework Detection
                  </h4>
                  <Badge className="bg-blue-600">v{results.result.version}</Badge>
                </div>
                
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Framework: </span>
                    <span className="font-medium">{results.result.framework}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Outdated: </span>
                    {results.result.outdated ? (
                      <span className="flex items-center">
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        Yes
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                        No
                      </span>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-400">Known Vulnerabilities: </span>
                    <span>{results.result.knownVulnerabilities}</span>
                  </div>
                </div>
              </div>
            )}
            
            {results.scanType === 'comprehensive' && (
              <Tabs defaultValue="endpoints" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="endpoints" className="flex items-center">
                    <Code className="mr-2 h-4 w-4" />
                    API Endpoints
                  </TabsTrigger>
                  <TabsTrigger value="databases" className="flex items-center">
                    <Database className="mr-2 h-4 w-4" />
                    Databases
                  </TabsTrigger>
                  <TabsTrigger value="framework" className="flex items-center">
                    <Server className="mr-2 h-4 w-4" />
                    Framework
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="endpoints" className="pt-4">
                  {results.result?.endpoints ? (
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {results.result.endpoints.map((endpoint: any, index: number) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-md border ${
                              endpoint.vulnerabilities ? 'bg-red-900/20 border-red-800' : 'bg-scanner-dark border-gray-700'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Code className="h-4 w-4 mr-2 text-blue-400" />
                                <span className="font-mono text-sm">
                                  {endpoint.method} {endpoint.path}
                                </span>
                              </div>
                              {endpoint.authenticated ? (
                                <Badge variant="outline" className="bg-scanner-dark">Auth Required</Badge>
                              ) : (
                                <Badge className="bg-yellow-600">Public</Badge>
                              )}
                            </div>
                            
                            {endpoint.vulnerabilities && (
                              <div className="mt-2 flex items-center">
                                <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                                <span className="text-red-400 text-sm">{endpoint.vulnerabilities}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Code className="h-12 w-12 mx-auto mb-2" />
                      <p>No API endpoints detected</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="databases" className="pt-4">
                  {results.result?.databases ? (
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {results.result.databases.map((db: any, index: number) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-md border ${
                              db.exposed ? 'bg-red-900/20 border-red-800' : 'bg-scanner-dark border-gray-700'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Database className="h-4 w-4 mr-2 text-blue-400" />
                                <span className="font-medium">{db.type}</span>
                              </div>
                              <Badge className="bg-blue-600">v{db.version}</Badge>
                            </div>
                            
                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-400">Tables: </span>
                                <span>{db.tables}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Exposed: </span>
                                {db.exposed ? (
                                  <Badge className="bg-red-600">Yes</Badge>
                                ) : (
                                  <Badge variant="outline">No</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Database className="h-12 w-12 mx-auto mb-2" />
                      <p>No database information detected</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="framework" className="pt-4">
                  {results.result?.framework ? (
                    <div className="p-4 bg-scanner-dark rounded-md border border-gray-700">
                      <div className="flex justify-between items-center">
                        <h4 className="text-md font-medium flex items-center">
                          <Server className="h-4 w-4 text-blue-400 mr-2" />
                          {results.result.framework}
                        </h4>
                        <Badge className="bg-blue-600">v{results.result.version}</Badge>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-400">Outdated: </span>
                          {results.result.outdated ? (
                            <span className="flex items-center">
                              <XCircle className="h-4 w-4 text-red-500 mr-1" />
                              Yes
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                              No
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-400">Known Vulnerabilities: </span>
                          <span>{results.result.knownVulnerabilities}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Server className="h-12 w-12 mx-auto mb-2" />
                      <p>No framework information detected</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
