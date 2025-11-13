'use client';
import { useRef } from 'react';
import * as THREE from 'three';

interface Impeller1stStageModelProps {
  wireframe?: boolean;
}

export default function Impeller1stStageModel({ wireframe = false }: Impeller1stStageModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Material: Polished aluminium
  const material = new THREE.MeshStandardMaterial({
    color: 0xcccccc, // Polished aluminium gray
    metalness: 0.9,
    roughness: 0.1,
    wireframe,
  });

  // Approximate dimensions (scaled, 1 unit = 10mm)
  // Hub: OD 60mm, ID 30mm, length 40mm
  // Blades: 3 axial-flow blades, length 80mm, width 20mm, thickness 5mm

  return (
    <group ref={groupRef} name="Impeller_1stStage">
      {/* Hub */}
      <mesh material={material} name="Impeller_1stStage_Hub">
        <cylinderGeometry args={[3, 3, 4, 32]} /> {/* OD 60mm, length 40mm */}
      </mesh>
      {/* Blades */}
      {Array.from({ length: 3 }, (_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 3) * Math.PI * 2) * 4, // Position at hub OD
            Math.sin((i / 3) * Math.PI * 2) * 4,
            0,
          ]}
          rotation={[0, 0, (i / 3) * Math.PI * 2]}
          material={material}
          name={`Impeller_1stStage_Blade_${i + 1}`}
        >
          <boxGeometry args={[0.5, 8, 0.5]} /> {/* Thickness 5mm, length 80mm, width 5mm (simplified) */}
        </mesh>
      ))}
    </group>
  );
}
