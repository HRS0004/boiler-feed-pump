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

  // Dimensions (scaled: 1 unit = 10mm)
  const outerRadius = 4.5; // 90mm OD
  const innerRadius = 2.4; // 48mm ID
  const length = 16; // 160mm length

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

  // Axial ribs: 6 ribs, 8mm thickness
  const ribGeometry = new THREE.BoxGeometry(0.8, length, 0.8); // 8mm thick, full length
  const ribMaterial = new THREE.MeshStandardMaterial({
    color: 0xcd7f32, // Bronze
    metalness: 0.8,
    roughness: 0.2,
    wireframe,
  });
  const ribs = [];
  for (let i = 0; i < 6; i++) {
    const rib = new THREE.Mesh(ribGeometry, ribMaterial);
    const angle = (i / 6) * Math.PI * 2;
    rib.position.x = Math.cos(angle) * (outerRadius + 0.4);
    rib.position.z = Math.sin(angle) * (outerRadius + 0.4);
    ribs.push(rib);
  }

  // Copper sealing ring on downstream side
  const ringGeometry = new THREE.TorusGeometry(outerRadius + 0.5, 0.5, 8, 32);
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xb87333, // Copper color
    metalness: 0.7,
    roughness: 0.3,
    wireframe,
  });
  const sealingRing = new THREE.Mesh(ringGeometry, ringMaterial);
  sealingRing.position.y = - (length / 2) - 0.5; // Downstream side

  // Align along X-axis (shaft direction), origin at center of inner bore
  const group = new THREE.Group();
  group.add(bush);
  group.add(bore);
  group.add(chamfer1);
  group.add(chamfer2);
  ribs.forEach(rib => group.add(rib));
  group.add(sealingRing);
  group.rotation.z = Math.PI / 2; // Rotate to align along X-axis

  return (
    <group ref={groupRef}>
      <primitive object={group} />
    </group>
  );
}
