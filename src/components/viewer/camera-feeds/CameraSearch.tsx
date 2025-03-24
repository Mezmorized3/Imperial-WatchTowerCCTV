import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, RefreshCw, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeCameradar, executeIPCamSearch, executeCCTV } from '@/utils/osintImplementations';
import { CameraResult } from '@/types/scanner';
import { CCTVParams } from '@/utils/types/cameraTypes';
import { getProperStreamUrl } from '@/utils/rtspUtils';

interface CameraSearchProps {
  setCustomRtspUrl: (url: string) => void;
  setActiveTab: (tab: string) => void;
}

const CameraSearch: React.FC<CameraSearchProps> = ({ 
  setCustomRtspUrl, 
  setActiveTab 
}) => {
  const [searchResults, setSearchResults] = useState<CameraResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<string>('cameradar');
  const [searchInput, setSearchInput] = useState<string>('');
  const { toast } = useToast();

  const filterCameras = (cameras: CameraResult[]) => {
    return cameras.filter(camera => {
      const searchTerm = searchInput.toLowerCase();
      
      // Filter by search term
      if (
        searchTerm &&
        !camera.ip.toLowerCase().includes(searchTerm) &&
        !(camera.model?.toLowerCase().includes(searchTerm)) &&
        // Handle undefined manufacturer
        !(camera.manufacturer?.toLowerCase().includes(searchTerm))
      ) {
        return false;
      }

      return true;
    });
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
      
      switch (searchType) {
        case 'cameradar':
          results = await executeCameradar({
            target: searchInput
          });
          break;
        case 'ipcamsearch':
          results = await executeIPCamSearch({
            subnet: searchInput,
            protocols: []
          });
          break;
        case 'cctv':
          const cctvParams: CCTVParams = {
            region: searchInput,
            country: searchInput,
            limit: 10
          };
          results = await executeCCTV(cctvParams);
          break;
        default:
          results = await executeCameradar({
            target: searchInput
          });
      }
      
      if (results && results.data && results.data.cameras) {
        setSearchResults(filterCameras(results.data.cameras));
        toast({
          title: "Search Complete",
          description: `Found ${results.data.cameras.length} camera${results.data.cameras.length !== 1 ? 's' : ''}`
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

  return (
    <>
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
                          {camera.brand || camera.manufacturer || 'Unknown'} {camera.model || 'Camera'}
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
          <p>• For cameras in specific countries, try using their IP ranges</p>
          <p>• Ukrainian cameras often use ports 554 and 80</p>
          <p>• Russian CCTV systems may be found on ports 8000 and 37777</p>
        </CardContent>
      </Card>
    </>
  );
};

export default CameraSearch;
