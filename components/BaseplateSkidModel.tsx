'use client';
import { useRef } from 'react';
import * as THREE from 'three';

interface BaseplateSkidModelProps {
  wireframe?: boolean;
}

export default function BaseplateSkidModel({ wireframe = false }: BaseplateSkidModelProps) {
  // Materials
  const steelMaterial = new THREE.MeshStandardMaterial({
    color: 0x666666, // Industrial gray steel
    metalness: 0.7,
    roughness: 0.3,
    wireframe,
  });

  const padMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888, // Slightly lighter for machined pads
    metalness: 0.8,
    roughness: 0.2,
    wireframe,
  });

  return (
    <group>
      {/* Frame Structure */}
      <group name="frame_structure">
        {/* Longitudinal base beams (I-beam approximation using boxes) */}
        <mesh position={[0, -0.1, 0.35]} material={steelMaterial}>
          <boxGeometry args={[2.5, 0.15, 0.1]} />
        </mesh>
        <mesh position={[0, -0.1, -0.35]} material={steelMaterial}>
          <boxGeometry args={[2.5, 0.15, 0.1]} />
        </mesh>
        {/* Web of I-beam */}
        <mesh position={[0, -0.1, 0.35]} material={steelMaterial}>
          <boxGeometry args={[2.5, 0.05, 0.05]} />
        </mesh>
        <mesh position={[0, -0.1, -0.35]} material={steelMaterial}>
          <boxGeometry args={[2.5, 0.05, 0.05]} />
        </mesh>
      </group>

      {/* Cross-members */}
      <group name="cross_members">
        {/* Flat bars as cross-members */}
        <mesh position={[1.1, -0.05, 0]} material={steelMaterial}>
          <boxGeometry args={[0.1, 0.1, 0.8]} />
        </mesh>
        <mesh position={[-1.1, -0.05, 0]} material={steelMaterial}>
          <boxGeometry args={[0.1, 0.1, 0.8]} />
        </mesh>
        <mesh position={[0, -0.05, 0]} material={steelMaterial}>
          <boxGeometry args={[0.1, 0.1, 0.8]} />
        </mesh>
      </group>

      {/* Mounting Pads */}
      <group name="mounting_pads">
        {/* Pump mounting pad */}
        <mesh position={[0.8, 0, 0]} material={padMaterial}>
          <boxGeometry args={[0.6, 0.05, 0.4]} />
        </mesh>
        {/* Motor mounting pad */}
        <mesh position={[-0.8, 0, 0]} material={padMaterial}>
          <boxGeometry args={[0.6, 0.05, 0.4]} />
        </mesh>
      </group>

      {/* Bolt Holes */}
      <group name="bolt_holes">
        {/* Holes on pump pad */}
        <mesh position={[0.8, 0.025, 0.15]} material={steelMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
        </mesh>
        <mesh position={[0.8, 0.025, -0.15]} material={steelMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
        </mesh>
        <mesh position={[0.95, 0.025, 0]} material={steelMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
        </mesh>
        <mesh position={[0.65, 0.025, 0]} material={steelMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
        </mesh>
        {/* Holes on motor pad */}
        <mesh position={[-0.8, 0.025, 0.15]} material={steelMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
        </mesh>
        <mesh position={[-0.8, 0.025, -0.15]} material={steelMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
        </mesh>
        <mesh position={[-0.95, 0.025, 0]} material={steelMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
        </mesh>
        <mesh position={[-0.65, 0.025, 0]} material={steelMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
        </mesh>
      </group>

      {/* Lifting Lugs */}
      <group name="lifting_lugs">
        {/* Eye-bolts at corners */}
        <mesh position={[1.2, 0.1, 0.4]} material={steelMaterial}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
        </mesh>
        <mesh position={[1.2, 0.1, -0.4]} material={steelMaterial}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
        </mesh>
        <mesh position={[-1.2, 0.1, 0.4]} material={steelMaterial}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
        </mesh>
        <mesh position={[-1.2, 0.1, -0.4]} material={steelMaterial}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
        </mesh>
      </group>
    </group>
  );
}
