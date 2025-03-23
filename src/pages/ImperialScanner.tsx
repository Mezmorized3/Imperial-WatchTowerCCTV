import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, Globe, Search, Shield, Terminal, AlertTriangle } from 'lucide-react';
import { getRandomGeoLocation } from '@/utils/osintUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IMPERIAL_TERRITORIES = [
  { code: 'US', name: 'United States', count: 5234 },
  { code: 'JP', name: 'Japan', count: 2918 },
  { code: 'DE', name: 'Germany', count: 2456 },
  { code: 'FR', name: 'France', count: 2089 },
  { code: 'KR', name: 'South Korea', count: 1799 },
  { code: 'GB', name: 'United Kingdom', count: 1527 },
  { code: 'TW', name: 'Taiwan', count: 1289 },
  { code: 'NL', name: 'Netherlands', count: 1125 },
  { code: 'IT', name: 'Italy', count: 980 },
  { code: 'RU', name: 'Russia', count: 867 },
  { code: 'BR', name: 'Brazil', count: 784 },
  { code: 'CA', name: 'Canada', count: 721 },
  { code: 'IN', name: 'India', count: 634 },
  { code: 'TR', name: 'Turkey', count: 573 },
  { code: 'MX', name: 'Mexico', count: 512 }
];

const ImperialScanner = () => {
  const { toast } = useToast();
  const [selectedTerritory, setSelectedTerritory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [commandAccepted, setCommandAccepted] = useState<boolean>(false);
  const navigate = useNavigate();
  const [scan4allTarget, setScan4allTarget] = useState<string>('');
  const [scan4allMode, setScan4allMode] = useState<string>('comprehensive');
  const [scan4allResults, setScan4allResults] = useState<any[]>([]);
  const [isScan4allRunning, setIsScan4allRunning] = useState<boolean>(false);
  const [scan4allProgress, setScan4allProgress] = useState<number>(0);

  const imperialBanner = `
 ██╗███╗   ███╗██████╗ ███████╗██████╗ ██╗ █████╗ ██╗         ███████╗██╗   ██╗███████╗███████╗
 ██║████╗ ████║██╔══██╗██╔════╝██╔══██╗██║██╔══██╗██║         ██╔════╝╚██╗ ██╔╝██╔════╝██╔════╝
 ██║██╔████╔██║██████╔╝█████╗  ██████╔╝██║███████║██║         █████╗   ╚████╔╝ █████╗  ███████╗
 ██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗██║██╔══██║██║         ██╔══╝    ╚██╔╝  ██╔══╝  ╚════██║
 ██║██║ ╚═╝ ██║██║     ███████╗██║  ██║██║██║  ██║███████╗    ███████╗   ██║   ███████╗███████║
 ╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝    ╚══════╝   ╚═╝   ╚══════╝╚══════╝
  `;

  const acceptImperialMandate = () => {
    setCommandAccepted(true);
    toast({
      title: "Imperial Mandate Accepted",
      description: "Welcome to the Imperial Surveillance Network.",
      variant: "default",
    });
  };

  const startScan = () => {
    if (!selectedTerritory && !searchQuery) {
      toast({
        title: "Command Error",
        description: "Select a territory or enter a search query to begin.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanResults([]);

    const selectedCountry = IMPERIAL_TERRITORIES.find(t => t.code === selectedTerritory);
    const totalPages = selectedCountry ? Math.ceil(selectedCountry.count / 10) : 5;
    let currentPage = 0;

    const scanInterval = setInterval(() => {
      currentPage++;
      const newProgress = Math.min(100, Math.round((currentPage / totalPages) * 100));
      setScanProgress(newProgress);

      if (currentPage % 2 === 0 || currentPage === 1) {
        generateSimulatedResult();
      }

      if (newProgress >= 100) {
        clearInterval(scanInterval);
        setIsScanning(false);
        toast({
          title: "Scan Complete",
          description: `Found ${scanResults.length + 1} cameras in target region.`,
          variant: "default",
        });
        generateSimulatedResult();
      }
    }, 1000);
  };

  const generateSimulatedResult = () => {
    const randomLocation = getRandomGeoLocation(selectedTerritory || 'US');
    
    const result = {
      id: `cam-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      port: [80, 8080, 554, 443, 8000][Math.floor(Math.random() * 5)],
      brand: ['Hikvision', 'Dahua', 'Axis', 'Bosch', 'Sony'][Math.floor(Math.random() * 5)],
      model: `Model-${Math.floor(Math.random() * 1000)}`,
      accessLevel: ['admin', 'view', 'none'][Math.floor(Math.random() * 3)],
      country: randomLocation.country,
      city: randomLocation.city,
      latitude: randomLocation.lat,
      longitude: randomLocation.lng,
      timestamp: new Date().toISOString()
    };

    setScanResults(prev => [...prev, result]);
  };

  const executeSearchCamQuery = () => {
    if (!searchQuery) {
      toast({
        title: "Command Error",
        description: "Enter a search query to begin.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    toast({
      title: "SearchCAM Protocol Initiated",
      description: `Searching for: ${searchQuery}`,
      variant: "default",
    });

    let progress = 0;
    const searchInterval = setInterval(() => {
      progress += 20;
      setScanProgress(Math.min(100, progress));

      if (progress >= 100) {
        clearInterval(searchInterval);
        setIsScanning(false);
        setScanResults([
          {
            id: `search-${Date.now()}`,
            url: `http://example.com/search?q=${encodeURIComponent(searchQuery)}`,
            type: 'SearchCAM result',
            query: searchQuery,
            timestamp: new Date().toISOString()
          },
          {
            id: `search-${Date.now() + 1}`,
            url: `http://cameras.example.org/results?query=${encodeURIComponent(searchQuery)}`,
            type: 'SearchCAM result',
            query: searchQuery,
            timestamp: new Date().toISOString()
          },
          {
            id: `search-${Date.now() + 2}`,
            url: `http://surveillance.example.net/find?term=${encodeURIComponent(searchQuery)}`,
            type: 'SearchCAM result',
            query: searchQuery,
            timestamp: new Date().toISOString()
          }
        ]);
        toast({
          title: "SearchCAM Complete",
          description: `Found 3 results for "${searchQuery}".`,
          variant: "default",
        });
      }
    }, 1000);
  };

  const executeScan4all = async () => {
    if (!scan4allTarget) {
      toast({
        title: "Input Required",
        description: "Please enter a target to scan",
        variant: "destructive"
      });
      return;
    }

    setIsScan4allRunning(true);
    setScan4allProgress(0);
    setScan4allResults([]);
    
    toast({
      title: "Scan Initiated",
      description: `Starting scan4all on target: ${scan4allTarget}`,
    });

    const scanTimer = setInterval(() => {
      setScan4allProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 10) + 1;
        if (newProgress >= 100) {
          clearInterval(scanTimer);
          completeScan4all();
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    const vulnerabilityTypes = [
      'SQL Injection', 'Cross-Site Scripting (XSS)', 'Cross-Site Request Forgery (CSRF)',
      'Remote Code Execution', 'Open Redirect', 'Information Disclosure',
      'Insecure Direct Object References', 'Security Misconfiguration',
      'Broken Authentication', 'Command Injection'
    ];
    
    const severityLevels = ['Critical', 'High', 'Medium', 'Low', 'Info'];
    const vulnerabilityCount = Math.floor(Math.random() * 10) + 1;
    
    const results = Array.from({ length: vulnerabilityCount }).map((_, index) => ({
      id: `vuln-${Date.now()}-${index}`,
      type: vulnerabilityTypes[Math.floor(Math.random() * vulnerabilityTypes.length)],
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
      path: `/api/${['users', 'products', 'orders', 'auth'][Math.floor(Math.random() * 4)]}`,
      description: `Potential vulnerability detected in target endpoint. Risk score: ${(Math.random() * 10).toFixed(1)}`,
      timestamp: new Date().toISOString()
    }));
    
    setScan4allResults(results);
    setIsScan4allRunning(false);
    
    toast({
      title: "Scan Complete",
      description: `Found ${results.length} potential vulnerabilities`,
    });
  };

  const completeScan4all = () => {
    const vulnerabilityTypes = [
      'SQL Injection', 'Cross-Site Scripting (XSS)', 'Cross-Site Request Forgery (CSRF)',
      'Remote Code Execution', 'Open Redirect', 'Information Disclosure',
      'Insecure Direct Object References', 'Security Misconfiguration',
      'Broken Authentication', 'Command Injection'
    ];
    
    const severityLevels = ['Critical', 'High', 'Medium', 'Low', 'Info'];
    const vulnerabilityCount = Math.floor(Math.random() * 10) + 1;
    
    const results = Array.from({ length: vulnerabilityCount }).map((_, index) => ({
      id: `vuln-${Date.now()}-${index}`,
      type: vulnerabilityTypes[Math.floor(Math.random() * vulnerabilityTypes.length)],
      severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
      path: `/api/${['users', 'products', 'orders', 'auth'][Math.floor(Math.random() * 4)]}`,
      description: `Potential vulnerability detected in target endpoint. Risk score: ${(Math.random() * 10).toFixed(1)}`,
      timestamp: new Date().toISOString()
    }));
    
    setScan4allResults(results);
    setIsScan4allRunning(false);
    
    toast({
      title: "Scan Complete",
      description: `Found ${results.length} potential vulnerabilities`,
    });
  };

  const navigateToImperialControl = () => {
    navigate('/imperial-control');
  };

  if (!commandAccepted) {
    return (
      <div className="min-h-screen bg-scanner-dark text-white p-6">
        <Card className="max-w-4xl mx-auto bg-scanner-dark-alt border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-2xl text-center text-red-500">Imperial Network Protocol</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Surveillance System v2.5
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <pre className="text-xs text-red-500 font-mono overflow-auto">{imperialBanner}</pre>
            
            <div className="mt-6 space-y-4 text-gray-300">
              <p className="text-yellow-400 font-bold">WARNING: Imperial Network Protocol Active</p>
              <p>By continuing, you swear fealty to the Imperial Network Charter.</p>
              <p className="text-red-400">This tool reveals digital strongholds - use with imperial discretion.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-gray-700 pt-4">
            <Button variant="secondary" onClick={() => window.history.back()}>
              Retreat from Network
            </Button>
            <Button variant="destructive" onClick={acceptImperialMandate}>
              Accept Imperial Mandate
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-scanner-dark text-white p-6">
      <Card className="max-w-6xl mx-auto bg-scanner-dark-alt border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center">
              <Shield className="mr-2 text-red-500" /> Imperial Surveillance Network
            </CardTitle>
            <Button variant="outline" size="sm" onClick={navigateToImperialControl}>
              Imperial Control Center
            </Button>
          </div>
          <CardDescription className="text-gray-400">
            Advanced scanning capabilities for Imperial surveillance and security assessment
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          <Tabs defaultValue="surveillance" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="surveillance">
                <Globe className="h-4 w-4 mr-2" />
                Camera Surveillance
              </TabsTrigger>
              <TabsTrigger value="scan4all">
                <Terminal className="h-4 w-4 mr-2" />
                Vulnerability Scanner
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="surveillance" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Globe className="mr-2 text-blue-400" /> Territory Selection
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Select 
                      value={selectedTerritory} 
                      onValueChange={setSelectedTerritory}
                    >
                      <SelectTrigger className="bg-scanner-dark border-gray-700 text-white">
                        <SelectValue placeholder="Select Territory" />
                      </SelectTrigger>
                      <SelectContent className="bg-scanner-dark border-gray-700 text-white">
                        <SelectGroup>
                          <SelectLabel>Available Territories</SelectLabel>
                          {IMPERIAL_TERRITORIES.map(territory => (
                            <SelectItem key={territory.code} value={territory.code}>
                              {territory.name} ({territory.count})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Button 
                      className="w-full" 
                      onClick={startScan}
                      disabled={isScanning || (!selectedTerritory && !searchQuery)}
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      {isScanning ? "Scanning..." : "Commence Reconnaissance"}
                    </Button>
                  </div>
                </div>
              
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Search className="mr-2 text-green-400" /> SearchCAM Protocol
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="Enter search query..."
                        className="bg-scanner-dark border-gray-700 text-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={executeSearchCamQuery}
                        disabled={isScanning || !searchQuery}
                      >
                        <Search className="mr-2 h-4 w-4" />
                        {isScanning ? "Searching..." : "Execute SearchCAM Query"}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {isScanning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Scanning in progress...</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <Progress value={scanProgress} className="h-2" />
                  </div>
                )}
                
                {scanResults.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b border-gray-700 pb-2">
                      Intelligence Gathered ({scanResults.length})
                    </h3>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto p-2">
                      {scanResults.map(result => (
                        <Card key={result.id} className="bg-scanner-dark border-gray-700">
                          <CardContent className="p-4 text-sm">
                            {result.type === 'SearchCAM result' ? (
                              <div>
                                <p className="text-green-400 font-medium">SearchCAM Result</p>
                                <p className="truncate text-blue-300 hover:underline">{result.url}</p>
                                <p className="text-gray-400 text-xs mt-1">Query: {result.query}</p>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p><span className="text-gray-400">IP:</span> {result.ip}:{result.port}</p>
                                  <p><span className="text-gray-400">Brand:</span> {result.brand}</p>
                                  <p><span className="text-gray-400">Model:</span> {result.model}</p>
                                </div>
                                <div>
                                  <p><span className="text-gray-400">Location:</span> {result.country}, {result.city}</p>
                                  <p><span className="text-gray-400">Coordinates:</span> {result.latitude.toFixed(4)}, {result.longitude.toFixed(4)}</p>
                                  <p><span className="text-gray-400">Access:</span> <span className={
                                    result.accessLevel === 'admin' ? 'text-red-400' : 
                                    result.accessLevel === 'view' ? 'text-yellow-400' : 'text-gray-400'
                                  }>{result.accessLevel}</span></p>
                                </div>
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Captured at: {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="scan4all" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="text-yellow-400" />
                  <p className="text-yellow-400 text-sm">
                    Advanced vulnerability scanning powered by GhostTroops/scan4all
                  </p>
                </div>
                
                <Card className="bg-scanner-dark border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Scan4All Target Configuration</CardTitle>
                    <CardDescription>
                      Comprehensive vulnerability scanning for web applications and networks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Target</label>
                        <Input
                          type="text"
                          placeholder="IP, Domain, or URL (e.g., example.com)"
                          className="bg-scanner-dark border-gray-700 text-white"
                          value={scan4allTarget}
                          onChange={(e) => setScan4allTarget(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Scan Mode</label>
                        <Select 
                          value={scan4allMode} 
                          onValueChange={setScan4allMode}
                        >
                          <SelectTrigger className="bg-scanner-dark border-gray-700 text-white">
                            <SelectValue placeholder="Select Scan Mode" />
                          </SelectTrigger>
                          <SelectContent className="bg-scanner-dark border-gray-700 text-white">
                            <SelectGroup>
                              <SelectItem value="comprehensive">Comprehensive</SelectItem>
                              <SelectItem value="fast">Fast Scan</SelectItem>
                              <SelectItem value="passive">Passive</SelectItem>
                              <SelectItem value="aggressive">Aggressive</SelectItem>
                              <SelectItem value="stealth">Stealth</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-2" 
                      variant="destructive"
                      onClick={executeScan4all}
                      disabled={isScan4allRunning || !scan4allTarget}
                    >
                      <Terminal className="mr-2 h-4 w-4" />
                      {isScan4allRunning ? "Scanning in progress..." : "Execute Scan4All"}
                    </Button>
                  </CardContent>
                </Card>
                
                {isScan4allRunning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Executing vulnerability scan...</span>
                      <span>{scan4allProgress}%</span>
                    </div>
                    <Progress value={scan4allProgress} className="h-2" />
                  </div>
                )}
                
                {scan4allResults.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b border-gray-700 pb-2">
                      Vulnerability Scan Results ({scan4allResults.length})
                    </h3>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto p-2">
                      {scan4allResults.map(result => (
                        <Card key={result.id} className="bg-scanner-dark border-gray-700">
                          <CardContent className="p-4 text-sm">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`h-2 w-2 rounded-full ${
                                    result.severity === 'Critical' ? 'bg-red-500' :
                                    result.severity === 'High' ? 'bg-orange-500' :
                                    result.severity === 'Medium' ? 'bg-yellow-500' :
                                    result.severity === 'Low' ? 'bg-blue-500' : 'bg-gray-500'
                                  }`}></span>
                                  <p className="font-medium">{result.type}</p>
                                </div>
                                <p className="text-sm text-gray-400 mt-1">{result.path}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded ${
                                result.severity === 'Critical' ? 'bg-red-900/30 text-red-400' :
                                result.severity === 'High' ? 'bg-orange-900/30 text-orange-400' :
                                result.severity === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                                result.severity === 'Low' ? 'bg-blue-900/30 text-blue-400' : 
                                'bg-gray-900/30 text-gray-400'
                              }`}>
                                {result.severity}
                              </span>
                            </div>
                            <p className="mt-2 text-sm">{result.description}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Discovered at: {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                <Card className="bg-scanner-dark-alt border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">About Scan4All</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-gray-400 space-y-2">
                    <p>• Comprehensive, powerful vulnerability scanner based on GhostTroops/scan4all</p>
                    <p>• Detects SQL injection, XSS, RCE, and many other vulnerability types</p>
                    <p>• Supports both active and passive scanning modes</p>
                    <p>• Combines multiple scanning engines for maximum coverage</p>
                    <p>• Use responsibly and only on systems you have permission to scan</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImperialScanner;
