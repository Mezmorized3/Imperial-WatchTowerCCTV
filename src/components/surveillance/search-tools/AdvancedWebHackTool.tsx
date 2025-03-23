
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Crosshair, Globe, Shield, Cpu, Server, RefreshCw, Lock, Database } from 'lucide-react';
import { executeWebhack } from '@/utils/osintImplementations';
import { WebHackParams } from '@/utils/osintToolTypes';
import { toast } from 'sonner';

const AdvancedWebHackTool: React.FC = () => {
  const [url, setUrl] = useState('');
  const [scanType, setScanType] = useState('full');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('scanner');
  const [options, setOptions] = useState({
    checkSqlInjection: true,
    checkXss: true,
    checkFileInclusion: true,
    checkHeaderVulnerabilities: true,
    checkSensitiveFiles: true,
    useProxy: false,
    captureScreenshots: false,
    deepScan: false
  });

  const handleOptionChange = (key: keyof typeof options) => {
    setOptions({...options, [key]: !options[key]});
  };

  const handleScan = async () => {
    if (!url) {
      toast.error('Please enter a target URL');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      toast.warning('URL should start with http:// or https://');
      setUrl(`https://${url}`);
    }

    setIsScanning(true);
    setProgress(0);
    setResults(null);
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 300);

    try {
      const params: WebHackParams = {
        target: url,
        mode: scanType,
        scanType,
        findVulnerabilities: true,
        checkHeaders: options.checkHeaderVulnerabilities,
        testXss: options.checkXss,
        testSql: options.checkSqlInjection
      };
      
      const result = await executeWebhack(params);
      setResults(result.data);
      
      // Simulate scan completion delay
      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setIsScanning(false);
        
        toast.success('Scan completed successfully');
      }, 1000);
    } catch (error) {
      clearInterval(interval);
      setIsScanning(false);
      setProgress(0);
      toast.error('Scan failed. Please try again.');
      console.error('Scan error:', error);
    }
  };

  const renderVulnerabilityTable = () => {
    if (!results?.vulnerabilities?.length) {
      return (
        <div className="text-center py-8">
          <Shield className="h-12 w-12 mx-auto text-green-500 mb-2" />
          <p>No vulnerabilities found</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vulnerability</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Path</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.vulnerabilities.map((vuln: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{vuln.name}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs ${
                  vuln.severity === 'high' ? 'bg-red-500/20 text-red-500' : 
                  vuln.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 
                  'bg-blue-500/20 text-blue-500'
                }`}>
                  {vuln.severity}
                </span>
              </TableCell>
              <TableCell className="font-mono text-xs">{vuln.path}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderTechnologiesSection = () => {
    if (!results?.technologies?.length) {
      return <p>No technology information available</p>;
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {results.technologies.map((tech: string, index: number) => (
          <div key={index} className="bg-scanner-dark p-2 rounded border border-gray-700 text-center">
            {tech}
          </div>
        ))}
      </div>
    );
  };

  const renderPortsSection = () => {
    if (!results?.openPorts?.length) {
      return <p>No open ports detected</p>;
    }

    return (
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {results.openPorts.map((port: number, index: number) => (
          <div key={index} className="bg-scanner-dark p-2 rounded border border-gray-700 text-center">
            {port}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="border-gray-700">
        <CardHeader>
          <CardTitle className="text-scanner-primary flex items-center">
            <Globe className="mr-2 h-5 w-5" />
            Advanced Web Vulnerability Scanner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-3 mb-4">
              <TabsTrigger value="scanner">Scanner</TabsTrigger>
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="results" disabled={!results}>Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scanner" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Target URL</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isScanning}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scanType">Scan Type</Label>
                <Select 
                  value={scanType} 
                  onValueChange={setScanType}
                  disabled={isScanning}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fast">Fast Scan</SelectItem>
                    <SelectItem value="full">Full Scan</SelectItem>
                    <SelectItem value="stealth">Stealth Scan</SelectItem>
                    <SelectItem value="aggressive">Aggressive Scan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isScanning && (
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Scanning in progress...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              <Button 
                onClick={handleScan} 
                disabled={isScanning || !url}
                className="w-full"
              >
                {isScanning ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Crosshair className="h-4 w-4 mr-2" />
                )}
                {isScanning ? 'Scanning...' : 'Start Scan'}
              </Button>
              
              <div className="text-xs text-yellow-500 flex items-start mt-2">
                <AlertTriangle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                <span>
                  For educational purposes only. Only scan systems you own or have explicit permission to test.
                  Unauthorized scanning may be illegal.
                </span>
              </div>
            </TabsContent>
            
            <TabsContent value="options" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Vulnerability Checks
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="checkSqlInjection" 
                        checked={options.checkSqlInjection}
                        onCheckedChange={() => handleOptionChange('checkSqlInjection')}
                      />
                      <Label htmlFor="checkSqlInjection">SQL Injection</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="checkXss" 
                        checked={options.checkXss}
                        onCheckedChange={() => handleOptionChange('checkXss')}
                      />
                      <Label htmlFor="checkXss">Cross-Site Scripting (XSS)</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="checkFileInclusion" 
                        checked={options.checkFileInclusion}
                        onCheckedChange={() => handleOptionChange('checkFileInclusion')}
                      />
                      <Label htmlFor="checkFileInclusion">File Inclusion</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="checkHeaderVulnerabilities" 
                        checked={options.checkHeaderVulnerabilities}
                        onCheckedChange={() => handleOptionChange('checkHeaderVulnerabilities')}
                      />
                      <Label htmlFor="checkHeaderVulnerabilities">Header Vulnerabilities</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center">
                    <Cpu className="h-4 w-4 mr-2" />
                    Scan Options
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="checkSensitiveFiles" 
                        checked={options.checkSensitiveFiles}
                        onCheckedChange={() => handleOptionChange('checkSensitiveFiles')}
                      />
                      <Label htmlFor="checkSensitiveFiles">Check for Sensitive Files</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="captureScreenshots" 
                        checked={options.captureScreenshots}
                        onCheckedChange={() => handleOptionChange('captureScreenshots')}
                      />
                      <Label htmlFor="captureScreenshots">Capture Screenshots</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="deepScan" 
                        checked={options.deepScan}
                        onCheckedChange={() => handleOptionChange('deepScan')}
                      />
                      <Label htmlFor="deepScan">Deep Scan (Slower but more thorough)</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="useProxy" 
                        checked={options.useProxy}
                        onCheckedChange={() => handleOptionChange('useProxy')}
                      />
                      <Label htmlFor="useProxy">Use Proxy Server</Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="results" className="space-y-4">
              {results ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-scanner-dark-alt p-4 rounded-md border border-gray-700">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Target
                      </h3>
                      <p className="font-mono text-sm">{results.target}</p>
                    </div>
                    
                    <div className="bg-scanner-dark-alt p-4 rounded-md border border-gray-700">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Scan Type
                      </h3>
                      <p className="font-mono text-sm capitalize">{results.mode}</p>
                    </div>
                    
                    <div className="bg-scanner-dark-alt p-4 rounded-md border border-gray-700">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Vulnerabilities
                      </h3>
                      <p className="font-mono text-sm">{results.vulnerabilities?.length || 0} found</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Vulnerability Summary
                    </h3>
                    {renderVulnerabilityTable()}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      Detected Technologies
                    </h3>
                    {renderTechnologiesSection()}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center">
                      <Server className="h-4 w-4 mr-2" />
                      Open Ports
                    </h3>
                    {renderPortsSection()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No scan results available. Run a scan first.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedWebHackTool;
