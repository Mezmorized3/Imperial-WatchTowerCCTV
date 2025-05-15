import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { executePhoton } from '@/utils/osintUtilsConnector';
import { Globe, Link, Mail, Search } from 'lucide-react';
import { PhotonParams, PhotonData } from '@/utils/types/webToolTypes';
import { HackingToolResult } from '@/utils/types/osintToolTypes';

const PhotonTool: React.FC = () => {
  const [url, setUrl] = useState('');
  const [depth, setDepth] = useState(2);
  const [timeout, setTimeout] = useState(30);
  const [threads, setThreads] = useState(2);
  const [delay, setDelay] = useState(0);
  const [userAgent, setUserAgent] = useState('');
  const [saveResults, setSaveResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PhotonData | null>(null);

  const handleExecute = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a target URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const params: PhotonParams = {
        tool: 'photon',
        url,
        depth,
        timeout,
        threads,
        delay,
        userAgent,
        saveResults
      };

      const result: HackingToolResult<PhotonData> = await executePhoton(params);

      if (result.success) {
        setResults(result.data.results);
        toast({
          title: "Scan Complete",
          description: `Found ${result.data.results.links?.length || 0} links, ${result.data.results.emails?.length || 0} emails, and ${result.data.results.subdomains?.length || 0} subdomains`
        });
      } else {
        toast({
          title: "Error",
          description: result.error || (result.data as any)?.message || "Failed to execute Photon",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Photon error:", error);
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
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-400" />
          Photon Web Crawler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="url">Target URL</Label>
              <Input
                id="url"
                placeholder="Enter URL to scan"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-scanner-dark border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="depth">Crawl Depth</Label>
              <Input
                id="depth"
                type="number"
                min={1}
                max={10}
                value={depth}
                onChange={(e) => setDepth(parseInt(e.target.value) || 2)}
                className="bg-scanner-dark border-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeout">Timeout (seconds)</Label>
              <Input
                id="timeout"
                type="number"
                min={10}
                max={60}
                value={timeout}
                onChange={(e) => setTimeout(parseInt(e.target.value) || 30)}
                className="bg-scanner-dark border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="threads">Threads</Label>
              <Input
                id="threads"
                type="number"
                min={1}
                max={10}
                value={threads}
                onChange={(e) => setThreads(parseInt(e.target.value) || 2)}
                className="bg-scanner-dark border-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="delay">Delay (ms)</Label>
              <Input
                id="delay"
                type="number"
                min={0}
                max={1000}
                value={delay}
                onChange={(e) => setDelay(parseInt(e.target.value) || 0)}
                className="bg-scanner-dark border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="userAgent">User Agent (Optional)</Label>
              <Input
                id="userAgent"
                placeholder="Custom User Agent"
                value={userAgent}
                onChange={(e) => setUserAgent(e.target.value)}
                className="bg-scanner-dark border-gray-700"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveResults"
              checked={saveResults}
              onCheckedChange={(checked) => setSaveResults(checked === true)}
            />
            <Label htmlFor="saveResults">Save Results</Label>
          </div>

          <Button onClick={handleExecute} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></div>
                Scanning...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Execute Photon
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotonTool;
