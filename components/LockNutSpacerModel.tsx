'use client';
import { useRef } from 'react';
import * as THREE from 'three';

interface LockNutSpacerModelProps {
  wireframe?: boolean;
}

export default function LockNutSpacerModel({ wireframe = false }: LockNutSpacerModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Materials: Steel
  const material = new THREE.MeshStandardMaterial({
    color: 0xcccccc, // Steel gray
    metalness: 0.9,
    roughness: 0.2,
    wireframe,
  });

  // Lock Nut: Hex 32 mm AF, thread M30 × 2.0 pitch
  const nutRadius = 1.6; // 32mm AF (across flats) / 2
  const nutHeight = 1.0; // Approximate height
  const nutGeometry = new THREE.CylinderGeometry(nutRadius, nutRadius, nutHeight, 6); // Hex shape

  // Thread representation (simplified)
  const threadGeometry = new THREE.CylinderGeometry(1.5, 1.5, nutHeight, 32); // M30 OD approx 30mm
  const threadMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    metalness: 0.8,
    roughness: 0.3,
    wireframe,
  });

  // Spacer Sleeve: 60 mm long, 34 mm OD
  const spacerRadius = 1.7; // 34mm OD
  const spacerLength = 6.0; // 60mm
  const spacerGeometry = new THREE.CylinderGeometry(spacerRadius, spacerRadius, spacerLength, 32);

  // Inner bore for spacer
  const boreGeometry = new THREE.CylinderGeometry(1.4, 1.4, spacerLength + 0.1, 32); // Slightly larger than shaft
  const boreMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.1,
    wireframe,
  });

  const nut = new THREE.Mesh(nutGeometry, material);
  const thread = new THREE.Mesh(threadGeometry, threadMaterial);
  const spacer = new THREE.Mesh(spacerGeometry, material);
  const bore = new THREE.Mesh(boreGeometry, boreMaterial);

  // Position spacer after nut
  spacer.position.x = (nutHeight / 2) + (spacerLength / 2);

  // Align along X-axis
  const group = new THREE.Group();
  group.add(nut);
  group.add(thread);
  group.add(spacer);
  group.add(bore);
  group.rotation.z = Math.PI / 2; // Rotate to align along X-axis

  return (
    <group ref={groupRef} name="lock_nut_spacer">
      <primitive object={group} />
    </group>
  );
}
