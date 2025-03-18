
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import countries from 'world-countries';
import { CameraResult } from '@/types/scanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

// Create a mapping of country codes to flag emojis
const countryCodeToFlag = (code: string) => {
  if (!code) return '';
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

interface GlobeViewProps {
  cameras: CameraResult[];
  scanInProgress?: boolean;
  currentTarget?: string;
  targetCountry?: string;
}

const CountryLabels = ({ globeRef, visibleLabels }: { globeRef: React.RefObject<ThreeGlobe>, visibleLabels: boolean }) => {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  
  useEffect(() => {
    if (!globeRef.current || !group.current || !visibleLabels) return;
    
    // Clear existing labels
    while (group.current.children.length > 0) {
      group.current.remove(group.current.children[0]);
    }
    
    // Add country labels
    countries.forEach(country => {
      if (!country.latlng || !country.cca2) return;
      
      const [lat, lng] = country.latlng;
      
      // Convert lat/lng to 3D position on sphere
      const radius = 101; // Slightly above the globe surface
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      
      const x = -radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      // Create text mesh
      const text = new THREE.Mesh();
      const font = 'Roboto';
      const countryName = country.name.common;
      const flag = countryCodeToFlag(country.cca2);
      
      // Create a single div element
      const div = document.createElement('div');
      div.innerHTML = `${flag} ${countryName}`;
      div.style.font = `12px ${font}`;
      div.style.color = 'white';
      div.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      div.style.padding = '2px 4px';
      div.style.borderRadius = '2px';
      div.style.whiteSpace = 'nowrap';
      
      // Create canvas to draw the text
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;
      
      const label = `${flag} ${countryName}`;
      const fontSize = 12;
      
      // Set canvas size based on text
      context.font = `${fontSize}px ${font}`;
      const metrics = context.measureText(label);
      canvas.width = metrics.width + 8;
      canvas.height = fontSize + 8;
      
      // Draw background
      context.fillStyle = 'rgba(0, 0, 0, 0.5)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw text
      context.fillStyle = 'white';
      context.font = `${fontSize}px ${font}`;
      context.fillText(label, 4, fontSize + 2);
      
      // Create texture
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      
      const labelGeometry = new THREE.PlaneGeometry(canvas.width / 10, canvas.height / 10);
      const labelMesh = new THREE.Mesh(labelGeometry, material);
      labelMesh.position.set(x, y, z);
      
      // Make label face the camera
      labelMesh.lookAt(0, 0, 0);
      labelMesh.rotation.y += Math.PI;
      
      // Add to group
      if (group.current) {
        group.current.add(labelMesh);
      }
    });
  }, [globeRef, visibleLabels]);
  
  // Update label rotations to face camera
  useFrame(() => {
    if (!group.current) return;
    
    group.current.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        child.lookAt(camera.position);
      }
    });
  });
  
  return <group ref={group} />;
};

const GlobeScene = ({ cameras, scanInProgress, targetCountry }: GlobeViewProps) => {
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
    <group ref={groupRef}>
      <CountryLabels globeRef={globeRef} visibleLabels={showLabels} />
    </group>
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
