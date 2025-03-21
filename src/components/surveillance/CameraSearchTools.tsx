import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Cpu, 
  Globe, 
  Search, 
  Shield, 
  Webhook, 
  Map, 
  User, 
  Scan, 
  Globe2, 
  Flag,
  ArrowRight,
  Link,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { 
  googleDorkSearch,
  getInsecamCountries,
  searchInsecamByCountry,
  searchUsername,
  analyzeWebsite
} from '@/utils/osintUtils';

// Updated search methods to include new OSINT tools
const SEARCH_METHODS = [
  { id: 'searchcam', name: 'SearchCAM', description: 'Google dorks to find camera streams', icon: <Search className="h-4 w-4" /> },
  { id: 'ipcamsearch', name: 'IPCam Protocol', description: 'Search using camera discovery protocols', icon: <Webhook className="h-4 w-4" /> },
  { id: 'cameradar', name: 'Cameradar', description: 'RTSP streams discovery and access', icon: <Shield className="h-4 w-4" /> },
  { id: 'insecam', name: 'InsecamOrg', description: 'Country-based camera search', icon: <Flag className="h-4 w-4" /> },
  { id: 'username', name: 'Username Search', description: 'Find accounts across platforms', icon: <User className="h-4 w-4" /> },
  { id: 'webcheck', name: 'Web Check', description: 'Analyze website security', icon: <Globe2 className="h-4 w-4" /> },
  { id: 'cctvmap', name: 'CCTV Mapper', description: 'Geolocation mapping of cameras', icon: <Map className="h-4 w-4" /> }
];

interface CameraSearchResult {
  id: string;
  type: string;
  source: string;
  content: string;
  timestamp: string;
  meta?: Record<string, any>;
}

