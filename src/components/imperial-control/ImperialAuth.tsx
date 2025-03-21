
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
          
          <div className="mt-6 space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="admin-token" className="text-gray-300">Imperial Admin Token</label>
              <Input
                id="admin-token"
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="Enter your Imperial admin token"
                className="bg-scanner-dark border-gray-700 text-white"
              />
            </div>
            
            <Button 
              onClick={handleLogin} 
              disabled={isLoading || !adminToken.trim()} 
              className="w-full"
            >
              {isLoading ? "Authenticating..." : "Authenticate"}
            </Button>
            
            <p className="text-sm text-gray-500 italic">
              Note: The default token can be found in server/config.json
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImperialAuth;
