
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { executeSocialUsernameSearch } from '@/utils/osintUtilsConnector';

interface UsernameSearchToolProps {
  onSearchComplete?: (results: any) => void;
}

const UsernameSearchTool: React.FC<UsernameSearchToolProps> = ({ onSearchComplete }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const handleSearch = async () => {
    if (!username) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await executeSocialUsernameSearch({ 
        tool: 'usernameSearch',
        username
      });
      
      if (result && result.success) {
        setResults(result.data.results);
        
        if (onSearchComplete) {
          onSearchComplete(result.data.results);
        }
        
        toast({
          title: "Username Search Complete",
          description: `Found ${result.data.results?.profiles?.length || 0} profiles.`
        });
      } else {
        toast({
          title: "Search Failed",
          description: "Failed to retrieve username data",
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
          <User className="h-5 w-5 text-green-400 mr-2" />
          Username Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Enter username to search"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
        
        <Button
          onClick={handleSearch}
          disabled={isLoading}
          variant="default"
          className="bg-scanner-primary w-full"
        >
          <Search className="h-4 w-4 mr-2" />
          {isLoading ? "Searching..." : "Search Username"}
        </Button>
        
        {results && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Results:</h3>
            {results.profiles && results.profiles.length > 0 ? (
              <ul className="text-xs text-gray-400 space-y-1 pl-5 list-disc">
                {results.profiles.map((profile: any, index: number) => (
                  <li key={index}>
                    {profile.platform}: {profile.url}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">No profiles found.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsernameSearchTool;
