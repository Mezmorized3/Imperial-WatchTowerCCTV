
import React, { useRef, useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { CameraResult } from '@/types/scanner';
import CountryLabels from './CountryLabels';
import { updateCameraMarkers, calculateTargetCoordinates } from '@/utils/globeUtils';
import { useGlobeAnimation } from '@/hooks/useGlobeAnimation';
import GlobeInitializer from './GlobeInitializer';

interface GlobeSceneProps {
  cameras: CameraResult[];
  scanInProgress?: boolean;
  currentTarget?: string;
  targetCountry?: string;
}

const GlobeScene: React.FC<GlobeSceneProps> = ({ 
  cameras, 
  scanInProgress, 
  currentTarget, 
  targetCountry 
}) => {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { scene, camera } = useThree();
  const [isInitialized, setIsInitialized] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const targetRef = useRef<{
    lat: number;
    lng: number;
    country: string;
  } | null>(null);

  // Find target country coordinates
  useEffect(() => {
    if (targetCountry && !targetRef.current) {
      targetRef.current = calculateTargetCoordinates(targetCountry);
    }
  }, [targetCountry]);

  // Update camera markers when camera data changes
  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;
    updateCameraMarkers(globeRef.current, cameras);
  }, [cameras, isInitialized]);

  // Show labels when not scanning
  useEffect(() => {
    setShowLabels(!scanInProgress);
  }, [scanInProgress]);

  // Use the custom animation hook
  useGlobeAnimation({
    groupRef,
    scanInProgress,
    targetRef,
    camera
  });

  return (
    <>
      <group ref={groupRef}>
        <CountryLabels globeRef={globeRef} visibleLabels={showLabels} />
      </group>
      
      <GlobeInitializer
        groupRef={groupRef}
        globeRef={globeRef}
        scene={scene}
        setIsInitialized={setIsInitialized}
        isInitialized={isInitialized}
      />
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </>
  );
};

export default GlobeScene;
