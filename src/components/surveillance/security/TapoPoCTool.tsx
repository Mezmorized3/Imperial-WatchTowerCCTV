
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Bug, Terminal, AlertTriangle
} from 'lucide-react';
import { executeTapoPoC } from '@/utils/osintTools';

interface Vulnerability {
  id?: string;
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  cve?: string;
  impact?: string;
  exploit?: string;
}

const TapoPoCTool: React.FC = () => {
  const { toast } = useToast();
  const [targetIP, setTargetIP] = useState('');
  const [port, setPort] = useState('80');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [attackType, setAttackType] = useState<'credentials' | 'config' | 'firmware' | 'shell' | 'all'>('credentials');
  const [extractConfigs, setExtractConfigs] = useState(true);
  const [checkVulnerabilities, setCheckVulnerabilities] = useState(true);
  const [saveDumps, setSaveDumps] = useState(false);
  const [payloadPath, setPayloadPath] = useState('');
  
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('config');
  
  const handleExecute = async () => {
    if (!targetIP) {
      toast({
        title: "Missing Target",
        description: "Please enter a target IP address or hostname",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunning(true);
    setActiveTab('results');
    
    try {
      const result = await executeTapoPoC({
        target: targetIP,
        port: parseInt(port),
        username,
        password,
        attackType,
        extractConfigs,
        checkVulnerabilities,
        saveDumps,
        payloadPath: payloadPath || undefined
      });
      
      toast({
        title: "Operation Complete",
        description: `${attackType === 'all' ? 'All attacks' : attackType.charAt(0).toUpperCase() + attackType.slice(1) + ' attack'} completed successfully`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Tool Not Available",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Tapo-PoC Scanner
        </CardTitle>
        <CardDescription>
          Security testing tool for TP-Link Tapo cameras (CVE checks, credentials, config dumps)
          <br />
          <span className="text-yellow-600 font-medium">⚠️ Tool needs implementation for production use</span>
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-ip">Target IP/Hostname</Label>
              <Input
                id="target-ip"
                value={targetIP}
                onChange={(e) => setTargetIP(e.target.value)}
                placeholder="192.168.1.100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="80"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter password (optional)"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attack-type">Attack Type</Label>
            <Select value={attackType} onValueChange={(value: typeof attackType) => setAttackType(value)}>
              <SelectTrigger id="attack-type">
                <SelectValue placeholder="Select attack type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Attacks</SelectItem>
                <SelectItem value="credentials">Default Credentials Check</SelectItem>
                <SelectItem value="config">Configuration Dump</SelectItem>
                <SelectItem value="firmware">Firmware Analysis</SelectItem>
                <SelectItem value="shell">Command Injection</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Alert variant="default" className="mt-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-900">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertTitle>Production Notice</AlertTitle>
            <AlertDescription>
              This tool requires actual TapoPoC implementation for production use. Currently shows configuration interface only.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleExecute}
          disabled={!targetIP || isRunning}
        >
          <Bug className="mr-2 h-4 w-4" />
          {isRunning ? "Testing..." : "Test Configuration"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TapoPoCTool;
