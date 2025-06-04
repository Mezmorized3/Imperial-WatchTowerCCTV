
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Search, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeOSINT } from '@/utils/osintUtilsConnector';

interface OSINTToolProps {
  onScanComplete?: (results: any) => void;
}

const OSINTTool: React.FC<OSINTToolProps> = ({ onScanComplete }) => {
  const { toast } = useToast();
  const [target, setTarget] = useState('');
  const [searchEngine, setSearchEngine] = useState('google');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [saveResults, setSaveResults] = useState(false);
  const [searchType, setSearchType] = useState('basic');

  const handleScan = async () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target to search",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setResults(null);

    try {
      const result = await executeOSINT({
        tool: 'osint',
        target,
        type: searchType,
        saveResults
      });

      if (result.success) {
        setResults(result.data);
        
        if (onScanComplete) {
          onScanComplete(result.data);
        }
        
        toast({
          title: "OSINT Search Complete",
          description: `Found ${result.data.results?.length || 0} results.`
        });
      } else {
        toast({
          title: "Search Failed",
          description: result.error || "Failed to complete OSINT search",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("OSINT search error:", error);
      toast({
        title: "Search Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="h-5 w-5 text-scanner-info mr-2" />
          OSINT Intelligence Gathering
        </CardTitle>
        <CardDescription>
          Open Source Intelligence gathering and analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="target">Target</Label>
          <Input
            id="target"
            placeholder="Domain, IP, email, username, or organization"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="search-engine">Search Engine</Label>
            <Select value={searchEngine} onValueChange={setSearchEngine}>
              <SelectTrigger id="search-engine" className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select search engine" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="bing">Bing</SelectItem>
                <SelectItem value="duckduckgo">DuckDuckGo</SelectItem>
                <SelectItem value="yandex">Yandex</SelectItem>
                <SelectItem value="baidu">Baidu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="search-type">Search Type</Label>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger id="search-type" className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select search type" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="basic">Basic Search</SelectItem>
                <SelectItem value="deep">Deep Search</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="technical">Technical Intelligence</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="save-results"
            checked={saveResults}
            onCheckedChange={(checked) => setSaveResults(!!checked)}
          />
          <Label htmlFor="save-results">Save Results</Label>
        </div>
        
        <Button
          onClick={handleScan}
          disabled={isScanning}
          variant="default"
          className="bg-scanner-primary w-full"
        >
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gathering Intelligence...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Start OSINT Search
            </>
          )}
        </Button>
      </CardContent>
      
      {results && (
        <CardFooter className="block">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold mb-2">OSINT Results:</h3>
            {results.results && results.results.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {results.results.map((result: any, index: number) => (
                  <div key={index} className="p-2 rounded bg-scanner-dark border border-gray-700 text-sm">
                    <p className="font-medium text-scanner-info">{result.title || result.source}</p>
                    <p className="text-xs text-gray-400">{result.url || result.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No results found.</p>
            )}
            
            {results.metadata && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <p className="text-xs text-gray-400">
                  Query completed in {results.metadata.queryTime || 'N/A'} | 
                  Total results: {results.metadata.total || 0}
                </p>
              </div>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default OSINTTool;
