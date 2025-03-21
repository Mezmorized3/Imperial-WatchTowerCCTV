import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Search, Calendar, ThumbsUp, RefreshCcw } from 'lucide-react';
import { executeTwint } from '@/utils/osintTools';
import { useToast } from '@/hooks/use-toast';

export const TwintTool: React.FC = () => {
  const [username, setUsername] = useState('');
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [limit, setLimit] = useState(50);
  const [verified, setVerified] = useState(false);
  const [searchMode, setSearchMode] = useState<'username' | 'term'>('username');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [tweetCount, setTweetCount] = useState(0);
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
    
    if (searchMode === 'term' && !keyword) {
      toast({
        title: "Search Term Required",
        description: "Please enter a search term",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    toast({
      title: "Twitter Search Initiated",
      description: searchMode === 'username' 
        ? `Searching tweets from @${username}...` 
        : `Searching tweets containing "${keyword}"...`,
    });
    
    try {
      const scanResults = await executeTwint({
        username: username,
        search: keyword,
        since: startDate,
        until: endDate,
        limit: parseInt(limit)
      });
      
      setResults(scanResults);
      toast({
        title: "Search Complete",
        description: scanResults?.simulatedData 
          ? "Showing simulated results (dev mode)" 
          : "Twitter search completed successfully",
      });

      if (scanResults?.data?.tweets) {
        setTweetCount(scanResults.data.tweets.length);
      }
    } catch (error) {
      console.error('Twint search error:', error);
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (isoDate: string) => {
    try {
      return new Date(isoDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoDate;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="username" value={searchMode} onValueChange={(v) => setSearchMode(v as 'username' | 'term')} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="username" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Search by Username
          </TabsTrigger>
          <TabsTrigger value="term" className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Search by Term
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="username" className="pt-4">
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
                    <User className="mr-2 h-4 w-4" />
                    Search User Tweets
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="term" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Enter search term or hashtag"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="bg-scanner-dark"
              />
            </div>
            <div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !keyword}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="since-date">Since Date</Label>
                <Input
                  id="since-date"
                  type="date"
                  className="bg-scanner-dark"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="until-date">Until Date</Label>
                <Input
                  id="until-date"
                  type="date"
                  className="bg-scanner-dark"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="limit-slider">Maximum Tweets: {limit}</Label>
                </div>
                <Slider 
                  id="limit-slider"
                  min={10} 
                  max={300} 
                  step={10} 
                  value={[limit]} 
                  onValueChange={(value) => setLimit(value[0])}
                />
                <p className="text-xs text-gray-400">Higher values return more tweets but take longer</p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="verified-only" className="text-sm">Verified Accounts Only</Label>
                <Switch 
                  id="verified-only" 
                  checked={verified}
                  onCheckedChange={setVerified}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {results && results.tweets && (
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardContent className="pt-4">
            <ScrollArea className="h-[400px]">
              {results.tweets.length > 0 ? (
                <div className="space-y-4">
                  {results.tweets.map((tweet: any, index: number) => (
                    <div key={index} className="p-3 bg-scanner-dark rounded-md border border-gray-700">
                      <div className="flex items-start">
                        <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">@{tweet.username}</span>
                              {verified && (
                                <span className="ml-1 text-blue-400">✓</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(tweet.date)}
                            </div>
                          </div>
                          <p className="mt-1">{tweet.text}</p>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <div className="flex items-center mr-4">
                              <RefreshCcw className="h-3 w-3 mr-1" />
                              {tweet.retweets}
                            </div>
                            <div className="flex items-center">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {tweet.likes}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Search className="h-12 w-12 mx-auto mb-2" />
                  <p>No tweets found matching your criteria</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
