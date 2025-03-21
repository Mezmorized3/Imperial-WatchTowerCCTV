
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { executeOSINT } from '@/utils/osintTools';
import { useToast } from '@/hooks/use-toast';

export const OSINTTool: React.FC = () => {
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState('person');
  const [searchDepth, setSearchDepth] = useState('deep');
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query) {
      toast({
        title: "Query Required",
        description: "Please enter a query to search",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    toast({
      title: "OSINT Search Initiated",
      description: `Searching for ${query}...`,
    });

    try {
      const scanResults = await executeOSINT({
        target: query.trim(),
        type: queryType,
        depth: searchDepth
      });

      setResults(scanResults.data);
      toast({
        title: "Search Complete",
        description: scanResults?.simulatedData
          ? "Showing simulated results (dev mode)"
          : "OSINT search completed successfully",
      });
    } catch (error) {
      console.error('OSINT search error:', error);
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Enter name, domain, or company to search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div>
          <Button
            onClick={handleSearch}
            disabled={isLoading || !query}
            className="w-full"
          >
            {isLoading ? (
              <>Searching...</>
            ) : (
              <>
                Search OSINT
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">Search Type</label>
              <select
                value={queryType}
                onChange={(e) => setQueryType(e.target.value)}
                className="w-full bg-scanner-dark border-gray-700 rounded px-4 py-2 mt-1"
              >
                <option value="person">Person</option>
                <option value="domain">Domain</option>
                <option value="company">Company</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400">Search Depth</label>
              <select
                value={searchDepth}
                onChange={(e) => setSearchDepth(e.target.value)}
                className="w-full bg-scanner-dark border-gray-700 rounded px-4 py-2 mt-1"
              >
                <option value="shallow">Shallow</option>
                <option value="deep">Deep</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardContent className="pt-4">
            <pre className="text-white">{JSON.stringify(results, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
