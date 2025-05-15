
// @ts-nocheck // TODO: FIX TYPES
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, ShieldAlert, Loader2, ServerCrash, Search } from 'lucide-react'; // Added Loader2
import { useToast } from '@/hooks/use-toast';
import { executeCCTVHackedScan } from '@/utils/osintImplementations/cctvHackedTools';
import { CCTVHackedParams, CCTVHackedResult, CCTVHackedData, CCTVHackedCamera } from '@/utils/types/osintToolTypes'; // Ensure these types exist

const CCTVHackedTool: React.FC = () => {
  const [target, setTarget] = useState(''); // Can be IP, range, or keyword
  const [scanType, setScanType] = useState<'ip_scan' | 'exploit_db' | 'default_creds'>('ip_scan');
  const [exploitName, setExploitName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CCTVHackedData | null>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!target && scanType !== 'exploit_db') { // Exploit DB might not need a target if it lists general exploits
      toast({ title: 'Error', description: 'Target is required for this scan type.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setResults(null);

    const params: CCTVHackedParams = {
      target_query: target,
      scan_type: scanType,
      exploit_name: scanType === 'exploit_db' ? exploitName : undefined,
      check_default_credentials: scanType === 'default_creds',
    };

    try {
      const response: CCTVHackedResult = await executeCCTVHackedScan(params);
      if (response.success) {
        setResults(response.data);
        toast({
          title: 'Scan Complete',
          description: response.data.message || `Found ${response.data.cameras?.length || 0} potentially vulnerable cameras.`,
        });
      } else {
        toast({
          title: 'Scan Failed',
          description: response.error || 'Unknown error during scan.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('CCTV Hacked Scan error:', error);
      toast({
        title: 'Scan Error',
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
          <ServerCrash className="mr-2 h-5 w-5 text-orange-500" />
          CCTV Hacked / Vulnerability Scanner
        </CardTitle>
        <CardDescription>
          Search for vulnerable CCTV cameras using various methods like IP scans, exploit databases, or default credential checks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="target-query">Target Query (IP, Range, Keyword for Exploit DB)</Label>
          <Input id="target-query" placeholder="e.g., 192.168.1.0/24,Hikvision exploit" value={target} onChange={(e) => setTarget(e.target.value)} className="bg-scanner-dark-alt border-gray-600" />
        </div>
        
        <div>
          <Label htmlFor="scan-type">Scan Type</Label>
          <Select value={scanType} onValueChange={(value: 'ip_scan' | 'exploit_db' | 'default_creds') => setScanType(value)}>
            <SelectTrigger id="scan-type" className="bg-scanner-dark-alt border-gray-600">
              <SelectValue placeholder="Select scan type" />
            </SelectTrigger>
            <SelectContent className="bg-scanner-dark border-gray-600">
              <SelectItem value="ip_scan">IP/Range Scan for Open Ports</SelectItem>
              <SelectItem value="exploit_db">Search Exploit Databases</SelectItem>
              <SelectItem value="default_creds">Check Default Credentials</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {scanType === 'exploit_db' && (
          <div>
            <Label htmlFor="exploit-name">Exploit Name/Keyword (Optional)</Label>
            <Input id="exploit-name" placeholder="e.g., CVE-2023-XXXX, RCE" value={exploitName} onChange={(e) => setExploitName(e.target.value)} className="bg-scanner-dark-alt border-gray-600" />
          </div>
        )}

        <Button onClick={handleScan} disabled={isLoading} className="w-full bg-orange-600 hover:bg-orange-700">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Scan for Vulnerable CCTV
        </Button>
      </CardContent>

      {results && results.cameras && results.cameras.length > 0 && (
        <CardFooter className="flex flex-col items-start space-y-4 mt-4 border-t border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-gray-200">Found Cameras ({results.cameras.length}):</h3>
          <div className="w-full max-h-96 overflow-y-auto space-y-3 pr-2">
            {results.cameras.map((camera: CCTVHackedCamera) => (
              <Card key={camera.id} className="bg-scanner-dark-alt border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Eye className="mr-2 h-4 w-4 text-blue-400" />
                    {camera.ip}:{camera.port}
                  </CardTitle>
                  <CardDescription className="text-xs">{camera.manufacturer} - {camera.model}</CardDescription>
                </CardHeader>
                <CardContent className="text-xs">
                  {camera.vulnerabilities && camera.vulnerabilities.length > 0 ? (
                    <>
                      <p className="font-semibold text-yellow-400">Potential Vulnerabilities:</p>
                      <ul className="list-disc list-inside pl-4">
                        {camera.vulnerabilities.map((vuln, idx) => <li key={idx}>{vuln}</li>)}
                      </ul>
                    </>
                  ) : (
                    <p className="text-gray-400">No specific vulnerabilities listed for this entry (may indicate open port or successful default credential test).</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardFooter>
      )}
       {results && results.message && (!results.cameras || results.cameras.length === 0) && (
         <CardFooter className="border-t border-gray-700 pt-4">
            <p className="text-gray-300">{results.message}</p>
         </CardFooter>
       )}
    </Card>
  );
};

export default CCTVHackedTool;
