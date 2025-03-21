
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Camera, Cpu, Globe, Search, Shield, Webhook } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock data for demonstration
const SEARCH_METHODS = [
  { id: 'searchcam', name: 'SearchCAM', description: 'Google dorks to find camera streams' },
  { id: 'ipcamsearch', name: 'IPCam Protocol', description: 'Search using camera discovery protocols' },
  { id: 'cameradar', name: 'Cameradar', description: 'RTSP streams discovery and access' },
  { id: 'speedcam', name: 'SpeedCam', description: 'Motion detection and speed camera simulation' },
  { id: 'cctvmap', name: 'CCTV Mapper', description: 'Geolocation mapping of cameras' }
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

  // Generate mock results based on the search method
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
      }

      results.push(result);
    }

    return results;
  };

  // Helper function to get the appropriate icon based on method id
  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'searchcam':
        return <Search className="h-4 w-4" />;
      case 'ipcamsearch':
        return <Webhook className="h-4 w-4" />;
      case 'cameradar':
        return <Shield className="h-4 w-4" />;
      case 'speedcam':
        return <Cpu className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Camera className="mr-2" /> Advanced Camera Search Tools
        </CardTitle>
        <CardDescription>
          Multiple methods to discover and analyze camera systems
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="searchcam" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-6">
            {SEARCH_METHODS.map(method => (
              <TabsTrigger key={method.id} value={method.id}>
                {method.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {SEARCH_METHODS.map(method => (
            <TabsContent key={method.id} value={method.id} className="space-y-4">
              <Alert>
                {getMethodIcon(method.id)}
                <AlertTitle>{method.name}</AlertTitle>
                <AlertDescription>{method.description}</AlertDescription>
              </Alert>
              
              <div className="flex space-x-2">
                <Input
                  placeholder={getPlaceholderForMethod(method.id)}
                  value={activeTab === method.id ? query : ''}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-scanner-dark border-gray-700 text-white"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching}
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Results section */}
        {results.length > 0 && (
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
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 pt-4">
        <p className="text-xs text-gray-400">
          These tools simulate functionality inspired by various GitHub projects. Results are simulated for demonstration purposes.
        </p>
      </CardFooter>
    </Card>
  );
};

// Helper function to get placeholder text based on search method
function getPlaceholderForMethod(method: string): string {
  switch (method) {
    case 'searchcam':
      return 'intitle:"webcam" OR inurl:"ViewerFrame"';
    case 'ipcamsearch':
      return 'IP range (e.g., 192.168.1.0/24) or specific IP';
    case 'cameradar':
      return 'RTSP target (IP or subnet)';
    case 'speedcam':
      return 'Location or camera ID';
    case 'cctvmap':
      return 'City, country or coordinates';
    default:
      return 'Enter search query...';
  }
}

export default CameraSearchTools;
