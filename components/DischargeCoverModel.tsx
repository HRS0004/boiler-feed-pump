'use client';
import { useRef } from 'react';
import * as THREE from 'three';

interface DischargeCoverModelProps {
  wireframe?: boolean;
}

export default function DischargeCoverModel({ wireframe = false }: DischargeCoverModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Materials
  const material = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.8,
    roughness: 0.2,
    wireframe,
  });

  const boltMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.9,
    roughness: 0.1,
    wireframe,
  });

  // Dimensions (scaled for visualization)
  const outerDiameter = 3; // ~300mm scaled
  const thickness = 0.3; // ~30mm scaled
  const boltCircleDiameter = 2.5;
  const numBolts = 8;
  const shaftDiameter = 0.2;
  const outletDiameter = 0.4;
  const outletLength = 0.8;

  return (
    <group ref={groupRef}>
      {/* Main Flange (flange_section) */}
      <group name="flange_section">
        <mesh material={material}>
          <cylinderGeometry args={[outerDiameter / 2, outerDiameter / 2, thickness, 64]} />
        </mesh>
        {/* Central shaft bore */}
        <mesh position={[0, 0, 0]} material={material}>
          <cylinderGeometry args={[shaftDiameter / 2, shaftDiameter / 2, thickness + 0.1, 32]} />
        </mesh>
      </group>

      {/* Bolt Ring (bolt_ring) */}
      <group name="bolt_ring">
        {Array.from({ length: numBolts }, (_, i) => {
          const angle = (i / numBolts) * Math.PI * 2;
          const x = Math.cos(angle) * (boltCircleDiameter / 2);
          const z = Math.sin(angle) * (boltCircleDiameter / 2);
          return (
            <group key={i} position={[x, 0, z]}>
              {/* Bolt hole */}
              <mesh material={material}>
                <cylinderGeometry args={[0.08, 0.08, thickness + 0.1, 16]} />
              </mesh>
              {/* Bolt head */}
              <mesh position={[0, thickness / 2 + 0.05, 0]} material={boltMaterial}>
                <cylinderGeometry args={[0.1, 0.1, 0.1, 6]} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Shaft Port (shaft_port) */}
      <group name="shaft_port">
        <mesh position={[0, 0, 0]} material={material}>
          <cylinderGeometry args={[shaftDiameter / 2 + 0.05, shaftDiameter / 2 + 0.05, thickness + 0.1, 32]} />
        </mesh>
      </group>

      {/* Gasket Groove (gasket_groove) */}
      <group name="gasket_groove">
        <mesh position={[0, -thickness / 2 - 0.02, 0]} material={material}>
          <ringGeometry args={[outerDiameter / 2 - 0.1, outerDiameter / 2, 64]} />
        </mesh>
      </group>

      {/* Outlet Pipe (outlet_pipe) */}
      <group name="outlet_pipe" position={[outerDiameter / 2 + outletLength / 2, 0, 0]}>
        <mesh material={material}>
          <cylinderGeometry args={[outletDiameter / 2, outletDiameter / 2, outletLength, 32]} />
        </mesh>
        {/* Bolting face */}
        <mesh position={[outletLength / 2 + 0.05, 0, 0]} material={material}>
          <cylinderGeometry args={[outletDiameter / 2 + 0.1, outletDiameter / 2 + 0.1, 0.1, 32]} />
        </mesh>
      </group>

      {/* Reinforcement Ribs */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * (outerDiameter / 4), 0, Math.sin(angle) * (outerDiameter / 4)]}
            rotation={[0, angle, 0]}
            material={material}
          >
            <boxGeometry args={[outerDiameter / 2, thickness, 0.05]} />
          </mesh>
        );
      })}

      {/* Engraved Text (simplified as a decal) */}
      <mesh position={[0, thickness / 2 + 0.01, 0]} material={new THREE.MeshBasicMaterial({ color: 0x000000 })}>
        <planeGeometry args={[1, 0.2]} />
      </mesh>
    </group>
  );
}
