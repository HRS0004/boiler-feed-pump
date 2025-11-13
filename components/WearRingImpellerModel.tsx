'use client';
import { useRef } from 'react';
import * as THREE from 'three';

interface WearRingImpellerModelProps {
  wireframe?: boolean;
  index: number; // 1 to 16 for WearRing_Impeller_1 to 16
}

export default function WearRingImpellerModel({ wireframe = false, index }: WearRingImpellerModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Material: Bronze or stainless steel
  const material = new THREE.MeshStandardMaterial({
    color: 0x8B4513, // Bronze color
    metalness: 0.8,
    roughness: 0.3,
    wireframe,
  });

  // Geometry: Thin ring
  // OD 62mm, ID 60mm, length 10mm

  return (
    <group ref={groupRef} name={`WearRing_Impeller_${index}`}>
      <mesh material={material} name={`WearRing_Impeller_${index}`}>
        <cylinderGeometry args={[3.1, 3.1, 1, 32]} /> {/* OD 62mm, length 10mm */}
      </mesh>
    </group>
  );
}
