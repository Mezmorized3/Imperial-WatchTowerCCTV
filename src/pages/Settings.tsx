
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Save, Settings as SettingsIcon, Database, Key, BellRing, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState({
    shodan: '',
    zoomeye: '',
    censys: '',
    virustotal: ''
  });
  
  const [settings, setSettings] = useState({
    darkMode: true,
    saveHistory: true,
    notificationsEnabled: true,
    autoScanInterval: 'never',
    maxThreads: 10,
    scanTimeout: 30,
    enableThreatIntel: true
  });
  
  const handleSaveSettings = (settingType: string) => {
    toast({
      title: "Settings Saved",
      description: `Your ${settingType} settings have been updated.`,
      duration: 3000
    });
  };
  
  return (
    <div className="min-h-screen bg-scanner-dark text-white">
      <DashboardHeader />
      
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <SettingsIcon className="mr-2 h-6 w-6 text-scanner-info" />
          Settings
        </h1>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="bg-scanner-dark-alt">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="scan">Scan Settings</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card className="bg-scanner-card border-gray-800">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-gray-400">Use dark theme for the application</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => setSettings({...settings, darkMode: checked})}
                  />
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="save-history">Save Scan History</Label>
                    <p className="text-sm text-gray-400">Store scan results for future reference</p>
                  </div>
                  <Switch
                    id="save-history"
                    checked={settings.saveHistory}
                    onCheckedChange={(checked) => setSettings({...settings, saveHistory: checked})}
                  />
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div className="space-y-2">
                  <Label htmlFor="language">Interface Language</Label>
                  <Select defaultValue="english">
                    <SelectTrigger className="bg-scanner-dark-alt border-gray-700">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent className="bg-scanner-dark-alt border-gray-700">
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="bg-scanner-info hover:bg-scanner-info/80" 
                    onClick={() => handleSaveSettings('general')}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <Card className="bg-scanner-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="mr-2 h-5 w-5 text-scanner-info" />
                  API Keys
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-scanner-dark-alt p-4 rounded-md border border-gray-700">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-scanner-info flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-300">
                      API keys are required for accessing external services like Shodan, ZoomEye, and
                      threat intelligence platforms. These keys will be stored locally in your browser.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shodan-key">Shodan API Key</Label>
                    <Input
                      id="shodan-key"
                      type="password"
                      placeholder="Enter Shodan API key"
                      value={apiKeys.shodan}
                      onChange={(e) => setApiKeys({...apiKeys, shodan: e.target.value})}
                      className="bg-scanner-dark-alt border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zoomeye-key">ZoomEye API Key</Label>
                    <Input
                      id="zoomeye-key"
                      type="password"
                      placeholder="Enter ZoomEye API key"
                      value={apiKeys.zoomeye}
                      onChange={(e) => setApiKeys({...apiKeys, zoomeye: e.target.value})}
                      className="bg-scanner-dark-alt border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="censys-key">Censys API Key</Label>
                    <Input
                      id="censys-key"
                      type="password"
                      placeholder="Enter Censys API key"
                      value={apiKeys.censys}
                      onChange={(e) => setApiKeys({...apiKeys, censys: e.target.value})}
                      className="bg-scanner-dark-alt border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="virustotal-key">VirusTotal API Key</Label>
                    <Input
                      id="virustotal-key"
                      type="password"
                      placeholder="Enter VirusTotal API key"
                      value={apiKeys.virustotal}
                      onChange={(e) => setApiKeys({...apiKeys, virustotal: e.target.value})}
                      className="bg-scanner-dark-alt border-gray-700"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="bg-scanner-info hover:bg-scanner-info/80" 
                    onClick={() => handleSaveSettings('API')}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save API Keys
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scan" className="space-y-4">
            <Card className="bg-scanner-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5 text-scanner-info" />
                  Scan Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="max-threads">Maximum Threads</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="max-threads"
                      type="number"
                      value={settings.maxThreads}
                      onChange={(e) => setSettings({...settings, maxThreads: parseInt(e.target.value) || 1})}
                      min="1"
                      max="50"
                      className="bg-scanner-dark-alt border-gray-700 w-24"
                    />
                    <p className="text-sm text-gray-400">Higher values may increase scan speed but use more resources</p>
                  </div>
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div className="space-y-2">
                  <Label htmlFor="scan-timeout">Scan Timeout (seconds)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="scan-timeout"
                      type="number"
                      value={settings.scanTimeout}
                      onChange={(e) => setSettings({...settings, scanTimeout: parseInt(e.target.value) || 10})}
                      min="5"
                      max="120"
                      className="bg-scanner-dark-alt border-gray-700 w-24"
                    />
                    <p className="text-sm text-gray-400">How long to wait for each target to respond</p>
                  </div>
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div className="space-y-2">
                  <Label htmlFor="auto-scan">Automatic Scan Interval</Label>
                  <Select 
                    value={settings.autoScanInterval}
                    onValueChange={(value) => setSettings({...settings, autoScanInterval: value})}
                  >
                    <SelectTrigger id="auto-scan" className="bg-scanner-dark-alt border-gray-700">
                      <SelectValue placeholder="Select scan interval" />
                    </SelectTrigger>
                    <SelectContent className="bg-scanner-dark-alt border-gray-700">
                      <SelectItem value="never">Never (Manual only)</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="threat-intel">Enable Threat Intelligence</Label>
                    <p className="text-sm text-gray-400">Fetch additional security data during scans</p>
                  </div>
                  <Switch
                    id="threat-intel"
                    checked={settings.enableThreatIntel}
                    onCheckedChange={(checked) => setSettings({...settings, enableThreatIntel: checked})}
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="bg-scanner-info hover:bg-scanner-info/80" 
                    onClick={() => handleSaveSettings('scan')}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Scan Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card className="bg-scanner-card border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BellRing className="mr-2 h-5 w-5 text-scanner-info" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-notifications">Enable Notifications</Label>
                    <p className="text-sm text-gray-400">Receive alerts for important events</p>
                  </div>
                  <Switch
                    id="enable-notifications"
                    checked={settings.notificationsEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, notificationsEnabled: checked})}
                  />
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Notification Events</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-scan-complete" className="flex-1">Scan Completed</Label>
                    <Switch id="notify-scan-complete" defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-vulnerabilities" className="flex-1">New Vulnerabilities Found</Label>
                    <Switch id="notify-vulnerabilities" defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-device-status" className="flex-1">Device Status Changes</Label>
                    <Switch id="notify-device-status" defaultChecked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-system" className="flex-1">System Notifications</Label>
                    <Switch id="notify-system" defaultChecked={true} />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="bg-scanner-info hover:bg-scanner-info/80" 
                    onClick={() => handleSaveSettings('notification')}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
