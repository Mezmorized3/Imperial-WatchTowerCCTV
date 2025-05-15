import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Search, Camera, Shield } from 'lucide-react';
import { executeWebCheck } from '@/utils/osintUtilsConnector';

const IndexPage = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleWebCheck = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to check",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await executeWebCheck({ url });

      if (result.success) {
        setResults(result.data);
        toast({
          title: "Web Check Complete",
          description: `Successfully checked ${url}`
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to execute web check",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Web check error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Web Check Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="Enter URL to check"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-scanner-dark"
            />
          </div>
          <Button onClick={handleWebCheck} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></div>
                Checking...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Check URL
              </>
            )}
          </Button>
          {results && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-400">Results</h3>
              <ul className="list-disc pl-5 text-sm">
                <li>Status Code: {results.statusCode}</li>
                <li>Server: {results.headers?.server}</li>
                <li>Technologies: {results.technologies?.join(', ')}</li>
                <li>Links: {results.links?.length}</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IndexPage;

function Label(props: { htmlFor: string; children: React.ReactNode }): React.ReactElement {
  return (
    <label htmlFor={props.htmlFor} className="block text-sm font-medium text-gray-300">
      {props.children}
    </label>
  )
}
