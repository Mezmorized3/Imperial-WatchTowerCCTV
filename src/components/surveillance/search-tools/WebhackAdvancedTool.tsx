
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Globe, Shield, AlertTriangle } from 'lucide-react';
import { executeWebhackAdvanced } from '@/utils/osintImplementations/webTools';
import { WebhackAdvancedParams } from '@/utils/osintToolTypes';
import { useToast } from '@/hooks/use-toast';

const WebhackAdvancedTool: React.FC = () => {
  const [target, setTarget] = useState<string>('');
  const [scanType, setScanType] = useState<string>('standard');
  const [testXSS, setTestXSS] = useState<boolean>(true);
  const [testSQLi, setTestSQLi] = useState<boolean>(true);
  const [testRFI, setTestRFI] = useState<boolean>(false);
  const [bruteforce, setBruteforce] = useState<boolean>(false);
  const [exploitVulnerabilities, setExploitVulnerabilities] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<string>('json');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [results, setResults] = useState<string | null>(null);
  const { toast } = useToast();

  const scanTypes = [
    { value: 'standard', label: 'Standard Scan' },
    { value: 'quick', label: 'Quick Scan' },
    { value: 'full', label: 'Full Scan' },
    { value: 'stealth', label: 'Stealth Scan' },
    { value: 'aggressive', label: 'Aggressive Scan' }
  ];

  const formatOptions = ['json', 'text', 'xml', 'html', 'yaml'];

  const handleExecute = async () => {
    if (!target) {
      toast({
        title: "Target Required",
        description: "Please enter a target URL or IP",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsExecuting(true);
      setResults(null);
      
      const params: WebhackAdvancedParams = {
        target,
        scanType,
        testXSS,
        testSQLi,
        testRFI,
        bruteforce,
        exploitVulnerabilities,
        outputFormat
      };
      
      const result = await executeWebhackAdvanced(params);
      
      if (result.success) {
        toast({
          title: "Scan Complete",
          description: `Webhack scan of ${target} completed successfully`,
        });
        setResults(JSON.stringify(result.data, null, 2));
      } else {
        toast({
          title: "Scan Failed",
          description: result.error || "An error occurred during scanning",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error executing webhack:", error);
      toast({
        title: "Execution Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark-alt">
      <CardHeader>
        <CardTitle className="text-scanner-primary flex items-center">
          <Globe className="mr-2 h-5 w-5" />
          WebHack Advanced (yan4ikyt/webhack)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="target">Target URL or IP</Label>
          <Input
            id="target"
            placeholder="https://example.com or 192.168.1.1"
            className="bg-scanner-dark border-gray-700"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="scanType">Scan Type</Label>
            <Select value={scanType} onValueChange={setScanType}>
              <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
                <SelectValue placeholder="Select scan type" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark text-white border-gray-700">
                {scanTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="outputFormat">Output Format</Label>
            <Select value={outputFormat} onValueChange={setOutputFormat}>
              <SelectTrigger className="w-full bg-scanner-dark border-gray-700">
                <SelectValue placeholder="Select output format" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark text-white border-gray-700">
                {formatOptions.map((format) => (
                  <SelectItem key={format} value={format}>{format.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="testXSS"
              checked={testXSS}
              onCheckedChange={setTestXSS}
            />
            <Label htmlFor="testXSS">Test XSS Vulnerabilities</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="testSQLi"
              checked={testSQLi}
              onCheckedChange={setTestSQLi}
            />
            <Label htmlFor="testSQLi">Test SQL Injection</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="testRFI"
              checked={testRFI}
              onCheckedChange={setTestRFI}
            />
            <Label htmlFor="testRFI">Test RFI/LFI</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="bruteforce"
              checked={bruteforce}
              onCheckedChange={setBruteforce}
            />
            <Label htmlFor="bruteforce">Attempt Bruteforce</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="exploitVulnerabilities"
              checked={exploitVulnerabilities}
              onCheckedChange={setExploitVulnerabilities}
            />
            <Label htmlFor="exploitVulnerabilities">Exploit Vulnerabilities</Label>
          </div>
        </div>
        
        <Button
          onClick={handleExecute}
          disabled={isExecuting || !target}
          className="w-full bg-scanner-warning hover:bg-scanner-warning/90 text-black"
        >
          {isExecuting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Shield className="h-4 w-4 mr-2" />
          )}
          Execute WebHack Scan
        </Button>
        
        {results && (
          <div className="mt-4">
            <Label>Scan Results</Label>
            <div className="bg-black rounded p-2 mt-1 overflow-auto max-h-60 text-xs font-mono">
              <pre>{results}</pre>
            </div>
          </div>
        )}
        
        <div className="mt-2 text-xs text-gray-400 flex items-start">
          <AlertTriangle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
          <span>
            WebHack is a security testing tool. Only use on systems you own or have permission to test.
            Unauthorized access to computer systems is illegal.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhackAdvancedTool;
