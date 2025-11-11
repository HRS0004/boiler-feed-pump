'use client';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface FeedPumpSectionModelProps {
  wireframe?: boolean;
}

export default function FeedPumpSectionModel({ wireframe = false }: FeedPumpSectionModelProps) {
  const impellerRef = useRef<THREE.Group>(null);

  // Materials
  const material = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.8,
    roughness: 0.2,
    wireframe,
  });

  // Impeller rotation
  useFrame((state, delta) => {
    if (impellerRef.current) {
      impellerRef.current.rotation.z += delta * 2; // Rotate impeller
    }
  });

  return (
    <group>
      {/* Casing */}
      <group>
        <mesh material={material}>
          <cylinderGeometry args={[1, 1, 2, 32]} />
        </mesh>
      </group>

      {/* Flanges */}
      <group position={[0, -1.1, 0]}>
        <mesh material={material}>
          <cylinderGeometry args={[1.2, 1.2, 0.2, 32]} />
        </mesh>
      </group>
      <group position={[0, 1.1, 0]}>
        <mesh material={material}>
          <cylinderGeometry args={[1.2, 1.2, 0.2, 32]} />
        </mesh>
      </group>

      {/* Shaft */}
      <group>
        <mesh material={material}>
          <cylinderGeometry args={[0.05, 0.05, 2.5, 16]} />
        </mesh>
      </group>

      {/* Impeller */}
      <group ref={impellerRef}>
        {/* Impeller hub */}
        <mesh position={[0, 0, 0]} material={material}>
          <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
        </mesh>
        {/* Blades */}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 6) * Math.PI * 2) * 0.5,
              Math.sin((i / 6) * Math.PI * 2) * 0.5,
              0,
            ]}
            rotation={[0, 0, (i / 6) * Math.PI * 2]}
            material={material}
          >
            <boxGeometry args={[0.1, 0.8, 0.05]} />
          </mesh>
        ))}
      </group>

      {/* Inlet/Outlet pipes (simplified) */}
      <group position={[-1.5, 0, 0]}>
        <mesh material={material}>
          <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
        </mesh>
      </group>
      <group position={[1.5, 0, 0]}>
        <mesh material={material}>
          <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
        </mesh>
      </group>
    </group>
  );
}
