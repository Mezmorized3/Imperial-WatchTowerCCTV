
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Monitor, Video, Play, Plus, Eye, Camera, Settings, Save, RefreshCw } from 'lucide-react';
import RtspPlayer from '@/components/RtspPlayer';
import { CameraResult } from '@/types/scanner';
import { getProperStreamUrl, testRtspConnection, startRecording, stopRecording, detectMotion } from '@/utils/rtspUtils';
import { useToast } from '@/hooks/use-toast';
import { executeCameradar, executeIPCamSearch, executeCCTV } from '@/utils/osintImplementations';

interface VideoFeedsProps {
  cameras: CameraResult[];
}

const VideoFeeds: React.FC<VideoFeedsProps> = ({ cameras }) => {
  const [selectedCamera, setSelectedCamera] = useState<CameraResult | null>(null);
  const [customRtspUrl, setCustomRtspUrl] = useState<string>('');
  const [showCustomStream, setShowCustomStream] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('cameralist');
  const [savedFeeds, setSavedFeeds] = useState<{ name: string; url: string }[]>([]);
  const [newFeedName, setNewFeedName] = useState<string>('');
  const [searchResults, setSearchResults] = useState<CameraResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<string>('cameradar');
  const [searchInput, setSearchInput] = useState<string>('');
  const { toast } = useToast();

  // Load saved feeds from localStorage on component mount
  useEffect(() => {
    const savedFeedsData = localStorage.getItem('savedVideoFeeds');
    if (savedFeedsData) {
      try {
        setSavedFeeds(JSON.parse(savedFeedsData));
      } catch (e) {
        console.error('Error loading saved feeds:', e);
      }
    }
  }, []);

  // Function to generate proper RTSP URL for the camera
  const getCameraStreamUrl = (camera: CameraResult): string => {
    return getProperStreamUrl({
      brand: camera.brand,
      ip: camera.ip,
      credentials: camera.credentials
    });
  };

  const handleCustomStreamPlay = () => {
    if (!customRtspUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid RTSP URL",
        variant: "destructive"
      });
      return;
    }
    setSelectedCamera(null);
    setShowCustomStream(true);
  };

  const handleSaveFeed = () => {
    if (!customRtspUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid RTSP URL to save",
        variant: "destructive"
      });
      return;
    }

    const feedName = newFeedName || `Feed ${savedFeeds.length + 1}`;
    const newSavedFeeds = [...savedFeeds, { name: feedName, url: customRtspUrl }];
    setSavedFeeds(newSavedFeeds);
    localStorage.setItem('savedVideoFeeds', JSON.stringify(newSavedFeeds));
    
    toast({
      title: "Feed Saved",
      description: `Feed "${feedName}" has been saved to your list`
    });
    
    setNewFeedName('');
  };

  const handleLoadSavedFeed = (url: string) => {
    setCustomRtspUrl(url);
    setShowCustomStream(true);
    setSelectedCamera(null);
  };

  const handleSearch = async () => {
    if (!searchInput) {
      toast({
        title: "Error",
        description: "Please enter an IP address or range to search",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    
    try {
      let results: any;
      
      // Use the appropriate search function based on the selected type
      switch (searchType) {
        case 'cameradar':
          results = await executeCameradar(searchInput);
          break;
        case 'ipcamsearch':
          results = await executeIPCamSearch(searchInput);
          break;
        case 'cctv':
          results = await executeCCTV(searchInput);
          break;
        default:
          results = await executeCameradar(searchInput);
      }
      
      if (results && results.cameras) {
        setSearchResults(results.cameras);
        toast({
          title: "Search Complete",
          description: `Found ${results.cameras.length} camera${results.cameras.length !== 1 ? 's' : ''}`
        });
      } else {
        toast({
          title: "Search Complete",
          description: "No cameras found"
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: error instanceof Error ? error.message : 'Failed to search for cameras',
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleTestConnection = async () => {
    if (!customRtspUrl) {
      toast({
        title: "Error",
        description: "Please enter a RTSP URL to test",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Testing Connection",
      description: "Please wait while we test the connection..."
    });
    
    try {
      const isConnected = await testRtspConnection(customRtspUrl);
      
      if (isConnected) {
        toast({
          title: "Connection Successful",
          description: "The RTSP stream is accessible"
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to the RTSP stream",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Test Error",
        description: error instanceof Error ? error.message : 'Error testing connection',
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="cameralist">
            <Camera className="h-4 w-4 mr-2" />
            Camera List
          </TabsTrigger>
          <TabsTrigger value="customstream">
            <Video className="h-4 w-4 mr-2" />
            Custom Stream
          </TabsTrigger>
          <TabsTrigger value="search">
            <Eye className="h-4 w-4 mr-2" />
            Find Cameras
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="cameralist">
          {!selectedCamera ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cameras.map((camera, index) => (
                <Card 
                  key={index} 
                  className="bg-scanner-dark-alt border-gray-700 hover:border-gray-600 cursor-pointer transition-colors"
                  onClick={() => setSelectedCamera(camera)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-scanner-dark flex items-center justify-center">
                        <Video className="h-4 w-4 text-scanner-info" />
                      </div>
                      <div>
                        <h3 className="font-medium">{camera.ip}</h3>
                        <p className="text-sm text-gray-400">
                          {camera.brand} {camera.model}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span 
                          className={`inline-block w-3 h-3 rounded-full ${
                            camera.status === "online" ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {cameras.length === 0 && (
                <div className="col-span-full text-center p-6 bg-scanner-dark-alt border border-gray-700 rounded-md">
                  <Video className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400">No cameras found in your network.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Try using the "Find Cameras" tab to discover cameras.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <Card className="bg-scanner-dark-alt border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-medium">
                  <div className="flex items-center">
                    <Monitor className="mr-2 h-4 w-4 text-scanner-info" />
                    {selectedCamera.ip}
                    <span className="ml-2 text-xs text-gray-400">
                      {selectedCamera.brand} {selectedCamera.model}
                    </span>
                  </div>
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedCamera(null)}
                >
                  Back to List
                </Button>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="aspect-video bg-black rounded-md overflow-hidden">
                  <RtspPlayer 
                    rtspUrl={getCameraStreamUrl(selectedCamera)} 
                    autoPlay={true}
                    onError={(error) => console.error("Stream error:", error)}
                  />
                </div>
                <div className="mt-4 text-sm text-gray-400 space-y-2">
                  <p>
                    <span className="font-semibold">IP:</span> {selectedCamera.ip}
                    {selectedCamera.port && <span className="ml-1">:{selectedCamera.port}</span>}
                  </p>
                  {selectedCamera.location && typeof selectedCamera.location === 'string' && (
                    <p><span className="font-semibold">Location:</span> {selectedCamera.location}</p>
                  )}
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span className={selectedCamera.status === "online" ? "text-green-500" : "text-red-500"}>
                      {selectedCamera.status}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="customstream">
          {!showCustomStream ? (
            <>
              <Card className="bg-scanner-dark-alt border-gray-700 mb-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-md font-medium">Custom RTSP Stream</CardTitle>
                </CardHeader>
                <CardContent className="pt-2 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      placeholder="Enter RTSP URL (e.g. rtsp://admin:admin@192.168.1.100:554/Streaming/Channels/101)"
                      value={customRtspUrl}
                      onChange={(e) => setCustomRtspUrl(e.target.value)}
                      className="flex-grow"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleCustomStreamPlay}>
                        <Play className="h-4 w-4 mr-2" />
                        Play Stream
                      </Button>
                      <Button variant="outline" onClick={handleTestConnection}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Test
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-gray-700">
                    <Input
                      placeholder="Enter a name for this feed"
                      value={newFeedName}
                      onChange={(e) => setNewFeedName(e.target.value)}
                      className="flex-grow"
                    />
                    <Button variant="secondary" onClick={handleSaveFeed}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Feed
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {savedFeeds.length > 0 && (
                <Card className="bg-scanner-dark-alt border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">Saved Feeds</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedFeeds.map((feed, index) => (
                        <Card 
                          key={index} 
                          className="bg-scanner-dark border-gray-700 hover:border-gray-600 cursor-pointer transition-colors"
                          onClick={() => handleLoadSavedFeed(feed.url)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-scanner-dark-alt flex items-center justify-center">
                                <Video className="h-4 w-4 text-scanner-info" />
                              </div>
                              <div>
                                <h3 className="font-medium">{feed.name}</h3>
                                <p className="text-sm text-gray-400 truncate max-w-[200px]">
                                  {feed.url}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="bg-scanner-dark-alt border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-medium">
                  <div className="flex items-center">
                    <Monitor className="mr-2 h-4 w-4 text-scanner-info" />
                    Custom RTSP Stream
                  </div>
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowCustomStream(false)}
                >
                  Back to Input
                </Button>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="aspect-video bg-black rounded-md overflow-hidden">
                  <RtspPlayer 
                    rtspUrl={customRtspUrl} 
                    autoPlay={true}
                    onError={(error) => console.error("Stream error:", error)}
                  />
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  <p><span className="font-semibold">URL:</span> {customRtspUrl}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="search">
          <Card className="bg-scanner-dark-alt border-gray-700 mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium">Find RTSP Cameras</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-grow space-y-2">
                  <Input
                    placeholder="Enter IP address or range (e.g. 192.168.1.0/24)"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full"
                  />
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select search method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cameradar">Cameradar (RTSP brute-force)</SelectItem>
                      <SelectItem value="ipcamsearch">IPCamSearch (Web interface)</SelectItem>
                      <SelectItem value="cctv">CCTV Scanner (Stream discovery)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="self-start">
                  <Button onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Search Cameras
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {searchResults.map((camera, index) => (
                    <Card 
                      key={index} 
                      className="bg-scanner-dark border-gray-700 hover:border-gray-600 cursor-pointer transition-colors"
                      onClick={() => {
                        const streamUrl = getProperStreamUrl(camera);
                        setCustomRtspUrl(streamUrl);
                        setActiveTab('customstream');
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-scanner-dark-alt flex items-center justify-center">
                            <Video className="h-4 w-4 text-scanner-info" />
                          </div>
                          <div>
                            <h3 className="font-medium">{camera.ip}</h3>
                            <p className="text-sm text-gray-400">
                              {camera.brand || 'Unknown'} {camera.model || 'Camera'}
                            </p>
                            {camera.credentials && (
                              <p className="text-xs text-green-500">
                                Credentials found: {camera.credentials.username}:{camera.credentials.password}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : isSearching ? (
                <div className="text-center p-8">
                  <div className="animate-spin inline-block h-8 w-8 border-b-2 border-scanner-info rounded-full mb-2"></div>
                  <p className="text-gray-400">Searching for cameras on the network...</p>
                </div>
              ) : searchInput ? (
                <div className="text-center p-8 border border-gray-700 rounded-lg">
                  <p className="text-gray-400">
                    {searchResults.length === 0 ? 'No cameras found. Try a different network range or search method.' : ''}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
          
          <Card className="bg-scanner-dark-alt border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-medium">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-400 space-y-2">
              <p>• Common camera networks are on 192.168.1.0/24 or 10.0.0.0/24</p>
              <p>• Most cameras use ports 554, 80, or 8080</p>
              <p>• Try different search methods if one doesn't find your camera</p>
              <p>• Check camera documentation for default credentials</p>
              <p>• Common usernames: admin, root, user</p>
              <p>• Common passwords: admin, password, 12345, blank</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VideoFeeds;
