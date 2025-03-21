
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { ExternalLink, Link } from 'lucide-react';
import { googleDorkSearch } from '@/utils/searchUtils';

export const SearchCamTool: React.FC = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [dorkResults, setDorkResults] = useState<Array<{
    id: string;
    title: string;
    url: string;
    snippet: string;
    isCamera: boolean;
  }>>([]);

  // Handle Google dork search
  const handleDorkSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchProgress(0);
    setDorkResults([]);
    
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => Math.min(prev + 2, 95));
    }, 100);
    
    try {
      const result = await googleDorkSearch(query);
      setDorkResults(result.results);
      
      toast({
        title: "Search Complete",
        description: `Found ${result.results.length} results for your search`,
      });
    } catch (error) {
      console.error('Error performing dork search:', error);
      toast({
        title: "Error",
        description: "Failed to search with Google dorks",
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
          placeholder='intitle:"webcam" OR inurl:"ViewerFrame"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-scanner-dark border-gray-700 text-white"
        />
        <Button 
          onClick={handleDorkSearch} 
          disabled={isSearching}
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>
      
      {searchProgress > 0 && (
        <Progress value={searchProgress} className="h-2" />
      )}
      
      {/* SearchCAM Google Dork Results */}
      {dorkResults.length > 0 && (
        <div className="mt-4 space-y-4">
          <h3 className="text-lg font-medium border-b border-gray-700 pb-2">
            SearchCAM Results ({dorkResults.length})
          </h3>
          
          <div className="space-y-4">
            {dorkResults.map(result => (
              <div key={result.id} className="bg-scanner-dark p-4 rounded border border-gray-700">
                <div className="flex items-center justify-between">
                  <h4 className="text-blue-400 font-medium">{result.title}</h4>
                  {result.isCamera && (
                    <Badge className="bg-green-600 hover:bg-green-700">Likely Camera</Badge>
                  )}
                </div>
                
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-gray-300 flex items-center mt-1 hover:underline"
                >
                  {result.url} <ExternalLink className="h-3 w-3 ml-1" />
                </a>
                
                <p className="text-sm mt-2 text-gray-300">{result.snippet}</p>
                
                <div className="flex justify-end mt-3">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Link className="h-3 w-3 mr-1" /> Open Stream
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
