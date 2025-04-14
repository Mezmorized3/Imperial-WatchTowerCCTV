
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { 
  Camera, 
  Play, 
  X, 
  Save, 
  Download, 
  Key, 
  FileText, 
  Layers,
  Cpu,
  Lock,
  Eye,
  Shield,
  Clock,
  Video
} from 'lucide-react';

import { RTSPBruteParams, RTSPBruteResult, RTSPStreamResult } from '@/types/scanner';
import { executeRTSPBrute } from '@/utils/imperial/rtspBruteUtils';

const ImperialRtspBrute: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('config');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<RTSPBruteResult | null>(null);
  const [selectedStream, setSelectedStream] = useState<RTSPStreamResult | null>(null);
  const resultsViewRef = useRef<HTMLDivElement>(null);

  // Configuration state
  const [params, setParams] = useState<RTSPBruteParams>({
    targets: '',
    ports: [554, 8554],
    credentials: [],
    routes: [],
    threads: 10,
    timeout: 5000,
    captureScreenshots: true,
    saveReport: true,
    outputFormat: 'json',
    useML: true,
    scanMode: 'thorough'
  });

  // Custom credential list
  const [customCredentials, setCustomCredentials] = useState('');
  const [customRoutes, setCustomRoutes] = useState('');

  useEffect(() => {
    // Parse custom credentials into the params when they change
    if (customCredentials.trim()) {
      const credentialsList = customCredentials
        .split('\n')
        .filter(line => line.includes(':'))
        .map(line => {
          const [username, password] = line.split(':');
          return { username: username.trim(), password: password.trim() };
        });
      
      setParams(prev => ({ ...prev, credentials: credentialsList }));
    }
  }, [customCredentials]);

  useEffect(() => {
    // Parse custom routes into the params when they change
    if (customRoutes.trim()) {
      const routesList = customRoutes
        .split('\n')
        .map(route => route.trim())
        .filter(Boolean);
      
      setParams(prev => ({ ...prev, routes: routesList }));
    }
  }, [customRoutes]);

  const handleTargetsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setParams(prev => ({ ...prev, targets: e.target.value }));
  };

  const handlePortsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const portsString = e.target.value;
    const portsList = portsString
      .split(',')
      .map(port => parseInt(port.trim()))
      .filter(port => !isNaN(port) && port > 0 && port < 65536);
    
    setParams(prev => ({ ...prev, ports: portsList }));
  };

  const handleThreadsChange = (value: number[]) => {
    setParams(prev => ({ ...prev, threads: value[0] }));
  };

  const handleTimeoutChange = (value: number[]) => {
    setParams(prev => ({ ...prev, timeout: value[0] * 1000 })); // Convert to milliseconds
  };

  const handleSwitchChange = (name: keyof RTSPBruteParams) => (checked: boolean) => {
    setParams(prev => ({ ...prev, [name]: checked }));
  };

  const handleScanModeChange = (value: string) => {
    setParams(prev => ({ ...prev, scanMode: value as 'quick' | 'thorough' | 'stealth' }));
  };

  const handleOutputFormatChange = (value: string) => {
    setParams(prev => ({ ...prev, outputFormat: value as 'json' | 'csv' | 'text' }));
  };

  const startScan = async () => {
    try {
      // Validate inputs
      if (!params.targets) {
        toast({
          title: "Validation Error",
          description: "Target IP address or range is required",
          variant: "destructive"
        });
        return;
      }

      // If no custom credentials, use defaults
      if (!params.credentials || params.credentials.length === 0) {
        setParams(prev => ({
          ...prev,
          credentials: [
            { username: 'admin', password: 'admin' },
            { username: 'admin', password: '12345' },
            { username: 'admin', password: 'password' },
            { username: 'root', password: 'root' },
            { username: 'user', password: 'user' }
          ]
        }));
      }

      // If no custom routes, use defaults
      if (!params.routes || params.routes.length === 0) {
        setParams(prev => ({
          ...prev,
          routes: [
            '/live', 
            '/live/main', 
            '/live/ch01', 
            '/cam/realmonitor',
            '/h264/ch1/main/av_stream',
            '/streaming/channels/1', 
            '/video1',
            '/media/video1',
            '/videostream.cgi'
          ]
        }));
      }

      setIsRunning(true);
      setProgress(0);
      setResults(null);
      setActiveTab('status');

      // Start the progress simulation
      const intervalId = setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) {
            clearInterval(intervalId);
            return 98;
          }
          return prev + (params.scanMode === 'quick' ? 2 : params.scanMode === 'thorough' ? 1 : 0.5);
        });
      }, params.scanMode === 'quick' ? 200 : params.scanMode === 'thorough' ? 400 : 800);

      // Process the targets into an array if it's a string
      const formattedParams = {
        ...params,
        targets: typeof params.targets === 'string' ? 
          params.targets.split('\n').filter(Boolean).map(t => t.trim()) : 
          params.targets
      };

      // Execute the scan
      const scanResults = await executeRTSPBrute(formattedParams);
      
      // Cleanup and display results
      clearInterval(intervalId);
      setProgress(100);
      setResults(scanResults);
      setActiveTab('results');
      
      toast({
        title: "Scan Completed",
        description: `Found ${scanResults.accessibleStreams} accessible RTSP streams`,
        variant: scanResults.accessibleStreams > 0 ? "default" : "destructive"
      });
    } catch (error) {
      setIsRunning(false);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const cancelScan = () => {
    setIsRunning(false);
    setProgress(0);
    toast({
      title: "Scan Cancelled",
      description: "RTSP scan was cancelled"
    });
  };

  const handleDownloadResults = () => {
    if (!results) return;

    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `rtsp-scan-results-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`);
    linkElement.click();

    toast({
      title: "Download Started",
      description: "Results file has been downloaded"
    });
  };

  const viewStream = (stream: RTSPStreamResult) => {
    setSelectedStream(stream);
    // We would integrate with a stream viewer component here
    toast({
      title: "Stream Selected",
      description: `Accessing stream at ${stream.streamUrl}`,
    });
  };

  useEffect(() => {
    // Scroll to results when they're available
    if (results && resultsViewRef.current) {
      resultsViewRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [results]);

  return (
    <div className="space-y-6">
      <Card className="bg-scanner-dark-alt border-gray-800">
        <CardHeader className="border-b border-gray-700">
          <div className="flex items-center">
            <Video className="mr-2 text-red-500 w-6 h-6" />
            <CardTitle className="text-2xl">Imperial RTSPBrute</CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Advanced RTSP stream discovery and credential bruteforcing tool
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-scanner-dark w-full justify-start mb-4">
              <TabsTrigger value="config" disabled={isRunning} className="data-[state=active]:bg-scanner-info/20">
                <Layers className="h-4 w-4 mr-2" />
                Configuration
              </TabsTrigger>
              <TabsTrigger value="status" className="data-[state=active]:bg-scanner-info/20">
                <Cpu className="h-4 w-4 mr-2" />
                Status
              </TabsTrigger>
              <TabsTrigger value="results" disabled={!results} className="data-[state=active]:bg-scanner-info/20">
                <Camera className="h-4 w-4 mr-2" />
                Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Target Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="targets">IP Addresses/Ranges (one per line)</Label>
                      <Textarea 
                        id="targets" 
                        placeholder="192.168.1.1&#10;10.0.0.0/24&#10;172.16.10.1-172.16.10.254" 
                        value={typeof params.targets === 'string' ? params.targets : params.targets.join('\n')} 
                        onChange={handleTargetsChange}
                        rows={4}
                        className="font-mono"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ports">Ports (comma-separated)</Label>
                      <Input 
                        id="ports" 
                        placeholder="554, 8554, 1935"
                        value={params.ports?.join(', ') || '554'}
                        onChange={handlePortsChange}
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Credentials & Routes</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="credentials">Custom Credentials (username:password, one per line)</Label>
                      <Textarea 
                        id="credentials" 
                        placeholder="admin:admin&#10;admin:12345&#10;root:password"
                        value={customCredentials}
                        onChange={(e) => setCustomCredentials(e.target.value)} 
                        rows={4}
                        className="font-mono"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="routes">Custom RTSP Routes (one per line)</Label>
                      <Textarea 
                        id="routes" 
                        placeholder="/live&#10;/h264/ch1/main/av_stream&#10;/cam/realmonitor"
                        value={customRoutes}
                        onChange={(e) => setCustomRoutes(e.target.value)} 
                        rows={4}
                        className="font-mono"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Scan Parameters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label htmlFor="threads">Threads: {params.threads}</Label>
                        </div>
                        <Slider 
                          id="threads"
                          value={[params.threads || 10]} 
                          min={1} 
                          max={50} 
                          step={1} 
                          onValueChange={handleThreadsChange}
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label htmlFor="timeout">Connection Timeout: {params.timeout ? params.timeout/1000 : 5}s</Label>
                        </div>
                        <Slider 
                          id="timeout"
                          value={[params.timeout ? params.timeout/1000 : 5]} 
                          min={1} 
                          max={30} 
                          step={1} 
                          onValueChange={handleTimeoutChange}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="scanMode">Scan Mode</Label>
                        <Select 
                          value={params.scanMode || 'thorough'} 
                          onValueChange={handleScanModeChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select scan mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="quick">Quick (Fast but less thorough)</SelectItem>
                            <SelectItem value="thorough">Thorough (Balanced)</SelectItem>
                            <SelectItem value="stealth">Stealth (Slower but less detectable)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="useML" 
                          checked={params.useML} 
                          onCheckedChange={handleSwitchChange('useML')}
                        />
                        <Label htmlFor="useML">Use Machine Learning Optimization</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="captureScreenshots" 
                          checked={params.captureScreenshots} 
                          onCheckedChange={handleSwitchChange('captureScreenshots')}
                        />
                        <Label htmlFor="captureScreenshots">Capture Stream Screenshots</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="saveReport" 
                          checked={params.saveReport} 
                          onCheckedChange={handleSwitchChange('saveReport')}
                        />
                        <Label htmlFor="saveReport">Generate Detailed Report</Label>
                      </div>
                      
                      <div>
                        <Label htmlFor="outputFormat">Output Format</Label>
                        <Select 
                          value={params.outputFormat || 'json'} 
                          onValueChange={handleOutputFormatChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select output format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="text">Plain Text</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setParams({
                    targets: '',
                    ports: [554, 8554],
                    credentials: [],
                    routes: [],
                    threads: 10,
                    timeout: 5000,
                    captureScreenshots: true,
                    saveReport: true,
                    outputFormat: 'json',
                    useML: true,
                    scanMode: 'thorough'
                  })}>
                    Reset
                  </Button>
                  <Button 
                    onClick={startScan} 
                    disabled={isRunning} 
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Scan
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="status">
              <div className="space-y-6">
                <Card className="border-scanner-info/30">
                  <CardContent className="pt-6">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Scan Progress</h3>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between mt-2 text-sm text-gray-400">
                          <span>{progress.toFixed(0)}% Complete</span>
                          {isRunning && <span>Scanning in progress...</span>}
                          {!isRunning && progress === 100 && <span>Scan complete!</span>}
                        </div>
                      </div>

                      {isRunning && (
                        <>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-scanner-dark p-4 rounded-md">
                                <div className="flex items-center mb-2">
                                  <Cpu className="h-4 w-4 mr-2 text-scanner-info" />
                                  <span className="text-sm font-medium">Thread Utilization</span>
                                </div>
                                <span className="text-2xl font-bold">{params.threads} threads</span>
                              </div>
                              
                              <div className="bg-scanner-dark p-4 rounded-md">
                                <div className="flex items-center mb-2">
                                  <Clock className="h-4 w-4 mr-2 text-scanner-info" />
                                  <span className="text-sm font-medium">Elapsed Time</span>
                                </div>
                                <span className="text-2xl font-bold">00:02:45</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-scanner-dark p-4 rounded-md">
                                <div className="flex items-center mb-2">
                                  <Shield className="h-4 w-4 mr-2 text-scanner-info" />
                                  <span className="text-sm font-medium">Targets</span>
                                </div>
                                <span className="text-2xl font-bold">24/96</span>
                              </div>
                              
                              <div className="bg-scanner-dark p-4 rounded-md">
                                <div className="flex items-center mb-2">
                                  <Lock className="h-4 w-4 mr-2 text-scanner-info" />
                                  <span className="text-sm font-medium">Credentials</span>
                                </div>
                                <span className="text-2xl font-bold">156/240</span>
                              </div>
                              
                              <div className="bg-scanner-dark p-4 rounded-md">
                                <div className="flex items-center mb-2">
                                  <Eye className="h-4 w-4 mr-2 text-scanner-info" />
                                  <span className="text-sm font-medium">Streams Found</span>
                                </div>
                                <span className="text-2xl font-bold">7</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button 
                              variant="destructive" 
                              onClick={cancelScan}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancel Scan
                            </Button>
                          </div>
                        </>
                      )}

                      {!isRunning && results && (
                        <div className="flex justify-end">
                          <Button 
                            variant="default" 
                            onClick={() => setActiveTab('results')}
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            View Results
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="results" ref={resultsViewRef}>
              {results && (
                <div className="space-y-6">
                  <Card className="border-scanner-info/30">
                    <CardHeader>
                      <CardTitle>Scan Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-scanner-dark p-4 rounded-md">
                          <span className="text-sm text-gray-400">Targets Scanned</span>
                          <div className="text-2xl font-bold">{results.targetsScanned}</div>
                        </div>
                        <div className="bg-scanner-dark p-4 rounded-md">
                          <span className="text-sm text-gray-400">Streams Found</span>
                          <div className="text-2xl font-bold">{results.streamsFound}</div>
                        </div>
                        <div className="bg-scanner-dark p-4 rounded-md">
                          <span className="text-sm text-gray-400">Accessible</span>
                          <div className="text-2xl font-bold">{results.accessibleStreams}</div>
                        </div>
                        <div className="bg-scanner-dark p-4 rounded-md">
                          <span className="text-sm text-gray-400">Execution Time</span>
                          <div className="text-2xl font-bold">{(results.executionTime / 1000).toFixed(2)}s</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end space-x-2 mb-4">
                    <Button 
                      variant="outline" 
                      onClick={handleDownloadResults}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Results
                    </Button>
                    {results.reportPath && (
                      <Button 
                        variant="outline"
                        onClick={() => window.open(results.reportPath, '_blank')}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Full Report
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Discovered Streams</h3>
                    {results.results.length > 0 ? (
                      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {results.results.map((stream) => (
                          <Card key={stream.id} className={`border-${stream.accessible ? 'green' : 'red'}-500/30`}>
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="font-mono text-sm">{stream.target}:{stream.port}</div>
                                  <div className="text-xs text-gray-400">{stream.protocol.toUpperCase()}</div>
                                </div>
                                <div className={`px-2 py-1 text-xs rounded-full ${stream.accessible ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                  {stream.accessible ? 'Accessible' : 'Inaccessible'}
                                </div>
                              </div>
                              
                              {stream.credentials && (
                                <div className="mt-2 bg-scanner-dark p-2 rounded-md">
                                  <div className="flex items-center mb-1">
                                    <Key className="h-3 w-3 mr-1 text-yellow-500" />
                                    <span className="text-xs text-gray-400">Credentials</span>
                                  </div>
                                  <div className="font-mono text-sm">
                                    {stream.credentials.username}:{stream.credentials.password}
                                    {stream.credentials.default && (
                                      <span className="ml-2 text-xs text-yellow-500">(Default)</span>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {stream.route && (
                                <div className="mt-2 bg-scanner-dark p-2 rounded-md">
                                  <div className="text-xs text-gray-400 mb-1">Path</div>
                                  <div className="font-mono text-sm truncate">{stream.route}</div>
                                </div>
                              )}
                              
                              {stream.accessible && stream.streamUrl && (
                                <div className="mt-2 bg-scanner-dark p-2 rounded-md">
                                  <div className="text-xs text-gray-400 mb-1">Stream URL</div>
                                  <div className="font-mono text-xs truncate">{stream.streamUrl}</div>
                                </div>
                              )}
                              
                              {stream.metadata && (
                                <div className="mt-2 bg-scanner-dark p-2 rounded-md">
                                  <div className="text-xs text-gray-400 mb-1">Metadata</div>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    {stream.metadata.resolution && (
                                      <div>Resolution: {stream.metadata.resolution}</div>
                                    )}
                                    {stream.metadata.fps && (
                                      <div>FPS: {stream.metadata.fps}</div>
                                    )}
                                    {stream.metadata.codec && (
                                      <div>Codec: {stream.metadata.codec}</div>
                                    )}
                                    {stream.metadata.bitrate && (
                                      <div>Bitrate: {stream.metadata.bitrate}</div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {stream.accessible && (
                                <div className="mt-4 flex space-x-2">
                                  <Button 
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => viewStream(stream)}
                                  >
                                    <Camera className="mr-2 h-3 w-3" />
                                    View Stream
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-scanner-dark rounded-md">
                        <Camera className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                        <h3 className="text-xl font-medium">No Streams Found</h3>
                        <p className="text-gray-400 mt-2">Try adjusting your scan parameters or targeting a different network.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImperialRtspBrute;
