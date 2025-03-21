
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, AlertTriangle, Terminal, Camera } from 'lucide-react';
import { getRandomGeoLocation } from '@/utils/osintUtils';
import { CameraResult } from '@/types/scanner';

const ImperialScanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [territoryCode, setTerritoryCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [acceptedMandate, setAcceptedMandate] = useState(false);
  const [results, setResults] = useState<CameraResult[]>([]);
  const [countries, setCountries] = useState<{ [key: string]: { country: string; count: number } }>({});
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  // Simulate fetching country data
  useEffect(() => {
    const mockCountries = {
      'US': { country: 'United States', count: 4721 },
      'JP': { country: 'Japan', count: 1832 },
      'DE': { country: 'Germany', count: 2508 },
      'FR': { country: 'France', count: 1405 },
      'UK': { country: 'United Kingdom', count: 2032 },
      'IT': { country: 'Italy', count: 1264 },
      'CA': { country: 'Canada', count: 1103 },
      'AU': { country: 'Australia', count: 894 },
      'RU': { country: 'Russia', count: 3781 },
      'CN': { country: 'China', count: 2943 }
    };
    setCountries(mockCountries);
  }, []);

  const addConsoleMessage = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    const coloredMessage = type === 'error' ? `[red]${message}[/]` : 
                           type === 'success' ? `[green]${message}[/]` : 
                           `[cyan]${message}[/]`;
    setConsoleOutput(prev => [...prev, coloredMessage]);
  };

  const startScan = async () => {
    if (!territoryCode) {
      toast({
        title: "Error",
        description: "Please select a territory code",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setProgress(0);
    setResults([]);
    addConsoleMessage(`Initializing Voidwalker Protocol for ${countries[territoryCode]?.country || territoryCode}`, 'success');
    
    const totalPages = Math.floor(Math.random() * 10) + 5; // Random number of pages between 5-15
    const totalCameras = Math.floor(Math.random() * 50) + 10; // Random number of cameras between 10-60
    
    for (let i = 0; i <= totalPages; i++) {
      addConsoleMessage(`Deploying Legions to page ${i + 1}/${totalPages}`, 'info');
      setProgress(Math.floor((i / totalPages) * 100));
      
      // Generate some random cameras for this page
      const camerasThisPage = Math.floor(Math.random() * 8) + 1; // 1-8 cameras per page
      
      const newCameras: CameraResult[] = [];
      for (let j = 0; j < camerasThisPage; j++) {
        // Generate random IP
        const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        const port = [80, 8080, 554, 443][Math.floor(Math.random() * 4)];
        
        const location = getRandomGeoLocation(countries[territoryCode]?.country || 'Unknown');
        
        const camera: CameraResult = {
          id: `imp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ip,
          port,
          status: ['online', 'vulnerable', 'authenticated'][Math.floor(Math.random() * 3)] as any,
          location: {
            country: countries[territoryCode]?.country || 'Unknown',
            city: location.city,
            latitude: location.latitude,
            longitude: location.longitude
          },
          lastSeen: new Date().toISOString(),
          accessLevel: ['none', 'view', 'control', 'admin'][Math.floor(Math.random() * 4)] as any,
          brand: ['Hikvision', 'Dahua', 'Axis', 'Bosch', 'Sony', 'Panasonic'][Math.floor(Math.random() * 6)],
          firmwareVersion: `${Math.floor(Math.random() * 9) + 1}.${Math.floor(Math.random() * 9) + 1}.${Math.floor(Math.random() * 9) + 1}`
        };
        
        // Sometimes add vulnerabilities
        if (Math.random() > 0.7) {
          camera.vulnerabilities = [
            {
              name: ['Default credentials', 'CVE-2021-36260', 'Outdated firmware', 'Exposed RTSP'][Math.floor(Math.random() * 4)],
              severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
              description: 'Security vulnerability detected'
            }
          ];
        }
        
        newCameras.push(camera);
      }
      
      // Wait for a short delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Add the cameras to results
      setResults(prev => [...prev, ...newCameras]);
      
      if (i === Math.floor(totalPages / 2)) {
        addConsoleMessage('Strengthening encryption protocols against imperial countermeasures', 'info');
      }
    }
    
    // Complete the scan
    setProgress(100);
    setIsScanning(false);
    
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 15);
    const filename = `imperial_spoils_${territoryCode}_${timestamp}.txt`;
    
    addConsoleMessage(`Voidwalker Protocol complete. ${results.length} strongholds captured.`, 'success');
    addConsoleMessage(`Spoils secured in ${filename}`, 'success');
    
    toast({
      title: "Scan Complete",
      description: `Found ${results.length} cameras in ${countries[territoryCode]?.country || territoryCode}`,
    });
  };

  const executeSearchCam = async () => {
    if (!searchQuery) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }
    
    addConsoleMessage(`Executing SearchCAM for query: "${searchQuery}"`, 'info');
    setIsScanning(true);
    
    // Simulate search progress
    for (let i = 0; i <= 5; i++) {
      setProgress(i * 20);
      addConsoleMessage(`Scouting page ${i+1} for query "${searchQuery}"`, 'info');
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Generate some fake search results
    const searchResults = [
      `https://cam-portal.${searchQuery.toLowerCase().replace(/\s/g, '')}.com/stream`,
      `http://surveillance.${searchQuery.toLowerCase().split(' ')[0]}.org/public`,
      `https://cctv-${searchQuery.toLowerCase().replace(/\s/g, '-')}.net/view?id=1234`,
      `http://webcam.${searchQuery.toLowerCase().split(' ')[0]}.io/live`,
      `https://stream.${searchQuery.toLowerCase().replace(/[^a-z0-9]/g, '')}-cams.com/public`
    ];
    
    addConsoleMessage(`SearchCAM Results for "${searchQuery}":`, 'success');
    searchResults.forEach(url => {
      addConsoleMessage(url, 'info');
    });
    
    setProgress(100);
    setIsScanning(false);
    
    toast({
      title: "SearchCAM Complete",
      description: `Found ${searchResults.length} results for "${searchQuery}"`,
    });
  };

  const acceptMandate = () => {
    addConsoleMessage("Imperial Mandate Accepted. Granting access to surveillance operations.", 'success');
    setAcceptedMandate(true);
  };

  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <header className="bg-scanner-dark-alt border-b border-gray-800 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> 
              Back to Scanner
            </Button>
            <h1 className="text-xl font-bold">Imperial Surveillance Network</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="bg-scanner-card border-gray-800 overflow-hidden">
              <CardHeader className="pb-2 border-b border-gray-800 bg-scanner-dark-alt">
                <CardTitle className="text-white text-lg flex items-center">
                  <Terminal className="w-5 h-5 mr-2 text-scanner-primary" />
                  Imperial Command
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {!acceptedMandate ? (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <pre className="text-scanner-primary text-xs leading-tight overflow-hidden">
                        {`
    ██╗███╗   ███╗██████╗ ███████╗██████╗ ██╗ █████╗ ██╗     
    ██║████╗ ████║██╔══██╗██╔════╝██╔══██╗██║██╔══██╗██║     
    ██║██╔████╔██║██████╔╝█████╗  ██████╔╝██║███████║██║     
    ██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗██║██╔══██║██║     
    ██║██║ ╚═╝ ██║██║     ███████╗██║  ██║██║██║  ██║███████╗
    ╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝
                        `}
                      </pre>
                    </div>
                    <div className="p-4 bg-scanner-dark-alt rounded-md border border-gray-800">
                      <p className="text-yellow-400 mb-2 font-medium">By continuing, you swear fealty to the Imperial Network Charter</p>
                      <p className="text-red-400 mb-4 text-sm flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        This tool reveals digital strongholds - use with imperial discretion
                      </p>
                      <Button 
                        className="w-full bg-scanner-primary hover:bg-scanner-primary/80"
                        onClick={acceptMandate}
                      >
                        Accept Imperial Mandate
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-scanner-dark-alt rounded-md border border-gray-800">
                      <h3 className="text-scanner-primary mb-2 font-medium">Territory Selection</h3>
                      <p className="text-sm text-gray-400 mb-3">Select the territory code to begin surveillance operation</p>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {Object.entries(countries).map(([code, data]) => (
                          <Button 
                            key={code}
                            variant="outline"
                            size="sm"
                            className={`justify-between ${territoryCode === code ? 'border-scanner-primary bg-scanner-primary/20' : 'border-gray-700'}`}
                            onClick={() => setTerritoryCode(code)}
                          >
                            <span>{code}</span>
                            <Badge variant="outline" className="ml-2 bg-scanner-dark-alt">
                              {data.count}
                            </Badge>
                          </Button>
                        ))}
                      </div>
                      
                      <Button 
                        className="w-full bg-scanner-primary hover:bg-scanner-primary/80 mt-2"
                        onClick={startScan}
                        disabled={isScanning || !territoryCode}
                      >
                        {isScanning ? 'Scanning...' : 'Execute Voidwalker Protocol'}
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-scanner-dark-alt rounded-md border border-gray-800">
                      <h3 className="text-scanner-primary mb-2 font-medium">SearchCAM Module</h3>
                      <p className="text-sm text-gray-400 mb-3">Scout additional intelligence through targeted queries</p>
                      
                      <div className="flex space-x-2 mb-2">
                        <Input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Enter search query"
                          className="bg-scanner-dark border-gray-700"
                        />
                        <Button 
                          onClick={executeSearchCam}
                          disabled={isScanning || !searchQuery}
                          size="icon"
                          className="bg-scanner-primary hover:bg-scanner-primary/80"
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {isScanning && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Operation Progress</p>
                    <Progress value={progress} className="h-2 bg-gray-800" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="bg-scanner-card border-gray-800 h-full">
              <CardHeader className="pb-2 border-b border-gray-800 bg-scanner-dark-alt">
                <CardTitle className="text-white text-lg flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-scanner-primary" />
                  Imperial Findings
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 h-full">
                <div className="grid grid-cols-1 gap-4 h-full">
                  <div className="bg-black/50 text-green-400 p-4 border border-gray-800 rounded-md font-mono text-sm h-60 overflow-y-auto">
                    {consoleOutput.length === 0 ? (
                      <p className="text-gray-500">Awaiting imperial command...</p>
                    ) : (
                      consoleOutput.map((line, i) => (
                        <div key={i} className="mb-1">
                          <span className="text-gray-500 mr-2">{'>>'}</span>
                          <span dangerouslySetInnerHTML={{ 
                            __html: line
                              .replace(/\[red\]/g, '<span class="text-red-400">')
                              .replace(/\[green\]/g, '<span class="text-green-400">')
                              .replace(/\[cyan\]/g, '<span class="text-cyan-400">')
                              .replace(/\[yellow\]/g, '<span class="text-yellow-400">')
                              .replace(/\[\//g, '</span>') 
                          }} />
                        </div>
                      ))
                    )}
                  </div>
                  
                  {results.length > 0 && (
                    <div className="border border-gray-800 rounded-md overflow-hidden">
                      <Table>
                        <TableHeader className="bg-scanner-dark-alt">
                          <TableRow>
                            <TableHead className="text-scanner-primary">IP:Port</TableHead>
                            <TableHead className="text-scanner-primary">Brand</TableHead>
                            <TableHead className="text-scanner-primary">Status</TableHead>
                            <TableHead className="text-scanner-primary">Location</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.map((camera) => (
                            <TableRow key={camera.id} className="border-t border-gray-800">
                              <TableCell className="font-mono">
                                {camera.ip}:{camera.port}
                              </TableCell>
                              <TableCell>{camera.brand || 'Unknown'}</TableCell>
                              <TableCell>
                                <Badge 
                                  className={
                                    camera.status === 'vulnerable' ? 'bg-red-500' : 
                                    camera.status === 'authenticated' ? 'bg-green-500' : 
                                    'bg-blue-500'
                                  }
                                >
                                  {camera.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {camera.location?.country}, {camera.location?.city}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImperialScanner;
