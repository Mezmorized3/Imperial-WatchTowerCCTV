
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

export const SecuritySettings: React.FC = () => {
  return (
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
  );
};
