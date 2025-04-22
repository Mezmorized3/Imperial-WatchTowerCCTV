
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Bug, TerminalSquare, Terminal, CheckCircle2, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { executeONVIFFuzzer } from '@/utils/osintImplementations/onvifFuzzerTools';

const ONVIFFuzzerTool: React.FC = () => {
  const { toast } = useToast();
  const [target, setTarget] = useState('');
  const [port, setPort] = useState('80');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [testType, setTestType] = useState<'all' | 'command-injection' | 'overflow' | 'xml-entity' | 'auth-bypass'>('all');
  const [iterations, setIterations] = useState(10);
  const [timeout, setTimeout] = useState(3000);
  
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('config');
  
  const handleExecuteFuzzer = async () => {
    if (!target) {
      toast({
        title: "Missing Target",
        description: "Please enter a target IP address or hostname",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    setActiveTab('results');
    
    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 300);
    
    try {
      const result = await executeONVIFFuzzer({
        target,
        port: parseInt(port),
        username,
        password,
        testType,
        iterations,
        timeout
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result.success) {
        setResults(result.data);
        toast({
          title: "Fuzzing Complete",
          description: `Found ${result.data.totalVulnerabilitiesFound} potential vulnerabilities`
        });
      } else {
        toast({
          title: "Fuzzing Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      clearInterval(progressInterval);
      toast({
        title: "Fuzzing Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const getSeverityColor = (score: number) => {
    if (score >= 9.0) return 'bg-red-500';
    if (score >= 7.0) return 'bg-orange-500';
    if (score >= 4.0) return 'bg-yellow-500';
    return 'bg-blue-500';
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          ONVIF Fuzzer
        </CardTitle>
        <CardDescription>
          Test ONVIF camera implementations for security vulnerabilities and implementation bugs
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mx-6">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config">
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target">Target IP/Hostname</Label>
                <Input 
                  id="target" 
                  value={target} 
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="192.168.1.100" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input 
                  id="port" 
                  value={port} 
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="80" 
                  type="number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="admin" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="test-type">Test Type</Label>
              <Select value={testType} onValueChange={(val: any) => setTestType(val)}>
                <SelectTrigger id="test-type">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tests</SelectItem>
                  <SelectItem value="command-injection">Command Injection</SelectItem>
                  <SelectItem value="overflow">Buffer Overflow</SelectItem>
                  <SelectItem value="xml-entity">XML Entity Injection</SelectItem>
                  <SelectItem value="auth-bypass">Authentication Bypass</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="iterations">Iterations</Label>
                <span className="text-sm text-gray-500">{iterations}</span>
              </div>
              <Slider
                id="iterations"
                value={[iterations]}
                min={1}
                max={50}
                step={1}
                onValueChange={(val) => setIterations(val[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="timeout">Timeout (ms)</Label>
                <span className="text-sm text-gray-500">{timeout}</span>
              </div>
              <Slider
                id="timeout"
                value={[timeout]}
                min={500}
                max={10000}
                step={100}
                onValueChange={(val) => setTimeout(val[0])}
              />
            </div>
            
            <Alert variant="warning" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                Fuzzing can potentially crash or disrupt camera services. Use with caution on production systems.
              </AlertDescription>
            </Alert>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="results">
          <CardContent>
            {isRunning ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Terminal className="h-5 w-5 mr-2 animate-pulse" />
                  <h3 className="text-lg font-medium">Running ONVIF Fuzzer...</h3>
                </div>
                
                <Progress value={progress} className="h-2" />
                
                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                  <div className="space-y-1">
                    <p className="text-gray-500">Target</p>
                    <p>{target}:{port}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">Test Type</p>
                    <p className="capitalize">{testType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">Iterations</p>
                    <p>{iterations}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">Progress</p>
                    <p>{Math.round(progress)}%</p>
                  </div>
                </div>
                
                <div className="border rounded p-3 bg-black/10 font-mono text-xs h-32 overflow-auto">
                  {Array.from({ length: Math.floor(progress / 10) }).map((_, i) => (
                    <div key={i} className="py-1">
                      [INFO] Testing {['GetSystemDateAndTime', 'GetDeviceInformation', 'GetCapabilities', 'GetProfiles', 'GetStreamUri'][i % 5]} method...
                    </div>
                  ))}
                </div>
              </div>
            ) : results ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TerminalSquare className="h-5 w-5 mr-2" />
                    <h3 className="text-lg font-medium">Fuzzing Results</h3>
                  </div>
                  <Badge 
                    variant={results.totalVulnerabilitiesFound > 0 ? "destructive" : "outline"}
                    className="text-xs"
                  >
                    {results.totalVulnerabilitiesFound} vulnerabilities found
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-500">Target</p>
                    <p>{results.target}:{results.port}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">Tests Run</p>
                    <p>{results.testsRun}</p>
                  </div>
                </div>
                
                {results.results.map((result: any, index: number) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 font-medium flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="capitalize">{result.testType} Tests</span>
                        <Badge 
                          variant={result.findings.length > 0 ? "destructive" : "outline"}
                          className="ml-2"
                        >
                          {result.findings.length} findings
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">{result.testsRun} iterations</span>
                    </div>
                    
                    {result.findings.length > 0 ? (
                      <div className="divide-y">
                        {result.findings.map((finding: any, i: number) => (
                          <div key={i} className="p-4 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{finding.type}</h4>
                                {finding.method && (
                                  <p className="text-sm text-gray-500">Method: {finding.method}</p>
                                )}
                              </div>
                              {finding.cvssScore && (
                                <Badge className={getSeverityColor(finding.cvssScore)}>
                                  CVSS {finding.cvssScore}
                                </Badge>
                              )}
                            </div>
                            
                            {finding.parameter && (
                              <div className="text-sm">
                                <span className="text-gray-500">Parameter:</span> {finding.parameter}
                              </div>
                            )}
                            
                            {finding.payload && (
                              <div className="text-sm">
                                <span className="text-gray-500">Payload:</span>
                                <code className="ml-2 p-1 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">
                                  {finding.payload.length > 50 ? 
                                    `${finding.payload.substring(0, 50)}...` : 
                                    finding.payload}
                                </code>
                              </div>
                            )}
                            
                            {finding.technique && (
                              <div className="text-sm">
                                <span className="text-gray-500">Technique:</span> {finding.technique}
                              </div>
                            )}
                            
                            {finding.response && (
                              <div className="text-sm">
                                <span className="text-gray-500">Response:</span> {finding.response}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No vulnerabilities found for this test type
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <TerminalSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Fuzzing Results</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  Configure the fuzzer settings and click "Start Fuzzing" to test the target camera for ONVIF vulnerabilities
                </p>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-end">
        {activeTab === 'config' ? (
          <Button 
            onClick={handleExecuteFuzzer}
            disabled={isRunning || !target}
          >
            <Bug className="mr-2 h-4 w-4" />
            Start Fuzzing
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={() => setActiveTab('config')}
            disabled={isRunning}
          >
            Back to Configuration
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ONVIFFuzzerTool;
