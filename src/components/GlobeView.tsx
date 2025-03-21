
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraResult } from '@/types/scanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlobeView from './globe/GlobeView';
import ScanAlert from './globe/ScanAlert';
import NoDataOverlay from './globe/NoDataOverlay';

interface GlobeComponentProps {
  cameras: CameraResult[];
  scanInProgress?: boolean;
  currentTarget?: string;
  targetCountry?: string;
}

console.log('Dashboard GlobeComponent loaded');

const GlobeComponent: React.FC<GlobeComponentProps> = (props) => {
  const { cameras, scanInProgress, currentTarget, targetCountry } = props;
  const camerasWithLocation = cameras.filter(c => c.location?.latitude && c.location?.longitude);
  const navigate = useNavigate();
  
  console.log('Dashboard GlobeComponent rendering', { 
    camerasCount: cameras.length, 
    camerasWithLocationCount: camerasWithLocation.length 
  });

  const handleGlobeNavigation = () => {
    console.log('Navigating to /globe');
    
    // Try React Router navigation first
    navigate('/globe');
  };

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
            onClick={handleGlobeNavigation}
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
          <GlobeView 
            cameras={cameras} 
            scanInProgress={scanInProgress} 
            currentTarget={currentTarget}
            targetCountry={targetCountry}
          />
          
          <NoDataOverlay visible={camerasWithLocation.length === 0 && !scanInProgress} />
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobeComponent;
