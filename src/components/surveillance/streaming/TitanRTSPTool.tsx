
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { executeTitanRtsp, TitanRtspParams, TitanRtspResult } from '@/utils/imperial/titanRtspUtils';
import { Zap, Server, Shield, Monitor, AlertCircle, Radio } from 'lucide-react';

const TitanRTSPTool: React.FC = () => {
  const { toast } = useToast();
  const [targets, setTargets] = useState<string>('');
  const [concurrentWorkers, setConcurrentWorkers] = useState<number>(5);
  const [useAI, setUseAI] = useState<boolean>(true);
  const [useProxy, setUseProxy] = useState<boolean>(false);
  const [bruteForceMode, setBruteForceMode] = useState<'standard' | 'aggressive' | 'stealth'>('standard');
  const [attackMode, setAttackMode] = useState<'credentials' | 'exploits' | 'full'>('credentials');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<TitanRtspResult | null>(null);

  const handleExecuteTitan = async () => {
    if (!targets.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide at least one target IP address or hostname",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      // Prepare target list
      const targetList = targets.trim().split(/[\s,;]+/).filter(Boolean);

      // Prepare parameters
      const params: TitanRtspParams = {
        targets: targetList,
        concurrentWorkers,
        useAI,
        useProxy,
        bruteForceMode,
        attackMode,
        saveResults: true
      };

      toast({
        title: "TITAN-RTSP Scan Started",
        description: `Scanning ${targetList.length} targets with AI mode ${useAI ? 'enabled' : 'disabled'}`
      });

      // Execute TITAN-RTSP
      const result = await executeTitanRtsp(params);
      setResults(result);

      if (result.success) {
        toast({
          title: "TITAN-RTSP Scan Completed",
          description: `Found ${result.found.length} accessible cameras out of ${targetList.length} targets`
        });
      } else {
        toast({
          title: "TITAN-RTSP Scan Failed",
          description: result.error || "An unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error executing TITAN-RTSP:", error);
      toast({
        title: "Execution Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-700 bg-scanner-dark-alt">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <Zap className="mr-2 text-yellow-500" />
            TITAN-RTSP Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="targets">Target IP(s)/Hostname(s)</Label>
            <Textarea
              id="targets"
              placeholder="Enter IP addresses or hostnames (one per line or comma-separated)"
              value={targets}
              onChange={(e) => setTargets(e.target.value)}
              rows={3}
              className="bg-scanner-dark resize-none"
            />
            <p className="text-xs text-gray-400">Examples: 192.168.1.100, camera.example.com, 10.0.0.0/24</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="workers">Concurrent Workers</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="workers"
                  min={1}
                  max={20}
                  step={1}
                  value={[concurrentWorkers]}
                  onValueChange={(values) => setConcurrentWorkers(values[0])}
                  className="flex-1"
                />
                <span className="w-10 text-right">{concurrentWorkers}</span>
              </div>
              <p className="text-xs text-gray-400">Higher values may trigger IDS/IPS alerts</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bruteforce-mode">Brute Force Mode</Label>
              <Select value={bruteForceMode} onValueChange={(value) => setBruteForceMode(value as any)}>
                <SelectTrigger id="bruteforce-mode" className="bg-scanner-dark">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark">
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                  <SelectItem value="stealth">Stealth</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-blue-400" />
                <Label htmlFor="use-ai">Use AI Attack Engine</Label>
              </div>
              <Switch
                id="use-ai"
                checked={useAI}
                onCheckedChange={setUseAI}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <Label htmlFor="use-proxy">Use Proxy Network</Label>
              </div>
              <Switch
                id="use-proxy"
                checked={useProxy}
                onCheckedChange={setUseProxy}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attack-mode">Attack Mode</Label>
            <Select value={attackMode} onValueChange={(value) => setAttackMode(value as any)}>
              <SelectTrigger id="attack-mode" className="bg-scanner-dark">
                <SelectValue placeholder="Select attack mode" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark">
                <SelectItem value="credentials">Credentials Only</SelectItem>
                <SelectItem value="exploits">Exploits Only</SelectItem>
                <SelectItem value="full">Full Attack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleExecuteTitan}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Executing TITAN-RTSP...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Execute TITAN-RTSP
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card className="border-gray-700 bg-scanner-dark-alt">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <Monitor className="mr-2 text-green-500" />
              TITAN-RTSP Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.success ? (
              <>
                <div className="bg-scanner-dark p-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Scan Summary</span>
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                      Found: {results.found.length}/{results.scanDetails?.targetsScanned || 0}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-300">
                    <div>Targets Scanned: {results.scanDetails?.targetsScanned}</div>
                    <div>Total Attempts: {results.scanDetails?.totalAttempts}</div>
                    <div>Time Elapsed: {results.scanDetails?.timeElapsed}</div>
                    {results.scanDetails?.aiModelUsed && (
                      <div>AI Model: {results.scanDetails?.aiModelUsed}</div>
                    )}
                  </div>
                </div>

                {results.found.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Accessible Cameras</h3>
                    {results.found.map((item, index) => (
                      <Card key={index} className="bg-scanner-dark border-gray-700">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">{item.target}</div>
                            <div className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                              Accessible
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-400">Username:</span> {item.user}
                            </div>
                            <div>
                              <span className="text-gray-400">Password:</span> {item.pass}
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-400">Stream URL:</span>{" "}
                              <code className="text-xs">rtsp://{item.user}:{item.pass}@{item.target}{item.uri}</code>
                            </div>
                            <div className="col-span-2 text-xs text-gray-400">
                              {item.detail} • {new Date(item.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div className="mt-3">
                            <Button size="sm" variant="outline" className="text-xs w-full">
                              Connect to Stream
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-6 text-center">
                    <div>
                      <AlertCircle className="h-10 w-10 mx-auto mb-4 text-yellow-500" />
                      <h3 className="text-lg font-medium">No Accessible Cameras Found</h3>
                      <p className="text-gray-400 mt-2">
                        TITAN-RTSP did not find any accessible cameras with the provided target list and configuration.
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center p-6 text-center">
                <div>
                  <AlertCircle className="h-10 w-10 mx-auto mb-4 text-red-500" />
                  <h3 className="text-lg font-medium">Scan Failed</h3>
                  <p className="text-gray-400 mt-2">
                    {results.error || "An error occurred during the TITAN-RTSP scan"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TitanRTSPTool;
