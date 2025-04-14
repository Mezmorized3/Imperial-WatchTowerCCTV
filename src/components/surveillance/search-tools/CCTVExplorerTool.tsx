
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Camera, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { CCTVParams } from '@/utils/osintToolTypes';
import { executeCCTV } from '@/utils/osintTools';

const CCTVExplorerTool = () => {
  const [ipRange, setIpRange] = useState('');
  const [country, setCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saveResults, setSaveResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const handleSearch = async () => {
    if (!ipRange && !country) {
      toast({
        title: "Validation Error",
        description: "Please enter an IP range or select a country",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const params: CCTVParams = {
        target: ipRange,
        country,
        region: country ? 'global' : undefined,
        timeout: 30000
      };
      
      const result = await executeCCTV(params);
      
      setResults(result);
      toast({
        title: "Search Complete",
        description: `Found ${result?.data?.cameras?.length || 0} cameras.`
      });
    } catch (error) {
      console.error("Error during search:", error);
      toast({
        title: "Search Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Camera className="h-5 w-5 text-blue-400 mr-2" />
          CCTV Explorer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ip-range">IP Range</Label>
          <Input
            id="ip-range"
            placeholder="192.168.1.0/24 or leave empty for country search"
            value={ipRange}
            onChange={(e) => setIpRange(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">Country (for global search)</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="GB">United Kingdom</SelectItem>
              <SelectItem value="DE">Germany</SelectItem>
              <SelectItem value="FR">France</SelectItem>
              <SelectItem value="JP">Japan</SelectItem>
              <SelectItem value="IN">India</SelectItem>
              <SelectItem value="BR">Brazil</SelectItem>
              <SelectItem value="RU">Russia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="save-results"
            checked={saveResults}
            onCheckedChange={(checked) => setSaveResults(checked === true)}
          />
          <Label htmlFor="save-results">Save results to file</Label>
        </div>
        
        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search for Cameras
            </>
          )}
        </Button>
        
        {results && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Results:</h3>
            <p className="text-sm">Found {results.data?.cameras?.length || 0} cameras.</p>
            
            {results.data?.cameras && results.data.cameras.length > 0 && (
              <div className="mt-2 max-h-60 overflow-y-auto p-2 bg-scanner-dark-alt rounded border border-gray-700">
                {results.data.cameras.map((camera: any, index: number) => (
                  <div key={index} className="p-2 border-b border-gray-700 last:border-b-0">
                    <p className="font-mono text-sm">{camera.ip}:{camera.port}</p>
                    {camera.model && <p className="text-xs text-gray-400">Model: {camera.model}</p>}
                    {camera.location && <p className="text-xs text-gray-400">Location: {camera.location.country}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CCTVExplorerTool;
