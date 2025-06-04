
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { CameraResult } from '@/types/scanner';
import SecurityTools from '@/components/viewer/SecurityTools';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Viewer: React.FC = () => {
  const { searchId } = useParams<{ searchId: string }>();
  const location = useLocation();
  const [cameras, setCameras] = useState<CameraResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get cameras from location state or load from storage
    const cameraData = location.state?.cameras || [];
    
    if (cameraData.length > 0) {
      setCameras(cameraData);
    } else if (searchId) {
      // Try to load from localStorage or other storage
      const storedData = localStorage.getItem(`search_${searchId}`);
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          setCameras(parsed.cameras || []);
        } catch (error) {
          console.error('Failed to parse stored camera data:', error);
        }
      }
    }
    
    setLoading(false);
  }, [searchId, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-scanner-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-scanner-info"></div>
          <p className="mt-4 text-gray-400">Loading camera data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-scanner-dark p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-gray-700 bg-scanner-dark-alt">
          <CardHeader>
            <CardTitle className="text-2xl text-scanner-info">
              Camera Surveillance Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Found {cameras.length} camera{cameras.length !== 1 ? 's' : ''} ready for monitoring
            </p>
          </CardContent>
        </Card>

        <SecurityTools cameras={cameras} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cameras.map((camera, index) => (
            <Card key={camera.id || index} className="border-gray-700 bg-scanner-dark-alt">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  {camera.ip}:{camera.port}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-1">
                  <div>Status: {camera.status || 'Unknown'}</div>
                  <div>Location: {camera.location?.country || 'Unknown'}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Viewer;
