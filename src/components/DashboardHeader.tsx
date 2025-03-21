import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Terminal, Camera, User, Map } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const DashboardHeader = () => {
  return (
    <header className="bg-scanner-dark-alt border-b border-gray-800 py-4 px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Terminal className="h-7 w-7 text-scanner-primary" />
            <h1 className="text-2xl font-bold text-white">CameraScanner</h1>
            <Badge className="bg-scanner-primary ml-2">Beta</Badge>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" className="text-gray-400 hover:text-white" asChild>
              <Link to="/viewer">
                <Camera className="h-4 w-4 mr-2" />
                Camera Viewer
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="text-gray-400 hover:text-white" asChild>
              <Link to="/imperial">
                <Terminal className="h-4 w-4 mr-2" />
                Imperial Scanner
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
