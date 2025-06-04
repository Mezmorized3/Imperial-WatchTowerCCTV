
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CameraViewerGrid from '@/components/viewer/CameraViewerGrid';
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
        
        <CameraViewerGrid cameras={cameras} />
      </div>
    </div>
  );
};

export default Viewer;
