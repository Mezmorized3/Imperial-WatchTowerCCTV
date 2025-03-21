
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ThreeGlobe from 'three-globe';
import countries from 'world-countries';
import { countryCodeToFlag } from '@/utils/globeUtils';

interface CountryLabelsProps {
  globeRef: React.RefObject<ThreeGlobe>;
  visibleLabels: boolean;
}

const CountryLabels: React.FC<CountryLabelsProps> = ({ globeRef, visibleLabels }) => {
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

export default CountryLabels;
