import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Globe } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { executeUsernameSearch, executeTwint, executeOSINT } from '@/utils/osintTools';

const OSINTTool: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('username');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async () => {
    if (!query) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setResults(null);
    
    try {
      let result;
      
      switch (searchType) {
        case 'username':
          result = await executeUsernameSearch();
          break;
        case 'twitter':
          result = await executeTwint();
          break;
        case 'osint':
          result = await executeOSINT();
          break;
        default:
          toast({
            title: "Error",
            description: "Invalid search type",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
      }
      
      if (result && result.success) {
        setResults(result.data);
        toast({
          title: "Search Complete",
          description: `Search completed successfully`
        });
      } else {
        toast({
          title: "Search Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
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
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          OSINT Search Tool
        </CardTitle>
        <CardDescription>
          Perform OSINT searches across various platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="query">Search Query</Label>
            <Input
              id="query"
              placeholder="Enter search query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="searchType">Search Type</Label>
            <Select 
              value={searchType} 
              onValueChange={(value) => setSearchType(value)}
              disabled={isLoading}
            >
              <SelectTrigger id="searchType" className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select search type" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="username">Username Search</SelectItem>
                <SelectItem value="twitter">Twitter (Twint)</SelectItem>
                <SelectItem value="osint">Generic OSINT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            onClick={handleSearch}
            disabled={isLoading || !query}
          >
            {isLoading ? 'Searching...' : 'Start Search'}
            {!isLoading && <Search className="ml-2 h-4 w-4" />}
          </Button>

          {results && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold">Search Results</h3>
              <pre className="text-xs text-muted-foreground">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OSINTTool;
