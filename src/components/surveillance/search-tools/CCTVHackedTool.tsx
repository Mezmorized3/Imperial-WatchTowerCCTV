
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { executeCCTVHacked } from '@/utils/osintTools';
import { Shield, Loader2, Search, Camera } from 'lucide-react';

const CCTVHackedTool = () => {
  const [target, setTarget] = useState('');
  const [bruteforce, setBruteforce] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;

    setLoading(true);
    setResults([]);

    try {
      const response = await executeCCTVHacked({
        target,
        bruteforce,
        advanced
      });

      if (response?.success) {
        setResults(response.data?.results || []);
      }
    } catch (error) {
      console.error('CCTV Hacked error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-gray-700 bg-scanner-dark-alt">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Shield className="w-5 h-5 mr-2 text-red-500" />
          CCTV Hacked Tool
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="target">Target IP or Network Range</Label>
              <Input
                id="target"
                placeholder="192.168.1.1 or 192.168.1.0/24"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="bg-scanner-dark border-gray-700"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="bruteforce" 
                checked={bruteforce} 
                onCheckedChange={(checked) => setBruteforce(!!checked)}
              />
              <Label htmlFor="bruteforce" className="cursor-pointer">Enable Password Bruteforce</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="advanced" 
                checked={advanced} 
                onCheckedChange={(checked) => setAdvanced(!!checked)}
              />
              <Label htmlFor="advanced" className="cursor-pointer">Advanced Exploitation Techniques</Label>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Scan Cameras
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="block">
        {results.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-400">Results ({results.length})</h3>
            {results.map((camera, index) => (
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
            {loading ? 'Scanning for vulnerable cameras...' : 'Enter a target IP or network range and click Scan'}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default CCTVHackedTool;
