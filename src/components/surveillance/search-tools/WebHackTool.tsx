import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Shield, Server, AlertTriangle } from 'lucide-react';
import { executeWebhack } from '@/utils/osintTools';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export const WebHackTool: React.FC = () => {
  const [url, setUrl] = useState('');
  const [scanType, setScanType] = useState('basic');
  const [findVulnerabilities, setFindVulnerabilities] = useState(true);
  const [checkHeaders, setCheckHeaders] = useState(true);
  const [testXss, setTestXss] = useState(true);
  const [testSql, setTestSql] = useState(true);
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
      title: "WebHack Scan Initiated",
      description: `Scanning ${url}...`,
    });
    
    try {
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      const scanResults = await executeWebhack({
        url: formattedUrl,
        scanType
      });
      
      setResults(scanResults);
      toast({
        title: "Scan Complete",
        description: scanResults?.simulatedData 
          ? "Showing simulated results (dev mode)" 
          : "WebHack scan completed successfully",
      });
    } catch (error) {
      console.error('WebHack scan error:', error);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-600 hover:bg-red-700';
      case 'high':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            placeholder="Enter URL to scan (e.g., example.com)"
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
              <>Scanning...</>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Scan Website
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-400">Scan Type</Label>
              <div className="mt-1">
                <Tabs value={scanType} onValueChange={setScanType} className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="basic" className="flex-1">Basic</TabsTrigger>
                    <TabsTrigger value="full" className="flex-1">Full Scan</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="find-vulns" className="text-sm">Find Vulnerabilities</Label>
                <Switch 
                  id="find-vulns" 
                  checked={findVulnerabilities}
                  onCheckedChange={setFindVulnerabilities}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="check-headers" className="text-sm">Check Security Headers</Label>
                <Switch 
                  id="check-headers" 
                  checked={checkHeaders}
                  onCheckedChange={setCheckHeaders}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="test-xss" 
                checked={testXss} 
                onCheckedChange={(checked) => setTestXss(checked as boolean)}
                disabled={!findVulnerabilities}
              />
              <Label htmlFor="test-xss" className={!findVulnerabilities ? "text-gray-500" : ""}>
                Test for XSS vulnerabilities
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="test-sql" 
                checked={testSql} 
                onCheckedChange={(checked) => setTestSql(checked as boolean)}
                disabled={!findVulnerabilities}
              />
              <Label htmlFor="test-sql" className={!findVulnerabilities ? "text-gray-500" : ""}>
                Test for SQL injection
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {results && (
        <Tabs defaultValue="vulnerabilities" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="vulnerabilities" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Vulnerabilities
            </TabsTrigger>
            <TabsTrigger value="headers" className="flex items-center">
              <Server className="mr-2 h-4 w-4" />
              Headers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="vulnerabilities" className="pt-4">
            <Card className="bg-scanner-dark-alt border-gray-700">
              <CardContent className="pt-4">
                {results.vulnerabilities && results.vulnerabilities.length > 0 ? (
                  <div className="space-y-4">
                    {results.vulnerabilities.map((vuln: any, index: number) => (
                      <div key={index} className="p-3 bg-scanner-dark rounded-md border border-gray-700">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                            <span className="font-medium">{vuln.name}</span>
                          </div>
                          <Badge className={getSeverityColor(vuln.severity)}>
                            {vuln.severity}
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-gray-400">
                          <p><span className="font-medium">Path:</span> {vuln.path}</p>
                          <p><span className="font-medium">Details:</span> {vuln.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Shield className="h-12 w-12 mx-auto mb-2" />
                    <p>No vulnerabilities detected</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="headers" className="pt-4">
            <Card className="bg-scanner-dark-alt border-gray-700">
              <CardContent className="pt-4">
                {results.headers && Object.keys(results.headers).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-700">
                          <th className="pb-2">Header</th>
                          <th className="pb-2">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(results.headers).map(([header, value]: any, index: number) => (
                          value && (
                            <tr key={index} className="border-b border-gray-800">
                              <td className="py-2 font-medium">{header}</td>
                              <td className="py-2 text-gray-300">{value}</td>
                            </tr>
                          )
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Server className="h-12 w-12 mx-auto mb-2" />
                    <p>No header information available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
