
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, Search, Shield, MapPin, Globe, AlertCircle, 
  Check, Lock, Server, ArrowRight, X, Eye
} from 'lucide-react';
import { 
  executeHackCCTV, executeCamDumper, executeOpenCCTV, 
  executeEyePwn, executeIngram, executeCCTV 
} from '@/utils/osintImplementations';
import { CameraResult } from '@/utils/types/cameraTypes';
import { getCountryCities } from '@/utils/countryUtils';
import { Badge } from '@/components/ui/badge';

interface ScanOption {
  value: string;
  label: string;
  description: string;
  tool: string;
}

const scanOptions: ScanOption[] = [
  { 
    value: 'country-scan', 
    label: 'Country-based Scan', 
    description: 'Scan cameras in specific countries',
    tool: 'cctv'
  },
  { 
    value: 'default-credentials', 
    label: 'Default Credentials Scanner', 
    description: 'Find cameras using default credentials',
    tool: 'hack-cctv'
  },
  { 
    value: 'vulnerability-scan', 
    label: 'Vulnerability Scanner', 
    description: 'Identify vulnerable cameras',
    tool: 'eye-pwn'
  },
  { 
    value: 'deep-scan', 
    label: 'Deep Network Analysis', 
    description: 'Perform comprehensive network scans',
    tool: 'ingram'
  },
  { 
    value: 'dump-scan', 
    label: 'Camera Data Dumper', 
    description: 'Extract data from accessible cameras',
    tool: 'cam-dumper'
  },
  { 
    value: 'stealth-scan', 
    label: 'Stealth Reconnaissance', 
    description: 'Low-profile scanning to avoid detection',
    tool: 'open-cctv'
  },
];

const countries = [
  { label: 'Ukraine', value: 'ukraine' },
  { label: 'Russia', value: 'russia' },
  { label: 'Georgia', value: 'georgia' },
  { label: 'Romania', value: 'romania' },
  { label: 'United States', value: 'united states' },
  { label: 'United Kingdom', value: 'united kingdom' },
  { label: 'Germany', value: 'germany' },
  { label: 'France', value: 'france' },
  { label: 'China', value: 'china' },
  { label: 'Japan', value: 'japan' }
];

const ComprehensiveCCTVScanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState('config');
  const [selectedOption, setSelectedOption] = useState<string>('country-scan');
  const [targetIP, setTargetIP] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ukraine');
  const [selectedCity, setSelectedCity] = useState('');
  const [bruteforce, setBruteforce] = useState(true);
  const [deepScan, setDeepScan] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<CameraResult[]>([]);
  const [scanStats, setScanStats] = useState<{
    totalScanned: number;
    vulnerableCount: number;
    accessibleCount: number;
    countryBreakdown: Record<string, number>;
  }>({
    totalScanned: 0,
    vulnerableCount: 0,
    accessibleCount: 0,
    countryBreakdown: {}
  });
  
  const { toast } = useToast();

  // Get cities based on selected country
  const cities = getCountryCities(selectedCountry);
  
  const handleScan = async () => {
    if (selectedOption === 'country-scan' && !selectedCountry) {
      toast({
        title: "Error",
        description: "Please select a country to scan",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedOption !== 'country-scan' && !targetIP) {
      toast({
        title: "Error",
        description: "Please enter a target IP or range",
        variant: "destructive"
      });
      return;
    }
    
    setIsScanning(true);
    setResults([]);
    
    try {
      let result;
      
      const selectedOptionObj = scanOptions.find(option => option.value === selectedOption);
      
      switch (selectedOptionObj?.tool) {
        case 'cctv':
          result = await executeCCTV({
            country: selectedCountry,
            region: selectedCountry,
            city: selectedCity,
            limit: 15
          });
          break;
          
        case 'hack-cctv':
          result = await executeHackCCTV({
            target: targetIP || `${selectedCountry}`,
            country: selectedCountry,
            bruteforce,
            deepScan
          });
          break;
          
        case 'eye-pwn':
          result = await executeEyePwn({
            target: targetIP,
            method: 'all',
            bruteforce,
            country: selectedCountry
          });
          break;
          
        case 'ingram':
          result = await executeIngram({
            target: targetIP,
            scanType: deepScan ? 'deep' : 'quick',
            country: selectedCountry
          });
          break;
          
        case 'cam-dumper':
          result = await executeCamDumper({
            target: targetIP,
            method: 'dump',
            country: selectedCountry
          });
          break;
          
        case 'open-cctv':
          result = await executeOpenCCTV({
            target: targetIP,
            scanMode: 'stealth'
          });
          break;
          
        default:
          result = await executeCCTV({
            country: selectedCountry,
            region: selectedCountry,
            limit: 15
          });
      }
      
      if (result?.data?.cameras) {
        setResults(result.data.cameras);
        
        // Calculate statistics
        const cameras = result.data.cameras;
        const vulnerable = cameras.filter(c => c.status === 'vulnerable').length;
        const accessible = cameras.filter(c => c.credentials || c.accessLevel !== 'none').length;
        
        // Count cameras by country
        const countryBreakdown: Record<string, number> = {};
        cameras.forEach(camera => {
          const country = camera.geolocation?.country || camera.location?.country || 'Unknown';
          countryBreakdown[country] = (countryBreakdown[country] || 0) + 1;
        });
        
        setScanStats({
          totalScanned: cameras.length,
          vulnerableCount: vulnerable,
          accessibleCount: accessible,
          countryBreakdown
        });
        
        toast({
          title: "Scan Complete",
          description: `Found ${cameras.length} cameras (${vulnerable} vulnerable)`
        });
        
        // Switch to results tab
        setActiveTab('results');
      } else {
        toast({
          title: "No Results",
          description: "No cameras found with the selected parameters"
        });
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="h-5 w-5 mr-2 text-scanner-primary" />
          Comprehensive CCTV Scanner
        </CardTitle>
        <CardDescription>
          Advanced tool for discovering and analyzing CCTV cameras across multiple countries
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="results">Results ({results.length})</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="config">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300 mb-2 block">Scan Type</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {scanOptions.map((option) => (
                    <Card 
                      key={option.value}
                      className={`bg-scanner-dark border-gray-700 hover:border-scanner-primary/50 cursor-pointer transition-all ${
                        selectedOption === option.value ? 'border-scanner-primary ring-1 ring-scanner-primary' : ''
                      }`}
                      onClick={() => setSelectedOption(option.value)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">{option.label}</div>
                          {selectedOption === option.value && (
                            <Check className="h-4 w-4 text-scanner-primary" />
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedOption === 'country-scan' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-gray-300">Country</Label>
                      <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                        <SelectTrigger id="country" className="bg-scanner-dark">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="bg-scanner-dark border-gray-700">
                          {countries.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-300">City (Optional)</Label>
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger id="city" className="bg-scanner-dark">
                          <SelectValue placeholder="Select city (optional)" />
                        </SelectTrigger>
                        <SelectContent className="bg-scanner-dark border-gray-700">
                          <SelectItem value="">Any City</SelectItem>
                          {cities?.map((city) => (
                            <SelectItem key={city} value={city.toLowerCase()}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="targetIP" className="text-gray-300">Target IP/Range</Label>
                      <Input
                        id="targetIP"
                        placeholder="e.g. 192.168.1.0/24"
                        value={targetIP}
                        onChange={(e) => setTargetIP(e.target.value)}
                        className="bg-scanner-dark"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country-filter" className="text-gray-300">Country Filter (Optional)</Label>
                      <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                        <SelectTrigger id="country-filter" className="bg-scanner-dark">
                          <SelectValue placeholder="Filter by country" />
                        </SelectTrigger>
                        <SelectContent className="bg-scanner-dark border-gray-700">
                          <SelectItem value="">Any Country</SelectItem>
                          {countries.map((country) => (
                            <SelectItem key={country.value} value={country.value}>
                              {country.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="bruteforce" 
                    checked={bruteforce}
                    onCheckedChange={(checked) => setBruteforce(checked === true)}
                  />
                  <Label htmlFor="bruteforce" className="text-gray-300">
                    Attempt credential discovery (when applicable)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="deepScan" 
                    checked={deepScan}
                    onCheckedChange={(checked) => setDeepScan(checked === true)}
                  />
                  <Label htmlFor="deepScan" className="text-gray-300">
                    Deep scan (more thorough but slower)
                  </Label>
                </div>
              </div>
              
              <Button 
                onClick={handleScan}
                disabled={isScanning}
                className="w-full bg-scanner-primary hover:bg-scanner-primary/90"
              >
                {isScanning ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></div>
                    Scanning...
                  </div>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Start Scan
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            <div className="space-y-3">
              {results.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <Card className="bg-scanner-dark border-gray-700">
                      <CardContent className="p-3 flex justify-between items-center">
                        <div>
                          <div className="text-xs text-gray-400">Total</div>
                          <div className="text-xl font-bold">{results.length}</div>
                        </div>
                        <Camera className="h-5 w-5 text-scanner-primary" />
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-scanner-dark border-gray-700">
                      <CardContent className="p-3 flex justify-between items-center">
                        <div>
                          <div className="text-xs text-gray-400">Vulnerable</div>
                          <div className="text-xl font-bold">
                            {results.filter(c => c.status === 'vulnerable').length}
                          </div>
                        </div>
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-scanner-dark border-gray-700">
                      <CardContent className="p-3 flex justify-between items-center">
                        <div>
                          <div className="text-xs text-gray-400">Accessible</div>
                          <div className="text-xl font-bold">
                            {results.filter(c => c.credentials || c.accessLevel !== 'none').length}
                          </div>
                        </div>
                        <Lock className="h-5 w-5 text-green-500" />
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-scanner-dark border-gray-700">
                      <CardContent className="p-3 flex justify-between items-center">
                        <div>
                          <div className="text-xs text-gray-400">Countries</div>
                          <div className="text-xl font-bold">
                            {new Set(results.map(c => 
                              c.geolocation?.country || c.location?.country || 'Unknown'
                            )).size}
                          </div>
                        </div>
                        <Globe className="h-5 w-5 text-blue-500" />
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="max-h-[500px] overflow-y-auto pr-1 space-y-2">
                    {results.map((camera, index) => (
                      <Card 
                        key={index}
                        className="bg-scanner-dark border-gray-700 hover:border-gray-600 transition-colors"
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium flex items-center">
                                <Server className="h-4 w-4 mr-2 text-scanner-primary" />
                                {camera.ip}:{camera.port}
                              </div>
                              <div className="text-sm text-gray-400">
                                {camera.manufacturer || camera.brand || 'Unknown'} {camera.model || 'Camera'}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Badge className={
                                camera.status === 'vulnerable' ? 'bg-red-900/50 text-red-400 hover:bg-red-900' :
                                camera.status === 'online' ? 'bg-green-900/50 text-green-400 hover:bg-green-900' :
                                'bg-gray-800 text-gray-400 hover:bg-gray-700'
                              }>
                                {camera.status}
                              </Badge>
                              
                              {camera.credentials && (
                                <Badge className="bg-blue-900/50 text-blue-400 hover:bg-blue-900">
                                  Credentials
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="flex items-center text-xs text-gray-400">
                              <MapPin className="h-3 w-3 mr-1 text-scanner-primary/70" />
                              {camera.geolocation?.country || camera.location?.country || 'Unknown'}
                              {(camera.geolocation?.city || camera.location?.city) && 
                                `, ${camera.geolocation?.city || camera.location?.city}`
                              }
                            </div>
                            
                            {camera.firmwareVersion && (
                              <div className="flex items-center text-xs text-gray-400">
                                <Server className="h-3 w-3 mr-1 text-scanner-primary/70" />
                                Firmware: {camera.firmwareVersion}
                              </div>
                            )}
                          </div>
                          
                          {camera.credentials && (
                            <div className="mt-2 p-1.5 bg-scanner-dark-alt rounded-sm text-xs flex justify-between items-center">
                              <div>
                                <span className="text-gray-400">Credentials:</span> 
                                {` ${camera.credentials.username}:${camera.credentials.password}`}
                              </div>
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          
                          {camera.vulnerabilities && camera.vulnerabilities.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs text-gray-400 mb-1">Vulnerabilities:</div>
                              <div className="flex flex-wrap gap-1">
                                {camera.vulnerabilities.map((vuln, i) => (
                                  <span 
                                    key={i} 
                                    className={`text-xs px-1.5 py-0.5 rounded ${
                                      vuln.severity === 'critical' ? 'bg-red-950 text-red-400' :
                                      vuln.severity === 'high' ? 'bg-orange-950 text-orange-400' :
                                      vuln.severity === 'medium' ? 'bg-yellow-950 text-yellow-400' :
                                      'bg-blue-950 text-blue-400'
                                    }`}
                                  >
                                    {vuln.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-16 text-center text-gray-400">
                  {isScanning ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin mb-4 h-8 w-8 border-b-2 border-scanner-primary rounded-full"></div>
                      <p>Scanning for cameras...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Camera className="h-12 w-12 mb-3 text-gray-600" />
                      <p>No results to display. Run a scan to find cameras.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            {results.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className="bg-scanner-dark border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Camera Status</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {['online', 'offline', 'vulnerable', 'authenticated'].map(status => {
                          const count = results.filter(c => c.status === status).length;
                          const percentage = (count / results.length) * 100;
                          
                          return (
                            <div key={status} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">{status}</span>
                                <span>{count} ({percentage.toFixed(1)}%)</span>
                              </div>
                              <div className="h-2 bg-scanner-dark-alt rounded overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    status === 'vulnerable' ? 'bg-red-600' :
                                    status === 'online' ? 'bg-green-600' :
                                    status === 'authenticated' ? 'bg-blue-600' :
                                    'bg-gray-600'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-scanner-dark border-gray-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Country Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {Object.entries(scanStats.countryBreakdown).map(([country, count]) => {
                          const percentage = (count / results.length) * 100;
                          
                          return (
                            <div key={country} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400">{country}</span>
                                <span>{count} ({percentage.toFixed(1)}%)</span>
                              </div>
                              <div className="h-2 bg-scanner-dark-alt rounded overflow-hidden">
                                <div 
                                  className={
                                    country === 'Ukraine' ? 'bg-blue-600' :
                                    country === 'Russia' ? 'bg-red-600' :
                                    country === 'Georgia' ? 'bg-orange-600' :
                                    country === 'Romania' ? 'bg-yellow-600' :
                                    'bg-scanner-primary'
                                  }
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="bg-scanner-dark border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Security Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-400">Vulnerable Cameras</div>
                        <div className="flex justify-between items-center">
                          <div className="text-2xl font-bold">{scanStats.vulnerableCount}</div>
                          <div 
                            className={`text-xs px-2 py-1 rounded ${
                              scanStats.vulnerableCount > 5 ? 'bg-red-900/50 text-red-400' :
                              scanStats.vulnerableCount > 0 ? 'bg-yellow-900/50 text-yellow-400' :
                              'bg-green-900/50 text-green-400'
                            }`}
                          >
                            {scanStats.vulnerableCount > 5 ? 'High Risk' :
                             scanStats.vulnerableCount > 0 ? 'Medium Risk' :
                             'Low Risk'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs text-gray-400">Accessible Cameras</div>
                        <div className="flex justify-between items-center">
                          <div className="text-2xl font-bold">{scanStats.accessibleCount}</div>
                          <div 
                            className={`text-xs px-2 py-1 rounded ${
                              scanStats.accessibleCount > 8 ? 'bg-green-900/50 text-green-400' :
                              scanStats.accessibleCount > 3 ? 'bg-blue-900/50 text-blue-400' :
                              'bg-gray-800 text-gray-400'
                            }`}
                          >
                            {scanStats.accessibleCount > 8 ? 'High Access' :
                             scanStats.accessibleCount > 3 ? 'Medium Access' :
                             'Low Access'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-xs text-gray-400">Success Rate</div>
                        <div className="flex justify-between items-center">
                          <div className="text-2xl font-bold">
                            {(scanStats.accessibleCount / scanStats.totalScanned * 100).toFixed(1)}%
                          </div>
                          <div 
                            className={`text-xs px-2 py-1 rounded ${
                              scanStats.accessibleCount / scanStats.totalScanned > 0.5 ? 'bg-green-900/50 text-green-400' :
                              scanStats.accessibleCount / scanStats.totalScanned > 0.2 ? 'bg-blue-900/50 text-blue-400' :
                              'bg-gray-800 text-gray-400'
                            }`}
                          >
                            {scanStats.accessibleCount / scanStats.totalScanned > 0.5 ? 'Excellent' :
                             scanStats.accessibleCount / scanStats.totalScanned > 0.2 ? 'Good' :
                             'Average'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-scanner-dark-alt rounded border border-gray-700">
                      <div className="text-xs font-medium mb-2">Security Recommendations</div>
                      <ul className="text-xs space-y-1.5 text-gray-400">
                        <li className="flex items-start">
                          <ArrowRight className="h-3 w-3 mr-1 mt-0.5 text-scanner-primary" />
                          {scanStats.vulnerableCount > 0 
                            ? `Address ${scanStats.vulnerableCount} vulnerable cameras with default credentials or outdated firmware.`
                            : 'No vulnerable cameras detected. Continue to monitor for new vulnerabilities.'
                          }
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-3 w-3 mr-1 mt-0.5 text-scanner-primary" />
                          {Object.keys(scanStats.countryBreakdown).length > 2
                            ? `Cameras detected across ${Object.keys(scanStats.countryBreakdown).length} countries. Review geographical distribution for security implications.`
                            : 'Cameras located in a limited geographical area. Consider expanding surveillance coverage.'
                          }
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-3 w-3 mr-1 mt-0.5 text-scanner-primary" />
                          {scanStats.accessibleCount > 0
                            ? `${scanStats.accessibleCount} cameras provide access. Ensure proper authentication and encryption.`
                            : 'No accessible cameras detected. Additional reconnaissance may be needed.'
                          }
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="py-16 text-center text-gray-400">
                <Shield className="h-12 w-12 mb-3 mx-auto text-gray-600" />
                <p>Run a scan to view statistics and analysis</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ComprehensiveCCTVScanner;
