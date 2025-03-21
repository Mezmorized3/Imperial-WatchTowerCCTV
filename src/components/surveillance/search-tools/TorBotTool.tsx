
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Globe, List, Mail, AlertTriangle } from 'lucide-react';
import { executeTorBot } from '@/utils/osintTools';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export const TorBotTool: React.FC = () => {
  const [url, setUrl] = useState('');
  const [scanType, setScanType] = useState('basic');
  const [checkLive, setCheckLive] = useState(true);
  const [findMail, setFindMail] = useState(true);
  const [saveCrawl, setSaveCrawl] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a .onion URL to scan",
        variant: "destructive"
      });
      return;
    }
    
    setIsScanning(true);
    toast({
      title: "TorBot Scan Initiated",
      description: `Scanning ${url}...`,
    });
    
    try {
      const scanResults = await executeTorBot({
        url,
        scanType: scanType as 'basic' | 'deep',
        checkLive,
        findMail,
        saveCrawl
      });
      
      setResults(scanResults);
      toast({
        title: "Scan Complete",
        description: scanResults?.simulatedData 
          ? "Showing simulated results (dev mode)" 
          : "TorBot scan completed successfully",
      });
    } catch (error) {
      console.error('TorBot scan error:', error);
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
      <Card className="bg-scanner-dark border border-yellow-900">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-200">
              <p className="font-medium">Dark Web Tool Warning</p>
              <p className="text-yellow-300/80">
                This tool interacts with the TOR network. Ensure you have proper authorization before scanning .onion domains. All activity is logged and may be reported to authorities if misused.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Enter .onion URL (e.g., abcdefg.onion)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div>
          <Button 
            onClick={handleSearch} 
            disabled={isScanning || !url}
            className="w-full"
            variant="outline"
          >
            {isScanning ? (
              <>Scanning...</>
            ) : (
              <>
                <Globe className="mr-2 h-4 w-4" />
                Search Dark Web
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="scan-type" className="text-sm">Deep Scan</Label>
                <Switch 
                  id="scan-type" 
                  checked={scanType === 'deep'}
                  onCheckedChange={(checked) => setScanType(checked ? 'deep' : 'basic')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="check-live" className="text-sm">Check If Links are Live</Label>
                <Switch 
                  id="check-live" 
                  checked={checkLive}
                  onCheckedChange={setCheckLive}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="find-mail" className="text-sm">Find Email Addresses</Label>
                <Switch 
                  id="find-mail" 
                  checked={findMail}
                  onCheckedChange={setFindMail}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="save-crawl" className="text-sm">Save Crawl Results</Label>
                <Switch 
                  id="save-crawl" 
                  checked={saveCrawl}
                  onCheckedChange={setSaveCrawl}
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
              <List className="mr-2 h-4 w-4" />
              Links ({results.links?.length || 0})
            </TabsTrigger>
            {results.emails && results.emails.length > 0 && (
              <TabsTrigger value="emails" className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Emails ({results.emails.length})
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
                            <Globe className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-blue-400 font-mono text-sm">{link}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Globe className="h-12 w-12 mx-auto mb-2" />
                    <p>No links discovered</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {results.emails && results.emails.length > 0 && (
            <TabsContent value="emails" className="pt-4">
              <Card className="bg-scanner-dark-alt border-gray-700">
                <CardContent className="pt-4">
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
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
};
