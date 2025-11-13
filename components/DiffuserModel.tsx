'use client';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface DiffuserModelProps {
  wireframe?: boolean;
  stage: number; // 1 to 8 for Diffuser_1 to 8
}

export default function DiffuserModel({ wireframe = false, stage }: DiffuserModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Material: Cast steel
  const material = new THREE.MeshStandardMaterial({
    color: 0x666666, // Cast steel gray
    metalness: 0.5,
    roughness: 0.5,
    wireframe,
  });

  // Geometry: Vaned ring (cylinder with vanes)
  // OD 120mm, ID 80mm, length 30mm, 6 vanes
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(4, 0); // ID 80mm
    shape.lineTo(6, 0); // OD 120mm
    shape.lineTo(6, 3); // Length 30mm
    shape.lineTo(4, 3);
    shape.lineTo(4, 0);

    return new THREE.LatheGeometry(shape.getPoints(16), 64);
  }, []);

  return (
    <group ref={groupRef} name={`Diffuser_${stage}`}>
      {/* Main ring */}
      <mesh geometry={geometry} material={material} name={`Diffuser_${stage}_Ring`} rotation={[0, 0, Math.PI / 2]} />
      {/* Vanes */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 6) * Math.PI * 2) * 5, // Position at average radius
            Math.sin((i / 6) * Math.PI * 2) * 5,
            0,
          ]}
          rotation={[0, 0, (i / 6) * Math.PI * 2]}
          material={material}
          name={`Diffuser_${stage}_Vane_${i + 1}`}
        >
          <boxGeometry args={[0.5, 3, 0.2]} /> {/* Thickness 5mm, length 30mm, width 2mm */}
        </mesh>
      ))}
    </group>
  );
}
