
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PhotonParams } from '@/utils/types/networkToolTypes';
import { toast } from '@/components/ui/use-toast';

interface PhotonToolProps {
  onExecute: (params: PhotonParams) => Promise<any>;
}

const PhotonTool: React.FC<PhotonToolProps> = ({ onExecute }) => {
  const [url, setUrl] = useState('');
  const [depth, setDepth] = useState(2);
  const [timeout, setTimeout] = useState(10);
  const [threads, setThreads] = useState(10);
  const [delay, setDelay] = useState(1);
  const [userAgent, setUserAgent] = useState('');
  const [saveResults, setSaveResults] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleExecute = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to crawl",
        variant: "destructive"
      });
      return;
    }

    setIsExecuting(true);
    setResult(null);

    try {
      const params: PhotonParams = {
        url,
        depth,
        timeout,
        threads,
        delay,
        userAgent,
        saveResults
      };

      // Call the onExecute function with the params
      const result = await onExecute(params);
      setResult(result);

      if (result?.success) {
        toast({
          title: "Crawl Completed",
          description: `Found ${result.data?.urls?.length || 0} URLs`,
        });
      } else {
        toast({
          title: "Crawl Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error executing Photon:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      
      toast({
        title: "Execution Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="bg-scanner-dark border-gray-700">
      <CardHeader>
        <CardTitle>Photon Web Crawler</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">Target URL</Label>
          <Input 
            id="url" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="https://example.com"
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="depth">Crawl Depth</Label>
            <Input 
              id="depth" 
              type="number" 
              min="1" 
              max="10" 
              value={depth} 
              onChange={(e) => setDepth(parseInt(e.target.value))} 
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeout">Timeout (seconds)</Label>
            <Input 
              id="timeout" 
              type="number" 
              min="1" 
              max="60" 
              value={timeout} 
              onChange={(e) => setTimeout(parseInt(e.target.value))} 
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="threads">Threads</Label>
            <Input 
              id="threads" 
              type="number" 
              min="1" 
              max="50" 
              value={threads} 
              onChange={(e) => setThreads(parseInt(e.target.value))} 
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="delay">Delay (seconds)</Label>
            <Input 
              id="delay" 
              type="number" 
              min="0" 
              max="10" 
              value={delay} 
              onChange={(e) => setDelay(parseInt(e.target.value))} 
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="user-agent">User Agent (Optional)</Label>
          <Input 
            id="user-agent" 
            value={userAgent} 
            onChange={(e) => setUserAgent(e.target.value)} 
            placeholder="Custom user agent"
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="save-results" className="cursor-pointer">Save crawl results to file</Label>
          <Switch 
            id="save-results" 
            checked={saveResults} 
            onCheckedChange={(checked) => setSaveResults(checked)}
          />
        </div>
        
        <Button 
          onClick={handleExecute} 
          disabled={isExecuting || !url} 
          className="w-full bg-scanner-primary"
        >
          {isExecuting ? "Crawling..." : "Start Web Crawl"}
        </Button>
        
        {result && (
          <div className="mt-4 p-3 rounded bg-scanner-dark-alt border border-gray-700">
            <h3 className="text-sm font-medium mb-2">Crawl Results</h3>
            
            {result.success ? (
              <div className="space-y-2 text-sm">
                <div>URLs found: {result.data?.urls?.length || 0}</div>
                <div>JavaScript files: {result.data?.js?.length || 0}</div>
                <div>CSS files: {result.data?.css?.length || 0}</div>
                <div>Images: {result.data?.images?.length || 0}</div>
                {result.data?.emails?.length > 0 && (
                  <div>Emails found: {result.data.emails.length}</div>
                )}
              </div>
            ) : (
              <div className="text-red-500 text-sm">{result.error || "Unknown error occurred"}</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotonTool;
