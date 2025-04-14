
import React, { useEffect, useRef, useState } from 'react';
import { CameraResult } from '@/types/scanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Camera, AlertTriangle, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface CameraMapProps {
  cameras: CameraResult[];
  onSelectCamera?: (camera: CameraResult) => void;
}

const CameraMap: React.FC<CameraMapProps> = ({ cameras, onSelectCamera }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    // Mock map loading - in a real implementation, we'd load a map library like Leaflet or Google Maps
    const loadMap = async () => {
      try {
        // In a real implementation, we'd initialize the map here
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulating map load time
        
        if (mapContainerRef.current) {
          console.log('Map initialized');
          mapRef.current = {
            initialized: true,
            // This would be the map instance in a real implementation
          };
          renderMarkers();
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to load map. Please check your connection and reload the page.');
      }
    };

    if (mapContainerRef.current && !mapRef.current) {
      loadMap();
    } else if (mapRef.current) {
      renderMarkers();
    }

    return () => {
      // Cleanup markers and map in a real implementation
      markersRef.current = [];
    };
  }, [cameras]);

  const getCameraLocation = (camera: CameraResult) => {
    if (!camera.location) return null;
    
    // Handle location as object
    if (typeof camera.location === 'object') {
      return camera.location;
    }
    
    // If we reach here, we don't have valid location data
    return null;
  };

  const renderMarkers = () => {
    // Clear existing markers in a real implementation
    markersRef.current = [];
    
    // Add markers for each camera with location data
    cameras.forEach(camera => {
      const location = getCameraLocation(camera);
      if (location && location.latitude && location.longitude) {
        // In a real implementation, we'd add actual markers to the map
        markersRef.current.push({
          camera,
          position: {
            lat: location.latitude,
            lng: location.longitude
          }
        });
        
        console.log(`Added marker for camera ${camera.ip} at ${location.latitude}, ${location.longitude}`);
      }
    });
  };

  const getCamerasWithLocation = () => {
    return cameras.filter(camera => {
      const location = getCameraLocation(camera);
      return location && location.latitude && location.longitude;
    });
  };

  return (
    <Card className="bg-scanner-card border-gray-800 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-scanner-primary" />
          <span>Camera Map</span>
          {getCamerasWithLocation().length > 0 && (
            <Badge className="ml-2 bg-scanner-primary">
              {getCamerasWithLocation().length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mapError ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{mapError}</AlertDescription>
          </Alert>
        ) : getCamerasWithLocation().length === 0 ? (
          <div className="h-72 flex items-center justify-center bg-gray-900 rounded-md border border-gray-800">
            <div className="text-center text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>No camera location data available</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Map container */}
            <div 
              ref={mapContainerRef} 
              className="h-72 bg-gray-900 rounded-md border border-gray-800 overflow-hidden"
            >
              {/* Mock map visualization */}
              <div className="absolute inset-0 p-4 flex flex-wrap gap-2 overflow-auto">
                {getCamerasWithLocation().map(camera => {
                  const location = getCameraLocation(camera);
                  if (!location) return null;
                  
                  return (
                    <div 
                      key={camera.id}
                      className="bg-gray-800 p-2 rounded border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => onSelectCamera && onSelectCamera(camera)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          camera.status === 'online' ? 'bg-scanner-info' :
                          camera.status === 'vulnerable' ? 'bg-scanner-danger' :
                          camera.status === 'authenticated' ? 'bg-scanner-success' : 'bg-gray-500'
                        }`} />
                        <span className="text-sm font-mono">{camera.ip}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {location.country}, {location.city || 'Unknown city'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Map Statistics */}
            <div className="absolute bottom-3 right-3 bg-gray-800/90 p-2 rounded text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-scanner-info mr-1" />
                  <span>Online: {cameras.filter(c => c.status === 'online' && getCameraLocation(c)?.latitude).length}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-scanner-danger mr-1" />
                  <span>Vulnerable: {cameras.filter(c => c.status === 'vulnerable' && getCameraLocation(c)?.latitude).length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CameraMap;
