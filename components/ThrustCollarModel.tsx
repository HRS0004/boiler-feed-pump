'use client';
import { useRef } from 'react';
import * as THREE from 'three';

interface ThrustCollarModelProps {
  wireframe?: boolean;
}

export default function ThrustCollarModel({ wireframe = false }: ThrustCollarModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Materials: Hardened steel or chrome-plated alloy (mirror-polished surface)
  const material = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0, // Silver metallic gray
    metalness: 0.9,
    roughness: 0.1,
    wireframe,
  });

  // Dimensions (scaled for visualization, e.g., 1 unit = 10mm)
  const outerRadius = 7.5; // ~75mm outer radius (OD ~150mm)
  const innerRadius = 3; // ~30mm inner radius (bore ID ~60mm)
  const thickness = 1.5; // ~15mm thickness

  // Main collar: Solid cylinder with central bore
  const collarGeometry = new THREE.CylinderGeometry(outerRadius, outerRadius, thickness, 64);
  const collar = new THREE.Mesh(collarGeometry, material);

  // Inner bore: Transparent cylinder for hollow effect
  const boreGeometry = new THREE.CylinderGeometry(innerRadius, innerRadius, thickness + 0.1, 64);
  const boreMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.1,
    wireframe,
  });
  const bore = new THREE.Mesh(boreGeometry, boreMaterial);

  // Two small axial grooves/notches (approximated as small cuts on the outer rim)
  const notchGeometry = new THREE.BoxGeometry(0.5, thickness + 0.1, 0.5); // Small rectangular notches
  const notch1 = new THREE.Mesh(notchGeometry, boreMaterial);
  notch1.position.set(outerRadius - 0.25, 0, 0); // Position on outer edge
  const notch2 = new THREE.Mesh(notchGeometry, boreMaterial);
  notch2.position.set(- (outerRadius - 0.25), 0, 0); // Opposite side

  return (
    <group ref={groupRef}>
      {/* Main collar disc */}
      <primitive object={collar} />
      {/* Central bore */}
      <primitive object={bore} />
      {/* Axial grooves/notches */}
      <primitive object={notch1} />
      <primitive object={notch2} />
    </group>
  );
}
