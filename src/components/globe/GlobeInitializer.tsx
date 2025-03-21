
import React, { useEffect } from 'react';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { initializeGlobe, setupGlobeLighting } from '@/utils/globeUtils';

interface GlobeInitializerProps {
  groupRef: React.RefObject<THREE.Group>;
  globeRef: React.RefObject<ThreeGlobe>;
  scene: THREE.Scene;
  setIsInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  isInitialized: boolean;
}

const GlobeInitializer: React.FC<GlobeInitializerProps> = ({
  groupRef,
  globeRef,
  scene,
  setIsInitialized,
  isInitialized
}) => {
  // Initialize the globe
  useEffect(() => {
    if (isInitialized) return;

    // Create globe
    const globe = initializeGlobe();
    
    // Add globe to scene
    if (groupRef.current) {
      globeRef.current = globe;
      groupRef.current.add(globe);
      setIsInitialized(true);
    }

    // Setup lighting
    const { ambientLight, directionalLight } = setupGlobeLighting(scene);

    return () => {
      if (globeRef.current && groupRef.current) {
        groupRef.current.remove(globeRef.current);
      }
      scene.remove(ambientLight);
      scene.remove(directionalLight);
    };
  }, [scene, isInitialized, groupRef, globeRef, setIsInitialized]);

  return null;
};

export default GlobeInitializer;
