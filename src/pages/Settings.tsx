
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardHeader from '@/components/DashboardHeader';
import { Shield, BellRing, Globe, Lock, Eye, Settings as SettingsIcon, Monitor } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-scanner-dark text-white">
      <DashboardHeader />

      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <SettingsIcon className="h-8 w-8 mr-3 text-scanner-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-scanner-card border-gray-700">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure your scanner preferences and application settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-scan" className="flex flex-col space-y-1">
                      <span>Automatic Scanning</span>
                      <span className="font-normal text-xs text-gray-400">Enable automatic periodic scanning of known devices</span>
                    </Label>
                    <Switch id="auto-scan" defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Scan Interval (hours)</Label>
                  <Slider defaultValue={[24]} max={72} step={1} className="w-full" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention Period</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="data-retention" className="w-full bg-gray-800">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-scanner-card border-gray-700">
              <CardHeader>
                <CardTitle>Network Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure network scan settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="scan-timeout">Scan Timeout (seconds)</Label>
                  <Input id="scan-timeout" className="bg-gray-800" defaultValue="30" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="concurrency">Max Concurrent Scans</Label>
                  <Input id="concurrency" className="bg-gray-800" defaultValue="5" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="aggressive-scan" className="flex flex-col space-y-1">
                      <span>Aggressive Scanning</span>
                      <span className="font-normal text-xs text-gray-400">May trigger security systems but provides more detailed results</span>
                    </Label>
                    <Switch id="aggressive-scan" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-scanner-card border-gray-700">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure how and when you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="vuln-alerts" className="flex flex-col space-y-1">
                      <span>Vulnerability Alerts</span>
                      <span className="font-normal text-xs text-gray-400">Receive alerts for newly detected vulnerabilities</span>
                    </Label>
                    <Switch id="vuln-alerts" defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="anomaly-alerts" className="flex flex-col space-y-1">
                      <span>Anomaly Detection Alerts</span>
                      <span className="font-normal text-xs text-gray-400">Receive alerts for unusual camera behavior</span>
                    </Label>
                    <Switch id="anomaly-alerts" defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                      <span>Email Notifications</span>
                      <span className="font-normal text-xs text-gray-400">Send alerts to your email address</span>
                    </Label>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" className="bg-gray-800" placeholder="Enter your email" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-scanner-card border-gray-700">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure security preferences and access controls.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="two-factor" className="flex flex-col space-y-1">
                      <span>Two-Factor Authentication</span>
                      <span className="font-normal text-xs text-gray-400">Enable 2FA for increased security</span>
                    </Label>
                    <Switch id="two-factor" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="session-timeout" className="flex flex-col space-y-1">
                      <span>Session Timeout</span>
                      <span className="font-normal text-xs text-gray-400">Automatically log out after period of inactivity</span>
                    </Label>
                    <Switch id="session-timeout" defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeout-duration">Timeout Duration (minutes)</Label>
                  <Input id="timeout-duration" className="bg-gray-800" defaultValue="30" />
                </div>

                <Button variant="secondary" className="w-full mt-4">
                  <Lock className="mr-2 h-4 w-4" /> Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-scanner-card border-gray-700">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Customize the look and feel of the application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select defaultValue="dark">
                    <SelectTrigger className="w-full bg-gray-800">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Globe View</Label>
                  <Select defaultValue="realistic">
                    <SelectTrigger className="w-full bg-gray-800">
                      <SelectValue placeholder="Select globe style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="wireframe">Wireframe</SelectItem>
                      <SelectItem value="satellite">Satellite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Dashboard Layout</Label>
                  <Select defaultValue="grid">
                    <SelectTrigger className="w-full bg-gray-800">
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-scanner-card border-gray-700">
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure advanced settings for the scanner application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="debug-mode" className="flex flex-col space-y-1">
                      <span>Debug Mode</span>
                      <span className="font-normal text-xs text-gray-400">Enable detailed logging for troubleshooting</span>
                    </Label>
                    <Switch id="debug-mode" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="api-access" className="flex flex-col space-y-1">
                      <span>API Access</span>
                      <span className="font-normal text-xs text-gray-400">Allow external applications to access scanner data</span>
                    </Label>
                    <Switch id="api-access" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex space-x-2">
                    <Input id="api-key" className="bg-gray-800" value="••••••••••••••••" readOnly />
                    <Button variant="outline">Regenerate</Button>
                  </div>
                </div>

                <div className="pt-4 pb-2">
                  <Button variant="destructive" className="w-full">
                    Reset All Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-8 space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
