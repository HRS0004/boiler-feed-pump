'use client';
import { useRef } from 'react';
import * as THREE from 'three';

interface WearRingCasingModelProps {
  wireframe?: boolean;
  index: number; // 1 to 8 for WearRing_Casing_1 to 8
}

export default function WearRingCasingModel({ wireframe = false, index }: WearRingCasingModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Material: Bronze or stainless steel
  const material = new THREE.MeshStandardMaterial({
    color: 0x8B4513, // Bronze color
    metalness: 0.8,
    roughness: 0.3,
    wireframe,
  });

  // Geometry: Thin ring
  // OD 122mm, ID 120mm, length 10mm

  return (
    <group ref={groupRef} name={`WearRing_Casing_${index}`}>
      <mesh material={material} name={`WearRing_Casing_${index}`}>
        <cylinderGeometry args={[6.1, 6.1, 1, 32]} /> {/* OD 122mm, length 10mm */}
      </mesh>
    </group>
  );
}
