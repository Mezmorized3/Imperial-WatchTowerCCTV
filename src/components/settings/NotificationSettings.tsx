
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const NotificationSettings: React.FC = () => {
  return (
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
  );
};
