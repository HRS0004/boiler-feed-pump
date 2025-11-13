'use client';
import { useRef } from 'react';
import * as THREE from 'three';

interface ImpellerKeyModelProps {
  wireframe?: boolean;
  index?: number; // 1 to 8 for ImpellerKey_1 to 8, default 1
}

export default function ImpellerKeyModel({ wireframe = false, index = 1 }: ImpellerKeyModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Materials: Hardened stainless steel or alloy steel (AISI 4140), brushed or matte metallic gray
  const material = new THREE.MeshStandardMaterial({
    color: 0x888888, // Adjusted for matte metallic gray
    metalness: 0.8,
    roughness: 0.4,
    wireframe,
  });

  // Approximate dimensions (scaled, e.g., 1 unit = 10mm)
  const length = 3.0; // 30mm along X-axis
  const width = 0.8; // 8mm along Z-axis
  const height = 0.5; // 5mm along Y-axis
  const chamfer = 0.03; // ~0.3mm chamfer

  return (
    <group ref={groupRef} name={`ImpellerKey_${index}`}>
      {/* Main rectangular key body with chamfers approximated by scaling */}
      <mesh material={material} name="impeller_key_body">
        <boxGeometry args={[length, height, width]} />
      </mesh>
      {/* Optional: Alignment reference marks (small notches on top) */}
      <group name="alignment_slot">
        <mesh material={material} position={[length / 4, height / 2 + 0.01, 0]}>
          <boxGeometry args={[0.1, 0.02, width * 0.8]} />
        </mesh>
        <mesh material={material} position={[-length / 4, height / 2 + 0.01, 0]}>
          <boxGeometry args={[0.1, 0.02, width * 0.8]} />
        </mesh>
      </group>
      {/* Optional: Small retaining groove for set screw demonstration */}
      <mesh material={material} position={[0, height / 2 - 0.05, 0]} name="retaining_groove">
        <boxGeometry args={[length * 0.8, 0.05, width * 0.9]} />
      </mesh>
      {/* Reference axis (invisible helper) */}
      <mesh visible={false} name="reference_axis">
        <cylinderGeometry args={[0.01, 0.01, length]} />
      </mesh>
    </group>
  );
}
