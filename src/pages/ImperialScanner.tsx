
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, Globe, Search, Shield } from 'lucide-react';
import { getRandomGeoLocation } from '@/utils/osintUtils';

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
            Select a territory for reconnaissance or use SearchCAM for targeted queries
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ImperialScanner;
