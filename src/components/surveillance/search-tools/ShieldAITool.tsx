import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { executeShieldAI } from '@/utils/osintUtilsConnector';

const ShieldAITool: React.FC = () => {
  const [target, setTarget] = useState('');
  const [mode, setMode] = useState('vulnerability');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleScan = async () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target system",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setResults(null);

    try {
      const result = await executeShieldAI({
        tool: 'shieldAI',
        targetSystem: target,
        scanType: mode as 'vulnerability' | 'compliance' | 'threat_detection'
      });

      if (result.success) {
        setResults(result.data.results);
        toast({
          title: "Scan Complete",
          description: result.data.message || "Shield AI scan completed successfully",
        });
      } else {
        toast({
          title: "Scan Failed",
          description: result.error || "Shield AI scan failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="bg-scanner-dark-alt border-gray-700">
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="target">Target System</Label>
          <Input
            id="target"
            placeholder="Enter IP, hostname, or system ID"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="bg-scanner-dark-alt border-gray-700"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mode">Scan Type</Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger id="mode" className="bg-scanner-dark-alt border-gray-700">
              <SelectValue placeholder="Select scan type" />
            </SelectTrigger>
            <SelectContent className="bg-scanner-dark border-gray-700">
              <SelectItem value="vulnerability">Vulnerability Scan</SelectItem>
              <SelectItem value="compliance">Compliance Scan</SelectItem>
              <SelectItem value="threat_detection">Threat Detection</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          onClick={handleScan}
          disabled={isScanning}
          className="w-full bg-scanner-primary"
        >
          {isScanning ? 'Scanning...' : <Shield className="h-4 w-4 mr-2" />}
          {isScanning ? 'Scanning...' : 'Start Shield AI Scan'}
        </Button>
        
        {results && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Scan Results</h3>
            <pre className="text-xs overflow-auto whitespace-pre-wrap max-h-60 p-2 bg-black/30 rounded">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShieldAITool;
