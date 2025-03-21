
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraResult } from '@/types/scanner';
import { Card } from '@/components/ui/card';
import GlobeScene from './GlobeScene';
import Legend from './Legend';

interface GlobeViewProps {
  cameras: CameraResult[];
  scanInProgress?: boolean;
  currentTarget?: string;
  targetCountry?: string;
}

console.log('GlobeView component file loaded');

const GlobeView: React.FC<GlobeViewProps> = (props) => {
  const { cameras, scanInProgress, currentTarget, targetCountry } = props;
  console.log('GlobeView component rendering', { camerasCount: cameras.length });
  
  return (
    <Card className="bg-scanner-card border-gray-800 shadow-lg h-full">
      <div className="h-full rounded-md overflow-hidden relative">
        <Canvas camera={{ position: [0, 0, 300], fov: 50 }}>
          <GlobeScene 
            cameras={cameras} 
            scanInProgress={scanInProgress} 
            currentTarget={currentTarget}
            targetCountry={targetCountry}
          />
        </Canvas>
        <Legend />
      </div>
    </Card>
  );
};

export default GlobeView;
