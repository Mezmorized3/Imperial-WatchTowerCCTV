import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { executeCCTVHacked } from '@/utils/osintTools';
import { Lock, Search } from 'lucide-react';

const CCTVHackedTool: React.FC = () => {
  const [target, setTarget] = useState('');
  const [port, setPort] = useState('80');
  const [scanType, setScanType] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleExecute = async () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target IP or hostname",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await executeCCTVHacked({
        target,
        port: parseInt(port, 10),
        scanType
      });

      if (result.success) {
        setResults(result.data);
        toast({
          title: "Scan Complete",
          description: `Found ${result.data.cameras?.length || 0} cameras`
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to execute CCTV Hacked",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("CCTV Hacked error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark-alt">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Lock className="w-5 h-5 mr-2 text-red-500" />
          CCTV Hacked Tool
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleExecute} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="target">Target IP or Hostname</Label>
              <Input
                id="target"
                placeholder="192.168.1.1 or example.com"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="bg-scanner-dark border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                className="bg-scanner-dark border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="scanType">Scan Type</Label>
              <Select>
                <SelectTrigger className="bg-scanner-dark border-gray-700">
                  <SelectValue placeholder="Basic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Scan
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="block">
        {results ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-400">Results ({results.cameras?.length || 0})</h3>
            {results.cameras?.map((camera, index) => (
              <div key={index} className="p-2 rounded bg-scanner-dark border border-gray-700 text-sm">
                <div className="flex justify-between">
                  <p className="font-medium text-blue-400">{camera.ip}</p>
                  <p className={`text-xs px-2 py-0.5 rounded ${camera.vulnerable ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                    {camera.vulnerable ? 'Vulnerable' : 'Secure'}
                  </p>
                </div>
                <p>Port: {camera.port}</p>
                {camera.exploits && (
                  <p>Exploits: {camera.exploits.join(', ')}</p>
                )}
                {camera.credentials && (
                  <p>Credentials: {camera.credentials}</p>
                )}
                {camera.firmware && (
                  <p>Firmware: {camera.firmware}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            {isLoading ? 'Scanning for vulnerable cameras...' : 'Enter a target IP or hostname and click Scan'}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default CCTVHackedTool;
