import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Search, Link2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { executePhoton } from '@/utils/osintTools';

export const PhotonTool: React.FC = () => {
  const [url, setUrl] = useState('');
  const [depth, setDepth] = useState(2);
  const [timeout, setTimeout] = useState(10);
  const [threads, setThreads] = useState(5);
  const [delay, setDelay] = useState(1000);
  const [userAgent, setUserAgent] = useState('');
  const [saveResults, setSaveResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleScan = async () => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await executePhoton({
        url,
        depth: parseInt(depth),
        timeout: parseInt(timeout),
        threads: parseInt(threads),
        delay: parseInt(delay),
        userAgent,
        saveResults
      });
      
      if (result && result.success) {
        setResults(result.data);
        toast({
          title: "Scan Complete",
          description: `Found ${result.data?.urls?.length || 0} URLs.`
        });
      } else {
        toast({
          title: "Scan Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during scan:", error);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Enter URL to crawl (e.g., example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div>
          <Button 
            onClick={handleScan} 
            disabled={isLoading || !url}
            className="w-full"
          >
            {isLoading ? (
              <>Crawling...</>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Crawl Website
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardHeader>
          <CardTitle>Crawl Settings</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="depth-slider">Crawl Depth: {depth}</Label>
                </div>
                <Slider 
                  id="depth-slider"
                  min={1} 
                  max={5} 
                  step={1} 
                  value={[depth]} 
                  onValueChange={(value) => setDepth(value[0])}
                />
                <p className="text-xs text-gray-400">Higher depth values crawl more pages but take longer</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="timeout-slider">Timeout: {timeout}s</Label>
                </div>
                <Slider 
                  id="timeout-slider"
                  min={5} 
                  max={30} 
                  step={1} 
                  value={[timeout]} 
                  onValueChange={(value) => setTimeout(value[0])}
                />
                <p className="text-xs text-gray-400">Maximum time to wait for each request</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="threads-slider">Threads: {threads}</Label>
                </div>
                <Slider 
                  id="threads-slider"
                  min={1} 
                  max={10} 
                  step={1} 
                  value={[threads]} 
                  onValueChange={(value) => setThreads(value[0])}
                />
                <p className="text-xs text-gray-400">Number of concurrent requests</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="delay-slider">Delay: {delay}ms</Label>
                </div>
                <Slider 
                  id="delay-slider"
                  min={1000} 
                  max={5000} 
                  step={1000} 
                  value={[delay]} 
                  onValueChange={(value) => setDelay(value[0])}
                />
                <p className="text-xs text-gray-400">Delay between requests</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="user-agent">User-Agent</Label>
                </div>
                <Input 
                  id="user-agent"
                  value={userAgent}
                  onChange={(e) => setUserAgent(e.target.value)}
                  className="bg-scanner-dark"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="save-results">Save Results</Label>
                </div>
                <Checkbox 
                  id="save-results"
                  checked={saveResults}
                  onChange={(e) => setSaveResults(e.target.checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {results && (
        <Tabs defaultValue="links" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="links" className="flex items-center">
              <Link2 className="mr-2 h-4 w-4" />
              Links ({results.links?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Emails ({results.emails?.length || 0})
            </TabsTrigger>
            {results.secrets && results.secrets.length > 0 && (
              <TabsTrigger value="secrets" className="flex items-center">
                <Key className="mr-2 h-4 w-4" />
                Secrets ({results.secrets.length})
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="links" className="pt-4">
            <Card className="bg-scanner-dark-alt border-gray-700">
              <CardContent className="pt-4">
                {results.links && results.links.length > 0 ? (
                  <ScrollArea className="h-[300px]">
                    <ul className="space-y-2">
                      {results.links.map((link: string, index: number) => (
                        <li key={index} className="p-2 bg-scanner-dark rounded hover:bg-scanner-dark-alt">
                          <div className="flex items-center">
                            <Link2 className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-blue-400 hover:underline font-mono text-sm break-all">{link}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Link2 className="h-12 w-12 mx-auto mb-2" />
                    <p>No links discovered</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="emails" className="pt-4">
            <Card className="bg-scanner-dark-alt border-gray-700">
              <CardContent className="pt-4">
                {results.emails && results.emails.length > 0 ? (
                  <ScrollArea className="h-[300px]">
                    <ul className="space-y-2">
                      {results.emails.map((email: string, index: number) => (
                        <li key={index} className="p-2 bg-scanner-dark rounded hover:bg-scanner-dark-alt">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-green-400 font-mono text-sm">{email}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Mail className="h-12 w-12 mx-auto mb-2" />
                    <p>No email addresses discovered</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {results.secrets && results.secrets.length > 0 && (
            <TabsContent value="secrets" className="pt-4">
              <Card className="bg-scanner-dark-alt border-gray-700">
                <CardContent className="pt-4">
                  <ScrollArea className="h-[300px]">
                    <ul className="space-y-2">
                      {results.secrets.map((secret: any, index: number) => (
                        <li key={index} className="p-2 bg-scanner-dark rounded hover:bg-scanner-dark-alt">
                          <div className="flex items-start">
                            <Key className="h-4 w-4 text-red-400 mr-2 mt-0.5" />
                            <div>
                              <span className="text-red-400 font-medium">{secret.type}:</span>
                              <div className="font-mono text-sm bg-scanner-dark-alt mt-1 p-1 rounded">
                                {secret.value}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
};
