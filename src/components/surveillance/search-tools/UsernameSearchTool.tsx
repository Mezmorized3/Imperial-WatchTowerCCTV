
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { ExternalLink } from 'lucide-react';
import { searchUsername } from '@/utils/osintUtils';

export const UsernameSearchTool: React.FC = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [usernameResults, setUsernameResults] = useState<Array<{
    platform: string;
    url: string;
    exists: boolean;
    username: string;
    note?: string;
  }>>([]);

  // Handle username search
  const handleUsernameSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty Username",
        description: "Please enter a username to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setUsernameResults([]);
    
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => Math.min(prev + 1, 95));
    }, 100);
    
    try {
      const result = await searchUsername(query);
      setUsernameResults(result.results);
      
      const foundCount = result.results.filter(r => r.exists).length;
      
      toast({
        title: "Search Complete",
        description: `Found ${foundCount} accounts for username "${query}"`,
      });
    } catch (error) {
      console.error('Error searching username:', error);
      toast({
        title: "Error",
        description: "Failed to search for username across platforms",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setSearchProgress(100);
      setIsSearching(false);
      
      // Reset progress after animation completes
      setTimeout(() => setSearchProgress(0), 1000);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Enter username to search across platforms"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-scanner-dark border-gray-700 text-white"
        />
        <Button 
          onClick={handleUsernameSearch}
          disabled={isSearching}
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>
      
      {searchProgress > 0 && (
        <Progress value={searchProgress} className="h-2" />
      )}
      
      {/* Username Search Results */}
      {usernameResults.length > 0 && (
        <div className="mt-4 space-y-4">
          <h3 className="text-lg font-medium border-b border-gray-700 pb-2">
            Platforms for username "{query}" ({usernameResults.filter(r => r.exists).length}/{usernameResults.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {usernameResults.map(result => (
              <div 
                key={result.platform} 
                className={`p-3 rounded border ${
                  result.exists 
                    ? 'border-green-600 bg-green-900/20' 
                    : 'border-gray-700 bg-scanner-dark'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.platform}</span>
                  <Badge 
                    variant={result.exists ? "default" : "outline"}
                    className={result.exists ? "bg-green-600" : ""}
                  >
                    {result.exists ? "Found" : "Not Found"}
                  </Badge>
                </div>
                
                {result.exists && (
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-blue-400 flex items-center mt-2 hover:underline"
                  >
                    {result.url} <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
                
                {result.note && (
                  <p className="text-xs text-gray-400 mt-1">{result.note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
