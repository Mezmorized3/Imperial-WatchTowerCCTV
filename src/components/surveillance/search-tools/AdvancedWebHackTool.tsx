import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Search, Shield } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { executeWebhack } from '@/utils/osintTools';
import { WebHackParams } from '@/utils/types/webToolTypes';

interface AdvancedWebHackToolProps {
  onScanComplete?: (results: any) => void;
}

const AdvancedWebHackTool: React.FC<AdvancedWebHackToolProps> = ({ onScanComplete }) => {
  const [targetUrl, setTargetUrl] = useState('');
  const [scanType, setScanType] = useState('basic');
  const [timeout, setTimeout] = useState('30000');
  const [checkVulnerabilities, setCheckVulnerabilities] = useState(true);
  const [checkSubdomains, setCheckSubdomains] = useState(false);
  const [userAgent, setUserAgent] = useState('');
  const [saveResults, setSaveResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const scanTypes = ['basic', 'full'];
  
  const startScan = async () => {
    // Validate URL
    if (!targetUrl.startsWith('http')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setResults(null);
    
    try {
      // Construct scan parameters
      const params: WebHackParams = {
        url: targetUrl,
        scanType: scanType as 'basic' | 'full', // Cast the string to the correct type
        timeout: parseInt(timeout),
        checkVulnerabilities: checkVulnerabilities,
        checkSubdomains: checkSubdomains,
        userAgent: userAgent || undefined,
        saveResults: saveResults
      };
      
      // Execute the scan
      const result = await executeWebhack(params);
      
      if (result && result.success) {
        setResults(result.data);
        
        if (onScanComplete) {
          onScanComplete(result.data);
        }
        
        toast({
          title: "Scan Complete",
          description: `Found ${result.data?.vulnerabilities?.length || 0} vulnerabilities.`
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
          <Shield className="h-5 w-5 text-scanner-success mr-2" />
          Advanced Web Hack
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="target-url">Target URL</Label>
          <Input
            id="target-url"
            placeholder="https://example.com"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
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
                {scanTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
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
            onCheckedChange={(checked) => setCheckVulnerabilities(checked === true)}
          />
          <Label htmlFor="check-vulnerabilities">Check Vulnerabilities</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="check-subdomains"
            checked={checkSubdomains}
            onCheckedChange={(checked) => setCheckSubdomains(checked === true)}
          />
          <Label htmlFor="check-subdomains">Check Subdomains</Label>
        </div>
        
        <div>
          <Label htmlFor="user-agent">User Agent (optional)</Label>
          <Input
            id="user-agent"
            placeholder="Mozilla/5.0..."
            value={userAgent}
            onChange={(e) => setUserAgent(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="save-results"
            checked={saveResults}
            onCheckedChange={(checked) => setSaveResults(checked === true)}
          />
          <Label htmlFor="save-results">Save Results</Label>
        </div>
        
        <Button
          onClick={startScan}
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
            <pre className="text-xs text-gray-400 whitespace-pre-wrap">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedWebHackTool;
