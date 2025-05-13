import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Play, Network, AlertTriangle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface RtspCredential {
  ip: string;
  port?: number;
  username?: string;
  password?: string;
  url?: string;
  valid: boolean;
}

interface RtspBruteOptions {
  targets: string[];
  userlist: string[];
  passlist: string[];
  workers: number;
  timeout: number;
  useTor?: boolean;
  bypassTechniques?: boolean;
  stealthMode?: boolean;
  smartCredentials?: boolean;
  vendor?: string;
}

interface ImperialRtspBruteProps {
  onBruteComplete?: (results: RtspCredential[]) => void;
}

const ImperialRtspBrute: React.FC<ImperialRtspBruteProps> = ({ onBruteComplete }) => {
  const { toast } = useToast();

  // State variables
  const [targets, setTargets] = useState<string>('');
  const [userlist, setUserlist] = useState<string>('admin,user');
  const [passlist, setPasslist] = useState<string>('password,12345');
  const [workers, setWorkers] = useState<number>(10);
  const [timeout, setTimeout] = useState<number>(5000);
  const [useTor, setUseTor] = useState<boolean>(false);
  const [bypassTechniques, setBypassTechniques] = useState<boolean>(false);
  const [stealthMode, setStealthMode] = useState<boolean>(false);
  const [smartCredentials, setSmartCredentials] = useState<boolean>(true);
  const [vendor, setVendor] = useState<string>('');
  const [isBruting, setIsBruting] = useState<boolean>(false);
  const [bruteProgress, setBruteProgress] = useState<number>(0);
  const [bruteResults, setBruteResults] = useState<RtspCredential[]>([]);
  const [scanDetails, setScanDetails] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Function to simulate the RTSP brute force process
  const simulateRtspBrute = useCallback(async (options: RtspBruteOptions) => {
    setIsBruting(true);
    setBruteProgress(0);
    setBruteResults([]);
    setScanDetails(null);

    const totalTargets = options.targets.length;
    const totalCredentials = options.userlist.length * options.passlist.length;
    const totalAttempts = totalTargets * totalCredentials;
    let attemptsCompleted = 0;
    const startTime = new Date();

    const simulatedResults: RtspCredential[] = [];

    // Create and store the interval ID
    let intervalId: ReturnType<typeof setInterval>;
    
    // Define the interval callback function
    const intervalCallback = () => {
      if (attemptsCompleted < totalAttempts) {
        attemptsCompleted += Math.floor(Math.random() * 10); // Simulate variable attempts
        const progress = Math.min((attemptsCompleted / totalAttempts) * 100, 99);
        setBruteProgress(progress);

        // Simulate finding a valid credential
        if (Math.random() < 0.01) {
          const target = options.targets[Math.floor(Math.random() * totalTargets)];
          const user = options.userlist[Math.floor(Math.random() * options.userlist.length)];
          const pass = options.passlist[Math.floor(Math.random() * options.passlist.length)];

          const [ip, portStr] = target.split(':');
          const port = parseInt(portStr || '554', 10);

          simulatedResults.push({
            ip: ip,
            port: port,
            username: user,
            password: pass,
            url: `rtsp://${user}:${pass}@${ip}:${port}/h264/ch1/main/av_stream`,
            valid: true
          });

          setBruteResults([...simulatedResults]);
        }
      } else {
        clearInterval(intervalId);
        setBruteProgress(100);
        
        // Add some metrics
        const endTime = new Date();
        const duration = (endTime.getTime() - startTime.getTime()) / 1000;
        
        setScanDetails({
          duration: duration.toFixed(1),
          targetsScanned: totalTargets,
          attemptsMade: totalAttempts,
          credentialsFound: simulatedResults.length,
          startTime: startTime.toLocaleString(),
          endTime: endTime.toLocaleString()
        });
        
        setIsBruting(false);
        
        if (onBruteComplete) {
          onBruteComplete(simulatedResults);
        }
        
        toast({
          title: "Brute Force Complete",
          description: `Found ${simulatedResults.length} valid credentials.`
        });
      }
    };
    
    // Set up the interval
    intervalId = setInterval(intervalCallback, 250);
    
    // Return a cleanup function
    return () => {
      clearInterval(intervalId);
    };
  }, [toast, onBruteComplete]);

  const handleBrute = useCallback(() => {
    if (!targets) {
      toast({
        title: "Error",
        description: "Please enter at least one target",
        variant: "destructive"
      });
      return;
    }
    
    const targetList = targets.split('\n').filter(t => t.trim() !== '');
    const userList = userlist.split(',').map(u => u.trim()).filter(u => u !== '');
    const passList = passlist.split(',').map(p => p.trim()).filter(p => p !== '');
    
    if (targetList.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one valid target",
        variant: "destructive"
      });
      return;
    }
    
    if (userList.length === 0 || passList.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one username and password",
        variant: "destructive"
      });
      return;
    }
    
    const options: RtspBruteOptions = {
      targets: targetList,
      userlist: userList,
      passlist: passList,
      workers,
      timeout,
      useTor,
      bypassTechniques,
      stealthMode,
      smartCredentials,
      vendor: vendor || undefined
    };
    
    simulateRtspBrute(options);
  }, [targets, userlist, passlist, workers, timeout, useTor, bypassTechniques, stealthMode, smartCredentials, vendor, toast, simulateRtspBrute]);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      // Cleanup handled in simulateRtspBrute
    };
  }, []);

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          RTSP Brute Force
        </CardTitle>
        <CardDescription>
          Test credentials against RTSP camera streams
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="targets">Target IP Addresses</Label>
            <Textarea
              id="targets"
              placeholder="Enter IP addresses (one per line)"
              value={targets}
              onChange={(e) => setTargets(e.target.value)}
              disabled={isBruting}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userlist">Usernames (comma separated)</Label>
              <Input
                id="userlist"
                placeholder="admin,user,root"
                value={userlist}
                onChange={(e) => setUserlist(e.target.value)}
                disabled={isBruting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passlist">Passwords (comma separated)</Label>
              <Input
                id="passlist"
                placeholder="password,admin,12345"
                value={passlist}
                onChange={(e) => setPasslist(e.target.value)}
                disabled={isBruting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workers">Workers</Label>
              <Input
                id="workers"
                type="number"
                min="1"
                max="100"
                value={workers}
                onChange={(e) => setWorkers(parseInt(e.target.value))}
                disabled={isBruting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout">Timeout (ms)</Label>
              <Input
                id="timeout"
                type="number"
                min="1000"
                max="30000"
                value={timeout}
                onChange={(e) => setTimeout(parseInt(e.target.value))}
                disabled={isBruting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor (optional)</Label>
            <Select
              value={vendor}
              onValueChange={setVendor}
              disabled={isBruting}
            >
              <SelectTrigger id="vendor">
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="hikvision">Hikvision</SelectItem>
                <SelectItem value="dahua">Dahua</SelectItem>
                <SelectItem value="axis">Axis</SelectItem>
                <SelectItem value="samsung">Samsung</SelectItem>
                <SelectItem value="bosch">Bosch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="useTor"
                checked={useTor}
                onCheckedChange={(checked) => setUseTor(checked === true)}
                disabled={isBruting}
              />
              <Label htmlFor="useTor">Use Tor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bypassTechniques"
                checked={bypassTechniques}
                onCheckedChange={(checked) => setBypassTechniques(checked === true)}
                disabled={isBruting}
              />
              <Label htmlFor="bypassTechniques">Use Bypass Techniques</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="stealthMode"
                checked={stealthMode}
                onCheckedChange={(checked) => setStealthMode(checked === true)}
                disabled={isBruting}
              />
              <Label htmlFor="stealthMode">Stealth Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="smartCredentials"
                checked={smartCredentials}
                onCheckedChange={(checked) => setSmartCredentials(checked === true)}
                disabled={isBruting}
              />
              <Label htmlFor="smartCredentials">Smart Credentials</Label>
            </div>
          </div>

          {isBruting && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Progress</Label>
                <span>{Math.round(bruteProgress)}%</span>
              </div>
              <Progress value={bruteProgress} className="w-full" />
            </div>
          )}
        </div>

        {bruteResults.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="text-lg font-semibold">Valid Credentials</h3>
            <div className="overflow-auto max-h-64">
              {bruteResults.map((result, idx) => (
                <div key={idx} className="p-2 border border-gray-700 rounded-md mb-2 bg-scanner-dark-alt">
                  <div className="flex justify-between">
                    <Badge variant="default" className="bg-green-600">Valid</Badge>
                    <span className="text-xs text-gray-400">{result.ip}:{result.port}</span>
                  </div>
                  <div className="mt-2">
                    <p><strong>Username:</strong> {result.username}</p>
                    <p><strong>Password:</strong> {result.password}</p>
                    <p className="text-xs text-gray-400 mt-1 break-all">{result.url}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {scanDetails && (
          <div className="mt-6 space-y-2">
            <h3 className="text-lg font-semibold">Scan Details</h3>
            <div className="p-2 border border-gray-700 rounded-md bg-scanner-dark-alt">
              <p><strong>Duration:</strong> {scanDetails.duration}s</p>
              <p><strong>Targets Scanned:</strong> {scanDetails.targetsScanned}</p>
              <p><strong>Attempts:</strong> {scanDetails.attemptsMade}</p>
              <p><strong>Credentials Found:</strong> {scanDetails.credentialsFound}</p>
              <p><strong>Start:</strong> {scanDetails.startTime}</p>
              <p><strong>End:</strong> {scanDetails.endTime}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleBrute}
          disabled={isBruting}
          className="w-full"
        >
          {isBruting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Brute Forcing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Brute Force
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImperialRtspBrute;
