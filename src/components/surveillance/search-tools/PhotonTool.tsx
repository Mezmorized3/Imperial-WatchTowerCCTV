
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Search, Link2, Mail, Key } from 'lucide-react';
import { executePhoton } from '@/utils/osintTools';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

export const PhotonTool: React.FC = () => {
  const [url, setUrl] = useState('');
  const [depth, setDepth] = useState(2);
  const [timeout, setTimeout] = useState(10);
  const [findSecrets, setFindSecrets] = useState(true);
  const [findKeys, setFindKeys] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to scan",
        variant: "destructive"
      });
      return;
    }
    
    // Validate URL format
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }
    
    setIsScanning(true);
    toast({
      title: "Photon Crawler Initiated",
      description: `Crawling ${url} with depth ${depth}...`,
    });
    
    try {
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      const scanResults = await executePhoton({
        url: formattedUrl,
        depth,
        timeout,
        findSecrets,
        findKeys
      });
      
      setResults(scanResults);
      toast({
        title: "Crawl Complete",
        description: scanResults?.simulatedData 
          ? "Showing simulated results (dev mode)" 
          : "Website crawled successfully",
      });
    } catch (error) {
      console.error('Photon scan error:', error);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
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
            disabled={isScanning || !url}
            className="w-full"
          >
            {isScanning ? (
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
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="find-secrets" className="text-sm">Find Secrets</Label>
                <Switch 
                  id="find-secrets" 
                  checked={findSecrets}
                  onCheckedChange={setFindSecrets}
                />
              </div>
              <p className="text-xs text-gray-400">Look for hardcoded passwords, tokens, and keys</p>
              
              <div className="flex items-center justify-between mt-4">
                <Label htmlFor="find-keys" className="text-sm">Find API Keys</Label>
                <Switch 
                  id="find-keys" 
                  checked={findKeys}
                  onCheckedChange={setFindKeys}
                />
              </div>
              <p className="text-xs text-gray-400">Detect common API key patterns in code</p>
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
