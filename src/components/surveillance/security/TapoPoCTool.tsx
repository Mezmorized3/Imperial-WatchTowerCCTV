
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Bug, Terminal, Shield, Loader2, AlertTriangle, 
  Download, FileCode, Server, Settings
} from 'lucide-react';
import { executeTapoPoC } from '@/utils/osintTools';

const TapoPoCTool: React.FC = () => {
  const { toast } = useToast();
  const [targetIP, setTargetIP] = useState('');
  const [port, setPort] = useState('80');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [attackType, setAttackType] = useState<'credentials' | 'config' | 'firmware' | 'shell' | 'all'>('credentials');
  const [extractConfigs, setExtractConfigs] = useState(true);
  const [checkVulnerabilities, setCheckVulnerabilities] = useState(true);
  const [saveDumps, setSaveDumps] = useState(false);
  const [payloadPath, setPayloadPath] = useState('');
  
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('config');
  
  const handleExecute = async () => {
    if (!targetIP) {
      toast({
        title: "Missing Target",
        description: "Please enter a target IP address or hostname",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunning(true);
    setResults(null);
    setActiveTab('results');
    
    try {
      const result = await executeTapoPoC({
        target: targetIP,
        port: parseInt(port),
        username,
        password,
        attackType,
        extractConfigs,
        checkVulnerabilities,
        saveDumps,
        payloadPath: payloadPath || undefined
      });
      
      if (result.success) {
        setResults(result.data);
        toast({
          title: "Operation Complete",
          description: `${attackType === 'all' ? 'All attacks' : attackType.charAt(0).toUpperCase() + attackType.slice(1) + ' attack'} completed successfully`
        });
      } else {
        toast({
          title: "Operation Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Operation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const renderVulnerability = (vuln: any) => {
    const severityClass = 
      vuln.severity === 'critical' ? 'bg-red-500 text-white' :
      vuln.severity === 'high' ? 'bg-orange-500 text-white' : 
      vuln.severity === 'medium' ? 'bg-yellow-500' :
      'bg-blue-500 text-white';
    
    return (
      <div key={vuln.id || vuln.name} className="border rounded p-3 space-y-2 mb-2">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm">{vuln.name}</h4>
          <Badge className={severityClass}>{vuln.severity}</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{vuln.description}</p>
        {vuln.cve && (
          <div className="text-xs text-gray-500">
            <span className="font-semibold">CVE:</span> {vuln.cve}
          </div>
        )}
        {vuln.impact && (
          <div className="text-xs text-gray-500">
            <span className="font-semibold">Impact:</span> {vuln.impact}
          </div>
        )}
        {vuln.exploit && (
          <div className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono">
            {vuln.exploit}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Tapo-PoC Scanner
        </CardTitle>
        <CardDescription>
          Security testing tool for TP-Link Tapo cameras (CVE checks, credentials, config dumps)
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mx-6">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config">
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-ip">Target IP/Hostname</Label>
                <Input
                  id="target-ip"
                  value={targetIP}
                  onChange={(e) => setTargetIP(e.target.value)}
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
                  placeholder="Enter password (optional)"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="attack-type">Attack Type</Label>
              <Select value={attackType} onValueChange={(value: any) => setAttackType(value)}>
                <SelectTrigger id="attack-type">
                  <SelectValue placeholder="Select attack type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Attacks</SelectItem>
                  <SelectItem value="credentials">Default Credentials Check</SelectItem>
                  <SelectItem value="config">Configuration Dump</SelectItem>
                  <SelectItem value="firmware">Firmware Analysis</SelectItem>
                  <SelectItem value="shell">Command Injection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="extract-configs" 
                  checked={extractConfigs}
                  onCheckedChange={(checked) => setExtractConfigs(!!checked)}
                />
                <Label htmlFor="extract-configs">Extract Configurations</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="check-vulnerabilities" 
                  checked={checkVulnerabilities}
                  onCheckedChange={(checked) => setCheckVulnerabilities(!!checked)}
                />
                <Label htmlFor="check-vulnerabilities">Check for Vulnerabilities</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="save-dumps" 
                  checked={saveDumps}
                  onCheckedChange={(checked) => setSaveDumps(!!checked)}
                />
                <Label htmlFor="save-dumps">Save Data Dumps</Label>
              </div>
            </div>
            
            {(attackType === 'shell' || attackType === 'all') && (
              <div className="space-y-2">
                <Label htmlFor="payload-path">Custom Payload Path (optional)</Label>
                <Input
                  id="payload-path"
                  value={payloadPath}
                  onChange={(e) => setPayloadPath(e.target.value)}
                  placeholder="/path/to/payload.sh"
                />
              </div>
            )}
            
            <Alert variant="default" className="mt-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-900">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This tool tests for real vulnerabilities against Tapo cameras. Use responsibly and only on systems you own or have permission to test.
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
                  <h3 className="text-lg font-medium">Running Tapo-PoC...</h3>
                </div>
                
                <div className="h-48 border rounded p-3 bg-black/10 font-mono text-xs overflow-auto">
                  <div className="py-1">[INFO] Initializing scan against {targetIP}:{port}</div>
                  <div className="py-1">[INFO] Selected attack type: {attackType}</div>
                  <div className="py-1">[INFO] Running vulnerability checks...</div>
                  <div className="py-1">[INFO] Testing authentication mechanisms...</div>
                  <div className="py-1 animate-pulse">[RUNNING] Please wait while the operation completes...</div>
                </div>
              </div>
            ) : results ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    <h3 className="text-lg font-medium">Scan Results</h3>
                  </div>
                  <Badge variant={results.vulnerabilities?.length > 0 ? "destructive" : "outline"}>
                    {results.vulnerabilities?.length || 0} vulnerabilities found
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-gray-500">Target</p>
                    <p>{results.target}:{results.port}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">Device Model</p>
                    <p>{results.deviceInfo?.model || "Unknown"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">Firmware Version</p>
                    <p>{results.deviceInfo?.firmwareVersion || "Unknown"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">MAC Address</p>
                    <p>{results.deviceInfo?.macAddress || "Unknown"}</p>
                  </div>
                </div>
                
                {results.vulnerabilities?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">Vulnerabilities</h4>
                    <div className="space-y-2">
                      {results.vulnerabilities.map((vuln: any) => renderVulnerability(vuln))}
                    </div>
                  </div>
                )}
                
                {results.configDump && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">Configuration Dump</h4>
                    <Textarea 
                      readOnly 
                      className="font-mono text-xs h-48"
                      value={typeof results.configDump === 'string' 
                        ? results.configDump 
                        : JSON.stringify(results.configDump, null, 2)
                      }
                    />
                  </div>
                )}
                
                {results.shellResults && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">Command Execution Results</h4>
                    <div className="border rounded p-3 bg-black/10 font-mono text-xs overflow-auto h-24">
                      {results.shellResults}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Terminal className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Scan Results</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  Configure scan parameters and click "Start Scan" to test your Tapo camera for vulnerabilities
                </p>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-end">
        {activeTab === 'config' ? (
          <Button
            onClick={handleExecute}
            disabled={isRunning || !targetIP}
          >
            <Bug className="mr-2 h-4 w-4" />
            Start Scan
          </Button>
        ) : (
          <div className="flex gap-2">
            {results && (
              <Button variant="outline" disabled={isRunning}>
                <Download className="mr-2 h-4 w-4" />
                Export Results
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('config')}
              disabled={isRunning}
            >
              Back to Configuration
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TapoPoCTool;
