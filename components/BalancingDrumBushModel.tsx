'use client';
import { useRef } from 'react';
import * as THREE from 'three';

interface BalancingDrumBushModelProps {
  wireframe?: boolean;
}

export default function BalancingDrumBushModel({ wireframe = false }: BalancingDrumBushModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Materials: Bronze (golden-bronze metallic surface)
  const material = new THREE.MeshStandardMaterial({
    color: 0xcd7f32, // Bronze color
    metalness: 0.8,
    roughness: 0.2,
    wireframe,
  });

  // Dimensions (scaled for visualization, e.g., 1 unit = 10mm)
  const outerRadius = 7; // ~70mm outer radius (OD ~140mm)
  const innerRadius = 5; // ~50mm inner radius (ID ~100mm)
  const length = 8; // ~80mm length

  // Main bush: Hollow cylinder (outer sleeve)
  const bushGeometry = new THREE.CylinderGeometry(outerRadius, outerRadius, length, 64);
  const bush = new THREE.Mesh(bushGeometry, material);

  // Inner bore: Transparent cylinder for hollow effect (polished inner surface)
  const boreGeometry = new THREE.CylinderGeometry(innerRadius, innerRadius, length + 0.1, 64);
  const boreMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.1,
    wireframe,
  });
  const bore = new THREE.Mesh(boreGeometry, boreMaterial);

  // Optional: Small chamfers at both ends (approximated as small bevels)
  const chamferGeometry = new THREE.CylinderGeometry(outerRadius + 0.1, outerRadius - 0.5, 0.5, 64);
  const chamfer1 = new THREE.Mesh(chamferGeometry, material);
  chamfer1.position.y = length / 2 - 0.25;
  const chamfer2 = new THREE.Mesh(chamferGeometry, material);
  chamfer2.position.y = - (length / 2 - 0.25);
  chamfer2.rotation.z = Math.PI; // Flip for bottom chamfer

  // Optional: Small grooves/ridges on outer surface for fitting/anti-rotation (approximated as thin rings)
  const grooveGeometry = new THREE.TorusGeometry(outerRadius + 0.1, 0.2, 8, 32);
  const grooveMaterial = new THREE.MeshStandardMaterial({
    color: 0x8b4513, // Darker bronze for grooves
    metalness: 0.7,
    roughness: 0.3,
    wireframe,
  });
  const groove1 = new THREE.Mesh(grooveGeometry, grooveMaterial);
  groove1.position.y = length / 4;
  const groove2 = new THREE.Mesh(grooveGeometry, grooveMaterial);
  groove2.position.y = - length / 4;

  // Align along X-axis (shaft direction), origin at center of inner bore
  const group = new THREE.Group();
  group.add(bush);
  group.add(bore);
  group.add(chamfer1);
  group.add(chamfer2);
  group.add(groove1);
  group.add(groove2);
  group.rotation.z = Math.PI / 2; // Rotate to align along X-axis

  return (
    <group ref={groupRef}>
      <primitive object={group} />
    </group>
  );
}
