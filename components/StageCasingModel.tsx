'use client';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface StageCasingModelProps {
  wireframe?: boolean;
  stage: number; // 1 to 8 for StageCasing_1 to 8
}

export default function StageCasingModel({ wireframe = false, stage }: StageCasingModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Material: Cast steel
  const material = new THREE.MeshStandardMaterial({
    color: 0x666666, // Cast steel gray
    metalness: 0.5,
    roughness: 0.5,
    wireframe,
  });

  // Geometry: Ring with bolt holes
  // OD 140mm, ID 120mm, length 40mm, 8 bolt holes
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(6, 0); // ID 120mm
    shape.lineTo(7, 0); // OD 140mm
    shape.lineTo(7, 4); // Length 40mm
    shape.lineTo(6, 4);
    shape.lineTo(6, 0);

    return new THREE.LatheGeometry(shape.getPoints(16), 64);
  }, []);

  return (
    <group ref={groupRef} name={`StageCasing_${stage}`}>
      {/* Main ring */}
      <mesh geometry={geometry} material={material} name={`StageCasing_${stage}_Ring`} rotation={[0, 0, Math.PI / 2]} />
      {/* Bolt holes */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 8) * Math.PI * 2) * 6.5, // Position at OD
            Math.sin((i / 8) * Math.PI * 2) * 6.5,
            0,
          ]}
          material={material}
          name={`StageCasing_${stage}_BoltHole_${i + 1}`}
        >
          <cylinderGeometry args={[0.3, 0.3, 4, 16]} /> {/* Hole diameter 6mm, length 40mm */}
        </mesh>
      ))}
    </group>
  );
}
