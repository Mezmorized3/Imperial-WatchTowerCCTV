
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { CCTVParams } from '@/utils/osintToolTypes';
import { executeCCTV } from '@/utils/osintTools';

interface CCTVToolProps {
  onSearchComplete?: (results: any) => void;
}

const CCTVTool: React.FC<CCTVToolProps> = ({ onSearchComplete }) => {
  const [target, setTarget] = useState('');
  const [mode, setMode] = useState('direct');
  const [country, setCountry] = useState('');
  const [brand, setBrand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const handleSearch = async () => {
    if (!target && !country) {
      toast({
        title: "Error",
        description: "Please enter either a target or select a country",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const params: CCTVParams = {
        target,
        mode,
        country,
        timeout: 30000
      };
      
      const result = await executeCCTV(params);
      
      setResults(result);
      
      if (onSearchComplete) {
        onSearchComplete(result);
      }
      
      toast({
        title: `${result.simulatedData ? 'Simulated ' : ''}Search Complete`,
        description: `Found ${result.data?.cameras?.length || 0} cameras.`
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
          CCTV Camera Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label htmlFor="target">IP Address or Network Range</Label>
        <Input
          id="target"
          placeholder="192.168.1.0/24 or individual IP"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="bg-scanner-dark-alt border-gray-700"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mode">Search Mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Direct Scan</SelectItem>
                <SelectItem value="passive">Passive (Database)</SelectItem>
                <SelectItem value="mixed">Mixed Approach</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brand">Camera Brand (Optional)</Label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Any brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="hikvision">Hikvision</SelectItem>
                <SelectItem value="dahua">Dahua</SelectItem>
                <SelectItem value="axis">Axis</SelectItem>
                <SelectItem value="samsung">Samsung</SelectItem>
                <SelectItem value="foscam">Foscam</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">Country Filter (Optional)</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
              <SelectValue placeholder="Any country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="GB">United Kingdom</SelectItem>
              <SelectItem value="DE">Germany</SelectItem>
              <SelectItem value="FR">France</SelectItem>
              <SelectItem value="JP">Japan</SelectItem>
              <SelectItem value="CN">China</SelectItem>
              <SelectItem value="RU">Russia</SelectItem>
              <SelectItem value="IN">India</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Searching..." : "Search for Cameras"}
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

export default CCTVTool;
