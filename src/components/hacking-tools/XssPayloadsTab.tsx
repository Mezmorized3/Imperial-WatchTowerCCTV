import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeHackingTool } from '@/utils/osintUtilsConnector';

const XssPayloadsTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm) {
      toast({
        title: "Error",
        description: "Please enter a search term",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResults([]);

    try {
      const params = {
        tool: 'xssPayloadSearch',
        searchTerm: searchTerm
      };
      const result = await executeHackingTool(params);
      
      if (result && result.success) {
        setResults(result.data.results);
        toast({
          title: "Search Complete",
          description: `Found ${result.data.results.length} XSS payloads.`
        });
      } else {
        toast({
          title: "Search Failed",
          description: result?.data?.message || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during XSS payloads search:", error);
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code className="h-4 w-4 mr-2" />
          XSS Payloads Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search-term">Search Term</Label>
          <Input
            id="search-term"
            placeholder="e.g., alert, prompt, etc."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Search className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search Payloads
            </>
          )}
        </Button>
        {results.length > 0 && (
          <div className="space-y-2">
            <Label>Results</Label>
            <Textarea
              readOnly
              value={results.join('\n')}
              className="min-h-[100px] font-mono text-sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default XssPayloadsTab;
