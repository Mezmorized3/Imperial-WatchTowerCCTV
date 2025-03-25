import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Search, Globe } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { executeOSINT } from '@/utils/osintTools';

interface OSINTToolProps {
  onScanComplete?: (results: any) => void;
}

const mockOsintData = {
  success: true,
  data: {
    results: [
      { source: "Google", title: "Sample result 1", url: "https://example.com/1" },
      { source: "DuckDuckGo", title: "Sample result 2", url: "https://example.com/2" }
    ],
    metadata: {
      queryTime: "0.75s",
      total: 2
    }
  },
  simulatedData: true
};

const OSINTTool: React.FC<OSINTToolProps> = ({ onScanComplete }) => {
  const [target, setTarget] = useState('');
  const [searchEngine, setSearchEngine] = useState('google');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [saveResults, setSaveResults] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'text' | 'json'>('text');
  const [apiKey, setApiKey] = useState('');
  const [customOptions, setCustomOptions] = useState('');

  const handleScan = async () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target to search for",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setResults(null);

    try {
      let result;
      
      if (typeof executeOSINT === 'function') {
        result = await executeOSINT();
      } else {
        result = mockOsintData;
      }

      if (result && result.success) {
        setResults(result.data);

        if (onScanComplete) {
          onScanComplete(result.data);
        }

        toast({
          title: "Scan Complete",
          description: `OSINT scan completed successfully`
        });
      } else {
        toast({
          title: "Scan Failed",
          description: result?.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during OSINT scan:", error);
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
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          OSINT Tool
        </CardTitle>
        <CardDescription>
          Gather intelligence from various online sources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target">Target</Label>
            <Input
              id="target"
              placeholder="Enter target to search"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={isScanning}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="searchEngine">Search Engine</Label>
            <Select
              value={searchEngine}
              onValueChange={setSearchEngine}
              disabled={isScanning}
            >
              <SelectTrigger id="searchEngine">
                <SelectValue placeholder="Select search engine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="bing">Bing</SelectItem>
                <SelectItem value="duckduckgo">DuckDuckGo</SelectItem>
                <SelectItem value="yandex">Yandex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key (Optional)</Label>
            <Input
              id="apiKey"
              placeholder="Enter API key if required"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isScanning}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customOptions">Custom Options (Optional)</Label>
            <Input
              id="customOptions"
              placeholder="Enter custom options"
              value={customOptions}
              onChange={(e) => setCustomOptions(e.target.value)}
              disabled={isScanning}
            />
          </div>

          <div className="space-y-2 flex items-center gap-2">
            <Checkbox
              id="saveResults"
              checked={saveResults}
              onCheckedChange={(checked) => setSaveResults(checked === true)}
              disabled={isScanning}
            />
            <Label htmlFor="saveResults">Save Results</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="outputFormat">Output Format</Label>
            <Select
              value={outputFormat}
              onValueChange={(value: 'text' | 'json') => setOutputFormat(value)}
              disabled={isScanning}
            >
              <SelectTrigger id="outputFormat">
                <SelectValue placeholder="Select output format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {results && (
            <div className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold">Scan Results</h3>
              <Textarea
                readOnly
                value={JSON.stringify(results, null, 2)}
                className="min-h-32 font-mono text-sm bg-scanner-dark-alt border-gray-700"
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleScan}
          disabled={isScanning || !target}
        >
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Start OSINT Scan
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OSINTTool;
