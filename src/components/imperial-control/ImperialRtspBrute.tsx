
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2, Lock, Network, Shield, Terminal, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { executeMegaRtspBruter, getCommonRtspUsers, getCommonRtspPasswords } from '@/utils/osintImplementations';
import { RtspCredential } from '@/utils/types/rtspBruteTypes';

const ImperialRtspBrute: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('targets');
  const [targetInput, setTargetInput] = useState('');
  const [targets, setTargets] = useState<string[]>([]);
  const [usernames, setUsernames] = useState<string[]>([]);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [workers, setWorkers] = useState(100);
  const [timeout, setTimeout] = useState(10);
  const [useTor, setUseTor] = useState(false);
  const [bypassTechniques, setBypassTechniques] = useState(true);
  const [stealthMode, setStealthMode] = useState(false);
  const [smartCredentials, setSmartCredentials] = useState(true);
  const [vendorDetection, setVendorDetection] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<string>('any');
  const [results, setResults] = useState<RtspCredential[]>([]);
  const [scanDetails, setScanDetails] = useState<any>(null);

  // Load common credentials when component mounts
  useEffect(() => {
    setUsernames(getCommonRtspUsers());
    setPasswords(getCommonRtspPasswords());
  }, []);

  const handleAddTarget = () => {
    if (!targetInput) return;
    
    // Add targets, handling both individual IPs and ranges
    const newTargets = targetInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    setTargets([...targets, ...newTargets]);
    setTargetInput('');
    
    toast({
      title: "Targets Added",
      description: `Added ${newTargets.length} targets to the scan list`,
    });
  };

  const handleAddUsername = () => {
    if (!usernameInput) return;
    setUsernames([...usernames, usernameInput]);
    setUsernameInput('');
  };

  const handleAddPassword = () => {
    if (!passwordInput) return;
    setPasswords([...passwords, passwordInput]);
    setPasswordInput('');
  };

  const handleRemoveTarget = (index: number) => {
    const newTargets = [...targets];
    newTargets.splice(index, 1);
    setTargets(newTargets);
  };

  const handleLoadDefaultCredentials = () => {
    setUsernames(getCommonRtspUsers());
    setPasswords(getCommonRtspPasswords());
    
    toast({
      title: "Default Credentials Loaded",
      description: `Loaded ${getCommonRtspUsers().length} usernames and ${getCommonRtspPasswords().length} passwords`,
    });
  };

  const handleExecuteScan = async () => {
    if (targets.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one target",
        variant: "destructive",
      });
      return;
    }
    
    if (usernames.length === 0 || passwords.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one username and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setResults([]);
    setScanDetails(null);
    
    try {
      const result = await executeMegaRtspBruter({
        targets,
        userlist: usernames,
        passlist: passwords,
        workers,
        timeout,
        useTor,
        bypassTechniques,
        stealthMode,
        smartCredentials,
        vendor: selectedVendor as any
      });
      
      if (result.success) {
        setResults(result.found);
        setScanDetails(result.scanDetails);
        
        if (result.found.length > 0) {
          toast({
            title: "Credentials Found!",
            description: `Found ${result.found.length} valid credentials`,
            variant: "default",
          });
        } else {
          toast({
            title: "Scan Complete",
            description: "No valid credentials found",
            variant: "default",
          });
        }
      } else {
        toast({
          title: "Scan Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during RTSP brute-force:", error);
      toast({
        title: "Execution Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setActiveTab('results');
    }
  };

  const renderTargetsTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="target-input">Target IPs/Hostnames (one per line)</Label>
          <Textarea
            id="target-input"
            placeholder="192.168.1.100
192.168.0.0/24
camera.example.com"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            rows={5}
            className="font-mono"
          />
        </div>
        
        <Button onClick={handleAddTarget} disabled={!targetInput || isLoading}>
          Add Targets
        </Button>
        
        {targets.length > 0 && (
          <div className="space-y-2">
            <Label>Target List ({targets.length} targets)</Label>
            <div className="border rounded-md p-2 max-h-40 overflow-y-auto bg-scanner-dark-alt">
              {targets.map((target, index) => (
                <div key={index} className="flex justify-between items-center py-1 border-b border-gray-700 last:border-0">
                  <span className="font-mono text-sm">{target}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTarget(index)}
                    disabled={isLoading}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCredentialsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Credentials</Label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLoadDefaultCredentials}
          disabled={isLoading}
        >
          Load Default Wordlists
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username-input">Add Username</Label>
          <div className="flex space-x-2">
            <Input
              id="username-input"
              placeholder="admin"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              variant="outline" 
              onClick={handleAddUsername} 
              disabled={!usernameInput || isLoading}
            >
              Add
            </Button>
          </div>
          <div className="border rounded-md p-2 h-28 overflow-y-auto bg-scanner-dark-alt">
            {usernames.map((username, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="m-1"
              >
                {username}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password-input">Add Password</Label>
          <div className="flex space-x-2">
            <Input
              id="password-input"
              placeholder="12345"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              variant="outline" 
              onClick={handleAddPassword} 
              disabled={!passwordInput || isLoading}
            >
              Add
            </Button>
          </div>
          <div className="border rounded-md p-2 h-28 overflow-y-auto bg-scanner-dark-alt">
            {passwords.map((password, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="m-1"
              >
                {password === '' ? '[empty]' : password}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      <div className="pt-2">
        <div className="text-sm text-gray-400 mb-2">
          Attack Stats: {usernames.length} usernames × {passwords.length} passwords = {usernames.length * passwords.length} possible combinations per target
        </div>
      </div>
    </div>
  );

  const renderOptionsTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="workers">Concurrent Workers: {workers}</Label>
          <Slider
            id="workers"
            value={[workers]}
            min={10}
            max={500}
            step={10}
            onValueChange={(value) => setWorkers(value[0])}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timeout">Request Timeout: {timeout}s</Label>
          <Slider
            id="timeout"
            value={[timeout]}
            min={1}
            max={30}
            step={1}
            onValueChange={(value) => setTimeout(value[0])}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="vendor">Target Camera Vendor</Label>
        <Select 
          value={selectedVendor} 
          onValueChange={setSelectedVendor}
          disabled={isLoading}
        >
          <SelectTrigger id="vendor">
            <SelectValue placeholder="Select vendor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any / Auto-detect</SelectItem>
            <SelectItem value="hikvision">Hikvision</SelectItem>
            <SelectItem value="dahua">Dahua</SelectItem>
            <SelectItem value="axis">Axis</SelectItem>
            <SelectItem value="bosch">Bosch</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="use-tor"
              checked={useTor}
              onCheckedChange={setUseTor}
              disabled={isLoading}
            />
            <Label htmlFor="use-tor" className="cursor-pointer">Use Tor Network</Label>
          </div>
          <Shield className="h-4 w-4 text-gray-500" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="bypass-techniques"
              checked={bypassTechniques}
              onCheckedChange={setBypassTechniques}
              disabled={isLoading}
            />
            <Label htmlFor="bypass-techniques" className="cursor-pointer">Use Bypass Techniques</Label>
          </div>
          <Lock className="h-4 w-4 text-gray-500" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="stealth-mode"
              checked={stealthMode}
              onCheckedChange={setStealthMode}
              disabled={isLoading}
            />
            <Label htmlFor="stealth-mode" className="cursor-pointer">Stealth Mode (Slower)</Label>
          </div>
          <Network className="h-4 w-4 text-gray-500" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="smart-credentials"
              checked={smartCredentials}
              onCheckedChange={setSmartCredentials}
              disabled={isLoading}
            />
            <Label htmlFor="smart-credentials" className="cursor-pointer">Smart Credential Prioritization</Label>
          </div>
          <Terminal className="h-4 w-4 text-gray-500" />
        </div>
      </div>
    </div>
  );

  const renderResultsTab = () => (
    <div className="space-y-4">
      {scanDetails && (
        <div className="bg-scanner-dark-alt rounded-md p-3 border border-gray-700">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Targets Scanned: <span className="font-semibold">{scanDetails.targetsScanned}</span></div>
            <div>Attempts Per Target: <span className="font-semibold">{scanDetails.attemptsPerTarget}</span></div>
            <div>Time Elapsed: <span className="font-semibold">{scanDetails.timeElapsed}</span></div>
            <div>Scan Type: <span className="font-semibold">{scanDetails.targetType}</span></div>
          </div>
        </div>
      )}
      
      {results.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-scanner-dark-alt">
              <tr>
                <th className="px-4 py-2 text-left">Target</th>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Password</th>
                <th className="px-4 py-2 text-left">Vendor</th>
                <th className="px-4 py-2 text-left">Stream URL</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="px-4 py-2 font-mono">{result.target}</td>
                  <td className="px-4 py-2 font-mono">{result.user}</td>
                  <td className="px-4 py-2 font-mono">{result.pass === '' ? '[empty]' : result.pass}</td>
                  <td className="px-4 py-2">{result.vendor || 'Unknown'}</td>
                  <td className="px-4 py-2 font-mono text-xs truncate max-w-[200px]">
                    {result.streamUrl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          {isLoading ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <div>Running RTSP brute-force attack...</div>
            </div>
          ) : (
            <div>
              {scanDetails ? "No valid credentials found" : "Run a scan to see results"}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Card className="w-full shadow-md bg-scanner-dark-alt border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Video className="mr-2 text-blue-500" />
          MegaRTSPBruter
        </CardTitle>
        <CardDescription className="text-gray-400">
          Advanced RTSP credential brute-forcer with multi-threading, bypass techniques, and adaptive evasion
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4 bg-scanner-dark">
            <TabsTrigger value="targets" disabled={isLoading}>
              Targets
            </TabsTrigger>
            <TabsTrigger value="credentials" disabled={isLoading}>
              Credentials
            </TabsTrigger>
            <TabsTrigger value="options" disabled={isLoading}>
              Options
            </TabsTrigger>
            <TabsTrigger value="results">
              Results {results.length > 0 && `(${results.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="targets">
            {renderTargetsTab()}
          </TabsContent>
          
          <TabsContent value="credentials">
            {renderCredentialsTab()}
          </TabsContent>
          
          <TabsContent value="options">
            {renderOptionsTab()}
          </TabsContent>
          
          <TabsContent value="results">
            {renderResultsTab()}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => {
            setTargets([]);
            setTargetInput('');
            handleLoadDefaultCredentials();
            setActiveTab('targets');
            setResults([]);
            setScanDetails(null);
          }}
          disabled={isLoading}
        >
          Reset
        </Button>
        
        <Button 
          onClick={handleExecuteScan} 
          disabled={isLoading || targets.length === 0 || usernames.length === 0 || passwords.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Brute-Force...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Start RTSP Brute-Force
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImperialRtspBrute;