const CameraSearchTools: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('searchcam');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<CameraSearchResult[]>([]);
  const [searchProgress, setSearchProgress] = useState(0);
  
  // InsecamOrg specific state
  const [countries, setCountries] = useState<Array<{code: string; country: string; count: number}>>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [insecamPage, setInsecamPage] = useState(1);
  const [totalInsecamPages, setTotalInsecamPages] = useState(1);
  const [insecamCameras, setInsecamCameras] = useState<Array<{
    id: string;
    ip: string;
    port: number;
    previewUrl: string;
    location: string;
    manufacturer?: string;
  }>>([]);
  
  // Google Dork search results
  const [dorkResults, setDorkResults] = useState<Array<{
    id: string;
    title: string;
    url: string;
    snippet: string;
    isCamera: boolean;
  }>>([]);
  
  // Username search results
  const [usernameResults, setUsernameResults] = useState<Array<{
    platform: string;
    url: string;
    exists: boolean;
    username: string;
    note?: string;
  }>>([]);
  
  // Web Check results
  const [webCheckResults, setWebCheckResults] = useState<{
    dns?: Array<{type: string, value: string}>;
    headers?: Record<string, string>;
    technologies?: string[];
    securityHeaders?: Array<{header: string, value: string | null, status: 'good' | 'warning' | 'bad'}>;
    certificates?: {
      issuer: string;
      validFrom: string;
      validTo: string;
      daysRemaining: number;
    } | null;
    ports?: Array<{port: number, service: string, state: 'open' | 'closed' | 'filtered'}>;
  }>({});

  // Load countries list when the InsecamOrg tab is selected
  useEffect(() => {
    if (activeTab === 'insecam' && countries.length === 0) {
      loadInsecamCountries();
    }
  }, [activeTab, countries.length]);

  // Load Insecam countries
  const loadInsecamCountries = async () => {
    setIsSearching(true);
    try {
      const countryList = await getInsecamCountries();
      setCountries(countryList);
      if (countryList.length > 0) {
        setSelectedCountry(countryList[0].code);
      }
    } catch (error) {
      console.error('Error loading countries:', error);
      toast({
        title: "Error",
        description: "Failed to load countries list from Insecam",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Handle searching Insecam by country
  const handleInsecamSearch = async () => {
    if (!selectedCountry) {
      toast({
        title: "Country Required",
        description: "Please select a country to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => Math.min(prev + 5, 95));
    }, 100);
    
    try {
      const result = await searchInsecamByCountry(selectedCountry, insecamPage);
      setInsecamCameras(result.cameras);
      setTotalInsecamPages(result.totalPages);
      
      toast({
        title: "Search Complete",
        description: `Found ${result.cameras.length} cameras in selected country`,
      });
    } catch (error) {
      console.error('Error searching Insecam:', error);
      toast({
        title: "Error",
        description: "Failed to search for cameras by country",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setSearchProgress(100);
      setIsSearching(false);
      
      // Reset progress after animation completes
      setTimeout(() => setSearchProgress(0), 1000);
    }
  };
  
  // Handle Google dork search
  const handleDorkSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setDorkResults([]);
    
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => Math.min(prev + 2, 95));
    }, 100);
    
    try {
      const result = await googleDorkSearch(query);
      setDorkResults(result.results);
      
      toast({
        title: "Search Complete",
        description: `Found ${result.results.length} results for your search`,
      });
    } catch (error) {
      console.error('Error performing dork search:', error);
      toast({
        title: "Error",
        description: "Failed to search with Google dorks",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setSearchProgress(100);
      setIsSearching(false);
      
      // Reset progress after animation completes
      setTimeout(() => setSearchProgress(0), 1000);
    }
  };
  
  // Handle username search
  const handleUsernameSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty Username",
        description: "Please enter a username to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setUsernameResults([]);
    
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => Math.min(prev + 1, 95));
    }, 100);
    
    try {
      const result = await searchUsername(query);
      setUsernameResults(result.results);
      
      const foundCount = result.results.filter(r => r.exists).length;
      
      toast({
        title: "Search Complete",
        description: `Found ${foundCount} accounts for username "${query}"`,
      });
    } catch (error) {
      console.error('Error searching username:', error);
      toast({
        title: "Error",
        description: "Failed to search for username across platforms",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setSearchProgress(100);
      setIsSearching(false);
      
      // Reset progress after animation completes
      setTimeout(() => setSearchProgress(0), 1000);
    }
  };
  
  // Handle website analysis
  const handleWebsiteAnalysis = async () => {
    if (!query.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setWebCheckResults({});
    
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => Math.min(prev + 0.5, 95));
    }, 100);
    
    try {
      const result = await analyzeWebsite(query);
      setWebCheckResults(result);
      
      toast({
        title: "Analysis Complete",
        description: `Website security analysis for ${query} is complete`,
      });
    } catch (error) {
      console.error('Error analyzing website:', error);
      toast({
        title: "Error",
        description: "Failed to analyze website",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setSearchProgress(100);
      setIsSearching(false);
      
      // Reset progress after animation completes
      setTimeout(() => setSearchProgress(0), 1000);
    }
  };

  // Legacy search handler for other tools
  const handleSearch = () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a search term or parameters",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setResults([]);

    // Simulate search process based on active tab
    toast({
      title: "Search Started",
      description: `Executing ${activeTab} search for: ${query}`,
    });

    // Simulate search delay and results
    setTimeout(() => {
      const mockResults = generateMockResults(activeTab, query);
      setResults(mockResults);
      setIsSearching(false);

      toast({
        title: "Search Complete",
        description: `Found ${mockResults.length} results`,
      });
    }, 2500);
  };

  // Generate mock results based on the search method (for legacy tools)
  const generateMockResults = (method: string, searchQuery: string): CameraSearchResult[] => {
    const results: CameraSearchResult[] = [];
    const count = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < count; i++) {
      let result: CameraSearchResult = {
        id: `${method}-${Date.now()}-${i}`,
        type: method,
        source: SEARCH_METHODS.find(m => m.id === method)?.name || method,
        content: '',
        timestamp: new Date().toISOString(),
        meta: {}
      };

      switch (method) {
        case 'searchcam':
          result.content = `http://example${i}.com/cameras/?search=${encodeURIComponent(searchQuery)}`;
          result.meta = {
            matchType: ['title', 'url', 'content'][Math.floor(Math.random() * 3)],
            relevance: (Math.random() * 100).toFixed(1) + '%'
          };
          break;

        case 'ipcamsearch':
          result.content = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}:${[80, 8080, 554, 443][Math.floor(Math.random() * 4)]}`;
          result.meta = {
            protocol: ['ONVIF', 'RTSP', 'HTTP'][Math.floor(Math.random() * 3)],
            manufacturer: ['Hikvision', 'Dahua', 'Axis', 'Bosch'][Math.floor(Math.random() * 4)]
          };
          break;

        case 'cameradar':
          result.content = `rtsp://${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}:554/stream`;
          result.meta = {
            credentials: Math.random() > 0.5 ? 'Found (admin:admin)' : 'Not found',
            routes: ['/live', '/stream', '/h264'][Math.floor(Math.random() * 3)]
          };
          break;

        case 'speedcam':
          result.content = `Camera ${i+1} - ${['Highway', 'Intersection', 'Parking'][Math.floor(Math.random() * 3)]}`;
          result.meta = {
            motionDetected: Math.random() > 0.3 ? 'Yes' : 'No',
            avgSpeed: Math.floor(Math.random() * 120) + ' km/h'
          };
          break;

        case 'cctvmap':
          result.content = `${['New York', 'London', 'Tokyo', 'Berlin', 'Sydney'][Math.floor(Math.random() * 5)]}, ${['USA', 'UK', 'Japan', 'Germany', 'Australia'][Math.floor(Math.random() * 5)]}`;
          result.meta = {
            latitude: (Math.random() * 180 - 90).toFixed(6),
            longitude: (Math.random() * 360 - 180).toFixed(6),
            cameras: Math.floor(Math.random() * 50) + 1
          };
          break;
          
        default:
          result.content = `Result ${i+1} for ${searchQuery}`;
          result.meta = {
            type: 'Unknown',
            relevance: (Math.random() * 100).toFixed(1) + '%'
          };
      }

      results.push(result);
    }

    return results;
  };

  // Helper function to get placeholder text based on search method
  const getPlaceholderForMethod = (method: string): string => {
    switch (method) {
      case 'searchcam':
        return 'intitle:"webcam" OR inurl:"ViewerFrame"';
      case 'ipcamsearch':
        return 'IP range (e.g., 192.168.1.0/24) or specific IP';
      case 'cameradar':
        return 'RTSP target (IP or subnet)';
      case 'insecam':
        return 'Select a country to search for cameras';
      case 'username':
        return 'Enter username to search across platforms';
      case 'webcheck':
        return 'Enter website URL to analyze (e.g., example.com)';
      case 'cctvmap':
        return 'City, country or coordinates';
      default:
        return 'Enter search query...';
    }
  };

  // Handler for search button click based on active tab
  const handleSearchClick = () => {
    switch (activeTab) {
      case 'searchcam':
        handleDorkSearch();
        break;
      case 'insecam':
        handleInsecamSearch();
        break;
      case 'username':
        handleUsernameSearch();
        break;
      case 'webcheck':
        handleWebsiteAnalysis();
        break;
      default:
        handleSearch();
        break;
    }
  };

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Camera className="mr-2" /> Advanced Camera & OSINT Tools
        </CardTitle>
        <CardDescription>
          Multiple methods to discover cameras and gather intelligence
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="searchcam" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-7 mb-6">
            {SEARCH_METHODS.map(method => (
              <TabsTrigger key={method.id} value={method.id} className="flex items-center">
                {method.icon}
                <span className="ml-1 hidden sm:inline">{method.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {SEARCH_METHODS.map(method => (
            <TabsContent key={method.id} value={method.id} className="space-y-4">
              <Alert>
                {method.icon}
                <AlertTitle>{method.name}</AlertTitle>
                <AlertDescription>{method.description}</AlertDescription>
              </Alert>
              
              {/* InsecamOrg country-based search */}
              {method.id === 'insecam' ? (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Select value={selectedCountry} onValueChange={setSelectedCountry} disabled={isSearching}>
                      <SelectTrigger className="bg-scanner-dark border-gray-700 text-white flex-1">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.country} ({country.count} cameras)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleInsecamSearch} 
                      disabled={isSearching || !selectedCountry}
                    >
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </div>
                  
                  {searchProgress > 0 && (
                    <Progress value={searchProgress} className="h-2" />
                  )}
                  
                  {/* InsecamOrg results */}
                  {insecamCameras.length > 0 && (
                    <div className="mt-4 space-y-4">
                      <h3 className="text-lg font-medium border-b border-gray-700 pb-2">
                        Cameras Found in {countries.find(c => c.code === selectedCountry)?.country || selectedCountry}
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {insecamCameras.map(camera => (
                          <div key={camera.id} className="bg-scanner-dark p-3 rounded border border-gray-700">
                            <div className="aspect-video bg-black/30 rounded flex items-center justify-center mb-2 overflow-hidden">
                              <img 
                                src={camera.previewUrl || '/placeholder.svg'} 
                                alt="Camera preview"
                                className="max-w-full max-h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                            </div>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium">{camera.ip}:{camera.port}</p>
                                <p className="text-xs text-gray-400">{camera.location}</p>
                              </div>
                              {camera.manufacturer && (
                                <Badge variant="outline">{camera.manufacturer}</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Pagination for Insecam results */}
                      {totalInsecamPages > 1 && (
                        <div className="flex justify-center mt-4">
                          <Pagination>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (insecamPage > 1) {
                                  setInsecamPage(insecamPage - 1);
                                  handleInsecamSearch();
                                }
                              }}
                              disabled={insecamPage === 1 || isSearching}
                            >
                              Previous
                            </Button>
                            <span className="mx-4 flex items-center">
                              Page {insecamPage} of {totalInsecamPages}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (insecamPage < totalInsecamPages) {
                                  setInsecamPage(insecamPage + 1);
                                  handleInsecamSearch();
                                }
                              }}
                              disabled={insecamPage === totalInsecamPages || isSearching}
                            >
                              Next
                            </Button>
                          </Pagination>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder={getPlaceholderForMethod(method.id)}
                      value={activeTab === method.id ? query : ''}
                      onChange={(e) => setQuery(e.target.value)}
                      className="bg-scanner-dark border-gray-700 text-white"
                    />
                    <Button 
                      onClick={handleSearchClick} 
                      disabled={isSearching}
                    >
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </div>
                  
                  {searchProgress > 0 && (
                    <Progress value={searchProgress} className="h-2" />
                  )}
                </div>
              )}
              
              {/* SearchCAM Google Dork Results */}
              {method.id === 'searchcam' && dorkResults.length > 0 && (
                <div className="mt-4 space-y-4">
                  <h3 className="text-lg font-medium border-b border-gray-700 pb-2">
                    SearchCAM Results ({dorkResults.length})
                  </h3>
                  
                  <div className="space-y-4">
                    {dorkResults.map(result => (
                      <div key={result.id} className="bg-scanner-dark p-4 rounded border border-gray-700">
                        <div className="flex items-center justify-between">
                          <h4 className="text-blue-400 font-medium">{result.title}</h4>
                          {result.isCamera && (
                            <Badge className="bg-green-600 hover:bg-green-700">Likely Camera</Badge>
                          )}
                        </div>
                        
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-gray-300 flex items-center mt-1 hover:underline"
                        >
                          {result.url} <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                        
                        <p className="text-sm mt-2 text-gray-300">{result.snippet}</p>
                        
                        <div className="flex justify-end mt-3">
                          <Button variant="outline" size="sm" className="text-xs">
                            <Link className="h-3 w-3 mr-1" /> Open Stream
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Username Search Results */}
              {method.id === 'username' && usernameResults.length > 0 && (
                <div className="mt-4 space-y-4">
                  <h3 className="text-lg font-medium border-b border-gray-700 pb-2">
                    Platforms for username "{query}" ({usernameResults.filter(r => r.exists).length}/{usernameResults.length})
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {usernameResults.map(result => (
                      <div 
                        key={result.platform} 
                        className={`p-3 rounded border ${
                          result.exists 
                            ? 'border-green-600 bg-green-900/20' 
                            : 'border-gray-700 bg-scanner-dark'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{result.platform}</span>
                          <Badge 
                            variant={result.exists ? "default" : "outline"}
                            className={result.exists ? "bg-green-600" : ""}
                          >
                            {result.exists ? "Found" : "Not Found"}
                          </Badge>
                        </div>
                        
                        {result.exists && (
                          <a 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-blue-400 flex items-center mt-2 hover:underline"
                          >
                            {result.url} <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                        
                        {result.note && (
                          <p className="text-xs text-gray-400 mt-1">{result.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Web Check Results */}
              {method.id === 'webcheck' && webCheckResults.dns && (
                <div className="mt-4 space-y-6">
                  <h3 className="text-lg font-medium border-b border-gray-700 pb-2">
                    Analysis for {query}
                  </h3>
                  
                  {/* DNS Records */}
                  <div className="space-y-2">
                    <h4 className="text-md font-medium">DNS Records</h4>
                    <div className="bg-scanner-dark rounded p-3 border border-gray-700">
                      <div className="grid grid-cols-2 gap-2">
                        {webCheckResults.dns.map((record, index) => (
                          <div key={index} className="text-sm">
                            <span className="text-gray-400">{record.type}:</span> {record.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Security Headers */}
                  {webCheckResults.securityHeaders && (
                    <div className="space-y-2">
                      <h4 className="text-md font-medium">Security Headers</h4>
                      <div className="bg-scanner-dark rounded p-3 border border-gray-700">
                        {webCheckResults.securityHeaders.map((header, index) => (
                          <div key={index} className="mb-2 pb-2 border-b border-gray-700 last:border-b-0 last:mb-0 last:pb-0">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{header.header}</span>
                              <Badge 
                                variant="outline" 
                                className={`
                                  ${header.status === 'good' ? 'border-green-500 text-green-500' : ''}
                                  ${header.status === 'warning' ? 'border-yellow-500 text-yellow-500' : ''}
                                  ${header.status === 'bad' ? 'border-red-500 text-red-500' : ''}
                                `}
                              >
                                {header.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {header.value || 'Not set'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Technologies */}
                  {webCheckResults.technologies && (
                    <div className="space-y-2">
                      <h4 className="text-md font-medium">Technologies</h4>
                      <div className="bg-scanner-dark rounded p-3 border border-gray-700 flex flex-wrap gap-2">
                        {webCheckResults.technologies.map((tech, index) => (
                          <Badge key={index} variant="secondary">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Open Ports */}
                  {webCheckResults.ports && (
                    <div className="space-y-2">
                      <h4 className="text-md font-medium">Ports</h4>
                      <div className="bg-scanner-dark rounded p-3 border border-gray-700">
                        <div className="grid grid-cols-3 gap-2">
                          {webCheckResults.ports.map((port, index) => (
                            <div key={index} className="text-sm">
                              <span className={`
                                ${port.state === 'open' ? 'text-green-500' : ''}
                                ${port.state === 'closed' ? 'text-gray-500' : ''}
                                ${port.state === 'filtered' ? 'text-yellow-500' : ''}
                              `}>
                                {port.port}/{port.service}
                              </span>
                              <span className="text-xs text-gray-400 ml-1">({port.state})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* SSL Certificate */}
                  {webCheckResults.certificates && (
                    <div className="space-y-2">
                      <h4 className="text-md font-medium">SSL Certificate</h4>
                      <div className="bg-scanner-dark rounded p-3 border border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div className="text-sm">
                            <span className="text-gray-400">Issuer:</span> {webCheckResults.certificates.issuer}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">Days Remaining:</span> {webCheckResults.certificates.daysRemaining}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">Valid From:</span> {new Date(webCheckResults.certificates.validFrom).toLocaleDateString()}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">Valid To:</span> {new Date(webCheckResults.certificates.validTo).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Legacy Results */}
              {['ipcamsearch', 'cameradar', 'cctvmap'].includes(method.id) && results.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-medium border-b border-gray-700 pb-2">
                    Search Results ({results.length})
                  </h3>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {results.map(result => (
                      <div 
                        key={result.id} 
                        className="p-3 bg-scanner-dark rounded-md border border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{result.source}</Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(result.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <p className="text-blue-400 break-all">{result.content}</p>
                        
                        {result.meta && Object.keys(result.meta).length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-700 grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(result.meta).map(([key, value]) => (
                              <div key={key}>
                                <span className="text-gray-400">{key}: </span>
                                <span>{value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t border-gray-
