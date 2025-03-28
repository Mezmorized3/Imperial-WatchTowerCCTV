
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Video } from 'lucide-react';
import RtspPlayer from '@/components/RtspPlayer';
import { CameraResult } from '@/types/scanner';
import { getProperStreamUrl } from '@/utils/rtspUtils';

interface CameraListProps {
  cameras: CameraResult[];
  selectedCamera: CameraResult | null;
  setSelectedCamera: (camera: CameraResult | null) => void;
}

const CameraList: React.FC<CameraListProps> = ({
  cameras,
  selectedCamera,
  setSelectedCamera,
}) => {
  const getCameraStreamUrl = (camera: CameraResult): string => {
    return getProperStreamUrl({
      brand: camera.brand,
      ip: camera.ip,
      credentials: camera.credentials
    });
  };
  
  return (
    <>
      {!selectedCamera ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cameras.map((camera, index) => (
            <Card 
              key={index} 
              className="bg-scanner-dark-alt border-gray-700 hover:border-gray-600 cursor-pointer transition-colors"
              onClick={() => setSelectedCamera(camera)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-scanner-dark flex items-center justify-center">
                    <Video className="h-4 w-4 text-scanner-info" />
                  </div>
                  <div>
                    <h3 className="font-medium">{camera.ip}</h3>
                    <p className="text-sm text-gray-400">
                      {camera.brand} {camera.model}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span 
                      className={`inline-block w-3 h-3 rounded-full ${
                        camera.status === "online" ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {cameras.length === 0 && (
            <div className="col-span-full text-center p-6 bg-scanner-dark-alt border border-gray-700 rounded-md">
              <Video className="h-12 w-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">No cameras found in your network.</p>
              <p className="text-sm text-gray-500 mt-2">
                Try using the "Find Cameras" tab to discover cameras.
              </p>
            </div>
          )}
        </div>
      ) : (
        <Card className="bg-scanner-dark-alt border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">
              <div className="flex items-center">
                <Monitor className="mr-2 h-4 w-4 text-scanner-info" />
                {selectedCamera.ip}
                <span className="ml-2 text-xs text-gray-400">
                  {selectedCamera.brand} {selectedCamera.model}
                </span>
              </div>
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSelectedCamera(null)}
            >
              Back to List
            </Button>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="aspect-video bg-black rounded-md overflow-hidden">
              <RtspPlayer 
                rtspUrl={getCameraStreamUrl(selectedCamera)} 
                autoPlay={true}
                onError={(error) => console.error("Stream error:", error)}
              />
            </div>
            <div className="mt-4 text-sm text-gray-400 space-y-2">
              <p>
                <span className="font-semibold">IP:</span> {selectedCamera.ip}
                {selectedCamera.port && <span className="ml-1">:{selectedCamera.port}</span>}
              </p>
              {selectedCamera.location && typeof selectedCamera.location === 'string' && (
                <p><span className="font-semibold">Location:</span> {selectedCamera.location}</p>
              )}
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span className={selectedCamera.status === "online" ? "text-green-500" : "text-red-500"}>
                  {selectedCamera.status}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CameraList;
