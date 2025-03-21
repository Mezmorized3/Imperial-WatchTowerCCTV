
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Shield, Server, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SecuritySettings: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeoutEnabled, setSessionTimeoutEnabled] = useState(true);
  const [timeoutDuration, setTimeoutDuration] = useState('30');
  const [imperialShieldEnabled, setImperialShieldEnabled] = useState(false);
  const [imperialPort, setImperialPort] = useState('9999');
  const [shieldPorts, setShieldPorts] = useState('80,443,8080');
  const [trustedNetworks, setTrustedNetworks] = useState('192.168.1.0/24,10.0.0.0/8');
  const [cipherKey, setCipherKey] = useState('');
  
  const { toast } = useToast();
  
  useEffect(() => {
    // Load settings from localStorage
    const loadedTwoFactor = localStorage.getItem('twoFactorEnabled') === 'true';
    const loadedSessionTimeout = localStorage.getItem('sessionTimeoutEnabled') === 'true';
    const loadedTimeoutDuration = localStorage.getItem('timeoutDuration') || '30';
    const loadedImperialShield = localStorage.getItem('imperialShieldEnabled') === 'true';
    const loadedImperialPort = localStorage.getItem('imperialPort') || '9999';
    const loadedShieldPorts = localStorage.getItem('shieldPorts') || '80,443,8080';
    const loadedTrustedNetworks = localStorage.getItem('trustedNetworks') || '192.168.1.0/24,10.0.0.0/8';
    
    setTwoFactorEnabled(loadedTwoFactor);
    setSessionTimeoutEnabled(loadedSessionTimeout);
    setTimeoutDuration(loadedTimeoutDuration);
    setImperialShieldEnabled(loadedImperialShield);
    setImperialPort(loadedImperialPort);
    setShieldPorts(loadedShieldPorts);
    setTrustedNetworks(loadedTrustedNetworks);
  }, []);
  
  const saveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem('twoFactorEnabled', twoFactorEnabled.toString());
    localStorage.setItem('sessionTimeoutEnabled', sessionTimeoutEnabled.toString());
    localStorage.setItem('timeoutDuration', timeoutDuration);
    localStorage.setItem('imperialShieldEnabled', imperialShieldEnabled.toString());
    localStorage.setItem('imperialPort', imperialPort);
    localStorage.setItem('shieldPorts', shieldPorts);
    localStorage.setItem('trustedNetworks', trustedNetworks);
    
    toast({
      title: "Settings saved",
      description: "Your security settings have been updated."
    });
  };
  
  const generateCipherKey = () => {
    // Simulate generating a secure cipher key
    const randomKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    setCipherKey(randomKey);
    toast({
      title: "Cipher key generated",
      description: "A new Imperial Shield cipher key has been created."
    });
  };

  return (
    <Card className="bg-scanner-card border-gray-700">
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription className="text-gray-400">
          Configure security preferences and access controls.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="general" className="flex-1">
              <Lock className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="imperial-shield" className="flex-1">
              <Shield className="h-4 w-4 mr-2" />
              Imperial Shield
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="two-factor" className="flex flex-col space-y-1">
                  <span>Two-Factor Authentication</span>
                  <span className="font-normal text-xs text-gray-400">Enable 2FA for increased security</span>
                </Label>
                <Switch 
                  id="two-factor" 
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="session-timeout" className="flex flex-col space-y-1">
                  <span>Session Timeout</span>
                  <span className="font-normal text-xs text-gray-400">Automatically log out after period of inactivity</span>
                </Label>
                <Switch 
                  id="session-timeout" 
                  checked={sessionTimeoutEnabled}
                  onCheckedChange={setSessionTimeoutEnabled}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeout-duration">Timeout Duration (minutes)</Label>
              <Input 
                id="timeout-duration" 
                className="bg-gray-800" 
                value={timeoutDuration}
                onChange={(e) => setTimeoutDuration(e.target.value)}
                disabled={!sessionTimeoutEnabled}
              />
            </div>

            <Button variant="secondary" className="w-full mt-4">
              <Lock className="mr-2 h-4 w-4" /> Change Password
            </Button>
          </TabsContent>
          
          <TabsContent value="imperial-shield" className="space-y-6 pt-4">
            <Alert className="bg-red-900/20 border-red-800">
              <AlertDescription className="text-sm">
                Imperial Shield Protocol provides advanced security through quantum cloaking and temporal signature validation.
                Requires server-side configuration of Python-based proxy system.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="imperial-shield" className="flex flex-col space-y-1">
                  <span>Imperial Shield Protocol</span>
                  <span className="font-normal text-xs text-gray-400">Enable advanced security layer</span>
                </Label>
                <Switch 
                  id="imperial-shield" 
                  checked={imperialShieldEnabled}
                  onCheckedChange={setImperialShieldEnabled}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imperial-port">Emperor Port (Hidden Service)</Label>
              <Input 
                id="imperial-port" 
                className="bg-gray-800" 
                value={imperialPort}
                onChange={(e) => setImperialPort(e.target.value)}
                placeholder="9999"
                disabled={!imperialShieldEnabled}
              />
              <p className="text-xs text-gray-400">The hidden port where your actual server runs</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shield-ports">Shield Ports (comma separated)</Label>
              <Input 
                id="shield-ports" 
                className="bg-gray-800" 
                value={shieldPorts}
                onChange={(e) => setShieldPorts(e.target.value)}
                placeholder="80,443,8080"
                disabled={!imperialShieldEnabled}
              />
              <p className="text-xs text-gray-400">Public-facing ports that shield the true service</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="trusted-networks">Trusted Networks (CIDR notation)</Label>
              <Input 
                id="trusted-networks" 
                className="bg-gray-800" 
                value={trustedNetworks}
                onChange={(e) => setTrustedNetworks(e.target.value)}
                placeholder="192.168.1.0/24,10.0.0.0/8"
                disabled={!imperialShieldEnabled}
              />
              <p className="text-xs text-gray-400">IP ranges that are allowed to access the Emperor's service</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <Label htmlFor="cipher-key">Celestial Cipher Key</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={generateCipherKey}
                  disabled={!imperialShieldEnabled}
                >
                  Generate
                </Button>
              </div>
              <Input 
                id="cipher-key" 
                className="bg-gray-800 font-mono text-xs" 
                value={cipherKey}
                onChange={(e) => setCipherKey(e.target.value)}
                placeholder="Generate or paste your cipher key"
                disabled={!imperialShieldEnabled}
              />
              <p className="text-xs text-gray-400">Used for blood oath authentication (keep this secret!)</p>
            </div>
            
            <div className="pt-4">
              <Button 
                variant="secondary" 
                className="w-full" 
                disabled={!imperialShieldEnabled}
              >
                <Server className="mr-2 h-4 w-4" /> Deploy Imperial Shield
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6 pt-6 border-t border-gray-700">
          <Button onClick={saveSettings}>
            <Key className="mr-2 h-4 w-4" /> Save Security Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
