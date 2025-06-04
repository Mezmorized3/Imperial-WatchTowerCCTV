
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Monitor } from 'lucide-react';
import { CameraResult } from '@/types/scanner';

interface CameraViewerGridProps {
  cameras: CameraResult[];
}

const CameraViewerGrid: React.FC<CameraViewerGridProps> = ({ cameras }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cameras.map((camera, index) => (
        <Card key={camera.id || index} className="border-gray-700 bg-scanner-dark-alt">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Camera className="h-4 w-4 mr-2 text-scanner-info" />
              {camera.ip}:{camera.port}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-black rounded-md flex items-center justify-center mb-2">
              <Monitor className="h-8 w-8 text-gray-500" />
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Location:</span>
                <span>{camera.location?.country || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`${camera.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                  {camera.status || 'Unknown'}
                </span>
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
  );
};

export default CameraViewerGrid;
