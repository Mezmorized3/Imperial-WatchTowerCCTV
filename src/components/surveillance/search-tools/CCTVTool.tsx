
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { executeCCTV } from '@/utils/osintTools';
import { useToast } from '@/hooks/use-toast';

export const CCTVTool: React.FC = () => {
  const [country, setCountry] = useState('');
  const [cameraType, setCameraType] = useState('');
  const [limit, setLimit] = useState('10');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!country) {
      toast({
        title: "Country Required",
        description: "Please enter a country to search for CCTV cameras",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    toast({
      title: "CCTV Search Initiated",
      description: `Searching for CCTV cameras in ${country}...`,
    });
    
    try {
      const scanResults = await executeCCTV({
        region: country, // Include region and set it to country value
        country: country,
        type: cameraType,
        limit: parseInt(limit)
      });
      
      setResults(scanResults.data);
      toast({
        title: "Search Complete",
        description: scanResults?.simulatedData 
          ? "Showing simulated results (dev mode)" 
          : "CCTV camera search completed successfully",
      });
    } catch (error) {
      console.error('CCTV search error:', error);
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <Input
            placeholder="Enter Country (e.g., US)"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div className="md:col-span-1">
          <Input
            placeholder="Camera Type (optional)"
            value={cameraType}
            onChange={(e) => setCameraType(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div className="md:col-span-1">
          <Input
            placeholder="Limit (default 10)"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div>
          <Button 
            onClick={handleSearch} 
            disabled={isSearching || !country}
            className="w-full"
          >
            {isSearching ? (
              <>Searching...</>
            ) : (
              <>
                Search CCTV Cameras
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-4">
          {results && results.cameras && results.cameras.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="pb-2">IP Address</th>
                    <th className="pb-2">Port</th>
                    <th className="pb-2">Country</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Accessible</th>
                  </tr>
                </thead>
                <tbody>
                  {results.cameras.map((camera: any, index: number) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-2">{camera.ip}</td>
                      <td className="py-2">{camera.port}</td>
                      <td className="py-2">{camera.country}</td>
                      <td className="py-2">{camera.type}</td>
                      <td className="py-2">{camera.accessible ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No CCTV cameras found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
