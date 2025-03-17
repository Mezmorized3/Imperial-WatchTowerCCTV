
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Key, CheckCircle2, XCircle } from 'lucide-react';
import { initializeZoomEye, isZoomEyeInitialized } from '@/utils/zoomEyeUtils';
import { useToast } from '@/hooks/use-toast';

const ZoomEyeApiSetup: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Check if ZoomEye is already initialized
  useEffect(() => {
    setIsInitialized(isZoomEyeInitialized());
  }, []);

  const handleInitialize = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid ZoomEye API key",
        variant: "destructive"
      });
      return;
    }

    try {
      initializeZoomEye(apiKey);
      setIsInitialized(true);
      // Store API key in localStorage for persistence
      localStorage.setItem('zoomEyeApiKey', apiKey);
      toast({
        title: "Success",
        description: "ZoomEye API initialized successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to initialize ZoomEye API:', error);
      toast({
        title: "Error",
        description: "Failed to initialize ZoomEye API. Please check your key.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-scanner-card border-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Key className="w-5 h-5 text-scanner-primary" />
          <span>ZoomEye API Setup</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-300">
                ZoomEye API Status: 
              </p>
            </div>
            <div>
              {isInitialized ? (
                <div className="flex items-center text-green-500">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  <span>Initialized</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <XCircle className="w-4 h-4 mr-1" />
                  <span>Not Initialized</span>
                </div>
              )}
            </div>
          </div>
          
          <Separator className="bg-gray-700" />
          
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-gray-300">
              ZoomEye API Key
            </Label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your ZoomEye API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
            <p className="text-xs text-gray-400">
              Get your API key from the ZoomEye website. This will be stored locally.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-800 pt-4">
        <Button 
          className="w-full bg-scanner-primary hover:bg-blue-600 text-white"
          onClick={handleInitialize}
          disabled={isInitialized && !apiKey}
        >
          {isInitialized ? 'Update API Key' : 'Initialize ZoomEye API'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ZoomEyeApiSetup;
