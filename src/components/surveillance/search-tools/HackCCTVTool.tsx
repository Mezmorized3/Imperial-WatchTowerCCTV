
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Camera, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { executeHackCCTV } from '@/utils/osintImplementations/cameraTools';
import { HackCCTVParams } from '@/utils/osintToolTypes';
import { useToast } from '@/hooks/use-toast';

const HackCCTVTool: React.FC = () => {
  const [target, setTarget] = useState<string>('');
  const [mode, setMode] = useState<'scan' | 'exploit' | 'bruteforce'>('scan');
  const [timeout, setTimeout] = useState<number>(60);
  const [defaultCredentials, setDefaultCredentials] = useState<boolean>(true);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const modes = [
    { value: 'scan', label: 'Scan Mode' },
    { value: 'exploit', label: 'Exploit Mode' },
    { value: 'bruteforce', label: 'Bruteforce Mode' }
  ];

  const handleExecute = async () => {
    if (!target) {
      toast({
        title: "Target Required",
        description: "Please enter a target IP or IP range",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsExecuting(true);
      setResults(null);
      
      const params: HackCCTVParams = {
        target,
        mode,
        timeout,
        defaultCredentials
      };
      
      const result = await executeHackCCTV(params);
      
      if (result.success) {
        toast({
          title: "Operation Complete",
          description: `HackCCTV ${mode} operation completed successfully`,
        });
        setResults(result.data);
      } else {
        toast({
          title: "Operation Failed",
          description: result.error || "An error occurred during the operation",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error executing HackCCTV:", error);
      toast({
        title: "Execution Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark-alt">
      <CardHeader>
        <CardTitle className="text-scanner-primary flex items-center">
          <Camera className="mr-2 h-5 w-5" />
          HackCCTV (mohammadmahdi-termux/hackCCTV)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="target">Target IP or IP Range</Label>
          <Input
            id="target"
            placeholder="192.168.1.1 or 192.168.1.0/24"
            className="bg-scanner-dark border-gray-700"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mode">Operation Mode</Label>
            <Select 
              value={mode} 
              onValueChange={(value: 'scan' | 'exploit' | 'bruteforce') => setMode(value)}
            >
              <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark text-white border-gray-700">
                {modes.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeout">Timeout (seconds)</Label>
            <Input
              id="timeout"
              type="number"
              min={1}
              max={300}
              className="bg-scanner-dark border-gray-700"
              value={timeout}
              onChange={(e) => setTimeout(parseInt(e.target.value) || 60)}
            />
          </div>
        </div>
        
        {mode === 'bruteforce' && (
          <div className="flex items-center space-x-2">
            <Switch
              id="defaultCredentials"
              checked={defaultCredentials}
              onCheckedChange={setDefaultCredentials}
            />
            <Label htmlFor="defaultCredentials">Try Default Credentials First</Label>
          </div>
        )}
        
        <Button
          onClick={handleExecute}
          disabled={isExecuting || !target}
          className="w-full bg-scanner-warning hover:bg-scanner-warning/90 text-black"
        >
          {isExecuting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Camera className="h-4 w-4 mr-2" />
          )}
          Execute HackCCTV {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </Button>
        
        {results && results.cameras && (
          <div className="mt-4 space-y-4">
            <Label>Operation Results</Label>
            
            <div className="space-y-4">
              {results.cameras.map((camera: any, index: number) => (
                <div key={index} className="bg-black/50 p-3 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Camera at {camera.ip}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      camera.status === 'vulnerable' || camera.status === 'exploited' || camera.status === 'compromised' 
                        ? 'bg-red-900/50 text-red-300' 
                        : 'bg-green-900/50 text-green-300'
                    }`}>
                      {camera.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {camera.model && (
                      <div>
                        <span className="text-gray-400">Model:</span> {camera.model}
                      </div>
                    )}
                    
                    {camera.manufacturer && (
                      <div>
                        <span className="text-gray-400">Manufacturer:</span> {camera.manufacturer}
                      </div>
                    )}
                    
                    {camera.port && (
                      <div>
                        <span className="text-gray-400">Port:</span> {camera.port}
                      </div>
                    )}
                    
                    {camera.rtspUrl && (
                      <div className="col-span-2">
                        <span className="text-gray-400">RTSP URL:</span> {camera.rtspUrl}
                      </div>
                    )}
                    
                    {camera.credentials && (
                      <div className="col-span-2 bg-red-950/30 p-2 rounded mt-2">
                        <div className="font-medium text-red-300 mb-1">Credentials Found</div>
                        <div>
                          <span className="text-gray-400">Username:</span> {camera.credentials.username}
                        </div>
                        <div>
                          <span className="text-gray-400">Password:</span> {camera.credentials.password}
                        </div>
                      </div>
                    )}
                    
                    {camera.bruteforceDetails && (
                      <div className="col-span-2 bg-blue-950/30 p-2 rounded mt-2">
                        <div className="font-medium text-blue-300 mb-1">Bruteforce Details</div>
                        <div>
                          <span className="text-gray-400">Attempts:</span> {camera.bruteforceDetails.attemptsRequired}
                        </div>
                        <div>
                          <span className="text-gray-400">Time:</span> {camera.bruteforceDetails.timeElapsed}
                        </div>
                        <div>
                          <span className="text-gray-400">Method:</span> {camera.bruteforceDetails.methodUsed}
                        </div>
                      </div>
                    )}
                    
                    {camera.exploitDetails && (
                      <div className="col-span-2 bg-yellow-950/30 p-2 rounded mt-2">
                        <div className="font-medium text-yellow-300 mb-1">Exploit Details</div>
                        <div className="grid grid-cols-2 gap-x-4">
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-1">Command Injection:</span>
                            {camera.exploitDetails.commandInjection ? 
                              <CheckCircle className="h-3 w-3 text-green-500" /> : 
                              <XCircle className="h-3 w-3 text-red-500" />
                            }
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-1">Access Granted:</span>
                            {camera.exploitDetails.accessGranted ? 
                              <CheckCircle className="h-3 w-3 text-green-500" /> : 
                              <XCircle className="h-3 w-3 text-red-500" />
                            }
                          </div>
                          <div className="flex items-center col-span-2">
                            <span className="text-gray-400 mr-1">Privilege Escalation:</span>
                            {camera.exploitDetails.privilegeEscalation ? 
                              <CheckCircle className="h-3 w-3 text-green-500" /> : 
                              <XCircle className="h-3 w-3 text-red-500" />
                            }
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {camera.vulnerabilities && (
                      <div className="col-span-2 mt-2">
                        <div className="font-medium mb-1">Vulnerabilities</div>
                        <div className="space-y-1">
                          {camera.vulnerabilities.map((vuln: any, vIndex: number) => (
                            <div key={vIndex} className="flex items-start">
                              <div className={`px-1.5 py-0.5 rounded text-xs mr-2 ${
                                vuln.severity === 'critical' ? 'bg-red-900/50 text-red-300' :
                                vuln.severity === 'high' ? 'bg-orange-900/50 text-orange-300' :
                                'bg-yellow-900/50 text-yellow-300'
                              }`}>
                                {vuln.severity}
                              </div>
                              <div>
                                <div>{vuln.name}</div>
                                {vuln.description && (
                                  <div className="text-xs text-gray-400">{vuln.description}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-400 flex items-start">
          <AlertTriangle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
          <span>
            WARNING: This tool is designed for security research only. 
            Only use on systems you own or have explicit permission to test. 
            Unauthorized access to surveillance systems is illegal.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default HackCCTVTool;
