
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Eye, 
  Search, 
  Lock, 
  AlertTriangle, 
  Clock, 
  Radio, 
  RefreshCw, 
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeHackCCTV } from '@/utils/osintImplementations';
import { HackCCTVParams, CameraResult } from '@/utils/types/cameraTypes';
import { Badge } from '@/components/ui/badge';

const HackCCTVTool: React.FC = () => {
  const [target, setTarget] = useState<string>('');
  const [method, setMethod] = useState<string>('default-credentials');
  const [bruteforce, setBruteforce] = useState<boolean>(true);
  const [deepScan, setDeepScan] = useState<boolean>(false);
  const [country, setCountry] = useState<string>('');
  const [results, setResults] = useState<CameraResult[]>([]);
  const [scanning, setScanning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('scan');
  const { toast } = useToast();

  const handleScan = async () => {
    if (!target) {
      toast({
        title: "Target Required",
        description: "Please enter an IP address, range, or hostname",
        variant: "destructive"
      });
      return;
    }

    setScanning(true);
    setResults([]);
    
    try {
      toast({
        title: "Scan Initiated",
        description: `Scanning ${target} using ${method} method...`,
      });
      
      const params: HackCCTVParams = {
        target,
        method: method as any,
        bruteforce,
        deepScan,
        country: country || undefined
      };
      
      const response = await executeHackCCTV(params);
      
      if (response.success && response.data.cameras) {
        setResults(response.data.cameras);
        setActiveTab('results');
        
        toast({
          title: "Scan Complete",
          description: `Found ${response.data.cameras.length} vulnerable cameras`,
        });
      } else {
        toast({
          title: "Scan Complete",
          description: "No vulnerable cameras found",
        });
      }
    } catch (error) {
      console.error('HackCCTV error:', error);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setScanning(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="scan" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="scan">Scan</TabsTrigger>
          <TabsTrigger value="results" disabled={results.length === 0}>Results</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-scanner-danger" />
                CCTV Camera Vulnerability Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Target IP, Range, or Hostname</Label>
                <Input 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="192.168.1.0/24 or example.com"
                  className="bg-scanner-dark"
                />
                <p className="text-xs text-gray-400 mt-1">Enter a single IP (192.168.1.1), CIDR range (192.168.1.0/24), or hostname</p>
              </div>
              
              <div>
                <Label>Attack Method</Label>
                <Select defaultValue={method} onValueChange={setMethod}>
                  <SelectTrigger className="bg-scanner-dark">
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default-credentials">Default Credentials</SelectItem>
                    <SelectItem value="exploit">Exploit Vulnerabilities</SelectItem>
                    <SelectItem value="brute-force">Brute Force</SelectItem>
                    <SelectItem value="rtsp-discovery">RTSP Discovery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Country (Optional)</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="bg-scanner-dark">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Countries</SelectItem>
                    <SelectItem value="Ukraine">Ukraine</SelectItem>
                    <SelectItem value="Russia">Russia</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Romania">Romania</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400 mt-1">Filter results by country (if available)</p>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="bruteforce" 
                    checked={bruteforce}
                    onCheckedChange={(checked) => setBruteforce(checked as boolean)}
                  />
                  <Label htmlFor="bruteforce" className="cursor-pointer">Test for default credentials</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="deepscan" 
                    checked={deepScan}
                    onCheckedChange={(checked) => setDeepScan(checked as boolean)}
                  />
                  <Label htmlFor="deepscan" className="cursor-pointer">Deep scan (slower but more thorough)</Label>
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleScan}
                disabled={scanning}
              >
                {scanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Scan for Vulnerable Cameras
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-scanner-primary" />
                  <span>Results ({results.length} cameras found)</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setActiveTab('scan')}
                >
                  New Scan
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((camera, index) => (
                      <Card key={index} className="overflow-hidden bg-scanner-dark-alt">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-white">{camera.ip}:{camera.port}</h3>
                            <Badge variant={camera.status === 'vulnerable' ? 'destructive' : 'outline'}>
                              {camera.status}
                            </Badge>
                          </div>
                          
                          <div className="text-sm space-y-2 text-gray-300">
                            <div className="flex items-center">
                              <Radio className="h-3.5 w-3.5 mr-1.5 text-scanner-primary opacity-70" />
                              <span>{camera.model || camera.manufacturer || 'Unknown Camera'}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <Globe className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                              <span>{camera.geolocation?.country || 'Unknown'}, {camera.geolocation?.city || 'Unknown'}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <Lock className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                              <span>Access: {camera.accessLevel}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                              <span>Last seen: {typeof camera.lastSeen === 'string' ? new Date(camera.lastSeen).toLocaleString() : 'Unknown'}</span>
                            </div>
                          </div>
                          
                          {camera.credentials && (
                            <div className="mt-3 p-2 bg-scanner-dark rounded border border-scanner-danger/30">
                              <p className="text-xs font-medium text-scanner-danger flex items-center">
                                <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                                Credentials exposed
                              </p>
                              <code className="text-xs block mt-1">
                                User: {camera.credentials.username} / Pass: {camera.credentials.password}
                              </code>
                            </div>
                          )}
                          
                          {camera.vulnerabilities && camera.vulnerabilities.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-medium">Vulnerabilities:</p>
                              <div className="mt-1 space-y-1">
                                {camera.vulnerabilities.slice(0, 2).map((vuln, i) => (
                                  <div key={i} className="text-xs flex items-start">
                                    <div className={`h-2 w-2 rounded-full mt-1 mr-1.5 ${
                                      vuln.severity === 'critical' ? 'bg-red-500' :
                                      vuln.severity === 'high' ? 'bg-orange-500' :
                                      vuln.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                    }`} />
                                    <span className="text-gray-300">{vuln.name}</span>
                                  </div>
                                ))}
                                {camera.vulnerabilities.length > 2 && (
                                  <div className="text-xs text-gray-400">
                                    +{camera.vulnerabilities.length - 2} more vulnerabilities
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-3">
                            <Button 
                              size="sm" 
                              className="w-full"
                              variant="outline"
                              onClick={() => {
                                if (camera.rtspUrl) {
                                  window.open(camera.rtspUrl);
                                }
                                toast({
                                  title: "Stream URL Copied",
                                  description: camera.rtspUrl || `rtsp://${camera.ip}:${camera.port}/stream`,
                                });
                              }}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1.5" />
                              Access Stream
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No vulnerable cameras found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About CCTV Vulnerability Scanner</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert">
              <p>
                This tool combines several open source CCTV hacking projects to scan for vulnerable cameras:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><a href="https://github.com/Whomrx666/Hack-cctv" target="_blank" rel="noopener noreferrer">Hack-cctv by Whomrx666</a></li>
                <li><a href="https://github.com/akashblackhat/cctv-Hack.py" target="_blank" rel="noopener noreferrer">cctv-Hack.py by akashblackhat</a></li>
                <li><a href="https://github.com/er4vn/Cam-Dumper" target="_blank" rel="noopener noreferrer">Cam-Dumper by er4vn</a></li>
                <li><a href="https://github.com/nak0823/OpenCCTV" target="_blank" rel="noopener noreferrer">OpenCCTV by nak0823</a></li>
                <li><a href="https://github.com/Rihan444/CCTV_HACKED" target="_blank" rel="noopener noreferrer">CCTV_HACKED by Rihan444</a></li>
              </ul>
              <p className="text-red-400 font-semibold mt-3">
                ⚠️ Warning: This tool should only be used for educational purposes and on systems you have permission to test. Unauthorized access to camera systems is illegal in most jurisdictions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HackCCTVTool;
