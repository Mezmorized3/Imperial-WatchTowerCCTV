
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Twitter } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { executeTwint } from '@/utils/osintImplementations/socialTools';

interface TwintToolProps {
  onSearchComplete?: (results: any) => void;
}

const TwintTool: React.FC<TwintToolProps> = ({ onSearchComplete }) => {
  const [username, setUsername] = useState('');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState('10');
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
      const result = await executeTwint({ 
        username: username || undefined,
        query: query || undefined,
        limit: limit ? parseInt(limit) : undefined
      });
      
      if (result && result.success) {
        setResults(result.data);
        
        if (onSearchComplete) {
          onSearchComplete(result.data);
        }
        
        toast({
          title: "Twitter Search Complete",
          description: `Found ${result.data?.posts?.length || 0} tweets.`
        });
      } else {
        toast({
          title: "Search Failed",
          description: "Failed to retrieve Twitter data",
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
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Enter Twitter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="query">Query</Label>
          <Input
            id="query"
            placeholder="Enter search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="limit">Results Limit</Label>
          <Select value={limit} onValueChange={setLimit}>
            <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
              <SelectValue placeholder="Number of tweets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 tweets</SelectItem>
              <SelectItem value="10">10 tweets</SelectItem>
              <SelectItem value="20">20 tweets</SelectItem>
              <SelectItem value="50">50 tweets</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
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
              <div className="max-h-60 overflow-y-auto">
                {results.posts.map((post: any, index: number) => (
                  <div key={index} className="p-2 border-b border-gray-700 last:border-b-0">
                    <p className="text-sm">{post.content}</p>
                    <div className="flex justify-between items-center mt-1 text-xs text-gray-400">
                      <span>
                        {new Date(post.timestamp).toLocaleDateString()} • {post.likes} likes
                      </span>
                      <a 
                        href={post.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        View on Twitter
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No tweets found matching your criteria.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwintTool;
