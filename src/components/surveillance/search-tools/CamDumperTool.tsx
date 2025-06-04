
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { executeCamDumper } from '@/utils/osintUtilsConnector';
import { Camera, Search } from 'lucide-react';

const CamDumperTool: React.FC = () => {
  const [target, setTarget] = useState('');
  const [region, setRegion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleExecute = async () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target IP or range",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await executeCamDumper({
        tool: 'camDumper',
        target,
        region
      });

      if (result.success) {
        setResults(result.data);
        toast({
          title: "Scan Complete",
          description: `Found ${result.data.results?.cameras?.length || 0} cameras`
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to execute Cam Dumper",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Cam Dumper error:", error);
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
          <Camera className="w-5 h-5 mr-2 text-blue-400" />
          Cam Dumper
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="target">Target IP/Range</Label>
            <Input
              id="target"
              placeholder="e.g. 192.168.1.0/24 or specific IP"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="bg-scanner-dark border-gray-700"
            />
          </div>
          <div>
            <Label htmlFor="region">Region (Optional)</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="bg-scanner-dark border-gray-700">
                <SelectValue placeholder="Select region (optional)" />
              </SelectTrigger>
              <SelectContent className="bg-scanner-dark border-gray-700">
                <SelectItem value="">Any Region</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="eu">Europe</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleExecute} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></div>
                Scanning...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Execute Cam Dump
              </>
            )}
          </Button>
        </div>
        {results && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-400">Results</h3>
            <ul className="mt-2 space-y-2">
              {results.results?.cameras?.map((camera: any, index: number) => (
                <li key={index} className="p-2 rounded bg-scanner-dark border border-gray-700 text-sm">
                  <p className="font-medium text-blue-400">{camera.ip}:{camera.port}</p>
                  <p>Type: {camera.type || 'Unknown'}</p>
                  <p>Manufacturer: {camera.manufacturer || 'Unknown'}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CamDumperTool;
