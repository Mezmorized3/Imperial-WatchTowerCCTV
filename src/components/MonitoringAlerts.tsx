
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { AlertConfig } from '@/types/scanner';

const MonitoringAlerts = () => {
  const [alerts, setAlerts] = useState<AlertConfig[]>([]);
  
  // Initialize with a properly typed AlertConfig
  const [newAlert, setNewAlert] = useState<AlertConfig>({
    id: '',
    name: '',
    enabled: false,
    triggeredBy: [],
    level: 'medium',
    action: 'notify',
    createdAt: new Date().toISOString(),
    type: 'access',
    severity: 'medium',
    notificationMethod: 'email'
  });
  
  const addAlert = () => {
    // Generate a unique ID for the new alert
    const alertWithId = {
      ...newAlert,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setAlerts([...alerts, alertWithId]);
    
    // Reset the form
    setNewAlert({
      id: '',
      name: '',
      enabled: false,
      triggeredBy: [],
      level: 'medium',
      action: 'notify',
      createdAt: new Date().toISOString(),
      type: 'access',
      severity: 'medium',
      notificationMethod: 'email'
    });
    
    toast({
      title: "Alert Added",
      description: "The alert has been added to your configuration.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Add New Alert</h3>
          
          <div className="space-y-2">
            <Label htmlFor="alert-name">Alert Name</Label>
            <Input
              id="alert-name"
              placeholder="Suspicious Access Alert"
              value={newAlert.name}
              onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alert-type">Alert Type</Label>
            <Select 
              value={newAlert.type} 
              onValueChange={(value) => setNewAlert({ ...newAlert, type: value })}
            >
              <SelectTrigger id="alert-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="access">Unauthorized Access</SelectItem>
                <SelectItem value="vulnerability">Vulnerability Detected</SelectItem>
                <SelectItem value="status">Status Change</SelectItem>
                <SelectItem value="network">Network Anomaly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alert-severity">Severity</Label>
            <Select 
              value={newAlert.severity} 
              onValueChange={(value) => setNewAlert({ ...newAlert, severity: value })}
            >
              <SelectTrigger id="alert-severity">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notification-method">Notification Method</Label>
            <Select 
              value={newAlert.notificationMethod} 
              onValueChange={(value) => setNewAlert({ ...newAlert, notificationMethod: value })}
            >
              <SelectTrigger id="notification-method">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="push">Push Notification</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="alert-enabled"
              checked={newAlert.enabled}
              onCheckedChange={(checked) => setNewAlert({ ...newAlert, enabled: checked })}
            />
            <Label htmlFor="alert-enabled">Enable Alert</Label>
          </div>
          
          <Button onClick={addAlert} disabled={!newAlert.name || !newAlert.type}>
            Add Alert
          </Button>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Active Alerts</h3>
          
          {alerts.length === 0 ? (
            <p className="text-gray-500">No alerts configured. Add an alert to get started.</p>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 border rounded-lg ${
                    alert.enabled ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-gray-800/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{alert.name}</h4>
                      <p className="text-sm text-gray-400">
                        Type: {alert.type}, Severity: {alert.severity}
                      </p>
                      <p className="text-sm text-gray-400">
                        Notification: {alert.notificationMethod}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${alert.enabled ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      <span className="text-xs">{alert.enabled ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitoringAlerts;
