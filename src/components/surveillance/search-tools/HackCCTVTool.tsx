
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Camera, Shield, ArrowRight, Globe, Search } from 'lucide-react';
import { executeHackCCTV, executeCamDumper, executeOpenCCTV, executeEyePwn, executeIngram } from '@/utils/osintImplementations';
import { CameraResult } from '@/utils/types/cameraTypes';

const HackCCTVTool: React.FC = () => {
  const [targetInput, setTargetInput] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('default-credentials');
  const [selectedTool, setSelectedTool] = useState('hack-cctv');
  const [bruteforce, setBruteforce] = useState(true);
  const [deepScan, setDeepScan] = useState(false);
  const [scanMode, setScanMode] = useState('quick');
  const [country, setCountry] = useState('');
  const [results, setResults] = useState<CameraResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleExecute = async () => {
    if (!targetInput) {
      toast({
        title: "Error",
        description: "Please enter a target IP or range",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    try {
      let searchResult;
      
      switch (selectedTool) {
        case 'hack-cctv':
          searchResult = await executeHackCCTV({
            target: targetInput,
            method: selectedMethod as any,
            bruteforce,
            deepScan,
            country
          });
          break;
          
        case 'cam-dumper':
          searchResult = await executeCamDumper({
            target: targetInput,
            method: 'scan',
            country
          });
          break;
          
        case 'open-cctv':
          searchResult = await executeOpenCCTV({
            target: targetInput,
            scanMode: scanMode as any
          });
          break;
          
        case 'eye-pwn':
          searchResult = await executeEyePwn({
            target: targetInput,
            method: 'all',
            bruteforce,
            country
          });
          break;
          
        case 'ingram':
          searchResult = await executeIngram({
            target: targetInput,
            scanType: scanMode as any,
            country
          });
          break;
          
        default:
          searchResult = await executeHackCCTV({
            target: targetInput,
            bruteforce,
            country
          });
      }
      
      if (searchResult?.data?.cameras) {
        setResults(searchResult.data.cameras);
        toast({
          title: "Scan Complete",
          description: `Found ${searchResult.data.cameras.length} camera${searchResult.data.cameras.length !== 1 ? 's' : ''}`
        });
      } else {
        toast({
          title: "No Results",
          description: "No cameras found with selected parameters"
        });
      }
    } catch (error) {
      console.error('HackCCTV error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-scanner-dark-alt border-gray-700 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center">
            <Shield className="mr-2 h-5 w-5 text-scanner-primary" />
            CCTV Hacking Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target" className="text-sm text-gray-300">Target IP/Range</Label>
                  <Input 
                    id="target"
                    placeholder="e.g. 192.168.1.0/24 or specific IP"
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    className="bg-scanner-dark border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm text-gray-300">Target Country (Optional)</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger id="country" className="bg-scanner-dark border-gray-700">
                      <SelectValue placeholder="Select country (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-scanner-dark border-gray-700">
                      <SelectItem value="">Any Country</SelectItem>
                      <SelectItem value="ukraine">Ukraine</SelectItem>
                      <SelectItem value="russia">Russia</SelectItem>
                      <SelectItem value="georgia">Georgia</SelectItem>
                      <SelectItem value="romania">Romania</SelectItem>
                      <SelectItem value="united states">United States</SelectItem>
                      <SelectItem value="united kingdom">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tool" className="text-sm text-gray-300">Hacking Tool</Label>
                  <Select value={selectedTool} onValueChange={setSelectedTool}>
                    <SelectTrigger id="tool" className="bg-scanner-dark border-gray-700">
                      <SelectValue placeholder="Select hacking tool" />
                    </SelectTrigger>
                    <SelectContent className="bg-scanner-dark border-gray-700">
                      <SelectItem value="hack-cctv">Hack-CCTV</SelectItem>
                      <SelectItem value="cam-dumper">Cam-Dumper</SelectItem>
                      <SelectItem value="open-cctv">OpenCCTV</SelectItem>
                      <SelectItem value="eye-pwn">EyePwn</SelectItem>
                      <SelectItem value="ingram">Ingram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedTool === 'hack-cctv' && (
                  <div className="space-y-2">
                    <Label htmlFor="method" className="text-sm text-gray-300">Attack Method</Label>
                    <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                      <SelectTrigger id="method" className="bg-scanner-dark border-gray-700">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent className="bg-scanner-dark border-gray-700">
                        <SelectItem value="default-credentials">Default Credentials</SelectItem>
                        <SelectItem value="exploit">Exploit Vulnerabilities</SelectItem>
                        <SelectItem value="brute-force">Brute Force</SelectItem>
                        <SelectItem value="rtsp-discovery">RTSP Discovery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {(selectedTool === 'open-cctv' || selectedTool === 'ingram') && (
                  <div className="space-y-2">
                    <Label htmlFor="scanMode" className="text-sm text-gray-300">Scan Mode</Label>
                    <Select value={scanMode} onValueChange={setScanMode}>
                      <SelectTrigger id="scanMode" className="bg-scanner-dark border-gray-700">
                        <SelectValue placeholder="Select scan mode" />
                      </SelectTrigger>
                      <SelectContent className="bg-scanner-dark border-gray-700">
                        <SelectItem value="quick">Quick</SelectItem>
                        <SelectItem value="deep">Deep</SelectItem>
                        <SelectItem value="stealth">Stealth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="bruteforce" 
                    checked={bruteforce}
                    onCheckedChange={(checked) => setBruteforce(checked === true)}
                  />
                  <Label htmlFor="bruteforce" className="text-sm text-gray-300">
                    Try brute-forcing credentials
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="deepscan" 
                    checked={deepScan}
                    onCheckedChange={(checked) => setDeepScan(checked === true)}
                  />
                  <Label htmlFor="deepscan" className="text-sm text-gray-300">
                    Perform deep scan (slower but more thorough)
                  </Label>
                </div>
              </div>
              
              <Button 
                onClick={handleExecute}
                disabled={isSearching || !targetInput}
                className="w-full bg-scanner-primary hover:bg-scanner-primary/90"
              >
                {isSearching ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></div>
                    Scanning...
                  </div>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Execute Hack
                  </>
                )}
              </Button>
            </TabsContent>
            
            <TabsContent value="results">
              {results.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-400 mb-2">
                    Found {results.length} vulnerable camera{results.length !== 1 ? 's' : ''}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto pr-1">
                    {results.map((camera, index) => (
                      <div 
                        key={index}
                        className="p-3 bg-scanner-dark border border-gray-700 rounded-md hover:border-scanner-primary/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium flex items-center">
                              <Camera className="h-4 w-4 mr-2 text-scanner-primary" />
                              {camera.ip}:{camera.port}
                            </div>
                            <div className="text-sm text-gray-400">
                              {camera.manufacturer || camera.brand || 'Unknown'} {camera.model || 'Camera'}
                            </div>
                            <div className="text-xs flex flex-wrap gap-1 mt-1">
                              <span className={`px-1.5 py-0.5 rounded ${camera.status === 'vulnerable' ? 'bg-red-900/40 text-red-400' : 'bg-gray-800 text-gray-400'}`}>
                                {camera.status}
                              </span>
                              {camera.credentials && (
                                <span className="px-1.5 py-0.5 rounded bg-green-900/40 text-green-400">
                                  Credentials Found
                                </span>
                              )}
                              {camera.geolocation?.country && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-900/40 text-blue-400 flex items-center">
                                  <Globe className="h-3 w-3 mr-1" />
                                  {camera.geolocation.country}
                                  {camera.geolocation.city && `, ${camera.geolocation.city}`}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="h-7 px-2">
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {camera.credentials && (
                          <div className="mt-2 p-1.5 bg-scanner-dark-alt rounded text-xs">
                            <span className="text-gray-400">Login:</span> {camera.credentials.username}:{camera.credentials.password}
                          </div>
                        )}
                        
                        {camera.vulnerabilities && camera.vulnerabilities.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-400">Vulnerabilities:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {camera.vulnerabilities.map((vuln, i) => (
                                <span 
                                  key={i} 
                                  className={`text-xs px-1.5 py-0.5 rounded ${
                                    vuln.severity === 'critical' ? 'bg-red-950 text-red-400' :
                                    vuln.severity === 'high' ? 'bg-orange-950 text-orange-400' :
                                    vuln.severity === 'medium' ? 'bg-yellow-950 text-yellow-400' :
                                    'bg-blue-950 text-blue-400'
                                  }`}
                                >
                                  {vuln.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-gray-400">
                  {isSearching ? 
                    <div className="flex flex-col items-center">
                      <div className="animate-spin mb-4 h-8 w-8 border-b-2 border-scanner-primary rounded-full"></div>
                      <p>Scanning for vulnerable cameras...</p>
                    </div>
                    : 
                    <div className="flex flex-col items-center">
                      <Shield className="h-12 w-12 mb-2 text-gray-600" />
                      <p>Configure settings and execute a scan to see results</p>
                    </div>
                  }
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default HackCCTVTool;
