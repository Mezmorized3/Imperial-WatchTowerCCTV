
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { executeCCTV } from '@/utils/osintImplementations';
import { useToast } from '@/hooks/use-toast';
import { CameraResult } from '@/utils/types/cameraTypes';
import { getCountryIpRanges } from '@/utils/ipRangeUtils';

const countries = [
  { label: 'All Countries', value: '' },
  { label: 'Ukraine', value: 'ua' },
  { label: 'Russia', value: 'ru' },
  { label: 'Georgia', value: 'ge' },
  { label: 'Romania', value: 'ro' },
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
  { label: 'Japan', value: 'jp' }
];

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
        description: "Please select a country to search for CCTV cameras",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    toast({
      title: "CCTV Search Initiated",
      description: `Searching for CCTV cameras in ${countries.find(c => c.value === country)?.label || country}...`,
    });
    
    try {
      // Get selected country name for display
      const countryName = countries.find(c => c.value === country)?.label || country;
      
      // Get IP ranges for the country if available
      const ipRanges = getCountryIpRanges(country);
      if (ipRanges.length > 0) {
        const randomRangeIndex = Math.floor(Math.random() * ipRanges.length);
        toast({
          title: "Using IP Range",
          description: `${ipRanges[randomRangeIndex].description}: ${ipRanges[randomRangeIndex].range}`,
        });
      }
      
      const scanResults = await executeCCTV({
        region: country,
        limit: parseInt(limit),
        country: countryName,
        brand: cameraType
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
          <Label htmlFor="country" className="mb-2 block">Country</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger id="country" className="bg-scanner-dark">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="cameraType" className="mb-2 block">Camera Type</Label>
          <Input
            id="cameraType"
            placeholder="Camera Type (optional)"
            value={cameraType}
            onChange={(e) => setCameraType(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div className="md:col-span-1">
          <Label htmlFor="limit" className="mb-2 block">Results Limit</Label>
          <Input
            id="limit"
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
                    <th className="pb-2">City</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Accessible</th>
                  </tr>
                </thead>
                <tbody>
                  {results.cameras.map((camera: CameraResult, index: number) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-2">{camera.ip}</td>
                      <td className="py-2">{camera.port}</td>
                      <td className="py-2">{camera.geolocation?.country || 'Unknown'}</td>
                      <td className="py-2">{camera.geolocation?.city || 'Unknown'}</td>
                      <td className="py-2">{camera.manufacturer || camera.model || 'Unknown'}</td>
                      <td className="py-2">{camera.accessible ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              {isSearching ? 'Searching for cameras...' : 'No CCTV cameras found. Select a country and start a search.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CCTVTool;
