import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { executeCCTV } from '@/utils/osintUtilsConnector';
import { Camera, MapPin, Search } from 'lucide-react';

const CCTVTool: React.FC = () => {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleExecute = async () => {
    if (!query) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await executeCCTV({
        query,
        country,
        limit: 10
      });

      if (result.success) {
        setResults(result.data);
        toast({
          title: "Search Complete",
          description: `Found ${result.data.cameras?.length || 0} cameras`
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to execute CCTV search",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("CCTV search error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark-alt">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Camera className="w-5 h-5 mr-2 text-blue-400" />
          CCTV Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="query">Search Query</Label>
            <Input
              id="query"
              placeholder="Enter search term"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-scanner-dark border-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="bg-scanner-dark border-gray-700">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="">Any Country</SelectItem>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="GB">United Kingdom</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="FR">France</SelectItem>
                {/* Add more countries as needed */}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleExecute} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </div>
        {results && (
          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold">Search Results</h3>
            <Textarea
              readOnly
              value={JSON.stringify(results, null, 2)}
              className="min-h-32 font-mono text-sm bg-scanner-dark-alt border-gray-700"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CCTVTool;
