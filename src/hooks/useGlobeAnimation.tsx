
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef } from 'react'; // Correct import for useRef

interface UseGlobeAnimationProps {
  groupRef: React.RefObject<THREE.Group>;
  scanInProgress?: boolean;
  targetRef: React.RefObject<{
    lat: number;
    lng: number;
    country: string;
  } | null>;
  camera: THREE.Camera;
}

export const useGlobeAnimation = ({
  groupRef,
  scanInProgress,
  targetRef,
  camera
}: UseGlobeAnimationProps) => {
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
};
