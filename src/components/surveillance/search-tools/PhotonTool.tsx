
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Globe, ExternalLink } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Key, Mail } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { PhotonParams } from '@/utils/types/networkToolTypes';

// Mock function for Photon tool execution
const mockExecutePhoton = async (params: PhotonParams): Promise<any> => {
  console.log("PhotonTool: executing with params", params);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    urls: [
      'https://example.com',
      'https://example.com/about',
      'https://example.com/contact',
      'https://example.com/products',
      'https://example.com/blog',
    ],
    jsFiles: [
      'https://example.com/js/main.js',
      'https://example.com/js/analytics.js',
    ],
    emails: [
      'info@example.com',
      'support@example.com',
    ],
    apiKeys: [
      'api_key_123456789abcdef',
      'sk_test_example_key',
    ],
    total: 9
  };
};

const PhotonTool: React.FC = () => {
  const [url, setUrl] = useState('');
  const [depth, setDepth] = useState(3);
  const [timeout, setTimeout] = useState(30);
  const [threads, setThreads] = useState(8);
  const [delay, setDelay] = useState(0);
  const [userAgent, setUserAgent] = useState('');
  const [saveResults, setSaveResults] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('urls');

  const handleScan = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to scan",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setResults(null);

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

      // Execute photon tool (using mock in this case)
      const result = await mockExecutePhoton(params);

      setResults(result);
      
      toast({
        title: "Scan Complete",
        description: `Found ${result.total} items`,
      });
    } catch (error) {
      console.error("Error during Photon scan:", error);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Photon - Web Crawler
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Target URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isScanning}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="depth">Crawl Depth: {depth}</Label>
            </div>
            <Slider
              id="depth"
              min={1}
              max={10}
              step={1}
              value={[depth]}
              onValueChange={(value) => setDepth(value[0])}
              disabled={isScanning}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="timeout">Timeout (seconds): {timeout}</Label>
            </div>
            <Slider
              id="timeout"
              min={5}
              max={120}
              step={5}
              value={[timeout]}
              onValueChange={(value) => setTimeout(value[0])}
              disabled={isScanning}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="threads">Threads: {threads}</Label>
            </div>
            <Slider
              id="threads"
              min={1}
              max={20}
              step={1}
              value={[threads]}
              onValueChange={(value) => setThreads(value[0])}
              disabled={isScanning}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="delay">Request Delay (ms): {delay}</Label>
            </div>
            <Slider
              id="delay"
              min={0}
              max={2000}
              step={100}
              value={[delay]}
              onValueChange={(value) => setDelay(value[0])}
              disabled={isScanning}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userAgent">User Agent (Optional)</Label>
            <Input
              id="userAgent"
              placeholder="Mozilla/5.0..."
              value={userAgent}
              onChange={(e) => setUserAgent(e.target.value)}
              disabled={isScanning}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveResults"
              checked={saveResults}
              onCheckedChange={(checked) => setSaveResults(checked === true)}
              disabled={isScanning}
            />
            <Label htmlFor="saveResults">Save Results to Disk</Label>
          </div>
        </div>

        {results && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="urls" className="flex-1">
                URLs
              </TabsTrigger>
              <TabsTrigger value="js" className="flex-1">
                JS Files
              </TabsTrigger>
              <TabsTrigger value="emails" className="flex-1">
                <Mail className="mr-2 h-4 w-4" />
                Emails
              </TabsTrigger>
              <TabsTrigger value="keys" className="flex-1">
                <Key className="mr-2 h-4 w-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="raw" className="flex-1">
                Raw Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="urls" className="mt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">URLs Discovered</h3>
                <ScrollArea className="h-60 border rounded-md p-2">
                  <ul className="space-y-1">
                    {results.urls && results.urls.map((url: string, index: number) => (
                      <li key={index} className="flex items-center justify-between text-sm">
                        <span className="truncate">{url}</span>
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="js" className="mt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">JavaScript Files</h3>
                <ScrollArea className="h-60 border rounded-md p-2">
                  <ul className="space-y-1">
                    {results.jsFiles && results.jsFiles.map((url: string, index: number) => (
                      <li key={index} className="flex items-center justify-between text-sm">
                        <span className="truncate">{url}</span>
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="emails" className="mt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Email Addresses</h3>
                <ScrollArea className="h-60 border rounded-md p-2">
                  <ul className="space-y-1">
                    {results.emails && results.emails.map((email: string, index: number) => (
                      <li key={index} className="flex items-center justify-between text-sm">
                        <span>{email}</span>
                        <a 
                          href={`mailto:${email}`} 
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Mail className="h-3 w-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="keys" className="mt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">API Keys &amp; Tokens</h3>
                <ScrollArea className="h-60 border rounded-md p-2">
                  <ul className="space-y-1">
                    {results.apiKeys && results.apiKeys.map((key: string, index: number) => (
                      <li key={index} className="flex items-center justify-between text-sm">
                        <span className="font-mono">{key}</span>
                        <Key className="h-3 w-3 text-yellow-500" />
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="raw" className="mt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Raw Results</h3>
                <Textarea
                  readOnly
                  value={JSON.stringify(results, null, 2)}
                  className="h-60 font-mono text-sm"
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleScan}
          disabled={isScanning || !url}
        >
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Crawling Website...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Start Crawling
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PhotonTool;
