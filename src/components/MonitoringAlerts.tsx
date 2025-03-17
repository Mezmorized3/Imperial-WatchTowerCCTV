
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Bell, BellOff, Check, ChevronDown, ChevronUp, Eye, Shield, ToggleLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CameraResult, AlertConfig } from '@/types/scanner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface MonitoringAlertsProps {
  cameras: CameraResult[];
  onEnableMonitoring?: (cameraId: string, enabled: boolean) => void;
}

const MonitoringAlerts: React.FC<MonitoringAlertsProps> = ({ cameras, onEnableMonitoring }) => {
  const [globalAlertSettings, setGlobalAlertSettings] = useState<boolean>(false);
  const [alertsExpanded, setAlertsExpanded] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    enabled: false,
    type: 'status_change',
    severity: 'medium',
    notificationMethod: 'in_app'
  });
  
  // Mock alerts for demo purposes
  const [mockAlerts] = useState([
    {
      id: '1',
      cameraId: 'mock-cam-1',
      ip: '192.168.1.108',
      type: 'status_change',
      message: 'Camera status changed from online to offline',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      severity: 'high',
      read: false
    },
    {
      id: '2',
      cameraId: 'mock-cam-2',
      ip: '10.0.0.54',
      type: 'new_vulnerability',
      message: 'New critical vulnerability detected: Default credentials',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      severity: 'critical',
      read: true
    },
    {
      id: '3',
      cameraId: 'mock-cam-3',
      ip: '172.16.8.201',
      type: 'access_attempt',
      message: 'Unauthorized access attempt detected',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      severity: 'medium',
      read: false
    }
  ]);

  const handleToggleGlobalAlerts = (enabled: boolean) => {
    setGlobalAlertSettings(enabled);
    setAlertConfig({
      ...alertConfig,
      enabled
    });
  };

  const handleCameraMonitoring = (cameraId: string, enabled: boolean) => {
    if (onEnableMonitoring) {
      onEnableMonitoring(cameraId, enabled);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffMins < 24 * 60) {
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffDays = Math.floor(diffMins / (60 * 24));
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-scanner-danger';
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-scanner-warning';
      case 'low': return 'bg-scanner-info';
      default: return 'bg-gray-500';
    }
  };

  // Count unread alerts
  const unreadCount = mockAlerts.filter(alert => !alert.read).length;

  return (
    <Card className="bg-scanner-card border-gray-800 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-scanner-primary" />
            <span>Monitoring & Alerts</span>
            {unreadCount > 0 && (
              <Badge className="bg-scanner-danger">{unreadCount}</Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="global-alerts" 
              checked={globalAlertSettings}
              onCheckedChange={handleToggleGlobalAlerts}
            />
            <Label htmlFor="global-alerts">
              {globalAlertSettings ? 'Enabled' : 'Disabled'}
            </Label>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {cameras.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No cameras to monitor</AlertTitle>
            <AlertDescription>
              Start a scan to discover cameras for monitoring.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {/* Alert Settings */}
            <Collapsible
              open={alertsExpanded}
              onOpenChange={setAlertsExpanded}
              className="border border-gray-800 rounded-md"
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex w-full justify-between p-4 rounded-none border-none"
                >
                  <span>Alert Configuration</span>
                  {alertsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 pt-0 border-t border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-type">Alert Type</Label>
                    <Select 
                      defaultValue={alertConfig.type} 
                      onValueChange={(value) => setAlertConfig({...alertConfig, type: value as any})}
                      disabled={!globalAlertSettings}
                    >
                      <SelectTrigger id="alert-type" className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select alert type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="status_change">Status Change</SelectItem>
                        <SelectItem value="new_vulnerability">New Vulnerability</SelectItem>
                        <SelectItem value="connection_loss">Connection Loss</SelectItem>
                        <SelectItem value="access_attempt">Access Attempt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="alert-severity">Minimum Severity</Label>
                    <Select 
                      defaultValue={alertConfig.severity} 
                      onValueChange={(value) => setAlertConfig({...alertConfig, severity: value as any})}
                      disabled={!globalAlertSettings}
                    >
                      <SelectTrigger id="alert-severity" className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Label htmlFor="notification-method">Notification Method</Label>
                  <Select 
                    defaultValue={alertConfig.notificationMethod} 
                    onValueChange={(value) => setAlertConfig({...alertConfig, notificationMethod: value as any})}
                    disabled={!globalAlertSettings}
                  >
                    <SelectTrigger id="notification-method" className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="in_app">In-App Notifications</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            {/* Recent Alerts */}
            <div className="border border-gray-800 rounded-md">
              <div className="p-3 bg-gray-900 flex items-center justify-between">
                <h3 className="text-sm font-medium">Recent Alerts</h3>
                {unreadCount > 0 && (
                  <Badge className="bg-scanner-danger">{unreadCount} unread</Badge>
                )}
              </div>
              
              {mockAlerts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>No alerts to display</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {mockAlerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`p-3 ${alert.read ? '' : 'bg-gray-800/40'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-2">
                          <Badge className={getSeverityClass(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium">{alert.ip}</p>
                            <p className="text-xs text-gray-400">{alert.message}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{formatTimestamp(alert.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Monitored Cameras */}
            <div className="border border-gray-800 rounded-md">
              <div className="p-3 bg-gray-900">
                <h3 className="text-sm font-medium">Monitored Cameras</h3>
              </div>
              
              <div className="divide-y divide-gray-800">
                {cameras.slice(0, 5).map((camera) => (
                  <div key={camera.id} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-mono">{camera.ip}</p>
                      <p className="text-xs text-gray-400">
                        {camera.brand || 'Unknown'} {camera.model || ''}
                      </p>
                    </div>
                    <Switch 
                      checked={camera.monitoringEnabled || false}
                      onCheckedChange={(enabled) => handleCameraMonitoring(camera.id, enabled)}
                      disabled={!globalAlertSettings}
                    />
                  </div>
                ))}
                
                {cameras.length > 5 && (
                  <div className="p-3 text-center">
                    <Button variant="link" className="text-scanner-info">
                      View all {cameras.length} cameras
                    </Button>
                  </div>
                )}
                
                {cameras.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    <Shield className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p>No cameras available for monitoring</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonitoringAlerts;
