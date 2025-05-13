import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ScanFace, Settings, HelpCircle, ShieldAlert, Network, Terminal, Globe } from 'lucide-react';
import { executeWebCheck } from '@/utils/osintTools';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';

interface ScanTarget {
  type: 'ip' | 'domain' | 'url';
  value: string;
}

interface ScanSettings {
  ports?: string;
  timeout?: number;
  aggressive?: boolean;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [scanTarget, setScanTarget] = useState<ScanTarget>({ type: 'ip', value: '' });
  const [scanSettings, setScanSettings] = useState<ScanSettings>({});
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress((prevProgress) => {
          const newProgress = Math.min(prevProgress + 10, 99);
          return newProgress;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setScanProgress(0);
    }
  }, [isScanning]);

  const handleScan = ({ target, settings }: { target: ScanTarget, settings: ScanSettings }) => {
    if (!target.value) {
      toast({
        title: "Error",
        description: "Please enter a target to scan.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);

    // Simulate scan execution
    setTimeout(() => {
      setIsScanning(false);
      setScanProgress(100);
      toast({
        title: "Scan Complete",
        description: `Scan of ${target.value} completed.`,
      });
    }, 5000);
  };

  const handleWebCheck = async () => {
    if (!scanTarget.value) {
      toast({
        title: "Error",
        description: "Please enter a URL to check.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);

    try {
      const result = await executeWebCheck({ url: scanTarget.value });

      if (result.success) {
        toast({
          title: "Web Check Complete",
          description: `Web check of ${scanTarget.value} completed.`,
        });
      } else {
        toast({
          title: "Web Check Failed",
          description: `Web check of ${scanTarget.value} failed.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during the web check.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ScanFace className="h-5 w-5 mr-2 text-scanner-success" />
              Start Scanning
            </CardTitle>
            <CardDescription>Enter a target to begin scanning.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target</Label>
              <Input
                id="target"
                placeholder="e.g., 192.168.1.1 or example.com"
                value={scanTarget.value}
                onChange={(e) => setScanTarget({ ...scanTarget, value: e.target.value })}
                disabled={isScanning}
                className="bg-scanner-dark border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-type">Target Type</Label>
              <Select
                value={scanTarget.type}
                onValueChange={(value) => setScanTarget({ ...scanTarget, type: value as 'ip' | 'domain' | 'url' })}
                disabled={isScanning}
              >
                <SelectTrigger id="target-type" className="bg-scanner-dark border-gray-700">
                  <SelectValue placeholder="Select target type" />
                </SelectTrigger>
                <SelectContent className="bg-scanner-dark border-gray-700">
                  <SelectItem value="ip">IP Address</SelectItem>
                  <SelectItem value="domain">Domain</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showAdvancedSettings && (
              <div className="space-y-2">
                <Label htmlFor="ports">Ports (optional)</Label>
                <Input
                  id="ports"
                  placeholder="e.g., 22,80,443"
                  disabled={isScanning}
                  className="bg-scanner-dark border-gray-700"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="advanced-settings"
                checked={showAdvancedSettings}
                onCheckedChange={() => setShowAdvancedSettings(!showAdvancedSettings)}
                disabled={isScanning}
              />
              <Label htmlFor="advanced-settings">Show Advanced Settings</Label>
            </div>

            <Button
              onClick={() => handleScan({ target: scanTarget, settings: scanSettings })}
              disabled={isScanning}
              className="w-full"
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <ScanFace className="mr-2 h-4 w-4" />
                  Start Scan
                </>
              )}
            </Button>

            <Button
              onClick={handleWebCheck}
              disabled={isScanning}
              variant="secondary"
              className="w-full"
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Web Check
                </>
              )}
            </Button>

            {isScanning && (
              <Progress value={scanProgress} className="w-full" />
            )}
          </CardContent>
        </Card>

        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Terminal className="h-5 w-5 mr-2 text-scanner-success" />
              OSINT Tools
            </CardTitle>
            <CardDescription>Explore various OSINT tools.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Button onClick={() => navigate('/osint-tools')} variant="secondary">
              <Network className="mr-2 h-4 w-4" />
              Network Tools
            </Button>
            <Button onClick={() => navigate('/hacking-tool')} variant="secondary">
              <ShieldAlert className="mr-2 h-4 w-4" />
              Hacking Tools
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-scanner-success" />
              Settings & Help
            </CardTitle>
            <CardDescription>Configure settings and get help.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <Button onClick={() => navigate('/settings')} variant="secondary">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button onClick={() => navigate('/help')} variant="secondary">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Documentation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
