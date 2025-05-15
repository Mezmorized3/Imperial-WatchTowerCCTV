
// @ts-nocheck // TODO: FIX TYPES
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Bug, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeONVIFFuzzer } from '@/utils/osintImplementations/onvifFuzzerTools';
import { ONVIFFuzzerParams, ONVIFFuzzerResult, ONVIFFuzzerData } from '@/utils/types/onvifToolTypes';

interface ONVIFFuzzerToolProps {
  // Props if any
}

const ONVIFFuzzerTool: React.FC<ONVIFFuzzerToolProps> = () => {
  const [targetIp, setTargetIp] = useState('');
  const [targetPort, setTargetPort] = useState('80');
  const [fuzzingLevel, setFuzzingLevel] = useState<'light' | 'medium' | 'heavy'>('light');
  const [fuzzingScope, setFuzzingScope] = useState<'discovery' | 'ptz' | 'streaming' | 'all'>('all');
  const [customPayloads, setCustomPayloads] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ONVIFFuzzerData | null>(null);
  const { toast } = useToast();

  const handleFuzz = async () => {
    if (!targetIp) {
      toast({ title: 'Error', description: 'Target IP is required.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setResults(null);

    const params: ONVIFFuzzerParams = {
      target: targetIp,
      port: parseInt(targetPort, 10) || 80,
      // username: '', // Removed, not part of ONVIFFuzzerParams
      // password: '', // Removed, not part of ONVIFFuzzerParams
      fuzzingLevel,
      fuzzingScope,
      customPayloadFile: customPayloads ? 'custom_payloads.txt' : undefined, // Assuming customPayloads content would be written to a file
      timeout: 30,
      protocol: 'HTTP', // Default or allow selection
    };

    try {
      const response: ONVIFFuzzerResult = await executeONVIFFuzzer(params, customPayloads);
      if (response.success) {
        setResults(response.data);
        toast({
          title: 'Fuzzing Complete',
          description: `Found ${response.data.vulnerabilities?.length || 0} potential vulnerabilities.`,
        });
      } else {
        toast({
          title: 'Fuzzing Failed',
          description: response.error || 'Unknown error occurred during fuzzing.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('ONVIF Fuzzing error:', error);
      toast({
        title: 'Fuzzing Error',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg border-gray-700 bg-scanner-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bug className="mr-2 h-5 w-5 text-red-500" />
          ONVIF Fuzzer
        </CardTitle>
        <CardDescription>
          Test ONVIF-enabled devices for vulnerabilities by sending malformed or unexpected data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="target-ip">Target IP</Label>
            <Input id="target-ip" placeholder="e.g., 192.168.1.100" value={targetIp} onChange={(e) => setTargetIp(e.target.value)} className="bg-scanner-dark-alt border-gray-600" />
          </div>
          <div>
            <Label htmlFor="target-port">Target Port</Label>
            <Input id="target-port" placeholder="e.g., 80 or 554" value={targetPort} onChange={(e) => setTargetPort(e.target.value)} className="bg-scanner-dark-alt border-gray-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fuzzing-level">Fuzzing Level</Label>
            <Select value={fuzzingLevel} onValueChange={(value: 'light' | 'medium' | 'heavy') => setFuzzingLevel(value)}>
              <SelectTrigger id="fuzzing-level" className="bg-scanner-dark-alt border-gray-600">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-600">
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="heavy">Heavy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="fuzzing-scope">Fuzzing Scope</Label>
            <Select value={fuzzingScope} onValueChange={(value: 'discovery' | 'ptz' | 'streaming' | 'all') => setFuzzingScope(value)}>
              <SelectTrigger id="fuzzing-scope" className="bg-scanner-dark-alt border-gray-600">
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-600">
                <SelectItem value="discovery">Discovery</SelectItem>
                <SelectItem value="ptz">PTZ Control</SelectItem>
                <SelectItem value="streaming">Streaming</SelectItem>
                <SelectItem value="all">All Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="custom-payloads">Custom Payloads (Optional, one per line)</Label>
          <Textarea
            id="custom-payloads"
            placeholder="e.g., <script>alert(1)</script>\n../../../../etc/passwd"
            value={customPayloads}
            onChange={(e) => setCustomPayloads(e.target.value)}
            className="min-h-[100px] bg-scanner-dark-alt border-gray-600 font-mono text-sm"
          />
        </div>

        <Button onClick={handleFuzz} disabled={isLoading} className="w-full bg-red-600 hover:bg-red-700">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Bug className="mr-2 h-4 w-4" />
          )}
          Start Fuzzing
        </Button>
      </CardContent>

      {results && (
        <CardFooter className="flex flex-col items-start space-y-4 mt-4 border-t border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-gray-200">Fuzzing Results for {results.target}</h3>
          <div className="w-full space-y-2">
            <p><span className="font-medium">Total Requests:</span> {results.totalRequests}</p>
            <p><span className="font-medium">Abnormal Responses:</span> {results.abnormalResponses}</p>
            <p><span className="font-medium">Vulnerabilities Found:</span> {results.vulnerabilitiesFound ? 'Yes' : 'No'} ({results.vulnerabilities?.length || 0} specific findings)</p>
            
            {results.vulnerabilities && results.vulnerabilities.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="font-medium text-gray-300">Potential Vulnerabilities:</h4>
                <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                  {results.vulnerabilities.map((vuln, index) => (
                    <li key={index} className="text-yellow-400">
                      <span className="font-semibold">{vuln.type}</span> (Severity: {vuln.severity}) - Payload: <code className="bg-gray-700 p-1 rounded text-xs">{vuln.payload}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.crashes && results.crashes.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="font-medium text-gray-300">Potential Crashes/Denial of Service:</h4>
                <ul className="list-disc list-inside pl-4 space-y-1 text-sm">
                  {results.crashes.map((crash, index) => (
                    <li key={index} className="text-red-400">
                      <span className="font-semibold">{crash.service}</span> - Triggered by: <code className="bg-gray-700 p-1 rounded text-xs">{crash.payload}</code> - Details: {crash.details}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {(!results.vulnerabilities || results.vulnerabilities.length === 0) && (!results.crashes || results.crashes.length === 0) && (
              <div className="flex items-center text-green-400 pt-2">
                <ShieldCheck className="mr-2 h-5 w-5" />
                <p>No specific vulnerabilities or crashes detected based on the fuzzing run.</p>
              </div>
            )}
             {results.log && (
              <div className="space-y-2 pt-2">
                <h4 className="font-medium text-gray-300">Fuzzer Log:</h4>
                <Textarea readOnly value={results.log} className="min-h-[150px] bg-gray-800 border-gray-700 font-mono text-xs" />
              </div>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ONVIFFuzzerTool;
