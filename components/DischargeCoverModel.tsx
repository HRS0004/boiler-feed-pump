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
    color: 0x666666, // Cast steel gray
    metalness: 0.5,
    roughness: 0.5,
    wireframe,
  });

  // Dimensions (mm, scaled to meters for Three.js)
  const outerDiameter = 0.2; // 200mm
  const thickness = 0.05; // 50mm
  const boltCircleDiameter = 0.18; // 180mm
  const numBolts = 8;
  const boltHoleDiameter = 0.016; // 16mm
  const shaftDiameter = 0.04; // 40mm (assumed for pump shaft)
  const nozzleOD = 0.0889; // DN80, OD 88.9mm
  const nozzleLength = 0.1; // 100mm
  const flangeOD = 0.127; // 127mm for DN80 flange
  const flangeThickness = 0.02; // 20mm
  const numFlangeBolts = 8;
  const flangeBoltHoleDiameter = 0.014; // 14mm
  const flangeBoltCircleDiameter = 0.11; // 110mm PCD for DN80
  const ribThickness = 0.01; // 10mm
  const numRibs = 6;

  return (
    <group ref={groupRef} name="DischargeCover">
      {/* DischargeCoverBody */}
      <group name="DischargeCoverBody">
        <mesh material={material}>
          <cylinderGeometry args={[outerDiameter / 2, outerDiameter / 2, thickness, 64]} />
        </mesh>
        {/* Central shaft bore */}
        <mesh position={[0, 0, 0]} material={material}>
          <cylinderGeometry args={[shaftDiameter / 2, shaftDiameter / 2, thickness + 0.001, 32]} />
        </mesh>
        {/* Internal Flow Chamber - curved cavity */}
        <mesh position={[0, 0, 0]} material={material}>
          <torusGeometry args={[outerDiameter / 4, outerDiameter / 8, 16, 32, Math.PI]} />
        </mesh>
      </group>

      {/* BoltHoles */}
      <group name="BoltHoles">
        {Array.from({ length: numBolts }, (_, i) => {
          const angle = (i / numBolts) * Math.PI * 2;
          const x = Math.cos(angle) * (boltCircleDiameter / 2);
          const z = Math.sin(angle) * (boltCircleDiameter / 2);
          return (
            <mesh key={i} position={[x, 0, z]} material={material}>
              <cylinderGeometry args={[boltHoleDiameter / 2, boltHoleDiameter / 2, thickness + 0.001, 16]} />
            </mesh>
          );
        })}
      </group>

      {/* DischargeNozzle */}
      <group name="DischargeNozzle" position={[outerDiameter / 2 + nozzleLength / 2, 0, 0]}>
        <mesh material={material}>
          <cylinderGeometry args={[nozzleOD / 2, nozzleOD / 2, nozzleLength, 32]} />
        </mesh>
      </group>

      {/* Flange */}
      <group name="Flange" position={[outerDiameter / 2 + nozzleLength + flangeThickness / 2, 0, 0]}>
        <mesh material={material}>
          <cylinderGeometry args={[flangeOD / 2, flangeOD / 2, flangeThickness, 32]} />
        </mesh>
        {/* Flange bolt holes */}
        {Array.from({ length: numFlangeBolts }, (_, i) => {
          const angle = (i / numFlangeBolts) * Math.PI * 2;
          const x = Math.cos(angle) * (flangeBoltCircleDiameter / 2);
          const z = Math.sin(angle) * (flangeBoltCircleDiameter / 2);
          return (
            <mesh key={i} position={[x, 0, z]} material={material}>
              <cylinderGeometry args={[flangeBoltHoleDiameter / 2, flangeBoltHoleDiameter / 2, flangeThickness + 0.001, 16]} />
            </mesh>
          );
        })}
      </group>

      {/* SealingGroove */}
      <group name="SealingGroove">
        <mesh position={[0, -thickness / 2 - 0.002, 0]} material={material}>
          <ringGeometry args={[outerDiameter / 2 - 0.01, outerDiameter / 2, 64]} />
        </mesh>
      </group>

      {/* ReinforcementRibs */}
      <group name="ReinforcementRibs">
        {Array.from({ length: numRibs }, (_, i) => {
          const angle = (i / numRibs) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * (outerDiameter / 4), 0, Math.sin(angle) * (outerDiameter / 4)]}
              rotation={[0, angle, 0]}
              material={material}
            >
              <boxGeometry args={[outerDiameter / 2, thickness, ribThickness]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
