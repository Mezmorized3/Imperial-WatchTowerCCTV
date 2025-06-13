
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Monitor, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CameraResult } from '@/types/scanner';

const Viewer: React.FC = () => {
  const { searchId } = useParams<{ searchId: string }>();
  const location = useLocation();
  const [cameras, setCameras] = useState<CameraResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Viewer component mounting...');
    console.log('Location state:', location.state);
    console.log('Search ID:', searchId);
    
    // Get cameras from location state or load from storage
    const cameraData = location.state?.cameras || [];
    
    if (cameraData.length > 0) {
      console.log('Found cameras in location state:', cameraData.length);
      setCameras(cameraData);
    } else if (searchId) {
      // Try to load from localStorage
      const storedData = localStorage.getItem(`search_${searchId}`);
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          console.log('Loaded cameras from storage:', parsed.cameras?.length || 0);
          setCameras(parsed.cameras || []);
        } catch (error) {
          console.error('Failed to parse stored camera data:', error);
        }
      }
    }
    
    setLoading(false);
    console.log('Viewer component loaded successfully');
  }, [searchId, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading camera data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-blue-400">Camera Viewer</h1>
          </div>
        </div>

        {/* Stats Card */}
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-400 flex items-center">
              <Camera className="h-6 w-6 mr-2" />
              Camera Surveillance Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Found {cameras.length} camera{cameras.length !== 1 ? 's' : ''} ready for monitoring
            </p>
          </CardContent>
        </Card>

        {/* Camera Grid */}
        {cameras.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cameras.map((camera, index) => (
              <Card key={camera.id || index} className="border-gray-700 bg-gray-800 hover:bg-gray-750 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Monitor className="h-4 w-4 mr-2 text-blue-400" />
                    {camera.ip}:{camera.port || 554}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black rounded-md flex items-center justify-center mb-3">
                    <Camera className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`${camera.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                        {camera.status || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location:</span>
                      <span>{camera.location?.country || 'Unknown'}</span>
                    </div>
                    {camera.manufacturer && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Brand:</span>
                        <span>{camera.manufacturer}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-gray-700 bg-gray-800">
            <CardContent className="p-8 text-center">
              <Camera className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Cameras Found</h3>
              <p className="text-gray-400 mb-4">
                No camera data is available for viewing. You can discover cameras using the scanner.
              </p>
              <Button asChild>
                <Link to="/imperial" className="flex items-center">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera Scan
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Viewer;
