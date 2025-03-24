import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Loader2, 
  Wifi, 
  ShieldAlert, 
  Eye, 
  Globe,
  Crosshair,
  AlertTriangle,
  Key
} from 'lucide-react';
import { executeHackCCTV } from '@/utils/osintImplementations';
import { CameraResult, HackCCTVParams } from '@/utils/osintToolTypes';

const HackCCTVTool: React.FC = () => {
  const { toast } = useToast();
  const [targetIP, setTargetIP] = useState<string>('');
  const [targetRange, setTargetRange] = useState<string>('');
  const [ports, setPorts] = useState<string>('80,554,8080');
  const [timeout, setTimeout] = useState<number>(3);
  const [bruteforce, setBruteforce] = useState<boolean>(true);
  const [deepScan, setDeepScan] = useState<boolean>(false);
  const [exploitType, setExploitType] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<CameraResult[]>([]);
  const [activeTab, setActiveTab] = useState<string>('single');

  const exploitOptions = [
    { value: 'all', label: 'All Exploits' },
    { value: 'default_creds', label: 'Default Credentials' },
    { value: 'command_injection', label: 'Command Injection' },
    { value: 'xss', label: 'Cross-Site Scripting (XSS)' },
    { value: 'auth_bypass', label: 'Authentication Bypass' }
  ];

  const handleSearch = async () => {
    // Validate inputs
    if (activeTab === 'single' && !targetIP) {
      toast({
        title: 'Error',
        description: 'Please enter a target IP address',
        variant: 'destructive',
      });
      return;
    }

    if (activeTab === 'range' && !targetRange) {
      toast({
        title: 'Error',
        description: 'Please enter a target IP range',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const params: HackCCTVParams = {
        target: activeTab === 'single' ? targetIP : targetRange,
        exploitType,
        bruteforce,
        ports,
        timeout,
        deepScan
      };

      // Execute hackCCTV with the provided parameters
      const response = await executeHackCCTV(params);

      if (response.success && response.data && response.data.cameras) {
        setResults(convertCameraResults(response.data.cameras));
        toast({
          title: 'Scan Complete',
          description: `Found ${response.data.cameras.length} vulnerable cameras`,
        });
      } else {
        toast({
          title: 'Scan Failed',
          description: 'No vulnerable cameras found or an error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('HackCCTV error:', error);
      toast({
        title: 'Scan Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500 hover:bg-red-600';
      case 'high':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'low':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const openStream = (url: string) => {
    window.open(url, '_blank');
    toast({
      title: 'Opening Stream',
      description: 'Attempting to connect to camera stream...',
    });
  };

  const convertCameraResults = (cameras: import('@/types/scanner').CameraResult[]): import('@/utils/types/cameraTypes').CameraResult[] => {
    return cameras.map(camera => ({
      id: camera.id,
      ip: camera.ip,
      port: camera.port || 554,
      model: camera.model,
      manufacturer: camera.brand,
      location: camera.location ? 
        (typeof camera.location === 'string' ? 
          camera.location : 
          `${camera.location.country}${camera.location.city ? `, ${camera.location.city}` : ''}`) 
        : undefined,
      status: camera.status,
      credentials: camera.credentials,
      vulnerabilities: camera.vulnerabilities,
      accessible: camera.accessLevel !== 'none',
      threatIntelligence: camera.threatIntel,
      accessLevel: camera.accessLevel || 'none',
      lastSeen: typeof camera.lastSeen === 'string' ? camera.lastSeen : camera.lastSeen?.toISOString() || new Date().toISOString()
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            HackCCTV Tool
          </CardTitle>
          <CardDescription>
            Find and exploit vulnerable CCTV cameras on a network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Single IP</TabsTrigger>
              <TabsTrigger value="range">IP Range</TabsTrigger>
            </TabsList>
            <TabsContent value="single" className="pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="targetIP">Target IP Address</Label>
                  <Input
                    id="targetIP"
                    placeholder="e.g. 192.168.1.100"
                    value={targetIP}
                    onChange={(e) => setTargetIP(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="range" className="pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="targetRange">Target IP Range</Label>
                  <Input
                    id="targetRange"
                    placeholder="e.g. 192.168.1.0/24 or 192.168.1.1-10"
                    value={targetRange}
                    onChange={(e) => setTargetRange(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 md:grid-cols-2 mb-4">
            <div>
              <Label htmlFor="ports" className="text-sm font-medium mb-1 block">
                Ports to Scan
              </Label>
              <Input
                id="ports"
                placeholder="80,443,554,8080"
                value={ports}
                onChange={(e) => setPorts(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="timeout" className="text-sm font-medium mb-1 block">
                Timeout (seconds)
              </Label>
              <Input
                id="timeout"
                type="number"
                value={timeout}
                onChange={(e) => setTimeout(parseInt(e.target.value) || 1)}
                min={1}
                max={10}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mb-4">
            <div>
              <Label htmlFor="exploitType" className="text-sm font-medium mb-1 block">
                Exploit Type
              </Label>
              <Select value={exploitType} onValueChange={setExploitType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exploit type" />
                </SelectTrigger>
                <SelectContent>
                  {exploitOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-8 mt-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="bruteforce" checked={bruteforce} onCheckedChange={(checked) => setBruteforce(!!checked)} />
                <Label htmlFor="bruteforce">Bruteforce</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="deepScan" checked={deepScan} onCheckedChange={(checked) => setDeepScan(!!checked)} />
                <Label htmlFor="deepScan">Deep Scan</Label>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSearch} 
            disabled={loading}
            className="w-full"
            variant="destructive"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <ShieldAlert className="mr-2 h-4 w-4" />
                Find Vulnerable Cameras
              </>
            )}
          </Button>

          {results.length > 0 ? (
            <div className="mt-6 space-y-4">
              <h3 className="text-md font-medium">{results.length} Vulnerable Cameras Found</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {results.map((camera, idx) => (
                  <Card key={idx} className="overflow-hidden border-red-800 bg-red-950/20">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-md font-medium flex items-center gap-2">
                            <Wifi className="h-4 w-4 text-red-500" />
                            {camera.ip}:{camera.port}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {camera.brand} {camera.model}
                          </CardDescription>
                        </div>
                        <Badge variant={camera.status === 'online' ? 'default' : 'secondary'}>
                          {camera.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {camera.credentials && (
                        <div className="p-2 bg-red-900/30 rounded border border-red-700 text-sm">
                          <div className="flex items-center gap-2 font-medium text-red-300 mb-1">
                            <Key className="h-4 w-4" />
                            <span>Credentials Found</span>
                          </div>
                          <div className="font-mono bg-black/30 p-1 rounded text-xs">
                            {camera.credentials.username}:{camera.credentials.password}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          Vulnerabilities
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {camera.vulnerabilities?.map((vuln, vidx) => (
                            <Badge 
                              key={vidx} 
                              variant="outline"
                              className={`text-xs ${getSeverityColor(vuln.severity)}`}
                            >
                              {vuln.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Globe className="h-3 w-3" />
                        <span>
                          {camera.geolocation?.country || 'Unknown'}, {camera.geolocation?.city || 'Unknown'}
                        </span>
                      </div>

                      <div className="flex justify-between gap-2 mt-2">
                        <Button 
                          size="sm" 
                          className="flex-1" 
                          onClick={() => openStream(camera.rtspUrl!)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Stream
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="flex-1"
                          disabled
                        >
                          <Crosshair className="h-4 w-4 mr-1" />
                          Exploit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center py-8 mt-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : null}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">About HackCCTV Tool</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="space-y-2">
            <p>
              This tool searches for vulnerable CCTV cameras on a network, attempting to
              identify common security issues like default credentials, command injection vulnerabilities,
              and authentication bypasses.
            </p>
            <p className="flex items-center gap-2 text-red-500 font-medium">
              <AlertTriangle className="h-4 w-4" />
              For educational and authorized testing purposes only.
            </p>
            <p className="text-xs text-gray-500">
              Unauthorized access to camera systems may be illegal. Always ensure
              you have permission to scan and test these systems.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HackCCTVTool;
