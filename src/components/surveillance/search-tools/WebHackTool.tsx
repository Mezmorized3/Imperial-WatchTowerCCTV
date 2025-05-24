
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, HardDrive, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { executeWebhack } from '@/utils/osintUtilsConnector';
import { WebhackData } from '@/utils/types/osintToolTypes';

interface WebHackToolProps {
  onScanComplete?: (results: any) => void;
}

const WebHackTool = () => {
  const [url, setUrl] = useState('');
  const [scanType, setScanType] = useState('basic');
  const [timeout, setTimeout] = useState('30000');
  const [checkVulnerabilities, setCheckVulnerabilities] = useState(true);
  const [checkSubdomains, setCheckSubdomains] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<WebhackData | null>(null);
  
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
      const result = await executeWebhack({
        tool: 'webhack',
        url,
        scanType: scanType as 'basic' | 'full',
        timeout: parseInt(timeout),
        checkVulnerabilities: true,
        checkSubdomains: true,
        saveResults: false
      });
      
      if (result && result.success) {
        setResults(result.data.results);
        toast({
          title: "Scan Complete",
          description: `Found ${result.data.results?.vulnerabilities?.length || 0} vulnerabilities.`
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
    <Card className="border-gray-700 bg-scanner-dark shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="h-5 w-5 text-scanner-success mr-2" />
          Web Vulnerability Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="url">Target URL</Label>
          <Input
            id="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="scan-type">Scan Type</Label>
            <Select value={scanType} onValueChange={setScanType}>
              <SelectTrigger id="scan-type" className="bg-scanner-dark-alt border-gray-700">
                <SelectValue placeholder="Select scan type" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="full">Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="timeout">Timeout (ms)</Label>
            <Input
              id="timeout"
              type="number"
              placeholder="30000"
              value={timeout}
              onChange={(e) => setTimeout(e.target.value)}
              className="bg-scanner-dark-alt border-gray-700"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="check-vulnerabilities"
            checked={checkVulnerabilities}
            onCheckedChange={(checked) => setCheckVulnerabilities(!!checked)}
          />
          <Label htmlFor="check-vulnerabilities">Check Vulnerabilities</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="check-subdomains"
            checked={checkSubdomains}
            onCheckedChange={(checked) => setCheckSubdomains(!!checked)}
          />
          <Label htmlFor="check-subdomains">Check Subdomains</Label>
        </div>
        
        <Button
          onClick={handleScan}
          disabled={isLoading}
          variant="default"
          className="bg-scanner-primary"
        >
          <Search className="h-4 w-4 mr-2" />
          {isLoading ? "Scanning..." : "Start Scan"}
        </Button>
        
        {results && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Scan Results:</h3>
            {results.vulnerabilities && results.vulnerabilities.length > 0 ? (
              <ul className="text-xs text-gray-400 space-y-1 pl-5 list-disc">
                {results.vulnerabilities.map((vuln: any, index: number) => (
                  <li key={index}>
                    {vuln.type} - {vuln.severity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">No vulnerabilities found.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebHackTool;
