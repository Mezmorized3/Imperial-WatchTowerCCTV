
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImperialAuthProps {
  adminToken: string;
  setAdminToken: (token: string) => void;
  handleLogin: () => void;
  isLoading: boolean;
  imperialBanner: string;
}

const ImperialAuth: React.FC<ImperialAuthProps> = ({
  adminToken,
  setAdminToken,
  handleLogin,
  isLoading,
  imperialBanner
}) => {
  const [isTokenAutoFilled, setIsTokenAutoFilled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isDevMode, setIsDevMode] = useState(false);
  
  useEffect(() => {
    // Check if we're in development mode
    setIsDevMode(window.location.hostname === 'localhost' || 
                import.meta.env.DEV === true);
    
    // Auto-fill the admin token from the server config
    const fetchToken = async () => {
      try {
        const response = await fetch('/server/config.json');
        if (response.ok) {
          const config = await response.json();
          if (config.adminToken) {
            setAdminToken(config.adminToken);
            setIsTokenAutoFilled(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch admin token:', error);
      }
    };
    
    fetchToken();
  }, [setAdminToken]);

  const toggleTokenVisibility = () => {
    setIsDialogOpen(true);
  };
  
  const handleLoginWithErrorHandling = () => {
    setAuthError(null);
    
    // Display development mode notice if we're not on localhost
    if (!isDevMode) {
      setAuthError("Authentication may fail: The Imperial Server runs locally on port 5001. If you're accessing this app remotely, the authentication will fail due to CORS restrictions. Run the application locally for full functionality.");
    }
    
    handleLogin();
  };

  return (
    <div className="min-h-screen bg-scanner-dark text-white p-6">
      <Card className="max-w-4xl mx-auto bg-scanner-dark-alt border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <CardTitle className="text-2xl text-center text-red-500">Imperial Control</CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Authentication Required
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <pre className="text-xs text-red-500 font-mono overflow-auto">{imperialBanner}</pre>
          
          {authError && (
            <Alert variant="destructive" className="my-4 bg-red-900/30 border-red-800 text-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                {authError}
              </AlertDescription>
            </Alert>
          )}
          
          {!isDevMode && (
            <Alert className="my-4 bg-yellow-900/30 border-yellow-800 text-yellow-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                Note: Imperial Server requires local access to port 5001. For full functionality, run this application locally.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="mt-6 space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="admin-token" className="text-gray-300">Imperial Admin Token</label>
              <div className="relative">
                <Input
                  id="admin-token"
                  type="password"
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  placeholder="Enter your Imperial admin token"
                  className="bg-scanner-dark border-gray-700 text-white pl-10"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              </div>
            </div>
            
            <Button 
              onClick={handleLoginWithErrorHandling} 
              disabled={isLoading || !adminToken.trim()} 
              className="w-full"
            >
              {isLoading ? "Authenticating..." : "Authenticate"}
            </Button>
            
            {isTokenAutoFilled && (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-green-900 text-green-200 border-green-700">
                    Auto-Authentication Ready
                  </Badge>
                  <span className="text-sm text-green-500">Token automatically loaded from server</span>
                </div>
                <Button variant="outline" size="sm" onClick={toggleTokenVisibility}>
                  Show Token Details
                </Button>
              </div>
            )}
            
            {!isTokenAutoFilled && (
              <p className="text-sm text-gray-500 italic">
                Note: The default token can be found in server/config.json
              </p>
            )}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-scanner-dark-alt text-white border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Imperial Token Details</DialogTitle>
                <DialogDescription className="text-gray-400">
                  This is your authentication token for Imperial Control
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-3 bg-scanner-dark rounded-md border border-gray-700">
                  <p className="font-mono break-all text-sm text-gray-300">{adminToken}</p>
                </div>
                <p className="text-xs text-gray-400">
                  This token is stored in server/config.json. For security purposes, avoid sharing this token.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImperialAuth;
