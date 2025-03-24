
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CameraSearch, EyeOff, Check, AlertCircle, Camera, Shield, RefreshCw, Globe } from 'lucide-react';
import { 
  executeHackCCTV, 
  executeCamDumper, 
  executeOpenCCTV, 
  executeEyePwn, 
  executeIngram 
} from '@/utils/osintImplementations';
import { CameraResult } from '@/utils/types/cameraTypes';
import { getCountryIpRanges } from '@/utils/ipRangeUtils';

export const ComprehensiveCCTVScanner: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    target: '',
    country: '',
    toolset: 'all', // 'all', 'hack-cctv', 'cam-dumper', 'open-cctv', 'eye-pwn', 'ingram'
    bruteforce: true,
    deepScan: false,
    scanMode: 'quick' // 'quick', 'deep', 'stealth'
  });
  
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<CameraResult[]>([]);
  const [activeTab, setActiveTab] = useState('config');
  const { toast } = useToast();
  
  const handleParamChange = (key: string, value: any) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  };
  
  const handleScan = async () => {
    if (!searchParams.target && !searchParams.country) {
      toast({
        title: "Input Required",
        description: "Please enter a target IP/range or select a country",
        variant: "destructive",
      });
      return;
    }
    
    setIsScanning(true);
    setResults([]);
    
    try {
      let combinedResults: CameraResult[] = [];
      const targetOrCountry = searchParams.target || searchParams.country;
      
      // If country is selected, show selected IP ranges
      if (searchParams.country && !searchParams.target) {
        const countryRanges = getCountryIpRanges(searchParams.country);
        if (countryRanges.length > 0) {
          const randomRangeIndex = Math.floor(Math.random() * countryRanges.length);
          toast({
            title: `IP Range Selected for ${searchParams.country.toUpperCase()}`,
            description: `Using ${countryRanges[randomRangeIndex].description} - ${countryRanges[randomRangeIndex].range}`,
          });
        }
      }
      
      // Run the selected tools
      if (searchParams.toolset === 'all' || searchParams.toolset === 'hack-cctv') {
        const hackCCTVResult = await executeHackCCTV({
          target: searchParams.target,
          country: searchParams.country,
          bruteforce: searchParams.bruteforce,
          deepScan: searchParams.deepScan
        });
        
        if (hackCCTVResult.success && hackCCTVResult.data?.cameras) {
          combinedResults = [...combinedResults, ...hackCCTVResult.data.cameras];
        }
      }
      
      if (searchParams.toolset === 'all' || searchParams.toolset === 'cam-dumper') {
        const camDumperResult = await executeCamDumper({
          target: searchParams.target,
          country: searchParams.country
        });
        
        if (camDumperResult.success && camDumperResult.data?.cameras) {
          combinedResults = [...combinedResults, ...camDumperResult.data.cameras];
        }
      }
      
      if (searchParams.toolset === 'all' || searchParams.toolset === 'open-cctv') {
        const openCCTVResult = await executeOpenCCTV({
          target: searchParams.target || targetOrCountry,
          scanMode: searchParams.scanMode as any
        });
        
        if (openCCTVResult.success && openCCTVResult.data?.cameras) {
          combinedResults = [...combinedResults, ...openCCTVResult.data.cameras];
        }
      }
      
      if (searchParams.toolset === 'all' || searchParams.toolset === 'eye-pwn') {
        const eyePwnResult = await executeEyePwn({
          target: searchParams.target,
          country: searchParams.country,
          bruteforce: searchParams.bruteforce
        });
        
        if (eyePwnResult.success && eyePwnResult.data?.cameras) {
          combinedResults = [...combinedResults, ...eyePwnResult.data.cameras];
        }
      }
      
      if (searchParams.toolset === 'all' || searchParams.toolset === 'ingram') {
        const ingramResult = await executeIngram({
          target: searchParams.target,
          country: searchParams.country,
          scanType: searchParams.scanMode as any
        });
        
        if (ingramResult.success && ingramResult.data?.cameras) {
          combinedResults = [...combinedResults, ...ingramResult.data.cameras];
        }
      }
      
      // Remove duplicates by IP:port
      const uniqueResults = Array.from(
        new Map(combinedResults.map(camera => [`${camera.ip}:${camera.port}`, camera])).values()
      );
      
      setResults(uniqueResults);
      
      if (uniqueResults.length > 0) {
        toast({
          title: "Scan Complete",
          description: `Found ${uniqueResults.length} cameras with ${uniqueResults.filter(c => c.vulnerabilities && c.vulnerabilities.length > 0).length} vulnerable`,
        });
        setActiveTab('results');
      } else {
        toast({
          title: "No Results",
          description: "No cameras found with the current parameters",
        });
      }
    } catch (error) {
      console.error('Comprehensive scan error:', error);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  // Group results by country
  const resultsByCountry = results.reduce((acc, camera) => {
    const country = camera.geolocation?.country || 'Unknown';
    if (!acc[country]) acc[country] = [];
    acc[country].push(camera);
    return acc;
  }, {} as Record<string, CameraResult[]>);
  
  // Count vulnerabilities by severity
  const vulnerabilityCount = results.reduce((acc, camera) => {
    if (camera.vulnerabilities) {
      camera.vulnerabilities.forEach(vuln => {
        if (!acc[vuln.severity]) acc[vuln.severity] = 0;
        acc[vuln.severity]++;
      });
    }
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <Card className="bg-scanner-dark border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <CameraSearch className="mr-2 h-5 w-5 text-scanner-primary" />
          Comprehensive CCTV Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target" className="text-sm">Target IP/Range</Label>
                <Input
                  id="target"
                  placeholder="e.g. 192.168.1.0/24"
                  value={searchParams.target}
                  onChange={(e) => handleParamChange('target', e.target.value)}
                  className="bg-scanner-dark-alt border-gray-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm">Target Country</Label>
                <Select 
                  value={searchParams.country} 
                  onValueChange={(value) => handleParamChange('country', value)}
                >
                  <SelectTrigger id="country" className="bg-scanner-dark-alt border-gray-700">
                    <SelectValue placeholder="Select country (optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-scanner-dark border-gray-700">
                    <SelectItem value="">Any Country</SelectItem>
                    <SelectItem value="ukraine">🇺🇦 Ukraine</SelectItem>
                    <SelectItem value="russia">🇷🇺 Russia</SelectItem>
                    <SelectItem value="georgia">🇬🇪 Georgia</SelectItem>
                    <SelectItem value="romania">🇷🇴 Romania</SelectItem>
                    <SelectItem value="united states">🇺🇸 United States</SelectItem>
                    <SelectItem value="united kingdom">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="germany">🇩🇪 Germany</SelectItem>
                    <SelectItem value="france">🇫🇷 France</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="toolset" className="text-sm">Hacking Toolset</Label>
                <Select 
                  value={searchParams.toolset} 
                  onValueChange={(value) => handleParamChange('toolset', value)}
                >
                  <SelectTrigger id="toolset" className="bg-scanner-dark-alt border-gray-700">
                    <SelectValue placeholder="Select toolset" />
                  </SelectTrigger>
                  <SelectContent className="bg-scanner-dark border-gray-700">
                    <SelectItem value="all">All Tools (Comprehensive)</SelectItem>
                    <SelectItem value="hack-cctv">Hack-CCTV</SelectItem>
                    <SelectItem value="cam-dumper">Cam-Dumper</SelectItem>
                    <SelectItem value="open-cctv">OpenCCTV</SelectItem>
                    <SelectItem value="eye-pwn">EyePwn</SelectItem>
                    <SelectItem value="ingram">Ingram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scanMode" className="text-sm">Scan Mode</Label>
                <Select 
                  value={searchParams.scanMode} 
                  onValueChange={(value) => handleParamChange('scanMode', value)}
                >
                  <SelectTrigger id="scanMode" className="bg-scanner-dark-alt border-gray-700">
                    <SelectValue placeholder="Select scan mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-scanner-dark border-gray-700">
                    <SelectItem value="quick">Quick (Fast, Less Comprehensive)</SelectItem>
                    <SelectItem value="deep">Deep (Slower, More Thorough)</SelectItem>
                    <SelectItem value="stealth">Stealth (Minimal Footprint)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="bruteforce" 
                  checked={searchParams.bruteforce}
                  onCheckedChange={(checked) => handleParamChange('bruteforce', checked === true)}
                />
                <Label htmlFor="bruteforce" className="text-sm text-gray-300">
                  Enable credential brute-forcing
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="deepScan" 
                  checked={searchParams.deepScan}
                  onCheckedChange={(checked) => handleParamChange('deepScan', checked === true)}
                />
                <Label htmlFor="deepScan" className="text-sm text-gray-300">
                  Enable deep scanning (slower but more thorough)
                </Label>
              </div>
            </div>
            
            <Button 
              onClick={handleScan}
              disabled={isScanning || (!searchParams.target && !searchParams.country)}
              className="w-full bg-scanner-primary hover:bg-scanner-primary/90"
            >
              {isScanning ? (
                <div className="flex items-center">
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </div>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Scan for Cameras
                </>
              )}
            </Button>
            
            <div className="text-xs text-gray-400 p-2 bg-scanner-dark-alt rounded border border-gray-700">
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-scanner-primary" />
                <div>
                  <p className="mb-1">This tool combines multiple CCTV scanning and exploitation techniques:</p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    <li>Hack-CCTV: Default credential checking and vulnerability scanning</li>
                    <li>Cam-Dumper: Specialized web interface access</li>
                    <li>OpenCCTV: RTSP stream discovery and access</li>
                    <li>EyePwn: Advanced vulnerability exploitation</li>
                    <li>Ingram: Comprehensive camera analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="pt-4">
            {results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-scanner-dark-alt border-gray-700">
                    Total: {results.length}
                  </Badge>
                  
                  {Object.entries(vulnerabilityCount).map(([severity, count]) => (
                    <Badge 
                      key={severity}
                      className={
                        severity === 'critical' ? 'bg-red-950/60 text-red-400 border-red-900' :
                        severity === 'high' ? 'bg-orange-950/60 text-orange-400 border-orange-900' :
                        severity === 'medium' ? 'bg-yellow-950/60 text-yellow-400 border-yellow-900' :
                        'bg-blue-950/60 text-blue-400 border-blue-900'
                      }
                    >
                      {severity}: {count}
                    </Badge>
                  ))}
                  
                  <Badge className="bg-green-950/60 text-green-400 border-green-900">
                    Credentials: {results.filter(c => c.credentials).length}
                  </Badge>
                </div>
                
                {/* Results by country */}
                {Object.keys(resultsByCountry).length > 1 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-300 flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-scanner-primary" />
                      Results by Country
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {Object.entries(resultsByCountry).map(([country, cameras]) => (
                        <div 
                          key={country}
                          className="bg-scanner-dark-alt border border-gray-700 rounded p-2 text-center"
                        >
                          <div className="text-sm font-medium">{country}</div>
                          <div className="text-2xl font-bold text-scanner-primary">{cameras.length}</div>
                          <div className="text-xs text-gray-400">cameras</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Camera list */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  <h3 className="text-sm font-medium text-gray-300 flex items-center">
                    <Camera className="h-4 w-4 mr-2 text-scanner-primary" />
                    Discovered Cameras
                  </h3>
                  
                  {results.map((camera, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-scanner-dark-alt border border-gray-700 rounded-md hover:border-scanner-primary/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-medium flex items-center">
                            {camera.ip}:{camera.port}
                          </div>
                          <div className="text-sm text-gray-400">
                            {camera.manufacturer || 'Unknown'} {camera.model || 'Camera'}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className={
                              camera.status === 'vulnerable' ? 'border-red-800 text-red-400' :
                              camera.status === 'online' ? 'border-green-800 text-green-400' :
                              'border-gray-700 text-gray-400'
                            }>
                              {camera.status}
                            </Badge>
                            
                            {camera.geolocation?.country && (
                              <Badge variant="outline" className="border-blue-800 text-blue-400 flex items-center space-x-1">
                                <Globe className="h-3 w-3" />
                                <span>
                                  {camera.geolocation.country}
                                  {camera.geolocation.city && `, ${camera.geolocation.city}`}
                                </span>
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {camera.vulnerabilities && camera.vulnerabilities.length > 0 && (
                            <Badge className={
                              camera.vulnerabilities.some(v => v.severity === 'critical') ? 'bg-red-950/60 text-red-400' :
                              camera.vulnerabilities.some(v => v.severity === 'high') ? 'bg-orange-950/60 text-orange-400' :
                              'bg-yellow-950/60 text-yellow-400'
                            }>
                              {camera.vulnerabilities.length} vuln
                            </Badge>
                          )}
                          
                          {camera.credentials && (
                            <Badge className="bg-green-950/60 text-green-400">
                              <Check className="h-3 w-3 mr-1" /> Creds
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Details section */}
                      {(camera.credentials || (camera.vulnerabilities && camera.vulnerabilities.length > 0)) && (
                        <div className="mt-2 pt-2 border-t border-gray-700/50">
                          {camera.credentials && (
                            <div className="mb-2 p-1.5 bg-gray-800/40 rounded text-xs flex items-center">
                              <Shield className="h-3.5 w-3.5 mr-1.5 text-green-400" />
                              <span className="text-gray-400 mr-1">Credentials:</span>
                              <span className="font-mono text-green-400">
                                {camera.credentials.username}:{camera.credentials.password}
                              </span>
                            </div>
                          )}
                          
                          {camera.vulnerabilities && camera.vulnerabilities.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-xs text-gray-400">Vulnerabilities:</div>
                              <div className="flex flex-wrap gap-1">
                                {camera.vulnerabilities.map((vuln, i) => (
                                  <span 
                                    key={i} 
                                    className={`text-xs px-1.5 py-0.5 rounded ${
                                      vuln.severity === 'critical' ? 'bg-red-950/60 text-red-400' :
                                      vuln.severity === 'high' ? 'bg-orange-950/60 text-orange-400' :
                                      vuln.severity === 'medium' ? 'bg-yellow-950/60 text-yellow-400' :
                                      'bg-blue-950/60 text-blue-400'
                                    }`}
                                  >
                                    {vuln.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400">
                {isScanning ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin mb-4 h-8 w-8 border-b-2 border-scanner-primary rounded-full"></div>
                    <p>Scanning for vulnerable cameras...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <EyeOff className="h-12 w-12 mb-2 text-gray-600" />
                    <p>Configure and run a scan to see results</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ComprehensiveCCTVScanner;
