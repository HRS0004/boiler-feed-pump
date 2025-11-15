'use client';
import { useRef } from 'react';
import * as THREE from 'three';

interface StageBushingModelProps {
  wireframe?: boolean;
  index: number;
}

export default function StageBushingModel({ wireframe = false, index }: StageBushingModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Materials: Silver/steel
  const material = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0, // Silver color
    metalness: 0.9,
    roughness: 0.1,
    wireframe,
  });

  // Dimensions (scaled: 1 unit = 10mm)
  const innerRadius = 2.42; // +0.2 mm clearance over 48mm shaft (2.4 + 0.02)
  const outerRadius = 3.6; // 72mm OD
  const length = 5.5; // 55mm length
  const collarLength = 1; // 10mm collar
  const collarOuterRadius = 3.8; // 76mm OD

  // Main bushing: Hollow cylinder
  const bushingGeometry = new THREE.CylinderGeometry(outerRadius, outerRadius, length, 64);
  const bushing = new THREE.Mesh(bushingGeometry, material);

  // Inner bore
  const boreGeometry = new THREE.CylinderGeometry(innerRadius, innerRadius, length + 0.1, 64);
  const boreMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.1,
    wireframe,
  });
  const bore = new THREE.Mesh(boreGeometry, boreMaterial);

  // Bush collar: Wider cylinder at one end
  const collarGeometry = new THREE.CylinderGeometry(collarOuterRadius, collarOuterRadius, collarLength, 64);
  const collar = new THREE.Mesh(collarGeometry, material);
  collar.position.y = (length / 2) + (collarLength / 2); // Position at end

  // Align along X-axis
  const group = new THREE.Group();
  group.add(bushing);
  group.add(bore);
  group.add(collar);
  group.rotation.z = Math.PI / 2; // Rotate to align along X-axis

  return (
    <group ref={groupRef} name={`stage_bushing_${index}`}>
      <primitive object={group} />
    </group>
  );
}
