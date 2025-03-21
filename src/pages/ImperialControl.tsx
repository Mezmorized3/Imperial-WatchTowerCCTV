
import React, { useState, useEffect } from 'react';
import { Shield, Eye, Terminal, Camera, Lock, Server, Search, Database, Radar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { imperialServerService } from '@/utils/imperialServerService';

// Import refactored components
import ImperialAuth from '@/components/imperial-control/ImperialAuth';
import ImperialRegistry from '@/components/imperial-control/ImperialRegistry';
import ImperialCompliance from '@/components/imperial-control/ImperialCompliance';
import ImperialSiege from '@/components/imperial-control/ImperialSiege';
import ImperialLoot from '@/components/imperial-control/ImperialLoot';
import ImperialShinobi from '@/components/imperial-control/ImperialShinobi';

// Types
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
    ██╗███╗   ███╗██████╗ ███████╗██████╗ ██╗ █████╗ ██╗          ██████╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗ ██╗     
   ██║████╗ ████║██╔══██╗██╔════╝██╔══██╗██║██╔══██╗██║         ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██║     
   ██║██╔████╔██║██████╔╝█████╗  ██████╔╝██║███████║██║         ██║     ██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║     
   ██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗██║██╔══██║██║         ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║██║     
   ██║██║ ╚═╝ ██║██║     ███████╗██║  ██║██║██║  ██║███████╗    ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗
   ╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝     ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
  `;

  if (!isAuthenticated) {
    return (
      <ImperialAuth
        adminToken={adminToken}
        setAdminToken={setAdminToken}
        handleLogin={handleLogin}
        isLoading={isLoading}
        imperialBanner={imperialBanner}
      />
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
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="registry" className="flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Imperial Registry
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Compliance Check
              </TabsTrigger>
              <TabsTrigger value="siege" className="flex items-center">
                <Radar className="h-4 w-4 mr-2" />
                Commence Siege
              </TabsTrigger>
              <TabsTrigger value="loot" className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Secure Loot
              </TabsTrigger>
              <TabsTrigger value="shinobi" className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Imperial Shinobi
              </TabsTrigger>
            </TabsList>
            
            {/* Imperial Registry */}
            <TabsContent value="registry">
              <ImperialRegistry
                legionStatus={legionStatus}
                selectedPort={selectedPort}
                setSelectedPort={setSelectedPort}
                issueDecree={issueDecree}
                isLoading={isLoading}
              />
            </TabsContent>
            
            {/* Imperial Compliance Check */}
            <TabsContent value="compliance">
              <ImperialCompliance
                targetIP={targetIP}
                setTargetIP={setTargetIP}
                initiateComplianceCheck={initiateComplianceCheck}
                isLoading={isLoading}
                progressValue={progressValue}
                scanResults={scanResults}
              />
            </TabsContent>
            
            {/* Commence Siege */}
            <TabsContent value="siege">
              <ImperialSiege
                targetSubnet={targetSubnet}
                setTargetSubnet={setTargetSubnet}
                commenceSiege={commenceSiege}
                isLoading={isLoading}
                progressValue={progressValue}
                scanResults={scanResults}
              />
            </TabsContent>
            
            {/* Secure Loot */}
            <TabsContent value="loot">
              <ImperialLoot
                targetURL={targetURL}
                setTargetURL={setTargetURL}
                secureLoot={secureLoot}
                isLoading={isLoading}
                progressValue={progressValue}
                scanResults={scanResults}
              />
            </TabsContent>
            
            {/* Imperial Shinobi */}
            <TabsContent value="shinobi">
              <ImperialShinobi />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImperialControl;
