
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Eye, Globe, Search } from 'lucide-react';
import { executeCCTV } from '@/utils/osintImplementations';
import { Badge } from '@/components/ui/badge';

// Inspired by https://github.com/Err0r-ICA/CCTV
const CCTVExplorerTool: React.FC = () => {
  const { toast } = useToast();
  const [region, setRegion] = useState<string>('us');
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);

  const regions = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' },
    { value: 'jp', label: 'Japan' },
    { value: 'cn', label: 'China' },
    { value: 'ru', label: 'Russia' },
    { value: 'br', label: 'Brazil' },
    { value: 'au', label: 'Australia' },
    { value: 'ca', label: 'Canada' },
  ];

  const handleSearch = async () => {
    setLoading(true);
    setResults([]);

    try {
      const response = await executeCCTV({
        region,
        limit,
        saveResults: true,
      });

      if (response.success && response.data.cameras) {
        setResults(response.data.cameras);
        toast({
          title: 'Search Complete',
          description: `Found ${response.data.cameras.length} cameras in ${regions.find(r => r.value === region)?.label || region}`,
        });
      } else {
        toast({
          title: 'Search Failed',
          description: 'No cameras found or an error occurred.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('CCTV search error:', error);
      toast({
        title: 'Search Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openStream = (url: string) => {
    // In a full implementation, this would launch a stream viewer
    window.open(url, '_blank');
    toast({
      title: 'Opening Stream',
      description: 'Attempting to connect to camera stream...',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">CCTV Explorer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Region</label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Limit Results</label>
              <Input
                type="number"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 5)}
                min={1}
                max={50}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find Cameras
                  </>
                )}
              </Button>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-md font-medium">{results.length} Cameras Found</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {results.map((camera, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{camera.ip}</h4>
                          <p className="text-sm text-muted-foreground">
                            {camera.model || 'Unknown Model'}
                          </p>
                        </div>
                        <Badge variant={camera.status === 'online' ? 'default' : 'destructive'}>
                          {camera.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm mt-3">
                        <div className="flex items-center mt-1">
                          <Globe className="h-4 w-4 mr-2 opacity-70" />
                          <span>{camera.geolocation?.country || 'Unknown'}, {camera.geolocation?.city || 'Unknown'}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => openStream(camera.rtspUrl || `rtsp://${camera.ip}:554/stream`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Stream
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Select a region and click search to find cameras</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">About CCTV Explorer</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            This tool searches for publicly accessible CCTV cameras in selected regions.
            It uses techniques from Err0r-ICA's CCTV project to discover cameras 
            through various search engines and public databases.
          </p>
          <p className="mt-2">
            <strong>Note:</strong> Always ensure you have permission to access any camera feeds.
            Unauthorized access to camera systems may be illegal in many jurisdictions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CCTVExplorerTool;
