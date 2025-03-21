
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import { CameraResult } from '@/types/scanner';

// Create a mapping of country codes to flag emojis
export const countryCodeToFlag = (code: string) => {
  if (!code) return '';
  const codePoints = code
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Initialize a new globe with standard configuration
export const initializeGlobe = (): ThreeGlobe => {
  const globe = new ThreeGlobe()
    .globeImageUrl('/earth-blue-marble.jpg')
    .bumpImageUrl('/earth-topology.png')
    .atmosphereColor('#3a228a')
    .atmosphereAltitude(0.15)
    .hexPolygonResolution(3)
    .hexPolygonMargin(0.7)
    .hexPolygonColor(() => {
      return '#1f2937';
    });

  // Configure globe material
  const globeMaterial = globe.globeMaterial() as THREE.MeshPhongMaterial;
  globeMaterial.shininess = 5;
  
  return globe;
};

// Update camera markers on the globe
export const updateCameraMarkers = (globe: ThreeGlobe, cameras: CameraResult[]) => {
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

  globe
    .pointsData(points)
    .pointAltitude(0.01)
    .pointColor('color')
    .pointRadius('size');
};

// Setup the lighting for the globe scene
export const setupGlobeLighting = (scene: THREE.Scene) => {
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xbbbbbb, 0.3);
  scene.add(ambientLight);
  
  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  
  return { ambientLight, directionalLight };
};

// Calculate target location for camera rotation
export const calculateTargetCoordinates = (targetCountry: string | undefined) => {
  // This would typically use the world-countries package to find coordinates
  // For now returning null if no country is provided
  return targetCountry ? { 
    lat: 0, 
    lng: 0, 
    country: targetCountry 
  } : null;
};
