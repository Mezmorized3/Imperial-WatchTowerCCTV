
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, Maximize, Minimize, AlertCircle, Shield, Globe, Server, Database, MapPin, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RtspPlayer from '@/components/RtspPlayer';
import { 
  fetchWhoisData, 
  fetchDnsRecords, 
  checkVulnerabilityDatabase,
  queryZoomEyeApi,
  getComprehensiveOsintData,
  getRandomGeoLocation
} from '@/utils/osintUtils';
import { toast } from '@/components/ui/use-toast';

// Helper function to extract IP from URL
const extractIPFromUrl = (url: string): string => {
  try {
    if (!url) return '';
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    // Try to extract using regex if URL parsing fails
    const ipMatch = url.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
    return ipMatch ? ipMatch[1] : '';
  }
};

const Viewer = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("stream");
  const [isLoadingComprehensive, setIsLoadingComprehensive] = useState(false);
  const [osintData, setOsintData] = useState<{
    whois: Record<string, any> | null;
    dns: Record<string, any>[] | null;
    vulnerabilities: Record<string, any>[] | null;
    zoomEye: Record<string, any> | null;
    geolocation: { lat: number; lng: number; accuracy: string } | null;
    isLoading: boolean;
    comprehensive: boolean;
  }>({
    whois: null,
    dns: null,
    vulnerabilities: null,
    zoomEye: null,
    geolocation: null,
    isLoading: false,
    comprehensive: false
  });
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Parse query parameters
  const searchParams = new URLSearchParams(location.search);
  const streamUrl = searchParams.get('url');
  const cameraName = searchParams.get('name') || 'Camera Stream';
  const ipAddress = searchParams.get('ip') || extractIPFromUrl(streamUrl || '');
  
  useEffect(() => {
    // Load OSINT data when IP address is available and the OSINT tab is selected
    if (ipAddress && activeTab === 'osint' && !osintData.whois && !osintData.isLoading) {
      loadOsintData(ipAddress);
    }
    
    // Initialize the map when the active tab is osint and we have geolocation data
    if (activeTab === 'osint' && osintData.geolocation && mapContainerRef.current) {
      initializeMap(osintData.geolocation);
    }
    
    // Handle hash in URL for direct tab access
    const hash = location.hash?.substring(1);
    if (hash && ['stream', 'osint', 'technical'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [ipAddress, activeTab, osintData.whois, osintData.isLoading, osintData.geolocation]);
  
  const loadOsintData = async (ip: string) => {
    setOsintData(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Load data in parallel
      const [whoisData, dnsRecords, vulnerabilityData, zoomEyeData] = await Promise.all([
        fetchWhoisData(ip),
        fetchDnsRecords(ip),
        checkVulnerabilityDatabase(ip),
        queryZoomEyeApi(ip)
      ]);
      
      // Extract geolocation from ZoomEye data
      const geolocation = zoomEyeData.Geolocation || null;
      
      setOsintData({
        whois: whoisData,
        dns: dnsRecords,
        vulnerabilities: vulnerabilityData,
        zoomEye: zoomEyeData,
        geolocation: geolocation,
        isLoading: false,
        comprehensive: false
      });
      
      // Initialize map if we have geolocation data
      if (geolocation && mapContainerRef.current) {
        initializeMap(geolocation);
      }
    } catch (error) {
      console.error('Failed to load OSINT data:', error);
      setOsintData(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Error Loading Data",
        description: "Failed to load OSINT data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const loadComprehensiveData = async () => {
    if (!ipAddress) return;
    
    setIsLoadingComprehensive(true);
    
    try {
      const data = await getComprehensiveOsintData(ipAddress);
      
      setOsintData({
        whois: data.whois,
        dns: data.dns,
        vulnerabilities: data.vulnerabilities,
        zoomEye: data.zoomEye,
        geolocation: data.geolocation,
        isLoading: false,
        comprehensive: true
      });
      
      toast({
        title: "Data Loaded",
        description: "Comprehensive OSINT data loaded successfully.",
      });
      
      // Initialize map with new data
      if (data.geolocation && mapContainerRef.current) {
        initializeMap(data.geolocation);
      }
    } catch (error) {
      console.error('Failed to load comprehensive data:', error);
      toast({
        title: "Error",
        description: "Failed to load comprehensive data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingComprehensive(false);
    }
  };
  
  const initializeMap = (geoData: { lat: number; lng: number; accuracy: string }) => {
    if (!mapContainerRef.current) return;
    
    // Clear previous map content
    mapContainerRef.current.innerHTML = '';
    
    // In a real app, we would use a mapping library like Leaflet or Google Maps
    // For this demo, we'll create a simple visualization
    
    // Map container
    const mapContainer = document.createElement('div');
    mapContainer.className = 'relative w-full h-full bg-gray-800 rounded overflow-hidden';
    
    // Map background (world map representation)
    const mapBackground = document.createElement('div');
    mapBackground.className = 'absolute inset-0 opacity-30';
    mapBackground.style.backgroundImage = 'url("https://cdn.pixabay.com/photo/2013/07/12/17/58/world-map-152299_1280.png")';
    mapBackground.style.backgroundSize = 'cover';
    mapBackground.style.backgroundPosition = 'center';
    
    // Create pin for camera location
    const pin = document.createElement('div');
    pin.className = 'absolute w-4 h-4 bg-scanner-danger rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse';
    pin.style.boxShadow = '0 0 0 rgba(236, 72, 153, 0.4)';
    
    // Accuracy circle
    const accuracyCircle = document.createElement('div');
    accuracyCircle.className = 'absolute rounded-full border-2 border-scanner-danger bg-scanner-danger/10 animate-pulse-slow transform -translate-x-1/2 -translate-y-1/2';
    
    // Set size based on accuracy
    const circleSize = geoData.accuracy === 'High' ? 30 : geoData.accuracy === 'Medium' ? 50 : 80;
    accuracyCircle.style.width = `${circleSize}px`;
    accuracyCircle.style.height = `${circleSize}px`;
    
    // Position elements on the "map"
    // Note: In a real map implementation, we would convert lat/lng to x/y coordinates
    // For this demo, we'll use a simplified approach
    
    // Convert lat/lng to rough x/y coordinates for our demo map
    // These are very approximate and just for visualization purposes
    const mapWidth = mapContainerRef.current.clientWidth;
    const mapHeight = mapContainerRef.current.clientHeight;
    
    // Roughly transform coordinates to fit our container
    // Real maps would use proper projections
    const x = ((geoData.lng + 180) / 360) * mapWidth;
    const y = ((90 - geoData.lat) / 180) * mapHeight;
    
    pin.style.left = `${x}px`;
    pin.style.top = `${y}px`;
    
    accuracyCircle.style.left = `${x}px`;
    accuracyCircle.style.top = `${y}px`;
    
    // Add info panel
    const infoPanel = document.createElement('div');
    infoPanel.className = 'absolute bottom-4 left-4 right-4 bg-gray-900/90 p-3 rounded text-white text-sm';
    infoPanel.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-scanner-danger rounded-full"></span>
        <span class="font-medium">Camera Location</span>
        <span class="ml-auto text-xs bg-gray-800 px-2 py-1 rounded">Accuracy: ${geoData.accuracy}</span>
      </div>
      <div class="mt-1 font-mono text-xs">Lat: ${geoData.lat.toFixed(4)}, Lng: ${geoData.lng.toFixed(4)}</div>
    `;
    
    // Add disclaimer
    const disclaimer = document.createElement('div');
    disclaimer.className = 'absolute top-2 right-2 bg-gray-900/70 text-xs text-gray-400 px-2 py-1 rounded';
    disclaimer.textContent = 'Demo Map - Not using real mapping API';
    
    // Assemble map
    mapContainer.appendChild(mapBackground);
    mapContainer.appendChild(accuracyCircle);
    mapContainer.appendChild(pin);
    mapContainer.appendChild(infoPanel);
    mapContainer.appendChild(disclaimer);
    
    mapContainerRef.current.appendChild(mapContainer);
  };
  
  const handleFullScreen = () => {
    const viewer = document.getElementById('stream-viewer');
    
    if (!isFullScreen) {
      if (viewer?.requestFullscreen) {
        viewer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullScreen(!isFullScreen);
  };
  
  // Handle fullscreen change events from browser API
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);
  
  const handleStreamError = (error: string) => {
    setStreamError(error);
    setIsStreamReady(false);
  };
  
  const handleStreamReady = () => {
    setStreamError(null);
    setIsStreamReady(true);
  };
  
  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <header className="bg-scanner-card border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <a href="/">
                <ArrowLeft className="h-5 w-5" />
              </a>
            </Button>
            <h1 className="text-lg font-medium flex items-center gap-2">
              <Camera className="h-5 w-5 text-scanner-primary" />
              {cameraName}
            </h1>
            <Badge className="bg-scanner-primary">
              {streamUrl?.startsWith('rtsp://') ? 'RTSP Stream' : 'HTTP Stream'}
            </Badge>
            {ipAddress && (
              <Badge variant="outline" className="text-gray-300">
                IP: {ipAddress}
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleFullScreen}>
              {isFullScreen ? (
                <>
                  <Minimize className="h-4 w-4 mr-1" />
                  Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize className="h-4 w-4 mr-1" />
                  Fullscreen
                </>
              )}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        {streamUrl?.includes('example.com') && (
          <Alert className="mb-4 border-yellow-600 bg-yellow-900/30">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-200">
              You're trying to connect to a demo proxy that doesn't exist. The player will automatically use a public demo stream instead.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="stream" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-scanner-card border-gray-800">
            <TabsTrigger value="stream">Stream View</TabsTrigger>
            <TabsTrigger value="osint">OSINT Data</TabsTrigger>
            <TabsTrigger value="technical">Technical Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stream" className="space-y-4">
            <div id="stream-viewer" className="bg-black rounded-lg shadow-lg overflow-hidden aspect-video relative">
              {streamUrl ? (
                <RtspPlayer 
                  rtspUrl={streamUrl} 
                  onError={handleStreamError}
                  onStreamReady={handleStreamReady}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-400">No stream URL provided</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="osint" className="space-y-4">
            {ipAddress ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Database className="h-5 w-5 text-scanner-primary" />
                    OSINT Intelligence
                  </h2>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={loadComprehensiveData}
                    disabled={isLoadingComprehensive}
                  >
                    {isLoadingComprehensive ? (
                      <>Loading Comprehensive Data...</>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-1" />
                        Load Comprehensive Data
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Map view */}
                <Card className="bg-scanner-card border-gray-800 overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-scanner-danger" />
                      <CardTitle className="text-lg">Geolocation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-[300px] bg-gray-900 rounded relative overflow-hidden" ref={mapContainerRef}>
                      {osintData.isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-gray-400">Loading map data...</p>
                        </div>
                      ) : !osintData.geolocation ? (
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <MapPin className="h-10 w-10 text-gray-600 mb-2" />
                          <p className="text-gray-400">No geolocation data available</p>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* ZoomEye Data */}
                  <Card className="bg-scanner-card border-gray-800">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <svg 
                          className="h-5 w-5 text-scanner-primary" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="12" r="4" />
                          <line x1="21.17" y1="8" x2="12" y2="8" />
                          <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
                          <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
                        </svg>
                        <CardTitle className="text-lg">ZoomEye Intelligence</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {osintData.isLoading ? (
                        <div className="text-center py-4">
                          <p className="text-gray-400">Loading ZoomEye data...</p>
                        </div>
                      ) : osintData.zoomEye ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(osintData.zoomEye).filter(([key]) => key !== 'Geolocation').map(([key, value]) => (
                              <div key={key} className="space-y-1">
                                <p className="text-xs text-gray-400">{key}</p>
                                <p className="font-mono text-sm break-words">{String(value)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-400">No ZoomEye data available</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mt-2"
                            onClick={() => loadOsintData(ipAddress)}
                          >
                            Refresh Data
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-scanner-card border-gray-800">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-scanner-primary" />
                        <CardTitle className="text-lg">WHOIS Information</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {osintData.isLoading ? (
                        <div className="text-center py-4">
                          <p className="text-gray-400">Loading WHOIS data...</p>
                        </div>
                      ) : osintData.whois ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(osintData.whois).map(([key, value]) => (
                              <div key={key} className="space-y-1">
                                <p className="text-xs text-gray-400">{key}</p>
                                <p className="font-mono text-sm break-words">{String(value)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-400">No WHOIS data available</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mt-2"
                            onClick={() => loadOsintData(ipAddress)}
                          >
                            Refresh Data
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-scanner-card border-gray-800">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Server className="h-5 w-5 text-scanner-primary" />
                        <CardTitle className="text-lg">DNS Records</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {osintData.isLoading ? (
                        <div className="text-center py-4">
                          <p className="text-gray-400">Loading DNS records...</p>
                        </div>
                      ) : osintData.dns && osintData.dns.length > 0 ? (
                        <div className="space-y-2">
                          {osintData.dns.map((record, index) => (
                            <div key={index} className="bg-gray-800 p-2 rounded">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">{record.type}</span>
                                <Badge variant="outline">{record.name}</Badge>
                              </div>
                              <p className="font-mono text-xs mt-1">{record.value}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-400">No DNS records found</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-scanner-card border-gray-800">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-scanner-danger" />
                        <CardTitle className="text-lg">Vulnerability Analysis</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {osintData.isLoading ? (
                        <div className="text-center py-4">
                          <p className="text-gray-400">Checking vulnerability databases...</p>
                        </div>
                      ) : osintData.vulnerabilities && osintData.vulnerabilities.length > 0 ? (
                        <div className="space-y-3">
                          {osintData.vulnerabilities.map((vuln, index) => (
                            <div key={index} className="bg-scanner-danger/10 border border-scanner-danger/20 rounded p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{vuln.name}</h3>
                                  <p className="text-sm text-gray-300 mt-1">{vuln.description}</p>
                                </div>
                                <Badge className={
                                  vuln.severity === 'critical' ? 'bg-scanner-danger' :
                                  vuln.severity === 'high' ? 'bg-red-500' :
                                  vuln.severity === 'medium' ? 'bg-scanner-warning' : 'bg-blue-500'
                                }>
                                  {vuln.severity}
                                </Badge>
                              </div>
                              {vuln.cve && (
                                <div className="mt-2 pt-2 border-t border-gray-700">
                                  <a 
                                    href={`https://nvd.nist.gov/vuln/detail/${vuln.cve}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-scanner-primary hover:underline"
                                  >
                                    {vuln.cve} - View in NVD Database
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-400">No known vulnerabilities found</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <AlertCircle className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                <p className="text-lg text-gray-400">No IP address available for OSINT analysis</p>
                <p className="text-sm text-gray-500 mt-1">An IP address is required to perform OSINT operations</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="technical" className="space-y-4">
            <div className="bg-scanner-card border border-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Stream URL</p>
                  <p className="font-mono bg-gray-800 p-2 rounded mt-1 text-sm break-all">
                    {streamUrl || 'No URL provided'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Connection Type</p>
                  <p className="mt-1">
                    {streamUrl?.startsWith('rtsp://') 
                      ? 'RTSP Stream (via HLS proxy)' 
                      : streamUrl?.includes('.m3u8') 
                        ? 'HLS Stream (direct)' 
                        : 'HTTP Stream'}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-500 text-sm">Technical Information</p>
                <p className="mt-1 text-sm">
                  {streamError 
                    ? 'There was an issue connecting to the specified stream. A fallback demo stream is being used instead.' 
                    : isStreamReady
                      ? 'Stream connection established successfully.' 
                      : 'This viewer attempts to connect directly to camera streams. Some streams may require specific network access or credentials to function properly.'}
                </p>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-500 text-sm">Network Information</p>
                <div className="bg-gray-800 p-2 rounded mt-1">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="text-gray-400 pr-4 py-1">IP Address:</td>
                        <td className="font-mono">{ipAddress || 'Unknown'}</td>
                      </tr>
                      <tr>
                        <td className="text-gray-400 pr-4 py-1">Port:</td>
                        <td className="font-mono">
                          {(() => {
                            try {
                              if (streamUrl) {
                                const url = new URL(streamUrl);
                                return url.port || (url.protocol === 'https:' ? '443' : '80');
                              }
                              return 'Unknown';
                            } catch {
                              return 'Unknown';
                            }
                          })()}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-gray-400 pr-4 py-1">Protocol:</td>
                        <td className="font-mono">
                          {streamUrl?.startsWith('rtsp://') 
                            ? 'RTSP' 
                            : streamUrl?.startsWith('https://') 
                              ? 'HTTPS' 
                              : streamUrl?.startsWith('http://') 
                                ? 'HTTP' 
                                : 'Unknown'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Viewer;
