
import React, { useEffect } from 'react';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { initializeGlobe, setupGlobeLighting } from '@/utils/globeUtils';

interface GlobeInitializerProps {
  groupRef: React.RefObject<THREE.Group>;
  globeRef: React.RefObject<ThreeGlobe | null>;
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
    if (groupRef.current && globeRef.current !== globe) {
      // Instead of directly assigning to .current, we check first if it's already set
      // and only add the globe to the group if needed
      groupRef.current.add(globe);
      // We will use state to track the globe instance, not the ref itself
      setIsInitialized(true);
      
      // Store the reference separately for useEffect cleanup
      const currentGlobe = globe;
      
      // Setup lighting
      const { ambientLight, directionalLight } = setupGlobeLighting(scene);

      return () => {
        if (groupRef.current) {
          groupRef.current.remove(currentGlobe);
        }
        scene.remove(ambientLight);
        scene.remove(directionalLight);
      };
    }
  }, [scene, isInitialized, groupRef, globeRef, setIsInitialized]);

  return null;
};

export default GlobeInitializer;
