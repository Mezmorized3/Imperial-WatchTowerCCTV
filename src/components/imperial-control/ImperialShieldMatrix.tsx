import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, Lock, AlertTriangle, Settings, RefreshCw } from 'lucide-react';
import { configureImperialShield, testImperialShieldConnection } from '@/utils/imperial/imperialShieldUtils';
import { useToast } from '@/components/ui/use-toast';

export const ImperialShieldMatrix: React.FC = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<'inactive' | 'active' | 'breached'>('inactive');
  const [securityRating, setSecurityRating] = useState(0);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initProgress, setInitProgress] = useState(0);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    checkShieldStatus();
  }, []);

  const checkShieldStatus = async () => {
    setIsInitializing(true);
    setInitProgress(0);

    // Simulate initialization
    const interval = setInterval(() => {
      setInitProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    try {
      // In real implementation, this would check Imperial Shield Protocol status
      const result = await testImperialShieldConnection('https://shield.example.com');
      
      // Fix: Convert string status to the correct enum type
      setStatus(result.shieldStatus as 'inactive' | 'active' | 'breached');
      setSecurityRating(result.securityRating);
      setLastChecked(new Date());
      
      if (result.success) {
        toast({
          title: 'Imperial Shield Active',
          description: 'The shield matrix is operational.',
        });
      } else {
        toast({
          title: 'Imperial Shield Warning',
          description: result.error || 'Shield status compromised.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error checking shield status:', error);
      setStatus('inactive');
      setSecurityRating(0);
      
      toast({
        title: 'Imperial Shield Offline',
        description: 'Unable to connect to the shield matrix.',
        variant: 'destructive',
      });
    } finally {
      clearInterval(interval);
      setInitProgress(100);
      setTimeout(() => setIsInitializing(false), 500);
    }
  };

  const activateShield = async () => {
    setIsInitializing(true);
    setInitProgress(0);
    
    // Simulate activation
    const interval = setInterval(() => {
      setInitProgress(prev => Math.min(prev + 2, 95));
    }, 50);
    
    try {
      // In real implementation, this would activate the Imperial Shield Protocol
      const success = configureImperialShield(
        true,                       // enabled
        '9000',                     // emperorPort
        '8080,443,8443',            // shieldPorts
        '10.0.0.0/8,192.168.0.0/16', // trustedNetworks
        Math.random().toString(36).substring(2) // Random cipher key
      );
      
      if (success) {
        setStatus('active');
        setSecurityRating(85);
        toast({
          title: 'Imperial Shield Activated',
          description: 'Shield matrix is now protecting your system.',
        });
      } else {
        throw new Error('Failed to configure Imperial Shield');
      }
    } catch (error) {
      console.error('Error activating shield:', error);
      toast({
        title: 'Activation Failed',
        description: 'Failed to activate Imperial Shield matrix.',
        variant: 'destructive',
      });
    } finally {
      clearInterval(interval);
      setInitProgress(100);
      setTimeout(() => setIsInitializing(false), 500);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'breached': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getSecurityRatingColor = () => {
    if (securityRating >= 75) return 'text-green-500';
    if (securityRating >= 50) return 'text-yellow-500';
    if (securityRating >= 25) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <Card className="border-2 border-gray-300 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className={`mr-2 h-6 w-6 ${getStatusColor()}`} />
          Imperial Shield Matrix
        </CardTitle>
        <CardDescription>
          Advanced security protocol for the Imperial network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              {status === 'active' ? (
                <Lock className="h-8 w-8 text-green-500 mr-3" />
              ) : status === 'breached' ? (
                <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
              ) : (
                <Shield className="h-8 w-8 text-gray-400 mr-3" />
              )}
              <div>
                <h3 className="text-lg font-semibold">Shield Status: <span className={getStatusColor()}>
                  {status === 'active' ? 'ACTIVE' : status === 'breached' ? 'BREACHED' : 'INACTIVE'}
                </span></h3>
                <p className="text-sm text-gray-500">
                  {lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : 'Not checked yet'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={status === 'active' ? 'outline' : 'default'}
                onClick={status === 'active' ? checkShieldStatus : activateShield}
                disabled={isInitializing}
              >
                {status === 'active' ? 'Refresh Status' : 'Activate Shield'}
              </Button>
              <Button variant="outline" disabled={isInitializing}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isInitializing && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>
                  {status === 'inactive' ? 'Initializing Imperial Shield...' : 'Updating shield status...'}
                </span>
                <span>{initProgress}%</span>
              </div>
              <Progress value={initProgress} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-medium mb-2">Security Rating</h3>
              <div className="flex items-center">
                <span className={`text-2xl font-bold mr-2 ${getSecurityRatingColor()}`}>
                  {securityRating}/100
                </span>
                <div className="flex-1 mx-2">
                  <Progress value={securityRating} className="h-2" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {securityRating >= 75 ? 'Excellent protection' :
                 securityRating >= 50 ? 'Good protection' :
                 securityRating >= 25 ? 'Moderate vulnerabilities' :
                 'Critical vulnerabilities'}
              </p>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-medium mb-2">Shield Components</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Quantum Firewall</span>
                  <span className="font-semibold text-green-500">Active</span>
                </li>
                <li className="flex justify-between">
                  <span>Neural Intrusion Detection</span>
                  <span className="font-semibold text-green-500">Active</span>
                </li>
                <li className="flex justify-between">
                  <span>Temporal Shield Generator</span>
                  <span className="font-semibold text-yellow-500">Partial</span>
                </li>
                <li className="flex justify-between">
                  <span>Blood Oath Authenticator</span>
                  <span className="font-semibold text-gray-500">Inactive</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
        <p className="text-sm text-gray-500">Imperial Shield v1.0</p>
        <Button variant="outline" size="sm" className="flex items-center" onClick={checkShieldStatus}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Status
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImperialShieldMatrix;
