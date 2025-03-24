import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { executeWebhack } from '@/utils/osintTools';
import { WebHackParams } from '@/utils/osintToolTypes';
import { toast } from '@/components/ui/use-toast';
import { Globe, Shield, Server, Database, RefreshCw, AlertTriangle } from 'lucide-react';

const scanTypes = [
  { value: 'full', label: 'Full Scan' },
  { value: 'quick', label: 'Quick Scan' },
  { value: 'passive', label: 'Passive Scan' },
  { value: 'aggressive', label: 'Aggressive Scan' }
];

const WebHackTool = () => {
  const [url, setUrl] = useState('');
  const [scanType, setScanType] = useState('full');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a target URL to scan",
        variant: "destructive"
      });
      return;
    }

    setScanning(true);
    setResults(null);
    setError('');

    try {
      const params: WebHackParams = {
        target: url,
        scanType: scanType,
        mode: scanType === 'aggressive' ? 'aggressive' : 'standard'
      };
      
      const result = await executeWebhack(params);
      
      if (result.success) {
        setResults(result.data);
        toast({
          title: "Scan Complete",
          description: `Found ${result.data.vulnerabilities?.length || 0} vulnerabilities`
        });
      } else {
        setError(result.error || 'Unknown error occurred');
        toast({
          title: "Scan Failed",
          description: result.error || "An unknown error occurred during the scan",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error during scan:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast({
        title: "Scan Error",
        description: err instanceof Error ? err.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark-alt">
      <CardHeader>
        <CardTitle className="text-scanner-primary flex items-center">
          <Globe className="mr-2 h-5 w-5" />
          Web Vulnerability Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="url">Target URL</Label>
          <Input
            id="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={scanning}
            className="bg-scanner-dark border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="scanType">Scan Type</Label>
          <Select
            value={scanType}
            onValueChange={setScanType}
            disabled={scanning}
          >
            <SelectTrigger className="bg-scanner-dark border-gray-700">
              <SelectValue placeholder="Select scan type" />
            </SelectTrigger>
            <SelectContent className="bg-scanner-dark text-white border-gray-700">
              {scanTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleScan}
          disabled={scanning || !url}
          className="w-full bg-scanner-primary hover:bg-scanner-primary/90"
        >
          {scanning ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Start Scan
            </>
          )}
        </Button>

        {error && (
          <div className="text-red-500 mt-2 flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            {error}
          </div>
        )}

        {results && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Scan Results:</h3>
            <div className="bg-scanner-dark-alt rounded-md border border-gray-700 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4" />
                  <span className="text-gray-400">Target:</span>
                </div>
                <span className="font-mono">{results.target}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  <span className="text-gray-400">Scan Type:</span>
                </div>
                <span className="capitalize">{results.mode}</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Server className="mr-2 h-4 w-4" />
                  <span className="text-gray-400">Technologies:</span>
                </div>
                <span>
                  {results.technologies && results.technologies.length > 0 ? (
                    results.technologies.join(', ')
                  ) : (
                    'N/A'
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Database className="mr-2 h-4 w-4" />
                  <span className="text-gray-400">Vulnerabilities:</span>
                </div>
                <span>{results.vulnerabilities?.length || 0}</span>
              </div>

              {results.vulnerabilities && results.vulnerabilities.length > 0 && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vulnerability</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Path</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.vulnerabilities.map((vuln, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{vuln.name}</TableCell>
                          <TableCell>{vuln.severity}</TableCell>
                          <TableCell className="font-mono text-xs">{vuln.path}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebHackTool;
