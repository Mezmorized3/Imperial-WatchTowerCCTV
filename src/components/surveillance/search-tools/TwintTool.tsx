
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { executeTwint } from '@/utils/osintTools';
import { useToast } from '@/hooks/use-toast';
import { Search, Calendar, Hash, UserCheck } from 'lucide-react';

export const TwintTool: React.FC = () => {
  const [username, setUsername] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [since, setSince] = useState('');
  const [until, setUntil] = useState('');
  const [limit, setLimit] = useState('100');
  const [verified, setVerified] = useState(false);
  const [searchMode, setSearchMode] = useState('username');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (searchMode === 'username' && !username) {
      toast({
        title: "Username Required",
        description: "Please enter a Twitter username to search",
        variant: "destructive"
      });
      return;
    }
    
    if (searchMode === 'keyword' && !searchTerm) {
      toast({
        title: "Search Term Required",
        description: "Please enter a keyword to search for tweets",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    toast({
      title: "Twitter Search Initiated",
      description: searchMode === 'username' 
        ? `Searching tweets from @${username}...` 
        : `Searching tweets containing "${searchTerm}"...`,
    });
    
    try {
      const params: any = {
        limit: limit,
        verified: verified
      };
      
      if (searchMode === 'username') {
        params.username = username;
      } else {
        params.search = searchTerm;
      }
      
      if (since) params.since = since;
      if (until) params.until = until;
      
      const searchResults = await executeTwint(params);
      
      setResults(searchResults);
      toast({
        title: "Search Complete",
        description: searchResults?.simulatedData 
          ? "Showing simulated results (dev mode)" 
          : "Twitter search completed successfully",
      });
    } catch (error) {
      console.error('Twitter search error:', error);
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={searchMode} onValueChange={setSearchMode}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="username" className="flex items-center">
            <UserCheck className="mr-2 h-4 w-4" />
            Search by Username
          </TabsTrigger>
          <TabsTrigger value="keyword" className="flex items-center">
            <Hash className="mr-2 h-4 w-4" />
            Search by Keyword
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="username">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Enter Twitter username (without @)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-scanner-dark"
              />
            </div>
            <div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !username}
                className="w-full"
              >
                {isSearching ? (
                  <>Searching...</>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Tweets
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="keyword">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Enter search term"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-scanner-dark"
              />
            </div>
            <div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !searchTerm}
                className="w-full"
              >
                {isSearching ? (
                  <>Searching...</>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Tweets
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm text-gray-400">Since Date</Label>
              <Input
                type="date"
                value={since}
                onChange={(e) => setSince(e.target.value)}
                className="bg-scanner-dark mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm text-gray-400">Until Date</Label>
              <Input
                type="date"
                value={until}
                onChange={(e) => setUntil(e.target.value)}
                className="bg-scanner-dark mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm text-gray-400">Limit</Label>
              <Input
                type="number"
                placeholder="100"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="bg-scanner-dark mt-1"
              />
            </div>
            
            <div className="flex items-end pb-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={verified} 
                  onCheckedChange={setVerified} 
                  id="verified-switch"
                />
                <Label htmlFor="verified-switch">Verified accounts only</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {results && (
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardContent className="pt-4">
            <h3 className="text-lg font-semibold mb-4">Search Results</h3>
            {results.tweets && results.tweets.length > 0 ? (
              <div className="space-y-4">
                {results.tweets.map((tweet: any, index: number) => (
                  <div key={index} className="p-3 border border-gray-700 rounded bg-scanner-dark">
                    <div className="flex items-center mb-2">
                      {tweet.user_avatar ? (
                        <img 
                          src={tweet.user_avatar} 
                          alt={tweet.username} 
                          className="w-10 h-10 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-700 mr-3" />
                      )}
                      <div>
                        <p className="font-semibold">
                          {tweet.name} 
                          {tweet.verified && <span className="text-blue-400 ml-1">✓</span>}
                        </p>
                        <p className="text-gray-400 text-sm">@{tweet.username}</p>
                      </div>
                    </div>
                    <p className="mb-2">{tweet.text}</p>
                    <div className="flex justify-between text-gray-400 text-sm">
                      <span>{tweet.date}</span>
                      <div className="flex space-x-4">
                        <span>{tweet.likes} likes</span>
                        <span>{tweet.retweets} RTs</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No tweets found.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
