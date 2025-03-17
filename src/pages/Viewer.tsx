
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, Maximize, Minimize, AlertCircle, Shield, Globe, Server, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RtspPlayer from '@/components/RtspPlayer';
import { fetchWhoisData, fetchDnsRecords, checkVulnerabilityDatabase } from '@/utils/osintUtils';

const Viewer = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("stream");
  const [osintData, setOsintData] = useState<{
    whois: Record<string, any> | null;
    dns: Record<string, any>[] | null;
    vulnerabilities: Record<string, any>[] | null;
    isLoading: boolean;
  }>({
    whois: null,
    dns: null,
    vulnerabilities: null,
    isLoading: false
  });
  
  const location = useLocation();
  
  // Parse query parameters
  const searchParams = new URLSearchParams(location.search);
  const streamUrl = searchParams.get('url');
  const cameraName = searchParams.get('name') || 'Camera Stream';
  const ipAddress = searchParams.get('ip') || extractIPFromUrl(streamUrl || '');
  
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
  
  useEffect(() => {
    // Load OSINT data when IP address is available and the OSINT tab is selected
    if (ipAddress && activeTab === 'osint' && !osintData.whois && !osintData.isLoading) {
      loadOsintData(ipAddress);
    }
  }, [ipAddress, activeTab, osintData.whois, osintData.isLoading]);
  
  const loadOsintData = async (ip: string) => {
    setOsintData(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Load data in parallel
      const [whoisData, dnsRecords, vulnerabilityData] = await Promise.all([
        fetchWhoisData(ip),
        fetchDnsRecords(ip),
        checkVulnerabilityDatabase(ip)
      ]);
      
      setOsintData({
        whois: whoisData,
        dns: dnsRecords,
        vulnerabilities: vulnerabilityData,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load OSINT data:', error);
      setOsintData(prev => ({ ...prev, isLoading: false }));
    }
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                
                <Card className="bg-scanner-card border-gray-800 lg:col-span-2">
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
