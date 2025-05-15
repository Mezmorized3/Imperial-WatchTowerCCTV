
// @ts-nocheck // TODO: FIX TYPES
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Search, Loader2, MapPin, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeCCTVScan } from '@/utils/osintImplementations/cameraTools'; // Assuming this is where it's homed
import { CCTVScanParams, CCTVScanResult, CCTVScanData, CCTVCamera } from '@/utils/types/osintToolTypes'; // Ensure these types exist

const CCTVTool: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [country, setCountry] = useState('');
  const [cameraType, setCameraType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CCTVScanData | null>(null);
  const { toast } = useToast();

  // Mock countries and camera types for the selectors
  const countries = [
    { value: 'US', label: 'United States' }, { value: 'GB', label: 'United Kingdom' },
    { value: 'DE', label: 'Germany' }, { value: 'JP', label: 'Japan' }, { value: 'ALL', label: 'Any Country' }
  ];
  const cameraTypes = [
    { value: 'ip_camera', label: 'IP Camera' }, { value: 'webcam', label: 'Webcam' },
    { value: 'traffic', label: 'Traffic Camera' }, { value: 'security', label: 'Security Camera' }, { value: 'ALL', label: 'Any Type' }
  ];

  const handleSearch = async () => {
    if (!searchQuery && !country && !cameraType) {
      toast({ title: 'Error', description: 'Please provide at least one search criteria.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setResults(null);

    const params: CCTVScanParams = {
      query: searchQuery,
      country_code: country !== 'ALL' ? country : undefined,
      camera_type: cameraType !== 'ALL' ? cameraType : undefined,
      limit: 20, // Example limit
    };

    try {
      const response: CCTVScanResult = await executeCCTVScan(params);
      if (response.success) {
        setResults(response.data);
        toast({
          title: 'Search Complete',
          description: `Found ${response.data.cameras?.length || 0} cameras.`,
        });
      } else {
        toast({
          title: 'Search Failed',
          description: response.error || 'Unknown error during CCTV search.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('CCTV Search error:', error);
      toast({
        title: 'Search Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg border-gray-700 bg-scanner-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Video className="mr-2 h-5 w-5 text-red-400" />
          Public CCTV Camera Search
        </CardTitle>
        <CardDescription>
          Search for publicly accessible CCTV cameras based on keywords, country, or type.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="search-query">Search Query (Keywords)</Label>
          <Input id="search-query" placeholder="e.g., city name, street, building type" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-scanner-dark-alt border-gray-600" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country-select">Country (Optional)</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country-select" className="bg-scanner-dark-alt border-gray-600">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-600">
                {countries.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="camera-type-select">Camera Type (Optional)</Label>
            <Select value={cameraType} onValueChange={setCameraType}>
              <SelectTrigger id="camera-type-select" className="bg-scanner-dark-alt border-gray-600">
                <SelectValue placeholder="Select camera type" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-600">
                {cameraTypes.map(ct => <SelectItem key={ct.value} value={ct.value}>{ct.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleSearch} disabled={isLoading} className="w-full bg-red-500 hover:bg-red-600">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Search CCTV Cameras
        </Button>
      </CardContent>

      {results && results.cameras && results.cameras.length > 0 && (
        <CardFooter className="flex flex-col items-start space-y-4 mt-4 border-t border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-gray-200">Search Results ({results.cameras.length}):</h3>
          <div className="w-full max-h-96 overflow-y-auto space-y-3 pr-2">
            {results.cameras.map((camera: CCTVCamera) => (
              <Card key={camera.id} className="bg-scanner-dark-alt border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-green-400" />
                    {camera.manufacturer} {camera.model || 'Camera'}
                  </CardTitle>
                  <CardDescription className="text-xs">IP: {camera.ip}:{camera.port}</CardDescription>
                </CardHeader>
                <CardContent className="text-xs space-y-1">
                  <p>URL: <a href={camera.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">{camera.url}</a></p>
                  {camera.location && <p>Location: Lat {camera.location.latitude.toFixed(4)}, Lon {camera.location.longitude.toFixed(4)}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardFooter>
      )}
      {results && (!results.cameras || results.cameras.length === 0) && (
        <CardFooter className="border-t border-gray-700 pt-4">
            <p className="text-gray-300">No cameras found matching your criteria.</p>
        </CardFooter>
      )}
    </Card>
  );
};

export default CCTVTool;
