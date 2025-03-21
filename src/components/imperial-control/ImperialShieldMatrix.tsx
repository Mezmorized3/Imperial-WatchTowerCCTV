
import React, { useState } from 'react';
import { Shield, Globe, Server, Lock, Unlock, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { imperialShieldProtocol } from '@/utils/imperial/imperialShieldProtocol';
import { ImperialShieldResult } from '@/utils/osintToolTypes';

const ImperialShieldMatrix: React.FC = () => {
  // State for form fields
  const [targetUrl, setTargetUrl] = useState('');
  const [port, setPort] = useState('443');
  const [protocol, setProtocol] = useState<'http' | 'https'>('https');
  const [validateCert, setValidateCert] = useState(true);
  
  // State for operations
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImperialShieldResult | null>(null);
  
  // Handle the shield activation
  const handleActivateShield = async () => {
    if (!targetUrl) {
      toast.error('Target URL is required');
      return;
    }
    
    setIsLoading(true);
    toast.info('Initializing Imperial Shield Protocol');
    
    try {
      // In development environment, use simulated responses
      const shieldResult = process.env.NODE_ENV === 'development' 
        ? await imperialShieldProtocol.simulateRequest({
            targetUrl,
            port: parseInt(port),
            protocol,
            validateCert
          })
        : await imperialShieldProtocol.request({
            targetUrl,
            port: parseInt(port),
            protocol,
            validateCert
          });
      
      setResult(shieldResult);
      
      if (shieldResult.success) {
        toast.success('Imperial Shield Protocol activated successfully');
      } else {
        toast.error(`Shield activation failed: ${shieldResult.error}`);
      }
    } catch (error) {
      console.error('Shield activation error:', error);
      toast.error('Critical shield failure');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get security rating color
  const getSecurityRatingColor = (rating?: number) => {
    if (rating === undefined) return 'bg-gray-500';
    if (rating >= 80) return 'bg-green-500';
    if (rating >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="space-y-4">
      <Card className="bg-scanner-dark-alt border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Shield className="mr-2 text-purple-400" /> Imperial Shield Protocol
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Target URL</label>
              <Input
                placeholder="Enter target URL"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="bg-scanner-dark"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Port</label>
              <Select value={port} onValueChange={setPort}>
                <SelectTrigger className="bg-scanner-dark">
                  <SelectValue placeholder="Select port" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="80">80 (HTTP)</SelectItem>
                  <SelectItem value="443">443 (HTTPS)</SelectItem>
                  <SelectItem value="8080">8080 (Alternative)</SelectItem>
                  <SelectItem value="9999">9999 (Emperor)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Protocol</label>
              <Select 
                value={protocol} 
                onValueChange={(value: 'http' | 'https') => setProtocol(value)}
              >
                <SelectTrigger className="bg-scanner-dark">
                  <SelectValue placeholder="Select protocol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="http">HTTP</SelectItem>
                  <SelectItem value="https">HTTPS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Validate Certificate</label>
              <Switch 
                checked={validateCert}
                onCheckedChange={setValidateCert}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleActivateShield}
            disabled={isLoading || !targetUrl}
            className="w-full bg-purple-700 hover:bg-purple-800"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Activating Shield...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Activate Imperial Shield
              </>
            )}
          </Button>
          
          {result && (
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-md bg-scanner-dark border border-gray-700">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  {result.success ? (
                    <>
                      <Lock className="mr-2 text-green-500" />
                      Shield Active
                    </>
                  ) : (
                    <>
                      <Unlock className="mr-2 text-red-500" />
                      Shield Breach Detected
                    </>
                  )}
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <p className="text-sm text-gray-400">Shield Status</p>
                    <p className="font-medium">{result.shieldStatus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Response Time</p>
                    <p className="font-medium flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {result.responseTime ? `${Math.round(result.responseTime)}ms` : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="mb-2">
                  <p className="text-sm text-gray-400 mb-1">Security Rating</p>
                  <div className="flex items-center">
                    <Progress 
                      value={result.securityRating} 
                      className="h-2" 
                      indicatorClassName={getSecurityRatingColor(result.securityRating)}
                    />
                    <span className="ml-2 text-sm">{result.securityRating || 0}%</span>
                  </div>
                </div>
                
                {result.error && (
                  <div className="p-2 rounded bg-red-900/30 text-red-400 mt-2 text-sm">
                    Error: {result.error}
                  </div>
                )}
                
                {result.data && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-1">Response Data</p>
                    <pre className="p-2 rounded bg-black/30 text-xs overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImperialShieldMatrix;
