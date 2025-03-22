
import React, { useState, useEffect } from 'react';
import { Shield, Eye, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { imperialServerService } from '@/utils/imperialServerService';
import ImperialShinobiContent from '@/components/imperial-control/ImperialShinobi';
import ImperialAuth from '@/components/imperial-control/ImperialAuth';
import { imperialProtocolBanner } from '@/components/settings/ImperialBanner';

const ImperialShinobi = () => {
  const { toast } = useToast();
  const [adminToken, setAdminToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = imperialServerService.isAuthenticated();
      setIsAuthenticated(isAuth);
    };
    
    checkAuth();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    const success = await imperialServerService.authenticate(adminToken);
    
    if (success) {
      setIsAuthenticated(true);
      toast({
        title: "Imperial Authentication Successful",
        description: "Welcome to Imperial Shinobi",
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid Imperial credentials",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    imperialServerService.logout();
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "Imperial session terminated",
    });
  };

  const shinobiBanner = `
    ██╗███╗   ███╗██████╗ ███████╗██████╗ ██╗ █████╗ ██╗          ███████╗██╗  ██╗██╗███╗   ██╗ ██████╗ ██████╗ ██╗
    ██║████╗ ████║██╔══██╗██╔════╝██╔══██╗██║██╔══██╗██║          ██╔════╝██║  ██║██║████╗  ██║██╔═══██╗██╔══██╗██║
    ██║██╔████╔██║██████╔╝█████╗  ██████╔╝██║███████║██║          ███████╗███████║██║██╔██╗ ██║██║   ██║██████╔╝██║
    ██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗██║██╔══██║██║          ╚════██║██╔══██║██║██║╚██╗██║██║   ██║██╔══██╗██║
    ██║██║ ╚═╝ ██║██║     ███████╗██║  ██║██║██║  ██║███████╗     ███████║██║  ██║██║██║ ╚████║╚██████╔╝██║  ██║██║
    ╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚══════╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚═╝
  `;

  if (!isAuthenticated) {
    return (
      <ImperialAuth
        adminToken={adminToken}
        setAdminToken={setAdminToken}
        handleLogin={handleLogin}
        isLoading={isLoading}
        imperialBanner={shinobiBanner}
      />
    );
  }

  return (
    <div className="min-h-screen bg-scanner-dark text-white p-6">
      <Card className="max-w-6xl mx-auto bg-scanner-dark-alt border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl flex items-center">
              <Eye className="mr-2 text-red-500" /> Imperial Shinobi
            </CardTitle>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/imperial-control" className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Control
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Terminate Session
              </Button>
            </div>
          </div>
          <pre className="text-xs md:text-sm text-red-500 font-mono overflow-auto mt-2">
            {shinobiBanner}
          </pre>
          <CardDescription className="text-gray-400">
            Advanced offensive security module for camera systems and web applications surveillance
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <ImperialShinobiContent />
        </CardContent>
      </Card>
    </div>
  );
};

export default ImperialShinobi;
