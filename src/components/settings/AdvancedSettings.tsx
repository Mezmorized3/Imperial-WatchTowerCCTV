
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const AdvancedSettings: React.FC = () => {
  return (
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
  );
};
