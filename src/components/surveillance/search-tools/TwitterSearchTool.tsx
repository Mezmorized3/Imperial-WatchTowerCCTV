
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { executeTwint } from '@/utils/osintUtilsConnector';
import { Loader2, Twitter, Search } from 'lucide-react';

const TwitterSearchTool = () => {
  const [username, setUsername] = useState('');
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username && !search) return;

    setLoading(true);
    setResults([]);

    try {
      const response = await executeTwint({
        tool: 'twint',
        username,
        search,
        limit,
      });

      if (response?.success) {
        setResults(response.data?.results?.tweets || response.data?.results?.posts || []);
      }
    } catch (error) {
      console.error('Twitter search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark-alt">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Twitter className="w-5 h-5 mr-2 text-blue-400" />
          Twitter Intelligence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Username to search"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-scanner-dark border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="search">Search Term</Label>
              <Input
                id="search"
                placeholder="Search term or hashtag"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-scanner-dark border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="limit">Result Limit</Label>
              <Input
                id="limit"
                type="number"
                min={1}
                max={100}
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 20)}
                className="bg-scanner-dark border-gray-700"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search Twitter
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="block">
        {results.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-400">Results ({results.length})</h3>
            {results.map((tweet, index) => (
              <div key={index} className="p-2 rounded bg-scanner-dark border border-gray-700 text-sm">
                <p className="font-medium text-blue-400">{tweet.username || 'User'}</p>
                <p>{tweet.tweet || tweet.content || 'No content available'}</p>
                <p className="text-xs text-gray-500">{tweet.date || 'Unknown date'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            {loading ? 'Searching...' : 'Enter a username or search term and click Search'}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default TwitterSearchTool;
