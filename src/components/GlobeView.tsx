
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraResult } from '@/types/scanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Import refactored components
import GlobeScene from './globe/GlobeScene';
import Legend from './globe/Legend';
import NoDataOverlay from './globe/NoDataOverlay';
import ScanAlert from './globe/ScanAlert';

interface GlobeViewProps {
  cameras: CameraResult[];
  scanInProgress?: boolean;
  currentTarget?: string;
  targetCountry?: string;
}

const GlobeView: React.FC<GlobeViewProps> = (props) => {
  const { cameras, scanInProgress, currentTarget, targetCountry } = props;
  const camerasWithLocation = cameras.filter(c => c.location?.latitude && c.location?.longitude);
  const navigate = useNavigate();
  
  return (
    <Card className="bg-scanner-card border-gray-800 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center space-x-2">
            <Globe className="w-5 h-5 text-scanner-primary" />
            <span>Interactive Globe</span>
            {camerasWithLocation.length > 0 && (
              <Badge className="ml-2 bg-scanner-primary">
                {camerasWithLocation.length}
              </Badge>
            )}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/globe')}
            className="text-gray-400 hover:text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Full View
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScanAlert 
          scanInProgress={!!scanInProgress} 
          currentTarget={currentTarget} 
          targetCountry={targetCountry} 
        />
        
        <div className="h-[500px] rounded-md overflow-hidden relative">
          <Canvas camera={{ position: [0, 0, 300], fov: 50 }}>
            <GlobeScene 
              cameras={cameras} 
              scanInProgress={scanInProgress} 
              currentTarget={currentTarget}
              targetCountry={targetCountry}
            />
          </Canvas>
          
          <NoDataOverlay visible={camerasWithLocation.length === 0 && !scanInProgress} />
          <Legend />
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobeView;
