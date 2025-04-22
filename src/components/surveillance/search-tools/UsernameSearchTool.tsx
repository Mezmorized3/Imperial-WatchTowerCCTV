
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { User, ExternalLink } from 'lucide-react';
import { executeUsernameSearch } from '@/utils/osintImplementations/socialTools';

export const UsernameSearchTool: React.FC = () => {
  const [username, setUsername] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchResults, setSearchResults] = useState<Array<{
    platform: string;
    url: string;
    exists: boolean;
    username?: string;
    note?: string;
  }>>([]);

  const handleSearch = async () => {
    if (!username.trim()) {
      toast({
        title: "Empty Username",
        description: "Please enter a username to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setSearchResults([]);
    
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => Math.min(prev + 2, 95));
    }, 100);
    
    try {
      const result = await executeUsernameSearch({ username });
      
      // Transform the results to match our component's expected format
      const formattedResults = result.data.results.map((item: any) => ({
        platform: item.platform,
        url: item.url,
        exists: item.exists,
        username: username,
        note: item.exists ? undefined : 'Profile not found'
      }));
      
      setSearchResults(formattedResults);
      
      const foundCount = formattedResults.filter(r => r.exists).length;
      
      toast({
        title: "Search Complete",
        description: `Found ${foundCount} profiles for username "${username}"`,
      });
    } catch (error) {
      console.error('Error searching username:', error);
      toast({
        title: "Error",
        description: "Failed to search for username",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setSearchProgress(100);
      setIsSearching(false);
      
      setTimeout(() => setSearchProgress(0), 1000);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Enter a username to search"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-scanner-dark border-gray-700 text-white"
        />
        <Button 
          onClick={handleSearch} 
          disabled={isSearching}
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>
      
      {searchProgress > 0 && (
        <Progress value={searchProgress} className="h-2" />
      )}
      
      {searchResults.length > 0 && (
        <div className="mt-4 space-y-4">
          <h3 className="text-lg font-medium border-b border-gray-700 pb-2">
            Results for "{username}" ({searchResults.filter(r => r.exists).length}/{searchResults.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((result, index) => (
              <div key={index} className={`p-4 rounded border ${result.exists ? 'bg-green-900/20 border-green-700' : 'bg-scanner-dark border-gray-700'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {result.platform}
                  </h4>
                  <Badge className={result.exists ? 'bg-green-600' : 'bg-gray-600'}>
                    {result.exists ? 'Found' : 'Not Found'}
                  </Badge>
                </div>
                
                {result.exists ? (
                  <a 
                    href={result.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-blue-400 flex items-center mt-1 hover:underline"
                  >
                    Visit Profile <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                ) : (
                  <p className="text-sm text-gray-400 mt-1">
                    {result.note || 'No profile found'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsernameSearchTool;
