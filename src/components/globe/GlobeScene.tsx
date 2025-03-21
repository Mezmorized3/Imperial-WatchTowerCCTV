
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { CameraResult } from '@/types/scanner';
import CountryLabels from './CountryLabels';
import { 
  initializeGlobe, 
  updateCameraMarkers, 
  setupGlobeLighting,
  calculateTargetCoordinates 
} from '@/utils/globeUtils';

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
  }, [scene, isInitialized]);

  // Update camera markers when camera data changes
  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;
    updateCameraMarkers(globeRef.current, cameras);
  }, [cameras, isInitialized]);

  // Show labels when not scanning
  useEffect(() => {
    setShowLabels(!scanInProgress);
  }, [scanInProgress]);

  // Animation loop - rotate globe and handle camera movements
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    if (!scanInProgress) {
      // Regular rotation when no scan in progress
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    } else if (targetRef.current) {
      // When scanning, slowly rotate towards target country
      const { lat, lng } = targetRef.current;
      
      // Convert lat/lng to 3D position on sphere
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      
      const targetX = -Math.sin(phi) * Math.cos(theta);
      const targetZ = Math.sin(phi) * Math.sin(theta);
      
      // Calculate angle to target
      const targetAngle = Math.atan2(targetZ, targetX);
      
      // Current rotation
      let currentRotation = groupRef.current.rotation.y % (2 * Math.PI);
      if (currentRotation < 0) currentRotation += 2 * Math.PI;
      
      // Calculate shortest path to target angle
      let angleDiff = targetAngle - currentRotation;
      if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
      
      // Smoothly rotate towards target
      groupRef.current.rotation.y += angleDiff * 0.01;
      
      // Zoom in slightly during scan
      if (camera instanceof THREE.PerspectiveCamera) {
        const progress = clock.getElapsedTime() / 10; // Normalize progress
        const zoomFactor = Math.max(0.3, 1 - progress); // Zoom in closer as progress increases
        camera.position.z = Math.max(150, 300 * zoomFactor);
      }
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <CountryLabels globeRef={globeRef} visibleLabels={showLabels} />
      </group>
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
