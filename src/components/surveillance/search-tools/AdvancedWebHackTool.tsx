import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Check, Copy, Scan } from 'lucide-react';
import { executeWebhack } from '@/utils/osintUtilsConnector';
import { WebhackData } from '@/utils/types/osintToolTypes';

const AdvancedWebHackTool: React.FC = () => {
  const [url, setUrl] = useState('');
  const [scanType, setScanType] = useState('basic');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<WebhackData | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [options, setOptions] = useState({
    checkVulnerabilities: true,
    checkSubdomains: false,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    saveResults: false
  });

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
      toast({
        title: "Copied to clipboard!",
        description: `The ${type} has been copied to your clipboard.`,
      });
    });
  };

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
      const result = await executeWebhack({
        tool: 'webhack',
        url,
        scanType: scanType as 'basic' | 'full',
        timeout: 30000,
        checkVulnerabilities: options.checkVulnerabilities,
        checkSubdomains: options.checkSubdomains,
        userAgent: options.userAgent,
        saveResults: options.saveResults
      });

      if (result.success) {
        setResults(result.data.results);
        toast({
          title: "Scan Complete",
          description: `Webhack scan for ${url} completed.`,
        });
      } else {
        toast({
          title: "Scan Failed",
          description: result.error || "An error occurred during the scan.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">Advanced Webhack Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="url">Target URL</Label>
            <Input
              type="url"
              id="url"
              placeholder="https://example.com"
              className="bg-scanner-dark-alt border-gray-700"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="scanType">Scan Type</Label>
            <select
              id="scanType"
              className="w-full bg-scanner-dark-alt border-gray-700 rounded-md py-2 px-3 text-sm"
              value={scanType}
              onChange={(e) => setScanType(e.target.value)}
            >
              <option value="basic">Basic</option>
              <option value="full">Full</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Options</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="checkVulnerabilities"
                checked={options.checkVulnerabilities}
                onCheckedChange={(checked) => setOptions({ ...options, checkVulnerabilities: checked })}
              />
              <Label htmlFor="checkVulnerabilities" className="text-sm text-gray-400">
                Check Vulnerabilities
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="checkSubdomains"
                checked={options.checkSubdomains}
                onCheckedChange={(checked) => setOptions({ ...options, checkSubdomains: checked })}
              />
              <Label htmlFor="checkSubdomains" className="text-sm text-gray-400">
                Check Subdomains
              </Label>
            </div>
          </div>

          <div>
            <Label htmlFor="userAgent">User Agent</Label>
            <Input
              type="text"
              id="userAgent"
              className="bg-scanner-dark-alt border-gray-700"
              value={options.userAgent}
              onChange={(e) => setOptions({ ...options, userAgent: e.target.value })}
            />
          </div>

          <Button
            onClick={handleScan}
            disabled={isScanning}
            className="bg-scanner-primary"
          >
            {isScanning ? (
              <>
                <Scan className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Scan className="h-4 w-4 mr-2" />
                Start Scan
              </>
            )}
          </Button>

          {results && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Results</h3>
              {results.vulnerabilities && results.vulnerabilities.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-1.5">
                    <Label>Vulnerabilities</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 border-gray-700 hover:bg-scanner-dark-alt"
                      onClick={() => handleCopyToClipboard(JSON.stringify(results.vulnerabilities, null, 2), 'vulnerabilities')}
                    >
                      {copySuccess === 'vulnerabilities' ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      Copy
                    </Button>
                  </div>
                  <div className="bg-scanner-dark-alt border border-gray-700 rounded-md p-4">
                    <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-96">
                      {JSON.stringify(results.vulnerabilities, null, 2)}
                    </pre>
                  </div>
                </>
              ) : (
                <p className="text-gray-400">No vulnerabilities found.</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedWebHackTool;
