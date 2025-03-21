import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Shield, Users, Server, Activity, Scan, Database, Lock, Radar, 
  BarChart, FileText, Globe, Search
} from 'lucide-react';
import { imperialServerService } from '@/utils/imperialServerService';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';

interface LegionStatus {
  [port: string]: {
    status: string;
    lastActivation: string | null;
    operationalCapacity: string;
    role: string;
  };
}

const ImperialControl = () => {
  const { toast } = useToast();
  const [adminToken, setAdminToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [legionStatus, setLegionStatus] = useState<LegionStatus | null>(null);
  const [selectedPort, setSelectedPort] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('registry');
  const [isLoading, setIsLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [scanResults, setScanResults] = useState<any[] | null>(null);

  // Target inputs
  const [targetIP, setTargetIP] = useState('');
  const [targetSubnet, setTargetSubnet] = useState('');
  const [targetURL, setTargetURL] = useState('');
  const [targetUsername, setTargetUsername] = useState('');

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = imperialServerService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        loadLegionStatus();
      }
    };
    
    checkAuth();
  }, []);

  const loadLegionStatus = async () => {
    const status = await imperialServerService.getImperialStatus();
    if (status) {
      setLegionStatus(status);
      
      // Select the first port by default
      if (Object.keys(status).length > 0 && !selectedPort) {
        setSelectedPort(Object.keys(status)[0]);
      }
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const success = await imperialServerService.authenticate(adminToken);
    
    if (success) {
      setIsAuthenticated(true);
      toast({
        title: "Imperial Authentication Successful",
        description: "Welcome, Imperial Overseer",
      });
      loadLegionStatus();
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid Imperial credentials",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    imperialServerService.logout();
    setIsAuthenticated(false);
    setLegionStatus(null);
    setSelectedPort(null);
    toast({
      title: "Logged Out",
      description: "Imperial session terminated",
    });
  };

  const issueDecree = async (command: 'MOBILIZE' | 'STAND_DOWN') => {
    if (!selectedPort) return;
    
    setIsLoading(true);
    const result = await imperialServerService.issueDecree(Number(selectedPort), command);
    setIsLoading(false);
    
    if (result) {
      toast({
        title: "Imperial Decree Issued",
        description: result.decree,
      });
      // Refresh legion status
      loadLegionStatus();
    }
  };

  const initiateComplianceCheck = async () => {
    if (!targetIP) {
      toast({
        title: "Error",
        description: "Please specify a target IP address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setProgressValue(0);
    setScanResults(null);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgressValue(prev => {
        const newValue = prev + 5;
        if (newValue >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newValue;
      });
    }, 200);
    
    try {
      const result = await imperialServerService.initiateCameraScan(targetIP, 'compliance');
      
      if (result) {
        setScanResults([
          {
            id: Date.now().toString(),
            ip: targetIP,
            status: 'Scanned',
            vulnerabilities: result.vulnerabilities || [],
            protocols: result.protocols || [],
            ports: result.openPorts || [],
            timestamp: new Date().toISOString()
          }
        ]);
        
        toast({
          title: "Imperial Compliance Check Complete",
          description: `Target: ${targetIP} has been assessed`,
        });
      }
    } catch (error) {
      console.error("Compliance check error:", error);
      toast({
        title: "Imperial Compliance Check Failed",
        description: "The target could not be properly assessed",
        variant: "destructive",
      });
    } finally {
      clearInterval(interval);
      setProgressValue(100);
      setIsLoading(false);
    }
  };

  const commenceSiege = async () => {
    if (!targetSubnet) {
      toast({
        title: "Error",
        description: "Please specify a target subnet",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setProgressValue(0);
    setScanResults(null);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgressValue(prev => {
        const newValue = prev + 2;
        if (newValue >= 95) {
          clearInterval(interval);
          return 95;
        }
        return newValue;
      });
    }, 200);
    
    try {
      const result = await imperialServerService.searchIPCameras(targetSubnet, ['ONVIF', 'Hikvision', 'Dahua']);
      
      if (result && result.devices) {
        setScanResults(result.devices.map((device: any, index: number) => ({
          id: `siege-${Date.now()}-${index}`,
          ip: device.ip,
          port: device.port,
          protocol: device.protocol,
          manufacturer: device.manufacturer || 'Unknown',
          model: device.model || 'Unknown',
          accessible: device.accessible || false,
          timestamp: new Date().toISOString()
        })));
        
        toast({
          title: "Imperial Siege Complete",
          description: `${result.devices.length} devices captured in subnet ${targetSubnet}`,
        });
      }
    } catch (error) {
      console.error("Siege error:", error);
      toast({
        title: "Imperial Siege Failed",
        description: "The operation could not be completed",
        variant: "destructive",
      });
    } finally {
      clearInterval(interval);
      setProgressValue(100);
      setIsLoading(false);
    }
  };

  const secureLoot = async () => {
    if (!targetURL) {
      toast({
        title: "Error",
        description: "Please specify a target URL",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setProgressValue(0);
    setScanResults(null);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgressValue(prev => {
        const newValue = prev + 1;
        if (newValue >= 95) {
          clearInterval(interval);
          return 95;
        }
        return newValue;
      });
    }, 100);
    
    try {
      const result = await imperialServerService.initiateWebCheck(targetURL);
      
      if (result) {
        setScanResults([
          {
            id: `loot-${Date.now()}`,
            url: targetURL,
            headers: result.headers || {},
            technologies: result.technologies || [],
            security: result.security || {},
            dns: result.dns || [],
            timestamp: new Date().toISOString()
          }
        ]);
        
        toast({
          title: "Loot Secured",
          description: `Intelligence gathered from ${targetURL}`,
        });
      }
    } catch (error) {
      console.error("Loot securing error:", error);
      toast({
        title: "Loot Operation Failed",
        description: "The intelligence could not be secured",
        variant: "destructive",
      });
    } finally {
      clearInterval(interval);
      setProgressValue(100);
      setIsLoading(false);
    }
  };

  const imperialBanner = `
    ██████╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗ ██╗         ██████╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗ ██╗
   ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██║         ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██║
   ██║     ██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║         ██║     ██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║
   ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║██║         ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║██║
   ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗    ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗
    ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝     ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
  `;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-scanner-dark text-white p-6">
        <Card className="max-w-4xl mx-auto bg-scanner-dark-alt border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-2xl text-center text-red-500">Imperial Control</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Authentication Required
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <pre className="text-xs text-red-500 font-mono overflow-auto">{imperialBanner}</pre>
            
            <div className="mt-6 space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="admin-token" className="text-gray-300">Imperial Admin Token</label>
                <Input
                  id="admin-token"
                  type="password"
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  placeholder="Enter your Imperial admin token"
                  className="bg-scanner-dark border-gray-700 text-white"
                />
              </div>
              
              <Button 
                onClick={handleLogin} 
                disabled={isLoading || !adminToken.trim()} 
                className="w-full"
              >
                {isLoading ? "Authenticating..." : "Authenticate"}
              </Button>
              
              <p className="text-sm text-gray-500 italic">
                Note: The default token can be found in server/config.json
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-scanner-dark text-white p-6">
      <Card className="max-w-6xl mx-auto bg-scanner-dark-alt border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl flex items-center">
              <Shield className="mr-2 text-red-500" /> Imperial Control
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Terminate Session
            </Button>
          </div>
          <CardDescription className="text-gray-400">
            Command and control interface for Imperial operations
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs defaultValue="registry" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="registry" className="flex items-center">
                <Database className="mr-2 h-4 w-4" />
                Imperial Registry
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Compliance Check
              </TabsTrigger>
              <TabsTrigger value="siege" className="flex items-center">
                <Radar className="mr-2 h-4 w-4" />
                Commence Siege
              </TabsTrigger>
              <TabsTrigger value="loot" className="flex items-center">
                <Lock className="mr-2 h-4 w-4" />
                Secure Loot
              </TabsTrigger>
            </TabsList>
            
            {/* Imperial Registry */}
            <TabsContent value="registry" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="col-span-2 bg-scanner-dark border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Server className="mr-2 h-4 w-4 text-blue-400" />
                      Legion Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {legionStatus ? (
                      <div className="space-y-4">
                        {Object.entries(legionStatus).map(([port, data]) => (
                          <div 
                            key={port} 
                            className={`p-3 border ${selectedPort === port ? 'border-blue-500' : 'border-gray-700'} 
                                       rounded-md cursor-pointer transition-colors`}
                            onClick={() => setSelectedPort(port)}
                          >
                            <div className="flex justify-between">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${data.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span>Legion {port}</span>
                              </div>
                              <span className="text-gray-400">{data.operationalCapacity}</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-400">{data.role}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        No legion data available
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-scanner-dark border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Activity className="mr-2 h-4 w-4 text-green-400" />
                      Imperial Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => issueDecree('MOBILIZE')} 
                        disabled={!selectedPort || isLoading} 
                        className="w-full mb-2"
                      >
                        Mobilize Legion
                      </Button>
                      <Button 
                        onClick={() => issueDecree('STAND_DOWN')} 
                        disabled={!selectedPort || isLoading} 
                        variant="destructive"
                        className="w-full"
                      >
                        Stand Down Legion
                      </Button>
                      
                      <div className="pt-4 text-sm text-gray-400">
                        {selectedPort ? (
                          <p>Selected: Legion {selectedPort} - {legionStatus?.[selectedPort]?.role}</p>
                        ) : (
                          <p>No legion selected</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-scanner-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart className="mr-2 h-4 w-4 text-yellow-400" />
                    Imperial Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-scanner-dark-alt rounded-md border border-gray-700">
                      <div className="text-sm text-gray-400">Active Legions</div>
                      <div className="text-2xl mt-1">
                        {legionStatus 
                          ? Object.values(legionStatus).filter(l => l.status === 'ACTIVE').length 
                          : 0}
                        <span className="text-sm text-gray-500">/{legionStatus ? Object.keys(legionStatus).length : 0}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-scanner-dark-alt rounded-md border border-gray-700">
                      <div className="text-sm text-gray-400">Imperial Throne</div>
                      <div className="text-2xl mt-1">Port 7443</div>
                    </div>
                    <div className="p-4 bg-scanner-dark-alt rounded-md border border-gray-700">
                      <div className="text-sm text-gray-400">Security Level</div>
                      <div className="text-2xl mt-1 text-yellow-400">Imperial</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Imperial Compliance Check */}
            <TabsContent value="compliance" className="space-y-4">
              <Card className="bg-scanner-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-red-400" />
                    Imperial Compliance Check
                  </CardTitle>
                  <CardDescription>
                    Assess a target for compliance with Imperial security protocols
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm text-gray-400">Target IP Address</label>
                      <Input
                        value={targetIP}
                        onChange={(e) => setTargetIP(e.target.value)}
                        placeholder="192.168.1.100"
                        className="bg-scanner-dark border-gray-700 text-white"
                      />
                    </div>
                    
                    <Button
                      onClick={initiateComplianceCheck}
                      disabled={isLoading || !targetIP.trim()}
                      className="w-full"
                    >
                      <Scan className="mr-2 h-4 w-4" />
                      {isLoading ? "Checking Compliance..." : "Initiate Compliance Check"}
                    </Button>
                    
                    {isLoading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Compliance check in progress...</span>
                          <span>{progressValue}%</span>
                        </div>
                        <Progress value={progressValue} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Compliance Results */}
              {scanResults && (
                <Card className="bg-scanner-dark border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-green-400" />
                      Compliance Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {scanResults.map(result => (
                      <div key={result.id} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">{result.ip}</h3>
                          <span className="text-xs text-gray-400">
                            {new Date(result.timestamp).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="p-3 bg-scanner-dark-alt border border-gray-700 rounded-md">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Open Ports</h4>
                            <div className="space-y-1">
                              {result.ports && result.ports.length > 0 ? (
                                result.ports.map((port: number, i: number) => (
                                  <div key={i} className="text-sm">{port}</div>
                                ))
                              ) : (
                                <div className="text-sm text-gray-500">No open ports detected</div>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-3 bg-scanner-dark-alt border border-gray-700 rounded-md">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Protocols</h4>
                            <div className="space-y-1">
                              {result.protocols && result.protocols.length > 0 ? (
                                result.protocols.map((protocol: string, i: number) => (
                                  <div key={i} className="text-sm">{protocol}</div>
                                ))
                              ) : (
                                <div className="text-sm text-gray-500">No protocols detected</div>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-3 bg-scanner-dark-alt border border-gray-700 rounded-md">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Vulnerabilities</h4>
                            <div className="space-y-1">
                              {result.vulnerabilities && result.vulnerabilities.length > 0 ? (
                                result.vulnerabilities.map((vuln: any, i: number) => (
                                  <div key={i} className="text-sm text-red-400">{vuln.name || vuln}</div>
                                ))
                              ) : (
                                <div className="text-sm text-green-500">No vulnerabilities detected</div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-scanner-dark-alt border border-gray-700 rounded-md">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">Imperial Assessment</h4>
                          <div className="text-sm">
                            {result.vulnerabilities && result.vulnerabilities.length > 0 ? (
                              <span className="text-red-400">Target has failed Imperial compliance check. Recommend immediate security remediation.</span>
                            ) : (
                              <span className="text-green-400">Target has passed Imperial compliance check. Continue monitoring for new threats.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Commence Siege */}
            <TabsContent value="siege" className="space-y-4">
              <Card className="bg-scanner-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Radar className="mr-2 h-5 w-5 text-blue-400" />
                    Commence Imperial Siege
                  </CardTitle>
                  <CardDescription>
                    Discover and capture surveillance devices across a network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm text-gray-400">Target Subnet</label>
                      <Input
                        value={targetSubnet}
                        onChange={(e) => setTargetSubnet(e.target.value)}
                        placeholder="192.168.1.0/24"
                        className="bg-scanner-dark border-gray-700 text-white"
                      />
                    </div>
                    
                    <Button
                      onClick={commenceSiege}
                      disabled={isLoading || !targetSubnet.trim()}
                      className="w-full"
                    >
                      <Radar className="mr-2 h-4 w-4" />
                      {isLoading ? "Siege in Progress..." : "Commence Siege"}
                    </Button>
                    
                    {isLoading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Siege operations in progress...</span>
                          <span>{progressValue}%</span>
                        </div>
                        <Progress value={progressValue} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Siege Results */}
              {scanResults && scanResults.length > 0 && (
                <Card className="bg-scanner-dark border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Users className="mr-2 h-4 w-4 text-blue-400" />
                      Captured Devices ({scanResults.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      {scanResults.map(device => (
                        <div 
                          key={device.id} 
                          className="p-4 bg-scanner-dark-alt border border-gray-700 rounded-md"
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold">
                              {device.ip}:{device.port}
                            </h3>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${device.accessible ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                              {device.accessible ? 'Accessible' : 'Inaccessible'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                            <div>
                              <span className="text-gray-400">Protocol:</span> {device.protocol}
                            </div>
                            <div>
                              <span className="text-gray-400">Manufacturer:</span> {device.manufacturer}
                            </div>
                            <div>
                              <span className="text-gray-400">Model:</span> {device.model}
                            </div>
                            <div>
                              <span className="text-gray-400">Captured:</span> {new Date(device.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-700 flex justify-end">
                            <Button size="sm" variant="outline" className="text-xs">
                              Access Device
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {/* Secure Loot */}
            <TabsContent value="loot" className="space-y-4">
              <Card className="bg-scanner-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-purple-400" />
                    Secure Imperial Loot
                  </CardTitle>
                  <CardDescription>
                    Acquire digital intelligence from online targets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm text-gray-400">Target URL</label>
                      <Input
                        value={targetURL}
                        onChange={(e) => setTargetURL(e.target.value)}
                        placeholder="https://example.com"
                        className="bg-scanner-dark border-gray-700 text-white"
                      />
                    </div>
                    
                    <Button
                      onClick={secureLoot}
                      disabled={isLoading || !targetURL.trim()}
                      className="w-full"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      {isLoading ? "Securing Loot..." : "Secure Loot"}
                    </Button>
                    
                    {isLoading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Acquiring intelligence...</span>
                          <span>{progressValue}%</span>
                        </div>
                        <Progress value={progressValue} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Loot Results */}
              {scanResults && scanResults.length > 0 && (
                <Card className="bg-scanner-dark border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Database className="mr-2 h-4 w-4 text-purple-400" />
                      Acquired Intelligence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {scanResults.map(result => (
                      <div key={result.id} className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">{result.url}</h3>
                          <span className="text-xs text-gray-400">
                            {new Date(result.timestamp).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-scanner-dark-alt border border-gray-700 rounded-md">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Technologies</h4>
                            <div className="flex flex-wrap gap-2">
                              {result.technologies && result.technologies.length > 0 ? (
                                result.technologies.map((tech: string, i: number) => (
                                  <span key={i} className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-md">
                                    {tech}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-gray-500">No technologies detected</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-3 bg-scanner-dark-alt border border-gray-700 rounded-md">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Security</h4>
                            <div className="space-y-1 text-sm">
                              {result.security ? (
                                <>
                                  <div><span className="text-gray-400">HTTPS:</span> {result.security.https ? 'Yes' : 'No'}</div>
                                  <div><span className="text-gray-400">HSTS:</span> {result.security.hsts ? 'Yes' : 'No'}</div>
                                  <div><span className="text-gray-400">CSP:</span> {result.security.csp ? 'Yes' : 'No'}</div>
                                </>
                              ) : (
                                <span className="text-sm text-gray-500">No security information available</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-scanner-dark-alt border border-gray-700 rounded-md">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">DNS Information</h4>
                          <div className="space-y-2">
                            {result.dns && result.dns.length > 0 ? (
                              result.dns.map((record: any, i: number) => (
                                <div key={i} className="text-sm">
                                  <span className="text-gray-400">{record.type}:</span> {record.value}
                                </div>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500">No DNS information available</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-3 bg-scanner-dark-alt border border-gray-700 rounded-md">
                          <h4 className="text-sm font-medium text-gray-400 mb-2">HTTP Headers</h4>
                          <div className="space-y-1 max-h-60 overflow-y-auto">
                            {result.headers && Object.keys(result.headers).length > 0 ? (
                              Object.entries(result.headers).map(([key, value]: [string, any], i: number) => (
                                <div key={i} className="text-sm flex">
                                  <span className="text-gray-400 min-w-36">{key}:</span>
                                  <span className="ml-2">{value as string}</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-sm text-gray-500">No HTTP headers available</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImperialControl;
