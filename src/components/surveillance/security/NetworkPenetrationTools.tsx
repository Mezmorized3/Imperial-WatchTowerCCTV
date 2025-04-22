
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
  Search, Lock, Network, Server, Loader2, Wifi, Shield, AlertTriangle, Terminal
} from 'lucide-react';
import { executeMasscan, executeZGrab, executeHydra } from '@/utils/osintTools';

const NetworkPenetrationTools: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('masscan');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  // Masscan state
  const [masscanTarget, setMasscanTarget] = useState('');
  const [masscanPorts, setMasscanPorts] = useState('80,443,554,8000,8080,37777');
  const [masscanRate, setMasscanRate] = useState('1000');
  const [masscanTimeout, setMasscanTimeout] = useState('60');
  const [masscanAggressive, setMasscanAggressive] = useState(false);
  
  // ZGrab state
  const [zgrabTarget, setZgrabTarget] = useState('');
  const [zgrabPort, setZgrabPort] = useState('80');
  const [zgrabProtocol, setZgrabProtocol] = useState<'http' | 'https' | 'rtsp'>('http');
  
  // Hydra state
  const [hydraTarget, setHydraTarget] = useState('');
  const [hydraService, setHydraService] = useState<'http-get' | 'rtsp' | 'ftp' | 'telnet' | 'ssh'>('http-get');
  const [hydraUserlist, setHydraUserlist] = useState('admin,root,user');
  const [hydraPasslist, setHydraPasslist] = useState('admin,password,123456,12345678');
  const [hydraThreads, setHydraThreads] = useState('16');
  const [hydraTimeout, setHydraTimeout] = useState('10');
  
  const handleExecute = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      let result;
      
      switch(activeTab) {
        case 'masscan':
          if (!masscanTarget) {
            throw new Error('Please enter a target IP or network range');
          }
          
          result = await executeMasscan({
            target: masscanTarget,
            ports: masscanPorts,
            rate: parseInt(masscanRate),
            timeout: parseInt(masscanTimeout),
            aggressive: masscanAggressive,
            saveResults: false
          });
          
          if (result.success) {
            toast({
              title: "Masscan Complete",
              description: `Scanned ${result.data.statistics?.hosts_total || 0} hosts, found ${result.data.results?.length || 0} open ports`
            });
          }
          break;
          
        case 'zgrab':
          if (!zgrabTarget) {
            throw new Error('Please enter a target IP or hostname');
          }
          
          result = await executeZGrab({
            target: zgrabTarget,
            port: parseInt(zgrabPort),
            protocol: zgrabProtocol,
            saveResults: false
          });
          
          if (result.success) {
            toast({
              title: "ZGrab Complete",
              description: `Banner grab completed for ${zgrabTarget}`
            });
          }
          break;
          
        case 'hydra':
          if (!hydraTarget) {
            throw new Error('Please enter a target IP or hostname');
          }
          
          result = await executeHydra({
            target: hydraTarget,
            service: hydraService,
            userList: hydraUserlist.split(','),
            passList: hydraPasslist.split(','),
            threads: parseInt(hydraThreads),
            timeout: parseInt(hydraTimeout) * 1000,
            saveResults: false
          });
          
          if (result.success) {
            toast({
              title: "Hydra Brute Force Complete",
              description: `Found ${result.data.credentials?.length || 0} valid credentials`
            });
          }
          break;
      }
      
      if (result && result.success) {
        setResults(result.data);
      } else if (result) {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error(`Error during ${activeTab} execution:`, error);
      toast({
        title: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Error`,
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderMasscanForm = () => (
    <div className="space-y-4">
      <Alert variant="default" className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-900">
        <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Masscan is an extremely fast port scanner that can generate significant network traffic. Only use on networks you own or have permission to scan.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <Label htmlFor="masscan-target">Target IP/Network</Label>
        <Input
          id="masscan-target"
          placeholder="192.168.1.0/24 or 10.0.0.1-10.0.0.255"
          value={masscanTarget}
          onChange={(e) => setMasscanTarget(e.target.value)}
        />
        <p className="text-xs text-gray-500">Can be a single IP, range (x.x.x.x-y.y.y.y), or CIDR notation</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="masscan-ports">Ports</Label>
        <Input
          id="masscan-ports"
          placeholder="80,443,554,8000,8080,37777"
          value={masscanPorts}
          onChange={(e) => setMasscanPorts(e.target.value)}
        />
        <p className="text-xs text-gray-500">Common camera ports: 80, 443, 554(RTSP), 8000, 8080, 37777(Dahua)</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="masscan-rate">Scan Rate (packets/second)</Label>
          <Input
            id="masscan-rate"
            type="number"
            placeholder="1000"
            value={masscanRate}
            onChange={(e) => setMasscanRate(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="masscan-timeout">Timeout (seconds)</Label>
          <Input
            id="masscan-timeout"
            type="number"
            placeholder="60"
            value={masscanTimeout}
            onChange={(e) => setMasscanTimeout(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="masscan-aggressive"
          checked={masscanAggressive}
          onCheckedChange={(checked) => setMasscanAggressive(!!checked)}
        />
        <Label htmlFor="masscan-aggressive">Aggressive Mode (faster, but noisier)</Label>
      </div>
    </div>
  );
  
  const renderZGrabForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="zgrab-target">Target IP/Hostname</Label>
        <Input
          id="zgrab-target"
          placeholder="192.168.1.100 or camera.example.com"
          value={zgrabTarget}
          onChange={(e) => setZgrabTarget(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zgrab-protocol">Protocol</Label>
          <Select value={zgrabProtocol} onValueChange={(value: any) => setZgrabProtocol(value)}>
            <SelectTrigger id="zgrab-protocol">
              <SelectValue placeholder="Select protocol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="http">HTTP</SelectItem>
              <SelectItem value="https">HTTPS</SelectItem>
              <SelectItem value="rtsp">RTSP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="zgrab-port">Port</Label>
          <Input
            id="zgrab-port"
            type="number"
            placeholder="80"
            value={zgrabPort}
            onChange={(e) => setZgrabPort(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
        <h4 className="text-sm font-medium mb-2 flex items-center">
          <Terminal className="h-4 w-4 mr-2" />
          What This Tool Does
        </h4>
        <ul className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
          <li>- Grabs service banners to identify camera types and firmware</li>
          <li>- Fingerprints web servers and identifies authentication methods</li>
          <li>- Pulls HTTP headers and server information</li>
          <li>- For RTSP, identifies stream capabilities and authentication requirements</li>
        </ul>
      </div>
    </div>
  );
  
  const renderHydraForm = () => (
    <div className="space-y-4">
      <Alert variant="default" className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-900">
        <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Hydra is a password brute-forcing tool. Only use on systems you own or have permission to test. Many failed login attempts may lock out accounts.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <Label htmlFor="hydra-target">Target IP/Hostname</Label>
        <Input
          id="hydra-target"
          placeholder="192.168.1.100 or camera.example.com"
          value={hydraTarget}
          onChange={(e) => setHydraTarget(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hydra-service">Service Type</Label>
        <Select value={hydraService} onValueChange={(value: any) => setHydraService(value)}>
          <SelectTrigger id="hydra-service">
            <SelectValue placeholder="Select service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="http-get">HTTP Basic Auth</SelectItem>
            <SelectItem value="rtsp">RTSP</SelectItem>
            <SelectItem value="ftp">FTP</SelectItem>
            <SelectItem value="telnet">Telnet</SelectItem>
            <SelectItem value="ssh">SSH</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hydra-userlist">Usernames (comma-separated)</Label>
        <Input
          id="hydra-userlist"
          placeholder="admin,root,user"
          value={hydraUserlist}
          onChange={(e) => setHydraUserlist(e.target.value)}
        />
        <p className="text-xs text-gray-500">Common camera usernames: admin, root, user, administrator</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hydra-passlist">Passwords (comma-separated)</Label>
        <Input
          id="hydra-passlist"
          placeholder="admin,password,123456"
          value={hydraPasslist}
          onChange={(e) => setHydraPasslist(e.target.value)}
        />
        <p className="text-xs text-gray-500">Common camera passwords: admin, password, 123456, 12345678, camera</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hydra-threads">Threads</Label>
          <Input
            id="hydra-threads"
            type="number"
            placeholder="16"
            value={hydraThreads}
            onChange={(e) => setHydraThreads(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hydra-timeout">Timeout (seconds)</Label>
          <Input
            id="hydra-timeout"
            type="number"
            placeholder="10"
            value={hydraTimeout}
            onChange={(e) => setHydraTimeout(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
  
  const renderCredentialFound = (cred: any, index: number) => (
    <div key={index} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
      <div className="flex justify-between items-center">
        <div className="font-mono text-sm">
          <span className="font-bold">{cred.username}</span>:<span>{cred.password}</span>
        </div>
        <Badge className="bg-green-500">Valid</Badge>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Service: {cred.service} | Host: {cred.host}{cred.port ? `:${cred.port}` : ''}
      </div>
    </div>
  );
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Network Penetration Tools
        </CardTitle>
        <CardDescription>
          Advanced tools for port scanning, banner grabbing, and authentication testing
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="masscan">
              <Network className="h-4 w-4 mr-2" />
              Masscan
            </TabsTrigger>
            <TabsTrigger value="zgrab">
              <Server className="h-4 w-4 mr-2" />
              ZGrab
            </TabsTrigger>
            <TabsTrigger value="hydra">
              <Lock className="h-4 w-4 mr-2" />
              Hydra
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="masscan">
            {renderMasscanForm()}
          </TabsContent>
          
          <TabsContent value="zgrab">
            {renderZGrabForm()}
          </TabsContent>
          
          <TabsContent value="hydra">
            {renderHydraForm()}
          </TabsContent>
        </Tabs>
        
        {results && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Results
            </h3>
            
            {activeTab === 'masscan' && results.results && (
              <div className="space-y-3">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-semibold">Total Hosts:</span> {results.statistics?.hosts_total || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold">Open Ports:</span> {results.results?.length || 0}
                    </div>
                    <div>
                      <span className="font-semibold">Scan Duration:</span> {results.statistics?.elapsed_time || 'N/A'}s
                    </div>
                    <div>
                      <span className="font-semibold">Scan Rate:</span> {results.statistics?.rate || 'N/A'} pps
                    </div>
                  </div>
                </div>
                
                <div className="overflow-auto max-h-64">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Port</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Protocol</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">State</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {results.results.map((result: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{result.ip}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{result.port}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">{result.protocol}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            <Badge className="bg-green-500">Open</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'zgrab' && results.banner && (
              <div className="space-y-3">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-semibold">Target:</span> {results.host || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold">Port:</span> {results.port || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold">Protocol:</span> {results.protocol || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold">Status:</span> {results.status || 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Banner</h4>
                  <div className="border rounded p-3 bg-black/10 font-mono text-xs overflow-auto max-h-96">
                    {results.banner}
                  </div>
                </div>
                
                {results.metadata && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Metadata</h4>
                    <Textarea
                      readOnly
                      className="font-mono text-xs h-48"
                      value={typeof results.metadata === 'string' 
                        ? results.metadata 
                        : JSON.stringify(results.metadata, null, 2)
                      }
                    />
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'hydra' && (
              <div className="space-y-3">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-semibold">Target:</span> {results.target || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold">Service:</span> {results.service || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold">Attempts:</span> {results.attempts || 'N/A'}
                    </div>
                    <div>
                      <span className="font-semibold">Found:</span> {results.credentials?.length || 0}
                    </div>
                  </div>
                </div>
                
                {results.credentials && results.credentials.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Valid Credentials
                    </h4>
                    <div className="space-y-2">
                      {results.credentials.map((cred: any, index: number) => renderCredentialFound(cred, index))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No valid credentials found
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleExecute}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {activeTab === 'masscan' && <Network className="mr-2 h-4 w-4" />}
              {activeTab === 'zgrab' && <Server className="mr-2 h-4 w-4" />}
              {activeTab === 'hydra' && <Lock className="mr-2 h-4 w-4" />}
              Run {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NetworkPenetrationTools;
