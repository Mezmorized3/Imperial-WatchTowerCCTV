
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Shield, Network, Search, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeRtspServer } from '@/utils/osintUtilsConnector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdvancedNetworkToolsProps {
  onActionComplete?: (results: any) => void;
}

const AdvancedNetworkTools: React.FC<AdvancedNetworkToolsProps> = ({ onActionComplete }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('zgrab');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  // ZGrab state
  const [zgrabTarget, setZgrabTarget] = useState('');
  const [zgrabPort, setZgrabPort] = useState<number>(80);
  const [zgrabProtocol, setZgrabProtocol] = useState<'http' | 'https' | 'rtsp'>('http');

  // Hydra state
  const [hydraTarget, setHydraTarget] = useState('');
  const [hydraService, setHydraService] = useState<'http-get' | 'rtsp' | 'ftp' | 'telnet' | 'ssh'>('http-get');
  const [hydraThreads, setHydraThreads] = useState<number>(10);
  const [hydraTimeout, setHydraTimeout] = useState<number>(5000);
  const [userList, setUserList] = useState<string>('admin,root,user');
  const [passList, setPassList] = useState<string>('admin,password,123456');

  // RTSP Server state
  const [rtspListenIp, setRtspListenIp] = useState('0.0.0.0');
  const [rtspListenPort, setRtspListenPort] = useState<number>(8554);
  const [rtspSourcePath, setRtspSourcePath] = useState('');
  const [rtspRecordPath, setRtspRecordPath] = useState('');
  const [rtspEnableTls, setRtspEnableTls] = useState<boolean>(false);
  const [rtspUsername, setRtspUsername] = useState('');
  const [rtspPassword, setRtspPassword] = useState('');

  const simulateNetworkOperation = async (operation: string, options: any = {}) => {
    setIsLoading(true);
    setResults(null);
    
    try {
      // Wait to simulate network activity
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResult = {
        success: true,
        operation,
        timestamp: new Date().toISOString(),
        options,
        data: {
          status: "success",
          found: Math.floor(Math.random() * 5),
          details: options
        }
      };
      
      setResults(mockResult.data);
      
      if (onActionComplete) {
        onActionComplete(mockResult.data);
      }
      
      return mockResult;
    } catch (error) {
      console.error(`Error in ${operation}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleZGrabExecute = async () => {
    if (!zgrabTarget) {
      toast({
        title: "Error",
        description: "Please enter a target IP address",
        variant: "destructive"
      });
      return;
    }

    const result = await simulateNetworkOperation("ZGrab Banner Grab", {
      target: zgrabTarget,
      port: zgrabPort,
      protocol: zgrabProtocol
    });
    
    if (result.success) {
      toast({
        title: "Scan Complete",
        description: `Banner grab completed for ${zgrabTarget}`
      });
    } else {
      toast({
        title: "Scan Failed",
        description: result.success === false && "error" in result ? result.error : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleHydraExecute = async () => {
    if (!hydraTarget) {
      toast({
        title: "Error",
        description: "Please enter a target IP address",
        variant: "destructive"
      });
      return;
    }

    const result = await simulateNetworkOperation("Hydra Brute Force", {
      target: hydraTarget,
      service: hydraService,
      userList: userList.split(','),
      passList: passList.split(','),
      threads: hydraThreads,
      timeout: hydraTimeout
    });
    
    if (result.success) {
      toast({
        title: "Brute Force Complete",
        description: `Found ${result.data?.found || 0} valid credentials for ${hydraTarget}`
      });
    } else {
      toast({
        title: "Brute Force Failed",
        description: result.success === false && "error" in result ? result.error : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleRtspServerExecute = async () => {
    setIsLoading(true);
    setResults(null);

    try {
      const credentials = (rtspUsername && rtspPassword) ? {
        username: rtspUsername,
        password: rtspPassword
      } : undefined;

      const result = await executeRtspServer({
        listenIp: rtspListenIp,
        listenPort: rtspListenPort,
        sourcePath: rtspSourcePath || undefined,
        recordPath: rtspRecordPath || undefined,
        credentials,
        enableTls: rtspEnableTls
      });

      if (result && result.success) {
        setResults(result.data);

        if (onActionComplete) {
          onActionComplete(result.data);
        }

        toast({
          title: "Server Started",
          description: `RTSP server is now running on ${rtspListenIp}:${rtspListenPort}`
        });
      } else {
        toast({
          title: "Server Failed",
          description: result && !result.success && "error" in result ? result.error : "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error starting RTSP server:", error);
      toast({
        title: "Server Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecute = () => {
    switch (activeTab) {
      case 'zgrab':
        handleZGrabExecute();
        break;
      case 'hydra':
        handleHydraExecute();
        break;
      case 'rtsp-server':
        handleRtspServerExecute();
        break;
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Advanced Network Tools
        </CardTitle>
        <CardDescription>
          Specialized tools for fingerprinting, authentication testing, and streaming
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="zgrab" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="zgrab">
              <Search className="h-4 w-4 mr-2" />
              Banner Grab
            </TabsTrigger>
            <TabsTrigger value="hydra">
              <Lock className="h-4 w-4 mr-2" />
              Auth Tester
            </TabsTrigger>
            <TabsTrigger value="rtsp-server">
              <Network className="h-4 w-4 mr-2" />
              RTSP Server
            </TabsTrigger>
          </TabsList>
          
          {/* ZGrab tab */}
          <TabsContent value="zgrab" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="zgrabTarget">Target IP or Host</Label>
              <Input
                id="zgrabTarget"
                placeholder="e.g., 192.168.1.100"
                value={zgrabTarget}
                onChange={(e) => setZgrabTarget(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zgrabProtocol">Protocol</Label>
              <Select
                value={zgrabProtocol}
                onValueChange={(value: 'http' | 'https' | 'rtsp') => setZgrabProtocol(value)}
                disabled={isLoading}
              >
                <SelectTrigger id="zgrabProtocol">
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
              <Label htmlFor="zgrabPort">Port</Label>
              <Input
                id="zgrabPort"
                type="number"
                value={zgrabPort}
                onChange={(e) => setZgrabPort(parseInt(e.target.value))}
                disabled={isLoading}
              />
            </div>
          </TabsContent>
          
          {/* Hydra tab */}
          <TabsContent value="hydra" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hydraTarget">Target IP or Host</Label>
              <Input
                id="hydraTarget"
                placeholder="e.g., 192.168.1.100"
                value={hydraTarget}
                onChange={(e) => setHydraTarget(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hydraService">Service</Label>
              <Select
                value={hydraService}
                onValueChange={(value: 'http-get' | 'rtsp' | 'ftp' | 'telnet' | 'ssh') => setHydraService(value)}
                disabled={isLoading}
              >
                <SelectTrigger id="hydraService">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="http-get">HTTP</SelectItem>
                  <SelectItem value="rtsp">RTSP</SelectItem>
                  <SelectItem value="ftp">FTP</SelectItem>
                  <SelectItem value="telnet">Telnet</SelectItem>
                  <SelectItem value="ssh">SSH</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="userList">Usernames</Label>
              <Input
                id="userList"
                placeholder="Comma-separated usernames"
                value={userList}
                onChange={(e) => setUserList(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passList">Passwords</Label>
              <Input
                id="passList"
                placeholder="Comma-separated passwords"
                value={passList}
                onChange={(e) => setPassList(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hydraThreads">Threads</Label>
                <Input
                  id="hydraThreads"
                  type="number"
                  value={hydraThreads}
                  onChange={(e) => setHydraThreads(parseInt(e.target.value))}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hydraTimeout">Timeout (ms)</Label>
                <Input
                  id="hydraTimeout"
                  type="number"
                  value={hydraTimeout}
                  onChange={(e) => setHydraTimeout(parseInt(e.target.value))}
                  disabled={isLoading}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* RTSP Server tab */}
          <TabsContent value="rtsp-server" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rtspListenIp">Listen IP</Label>
                <Input
                  id="rtspListenIp"
                  placeholder="e.g., 0.0.0.0"
                  value={rtspListenIp}
                  onChange={(e) => setRtspListenIp(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rtspListenPort">Listen Port</Label>
                <Input
                  id="rtspListenPort"
                  type="number"
                  value={rtspListenPort}
                  onChange={(e) => setRtspListenPort(parseInt(e.target.value))}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rtspSourcePath">Source Path (optional)</Label>
              <Input
                id="rtspSourcePath"
                placeholder="e.g., rtsp://example.com/stream"
                value={rtspSourcePath}
                onChange={(e) => setRtspSourcePath(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">RTSP source to proxy (leave empty for direct publishing)</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rtspRecordPath">Recording Path (optional)</Label>
              <Input
                id="rtspRecordPath"
                placeholder="e.g., /recordings"
                value={rtspRecordPath}
                onChange={(e) => setRtspRecordPath(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Authentication (optional)</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Username"
                  value={rtspUsername}
                  onChange={(e) => setRtspUsername(e.target.value)}
                  disabled={isLoading}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={rtspPassword}
                  onChange={(e) => setRtspPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rtspEnableTls"
                checked={rtspEnableTls}
                onCheckedChange={(checked) => setRtspEnableTls(checked === true)}
                disabled={isLoading}
              />
              <Label htmlFor="rtspEnableTls">Enable TLS</Label>
            </div>
          </TabsContent>
        </Tabs>
        
        {results && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold">Results</h3>
            <Textarea
              readOnly
              value={JSON.stringify(results, null, 2)}
              className="min-h-32 font-mono text-sm bg-scanner-dark-alt border-gray-700"
            />
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
              {activeTab === 'rtsp-server' ? 'Starting Server...' : 'Processing...'}
            </>
          ) : (
            <>
              {activeTab === 'zgrab' && <Search className="mr-2 h-4 w-4" />}
              {activeTab === 'hydra' && <Lock className="mr-2 h-4 w-4" />}
              {activeTab === 'rtsp-server' && <Network className="mr-2 h-4 w-4" />}
              {activeTab === 'zgrab' && 'Grab Banners'}
              {activeTab === 'hydra' && 'Test Credentials'}
              {activeTab === 'rtsp-server' && 'Start RTSP Server'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdvancedNetworkTools;
