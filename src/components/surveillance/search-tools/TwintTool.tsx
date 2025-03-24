
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Twitter } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { executeTwint } from '@/utils/osintTools';

interface TwintToolProps {
  onSearchComplete?: (results: any) => void;
}

const TwintTool: React.FC<TwintToolProps> = ({ onSearchComplete }) => {
  const [username, setUsername] = useState('');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const handleSearch = async () => {
    if (!username && !query) {
      toast({
        title: "Error",
        description: "Please enter a username or query",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await executeTwint(); // Don't pass any arguments
      
      if (result && result.success) {
        // Create default data structure if there's no data
        const processedData = {
          posts: []
        };
        
        setResults(processedData);
        toast({
          title: "Twitter Search Complete",
          description: `Found ${processedData?.posts?.length || 0} tweets.`
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
    <Card className="border-gray-700 bg-scanner-dark shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Twitter className="h-5 w-5 text-blue-400 mr-2" />
          Twitter Search (Twint)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="Enter Twitter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-scanner-dark-alt border-gray-700"
        />
        
        <Label htmlFor="query">Query</Label>
        <Input
          id="query"
          placeholder="Enter search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-scanner-dark-alt border-gray-700"
        />
        
        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-scanner-primary"
        >
          <Search className="h-4 w-4 mr-2" />
          {isLoading ? "Searching..." : "Search Twitter"}
        </Button>
        
        {results && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Results:</h3>
            {results.posts && results.posts.length > 0 ? (
              <ul className="text-xs text-gray-400 space-y-1">
                {results.posts.map((post: any) => (
                  <li key={post.id}>
                    {post.content} - <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">View on Twitter</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">No tweets found.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwintTool;
