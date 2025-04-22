
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { executeTorBot } from '@/utils/osintUtilsConnector';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const TorBotTool: React.FC = () => {
  const [onionUrl, setOnionUrl] = useState('');
  const [scanMode, setScanMode] = useState('standard');
  const [scanDepth, setScanDepth] = useState('3');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!onionUrl) {
      toast({
        title: "Onion URL Required",
        description: "Please enter an Onion URL to scan",
        variant: "destructive"
      });
      return;
    }
    
    // Validate URL format
    try {
      new URL(onionUrl.startsWith('http') ? onionUrl : `http://${onionUrl}`);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Onion URL",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    toast({
      title: "TorBot Scan Initiated",
      description: `Scanning ${onionUrl}...`,
    });
    
    try {
      const formattedUrl = onionUrl.startsWith('http') ? onionUrl : `http://${onionUrl}`;
      const scanResults = await executeTorBot({
        url: formattedUrl,
        mode: scanMode,
        depth: parseInt(scanDepth)
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
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Enter Onion URL to scan (e.g., example.onion)"
            value={onionUrl}
            onChange={(e) => setOnionUrl(e.target.value)}
            className="bg-scanner-dark"
          />
        </div>
        <div>
          <Button 
            onClick={handleSearch} 
            disabled={isSearching || !onionUrl}
            className="w-full"
          >
            {isSearching ? (
              <>Scanning...</>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Scan Onion URL
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-400">Scan Mode</Label>
              <div className="mt-1">
                <Tabs value={scanMode} onValueChange={setScanMode} className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="standard" className="flex-1">Standard</TabsTrigger>
                    <TabsTrigger value="deep" className="flex-1">Deep Scan</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            <div>
              <Label className="text-sm text-gray-400">Scan Depth</Label>
              <Input
                type="number"
                placeholder="Enter scan depth (default: 3)"
                value={scanDepth}
                onChange={(e) => setScanDepth(e.target.value)}
                className="bg-scanner-dark"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {results && (
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardContent className="pt-4">
            <h3 className="text-lg font-semibold mb-4">Scan Results</h3>
            {results.links_found && results.links_found.length > 0 ? (
              <ul className="list-disc pl-5">
                {results.links_found.map((link: string, index: number) => (
                  <li key={index} className="text-blue-400 hover:underline">
                    <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No links found.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
