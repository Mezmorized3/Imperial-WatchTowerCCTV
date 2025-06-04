
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { executeCameraScan } from '@/utils/osintUtilsConnector';
import { Camera, MapPin, Eye } from 'lucide-react';

interface IPCamSearchToolProps {
  onCamerasFound?: (cameras: any[]) => void;
}

const IPCamSearchTool: React.FC<IPCamSearchToolProps> = ({ onCamerasFound }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [country, setCountry] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!searchQuery) {
      toast({
        title: "Search Query Required",
        description: "Please enter a search query",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setResults([]);

    try {
      const result = await executeCameraScan({
        tool: 'cameraScan',
        target: searchQuery,
        country,
        manufacturer,
        timeout: 30
      });

      if (result.success) {
        const cameras = result.data.results?.cameras || [];
        setResults(cameras);
        
        if (onCamerasFound) {
          onCamerasFound(cameras);
        }
        
        toast({
          title: "Search Complete",
          description: `Found ${cameras.length} cameras`
        });
      } else {
        toast({
          title: "Search Failed", 
          description: result.error || "Failed to search for cameras",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Camera search error:", error);
      toast({
        title: "Search Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-gray-700 bg-scanner-dark shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="h-5 w-5 text-scanner-success mr-2" />
            IP Camera Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="search-query">Search Query</Label>
            <Input
              id="search-query"
              placeholder="Enter search terms (e.g., webcam, surveillance, RTSP)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country (Optional)</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country" className="bg-scanner-dark-alt border-gray-700">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark border-gray-700">
                  <SelectItem value="">Any Country</SelectItem>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CN">China</SelectItem>
                  <SelectItem value="RU">Russia</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="JP">Japan</SelectItem>
                  <SelectItem value="KR">South Korea</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="manufacturer">Manufacturer (Optional)</Label>
              <Select value={manufacturer} onValueChange={setManufacturer}>
                <SelectTrigger id="manufacturer" className="bg-scanner-dark-alt border-gray-700">
                  <SelectValue placeholder="Select manufacturer" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark border-gray-700">
                  <SelectItem value="">Any Manufacturer</SelectItem>
                  <SelectItem value="Hikvision">Hikvision</SelectItem>
                  <SelectItem value="Dahua">Dahua</SelectItem>
                  <SelectItem value="Axis">Axis</SelectItem>
                  <SelectItem value="Bosch">Bosch</SelectItem>
                  <SelectItem value="Sony">Sony</SelectItem>
                  <SelectItem value="Panasonic">Panasonic</SelectItem>
                  <SelectItem value="Samsung">Samsung</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-scanner-primary w-full"
          >
            <Camera className="h-4 w-4 mr-2" />
            {isSearching ? "Searching..." : "Search Cameras"}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">Search Results ({results.length})</h3>
          {results.map((camera, index) => (
            <Card key={index} className="border-gray-700 bg-scanner-dark-alt">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-scanner-success">
                      {camera.ip}:{camera.port}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {camera.manufacturer} {camera.model}
                    </p>
                    {camera.location && (
                      <div className="flex items-center text-xs text-gray-400">
                        <MapPin className="h-3 w-3 mr-1" />
                        {camera.location.country}, {camera.location.city}
                      </div>
                    )}
                    {camera.url && (
                      <div className="flex items-center text-xs text-blue-400">
                        <Eye className="h-3 w-3 mr-1" />
                        <a href={camera.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          View Stream
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge 
                      variant={camera.status === 'online' ? 'default' : 'secondary'}
                      className={camera.status === 'online' ? 'bg-green-600' : ''}
                    >
                      {camera.status}
                    </Badge>
                    {camera.vulnerabilities && camera.vulnerabilities.length > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        Vulnerable
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default IPCamSearchTool;
