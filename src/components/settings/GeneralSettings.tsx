
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const GeneralSettings: React.FC = () => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};
