
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const ServerConfig: React.FC = () => {
  const [imperialToken, setImperialToken] = useState('');
  
  useEffect(() => {
    // Load the token from localStorage when component mounts
    const savedToken = localStorage.getItem('imperialToken');
    if (savedToken) {
      setImperialToken(savedToken);
    }
  }, []);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToken = e.target.value;
    setImperialToken(newToken);
    localStorage.setItem('imperialToken', newToken);
  };

  return (
    <Card className="bg-scanner-card border-gray-700">
      <CardHeader>
        <CardTitle>Imperial Server Configuration</CardTitle>
        <CardDescription className="text-gray-400">
          Configure connection to the Imperial Server for enhanced capabilities.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="imperial-server-url" className="flex items-center">
            <span>Server URL</span>
            <span className="ml-2 px-2 py-0.5 text-xs bg-green-900 text-green-200 rounded">Required</span>
          </Label>
          <Input
            id="imperial-server-url"
            className="bg-gray-800"
            defaultValue="http://localhost:7443"
            placeholder="http://localhost:7443"
          />
          <p className="text-xs text-gray-400">The URL of your Imperial Server instance. Default port is 7443.</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="imperial-token" className="flex items-center">
            <span>Imperial Access Token</span>
            <span className="ml-2 px-2 py-0.5 text-xs bg-green-900 text-green-200 rounded">Required</span>
          </Label>
          <Input
            id="imperial-token"
            className="bg-gray-800"
            placeholder="Enter your Imperial admin token"
            type="password"
            value={imperialToken}
            onChange={handleTokenChange}
          />
          <p className="text-xs text-gray-400">Admin token from your server's config.json file.</p>
        </div>
      </CardContent>
    </Card>
  );
};
