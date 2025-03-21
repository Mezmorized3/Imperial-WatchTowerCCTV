
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tv, Key, Shield, Lock, AlertTriangle, Check, X } from 'lucide-react';
import { executeCCTV } from '@/utils/osintTools';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export const CCTVTool: React.FC = () => {
  const [target, setTarget] = useState('');
  const [mode, setMode] = useState('standard');
  const [scanDepth, setScanDepth] = useState('medium');
  const [timeout, setTimeout] = useState(30);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!target) {
      toast({
        title: "Target Required",
        description: "Please enter a camera IP or URL to scan",
        variant: "destructive"
      });
      return;
    }
    
    setIsScanning(true);
    toast({
      title: "CCTV Scan Initiated",
      description: `Scanning ${target} with ${mode} mode...`,
    });
    
    try {
      const scanResults = await executeCCTV({
        target,
        mode,
        scanDepth,
        timeout
      });
      
      setResults(scanResults);
      toast({
        title: "Scan Complete",
        description: scanResults?.simulatedData 
          ? "Showing simulated results (dev mode)" 
          : "CCTV scan completed successfully",
      });
    } catch (error) {
      console.error('CCTV scan error:', error);
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
      <Card className="bg-scanner-dark border border-yellow-900">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-200">
              <p className="font-medium">Security Testing Tool</p>
              <p className="text-yellow-300/80">
                CCTV Tools is designed for security testing. Only use on systems you own or have explicit permission to test. Usage on unauthorized systems is illegal.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Enter camera IP or URL (e.g., 192.168.1.100 or http://camera.example.com)"
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
              <>Scanning...</>
            ) : (
              <>
                <Tv className="mr-2 h-4 w-4" />
                Scan CCTV
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="mode-select">Scan Mode</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger id="mode-select" className="bg-scanner-dark">
                  <SelectValue placeholder="Select scan mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="bruteforce">Credential Bruteforce</SelectItem>
                  <SelectItem value="exploit">Exploit Check</SelectItem>
                  <SelectItem value="firmware">Firmware Analysis</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">Type of scan to perform on the target</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="depth-select">Scan Depth</Label>
              <Select value={scanDepth} onValueChange={setScanDepth}>
                <SelectTrigger id="depth-select" className="bg-scanner-dark">
                  <SelectValue placeholder="Select scan depth" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="deep">Deep</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">Deeper scans are more thorough but take longer</p>
            </div>
            
            <div className="space-y-2 sm:col-span-2">
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
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Tv className="mr-2 h-5 w-5" />
              CCTV Scan Results
              <Badge className="ml-2">{results.mode} mode</Badge>
            </h3>
            
            {results.mode === 'bruteforce' && results.result?.credentials && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium">Credential Testing</h4>
                  <Badge>
                    {results.result.attempts} attempts
                  </Badge>
                </div>
                
                <ScrollArea className="h-[250px]">
                  <div className="space-y-2">
                    {results.result.credentials.map((cred: any, index: number) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-md border ${
                          cred.success ? 'bg-green-900/20 border-green-800' : 'bg-scanner-dark border-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Key className="h-4 w-4 mr-2 text-gray-400" />
                            <div>
                              <span className="mr-1 font-mono">
                                {cred.username || '<empty>'}
                              </span>
                              :
                              <span className="ml-1 font-mono">
                                {cred.password || '<empty>'}
                              </span>
                            </div>
                          </div>
                          {cred.success ? (
                            <Badge className="bg-green-600">Success</Badge>
                          ) : (
                            <Badge variant="outline">Failed</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
            
            {results.mode === 'exploit' && results.result?.exploits && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-md font-medium">Exploit Testing</h4>
                  <Badge>
                    {results.result.attempts} attempts
                  </Badge>
                </div>
                
                <ScrollArea className="h-[250px]">
                  <div className="space-y-2">
                    {results.result.exploits.map((exploit: any, index: number) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-md border ${
                          exploit.success ? 'bg-red-900/20 border-red-800' : 'bg-scanner-dark border-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 mr-2 text-red-400" />
                              <span className="font-medium">{exploit.name}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{exploit.details}</p>
                          </div>
                          {exploit.success ? (
                            <Badge className="bg-red-600">Vulnerable</Badge>
                          ) : (
                            <Badge variant="outline">Secure</Badge>
                          )}
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="text-gray-400">Type: </span>
                          <span>{exploit.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
            
            {results.mode === 'firmware' && results.result?.firmwareVersion && (
              <div className="space-y-4">
                <div className="p-3 bg-scanner-dark rounded-md border border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-blue-400" />
                      <span className="font-medium">Firmware Analysis</span>
                    </div>
                    <Badge className="bg-blue-600">{results.result.firmwareVersion}</Badge>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Extracted: </span>
                      {results.result.extracted ? 
                        <Check className="inline h-4 w-4 text-green-500" /> : 
                        <X className="inline h-4 w-4 text-red-500" />}
                    </div>
                    <div>
                      <span className="text-gray-400">Vulnerabilities: </span>
                      <span>{results.result.vulnerabilities}</span>
                    </div>
                  </div>
                  
                  {results.result.components && results.result.components.length > 0 && (
                    <div className="mt-3">
                      <span className="text-gray-400">Components: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {results.result.components.map((component: string, i: number) => (
                          <Badge key={i} variant="outline" className="bg-scanner-dark-alt">
                            {component}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {results.mode === 'standard' && (
              <Tabs defaultValue="credentials" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="credentials" className="flex items-center">
                    <Key className="mr-2 h-4 w-4" />
                    Credentials
                  </TabsTrigger>
                  <TabsTrigger value="exploits" className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Exploits
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="credentials" className="pt-4">
                  {results.result?.credentials ? (
                    <ScrollArea className="h-[250px]">
                      <div className="space-y-2">
                        {results.result.credentials.map((cred: any, index: number) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-md border ${
                              cred.success ? 'bg-green-900/20 border-green-800' : 'bg-scanner-dark border-gray-700'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Key className="h-4 w-4 mr-2 text-gray-400" />
                                <div>
                                  <span className="mr-1 font-mono">
                                    {cred.username || '<empty>'}
                                  </span>
                                  :
                                  <span className="ml-1 font-mono">
                                    {cred.password || '<empty>'}
                                  </span>
                                </div>
                              </div>
                              {cred.success ? (
                                <Badge className="bg-green-600">Success</Badge>
                              ) : (
                                <Badge variant="outline">Failed</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Key className="h-12 w-12 mx-auto mb-2" />
                      <p>No credential information available</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="exploits" className="pt-4">
                  {results.result?.exploits ? (
                    <ScrollArea className="h-[250px]">
                      <div className="space-y-2">
                        {results.result.exploits.map((exploit: any, index: number) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-md border ${
                              exploit.success ? 'bg-red-900/20 border-red-800' : 'bg-scanner-dark border-gray-700'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <Shield className="h-4 w-4 mr-2 text-red-400" />
                                  <span className="font-medium">{exploit.name}</span>
                                </div>
                                <p className="text-sm text-gray-400 mt-1">{exploit.details}</p>
                              </div>
                              {exploit.success ? (
                                <Badge className="bg-red-600">Vulnerable</Badge>
                              ) : (
                                <Badge variant="outline">Secure</Badge>
                              )}
                            </div>
                            <div className="mt-2 text-sm">
                              <span className="text-gray-400">Type: </span>
                              <span>{exploit.type}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <Shield className="h-12 w-12 mx-auto mb-2" />
                      <p>No exploit information available</p>
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
