'use client';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface LubeOilSkidModelProps {
  wireframe?: boolean;
}

export default function LubeOilSkidModel({ wireframe = false }: LubeOilSkidModelProps) {
  const pumpRef = useRef<THREE.Group>(null);

  // Materials
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x666666, // Industrial gray
    metalness: 0.6,
    roughness: 0.4,
    wireframe,
  });

  const tankMaterial = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0, // Silver
    metalness: 0.8,
    roughness: 0.2,
    wireframe,
  });

  const pipeMaterial = new THREE.MeshStandardMaterial({
    color: 0xa0a0a0, // Silver pipes
    metalness: 0.7,
    roughness: 0.3,
    wireframe,
  });

  // Pump rotation
  useFrame((state, delta) => {
    if (pumpRef.current) {
      pumpRef.current.rotation.z += delta * 1; // Rotate pump impeller
    }
  });

  return (
    <group>
      {/* Base Frame */}
      <group name="base_frame">
        {/* Main frame beams */}
        <mesh position={[0, -0.5, 0]} material={frameMaterial}>
          <boxGeometry args={[4, 0.2, 0.2]} />
        </mesh>
        <mesh position={[0, -0.5, 1]} material={frameMaterial}>
          <boxGeometry args={[4, 0.2, 0.2]} />
        </mesh>
        <mesh position={[0, -0.5, -1]} material={frameMaterial}>
          <boxGeometry args={[4, 0.2, 0.2]} />
        </mesh>
        {/* Cross beams */}
        <mesh position={[1.8, -0.5, 0]} material={frameMaterial}>
          <boxGeometry args={[0.2, 0.2, 2]} />
        </mesh>
        <mesh position={[-1.8, -0.5, 0]} material={frameMaterial}>
          <boxGeometry args={[0.2, 0.2, 2]} />
        </mesh>
        {/* Legs */}
        <mesh position={[1.8, -1, 0.8]} material={frameMaterial}>
          <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
        </mesh>
        <mesh position={[1.8, -1, -0.8]} material={frameMaterial}>
          <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
        </mesh>
        <mesh position={[-1.8, -1, 0.8]} material={frameMaterial}>
          <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
        </mesh>
        <mesh position={[-1.8, -1, -0.8]} material={frameMaterial}>
          <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
        </mesh>
      </group>

      {/* Oil Tank */}
      <group name="oil_tank" position={[0, 0.5, 0]}>
        <mesh material={tankMaterial}>
          <cylinderGeometry args={[0.8, 0.8, 2, 16]} />
        </mesh>
        {/* Tank top */}
        <mesh position={[0, 1.1, 0]} material={tankMaterial}>
          <cylinderGeometry args={[0.9, 0.9, 0.2, 16]} />
        </mesh>
        {/* Tank bottom */}
        <mesh position={[0, -1.1, 0]} material={tankMaterial}>
          <cylinderGeometry args={[0.9, 0.9, 0.2, 16]} />
        </mesh>
      </group>

      {/* Pump Main */}
      <group name="pump_main" position={[1.5, 0, 0]}>
        <mesh material={frameMaterial}>
          <cylinderGeometry args={[0.4, 0.4, 1, 16]} />
        </mesh>
        {/* Pump flanges */}
        <mesh position={[0, -0.6, 0]} material={frameMaterial}>
          <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
        </mesh>
        <mesh position={[0, 0.6, 0]} material={frameMaterial}>
          <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
        </mesh>
        {/* Shaft */}
        <mesh material={frameMaterial}>
          <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
        </mesh>
        {/* Impeller */}
        <group ref={pumpRef}>
          <mesh position={[0, 0, 0]} material={frameMaterial}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 8]} />
          </mesh>
          {/* Blades */}
          {Array.from({ length: 4 }, (_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i / 4) * Math.PI * 2) * 0.25,
                Math.sin((i / 4) * Math.PI * 2) * 0.25,
                0,
              ]}
              rotation={[0, 0, (i / 4) * Math.PI * 2]}
              material={frameMaterial}
            >
              <boxGeometry args={[0.05, 0.4, 0.02]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Pipes */}
      <group name="pipes">
        {/* Suction pipe from tank to pump */}
        <mesh position={[0.7, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} material={pipeMaterial}>
          <cylinderGeometry args={[0.1, 0.1, 1.4, 8]} />
        </mesh>
        {/* Discharge pipe from pump */}
        <mesh position={[2.2, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} material={pipeMaterial}>
          <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
        </mesh>
        {/* Return pipe back to tank */}
        <mesh position={[1.5, 0.8, 0.5]} rotation={[Math.PI / 4, 0, 0]} material={pipeMaterial}>
          <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
        </mesh>
      </group>

      {/* Additional components: motor mount, valves, etc. (simplified) */}
      <group name="motor_mount" position={[-1.5, 0.2, 0]}>
        <mesh material={frameMaterial}>
          <boxGeometry args={[0.6, 0.4, 0.6]} />
        </mesh>
      </group>

      {/* Valves */}
      <group name="valves">
        <mesh position={[0.7, 0.6, 0.3]} material={pipeMaterial}>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 8]} />
        </mesh>
        <mesh position={[2.2, 0.6, 0.3]} material={pipeMaterial}>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 8]} />
        </mesh>
      </group>
    </group>
  );
}
