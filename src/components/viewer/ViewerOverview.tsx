
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Map } from 'lucide-react';
import { CameraResult } from '@/types/scanner';

type ViewerOverviewProps = {
  cameras: CameraResult[];
};

const ViewerOverview: React.FC<ViewerOverviewProps> = ({ cameras }) => {
  // Helper function to get location 
  const getCameraLocation = (camera: CameraResult) => {
    if (!camera.location) return null;
    
    // Handle location as object
    if (typeof camera.location === 'object') {
      return camera.location;
    }
    
    // If we reach here, we don't have valid location data
    return null;
  };

  // Group cameras by country
  const camerasByCountry = cameras.reduce((acc, camera) => {
    const location = getCameraLocation(camera);
    const country = location?.country || 'Unknown';
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(camera);
    return acc;
  }, {} as Record<string, CameraResult[]>);

  // Summary stats
  const totalCameras = cameras.length;
  const vulnerableCameras = cameras.filter(c => c.status === 'vulnerable').length;
  const countriesCount = Object.keys(camerasByCountry).length;

  return (
    <div className="pt-4">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-scanner-card border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center space-x-2">
              <Camera className="w-5 h-5 text-scanner-primary" />
              <span>Cameras Found</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{totalCameras}</div>
            <p className="text-gray-400 mt-2">Total number of cameras discovered</p>
          </CardContent>
        </Card>
        
        <Card className="bg-scanner-card border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center space-x-2">
              <Map className="w-5 h-5 text-scanner-primary" />
              <span>Countries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{countriesCount}</div>
            <p className="text-gray-400 mt-2">Spanning across {countriesCount} countries</p>
          </CardContent>
        </Card>
        
        <Card className="bg-scanner-card border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center space-x-2">
              <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white">!</span>
              <span>Vulnerable</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-white">{vulnerableCameras}</div>
            <p className="text-gray-400 mt-2">Cameras with security issues</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card className="bg-scanner-card border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Cameras by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {Object.entries(camerasByCountry).map(([country, camerasInCountry]) => (
                <li key={country} className="flex items-center justify-between p-3 bg-scanner-dark-alt rounded-md">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">{country === 'United States' ? '🇺🇸' : country === 'Germany' ? '🇩🇪' : country === 'Japan' ? '🇯🇵' : '🌍'}</span>
                    <span>{country}</span>
                  </div>
                  <Badge className="bg-scanner-primary">{camerasInCountry.length}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewerOverview;
