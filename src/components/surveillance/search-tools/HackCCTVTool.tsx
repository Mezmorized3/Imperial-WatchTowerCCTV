
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { executeHackCCTV } from '@/utils/osintImplementations';
import { Loader2, Search, ShieldAlert, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { HackCCTVParams } from '@/utils/types/cameraTypes';

const HackCCTVTool: React.FC = () => {
  const { toast } = useToast();
  const [target, setTarget] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [deepScan, setDeepScan] = useState<boolean>(false);
  const [bruteforce, setBruteforce] = useState<boolean>(true);
  const [manufacturer, setManufacturer] = useState<string>('');
  const [scanMethod, setScanMethod] = useState<string>('default-credentials');

  const countries = [
    { value: '', label: 'All Countries' },
    { value: 'georgia', label: 'Georgia' },
    { value: 'romania', label: 'Romania' },
    { value: 'ukraine', label: 'Ukraine' },
    { value: 'russia', label: 'Russia' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'jp', label: 'Japan' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' }
  ];

  const manufacturers = [
    { value: '', label: 'All Manufacturers' },
    { value: 'hikvision', label: 'Hikvision' },
    { value: 'dahua', label: 'Dahua' },
    { value: 'axis', label: 'Axis' },
    { value: 'foscam', label: 'Foscam' },
    { value: 'amcrest', label: 'Amcrest' },
    { value: 'reolink', label: 'Reolink' },
    { value: 'ubiquiti', label: 'Ubiquiti' },
    { value: 'bosch', label: 'Bosch' },
    { value: 'hanwha', label: 'Hanwha' },
    { value: 'vivotek', label: 'Vivotek' }
  ];

  const handleSearch = async () => {
    if (!target) {
      toast({
        title: "Target Required",
        description: "Please enter an IP address or range to scan",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const params: HackCCTVParams = {
        target,
        method: scanMethod as any,
        deepScan,
        bruteforce,
        country: country || undefined,
        manufacturer: manufacturer || undefined,
        saveResults: true
      };

      const response = await executeHackCCTV(params);

      if (response && response.success && response.data && response.data.cameras) {
        setResults(response.data.cameras);
        toast({
          title: 'Scan Complete',
          description: `Found ${response.data.cameras.length} vulnerable cameras`,
        });
      } else {
        toast({
          title: 'No Results',
          description: 'No vulnerable cameras found or scan failed',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('CCTV hack error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">HackCCTV Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Target IP/Range</Label>
                <Input
                  placeholder="192.168.1.0/24 or single IP"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">Enter IP address or CIDR range</p>
              </div>
              
              <div>
                <Label className="mb-2 block">Country Filter</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">Manufacturer Filter</Label>
                <Select value={manufacturer} onValueChange={setManufacturer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select manufacturer (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {manufacturers.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="mb-2 block">Scan Method</Label>
                <Select value={scanMethod} onValueChange={setScanMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scan method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default-credentials">Default Credentials</SelectItem>
                    <SelectItem value="exploit">Known Exploits</SelectItem>
                    <SelectItem value="brute-force">Brute Force</SelectItem>
                    <SelectItem value="rtsp-discovery">RTSP Discovery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="deepScan" 
                  checked={deepScan} 
                  onCheckedChange={(checked) => setDeepScan(checked === true)}
                />
                <Label htmlFor="deepScan">Deep Scan (slower but more thorough)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="bruteforce" 
                  checked={bruteforce} 
                  onCheckedChange={(checked) => setBruteforce(checked === true)}
                />
                <Label htmlFor="bruteforce">Test Default Credentials</Label>
              </div>
            </div>
            
            <Button 
              onClick={handleSearch} 
              disabled={loading || !target}
              className="w-full mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Find Vulnerable Cameras
                </>
              )}
            </Button>
          </div>

          {loading && (
            <div className="mt-8 text-center">
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
              <p>Scanning for vulnerable cameras. This might take a while...</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Results: {results.length} Cameras Found</h3>
              <div className="space-y-4">
                {results.map((camera, index) => (
                  <Card key={index} className="overflow-hidden border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h4 className="text-lg font-medium flex items-center gap-2">
                            {camera.ip}:{camera.port} 
                            {camera.status === 'vulnerable' && (
                              <Badge variant="destructive" className="ml-2">
                                Vulnerable
                              </Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {camera.manufacturer} {camera.model}
                          </p>
                          <p className="text-sm mt-1">
                            Location: {camera.geolocation?.country || 'Unknown'}, {camera.geolocation?.city || 'Unknown'}
                          </p>
                        </div>
                        
                        <div className="mt-2 md:mt-0">
                          {camera.credentials && (
                            <div className="text-sm bg-green-900/30 p-2 rounded">
                              <p className="font-medium flex items-center gap-1">
                                <Lock className="h-3 w-3" />
                                Credentials Found:
                              </p>
                              <code className="text-green-300">
                                {camera.credentials.username}:{camera.credentials.password}
                              </code>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {camera.vulnerabilities && camera.vulnerabilities.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium flex items-center gap-1 mb-1">
                            <ShieldAlert className="h-3 w-3 text-red-400" />
                            Vulnerabilities:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {camera.vulnerabilities.map((vuln: any, vIndex: number) => (
                              <Badge 
                                key={vIndex} 
                                variant="outline"
                                className={`${getSeverityColor(vuln.severity)} text-white`}
                              >
                                {vuln.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {camera.rtspUrl && (
                        <div className="mt-2 text-xs">
                          <p className="font-medium">RTSP Stream:</p>
                          <code className="bg-gray-800 p-1 rounded block overflow-x-auto">
                            {camera.rtspUrl}
                          </code>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {!loading && results.length === 0 && (
            <div className="mt-8 text-center text-muted-foreground">
              <p>Enter target details and click search to find vulnerable cameras</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">About HackCCTV Tool</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            This tool implements functionality from various open-source camera discovery 
            and security assessment tools including Hack-CCTV, CCTV-Hack.py, Cam-Dumper, 
            OpenCCTV, and CCTV_HACKED.
          </p>
          <Separator className="my-2" />
          <p className="text-red-400 font-medium">
            Important: This tool should only be used for authorized security testing
            and educational purposes. Unauthorized access to camera systems is illegal
            in most jurisdictions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HackCCTVTool;
