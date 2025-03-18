
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import countries from 'world-countries';
import { CameraResult } from '@/types/scanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface GlobeViewProps {
  cameras: CameraResult[];
  scanInProgress?: boolean;
  currentTarget?: string;
  targetCountry?: string;
}

const GlobeScene = ({ cameras, scanInProgress, targetCountry }: GlobeViewProps) => {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { scene, camera } = useThree();
  const [isInitialized, setIsInitialized] = useState(false);
  const targetRef = useRef<{
    lat: number;
    lng: number;
    country: string;
  } | null>(null);

  // Find target country coordinates
  useEffect(() => {
    if (targetCountry && !targetRef.current) {
      const country = countries.find(c => 
        c.name.common.toLowerCase() === targetCountry.toLowerCase());
      
      if (country && country.latlng) {
        targetRef.current = {
          lat: country.latlng[0],
          lng: country.latlng[1],
          country: country.name.common
        };
      }
    }
  }, [targetCountry]);

  // Initialize the globe
  useEffect(() => {
    if (isInitialized) return;

    // Create globe
    const globe = new ThreeGlobe()
      .globeImageUrl('/earth-blue-marble.jpg')
      .bumpImageUrl('/earth-topology.png')
      .atmosphereColor('#3a228a') // Fix: Use string instead of THREE.Color
      .atmosphereAltitude(0.15)
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .hexPolygonColor(() => {
        return '#1f2937'; // Fix: Return hex string instead of THREE.Color
      });

    // Configure globe
    const globeMaterial = globe.globeMaterial() as THREE.MeshPhongMaterial;
    globeMaterial.shininess = 5;
    
    // Add globe to scene
    if (groupRef.current) {
      globeRef.current = globe;
      groupRef.current.add(globe);
      setIsInitialized(true);
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xbbbbbb, 0.3);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

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

    const points = cameras
      .filter(camera => camera.location?.latitude && camera.location?.longitude)
      .map(camera => ({
        lat: camera.location!.latitude!,
        lng: camera.location!.longitude!,
        size: 0.2,
        color: camera.status === 'vulnerable' ? 'red' : 
               camera.status === 'online' ? 'cyan' : 
               camera.status === 'authenticated' ? 'green' : 'gray'
      }));

    globeRef.current
      .pointsData(points)
      .pointAltitude(0.01)
      .pointColor('color')
      .pointRadius('size');

  }, [cameras, isInitialized]);

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
        camera.position.z = Math.max(200, 300 - clock.getElapsedTime() * 2);
      }
    }
  });

  return (
    <group ref={groupRef} />
  );
};

const GlobeView: React.FC<GlobeViewProps> = (props) => {
  const { cameras, scanInProgress, currentTarget, targetCountry } = props;
  const camerasWithLocation = cameras.filter(c => c.location?.latitude && c.location?.longitude);
  
  return (
    <Card className="bg-scanner-card border-gray-800 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center space-x-2">
          <Globe className="w-5 h-5 text-scanner-primary" />
          <span>Interactive Globe</span>
          {camerasWithLocation.length > 0 && (
            <Badge className="ml-2 bg-scanner-primary">
              {camerasWithLocation.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {scanInProgress && targetCountry && (
          <Alert className="mb-4 bg-scanner-dark-alt border-scanner-info">
            <Info className="h-4 w-4 text-scanner-info" />
            <AlertTitle>Scan in Progress</AlertTitle>
            <AlertDescription>
              {currentTarget && `Scanning ${currentTarget}...`}
              {targetCountry && ` Focusing on ${targetCountry}`}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="h-[500px] rounded-md overflow-hidden relative">
          <Canvas camera={{ position: [0, 0, 300], fov: 50 }}>
            <GlobeScene 
              cameras={cameras} 
              scanInProgress={scanInProgress} 
              currentTarget={currentTarget}
              targetCountry={targetCountry}
            />
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={false}
              autoRotateSpeed={0.5}
            />
          </Canvas>
          
          {camerasWithLocation.length === 0 && !scanInProgress && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
              <div className="text-center text-gray-300">
                <Globe className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No camera locations to display</p>
                <p className="text-sm text-gray-400 mt-2">Start a scan to visualize results on the globe</p>
              </div>
            </div>
          )}
          
          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-black/60 rounded-md p-2 text-xs text-white">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Vulnerable</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span>Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Authenticated</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobeView;
