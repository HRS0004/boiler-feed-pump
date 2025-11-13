'use client';
import React, { useRef, useMemo } from 'react';
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

  // Dimensions (mm)
  const OD = 170;
  const ID = 120;
  const thickness = 40;
  const outerRadius = OD / 2;
  const innerRadius = ID / 2;

  // Geometry: Thick ring with internal features
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(innerRadius, 0);
    shape.lineTo(innerRadius, 5); // Start of locating shoulder
    shape.lineTo(innerRadius - 10, 5); // Step in for diffuser seat
    shape.lineTo(innerRadius - 10, 15);
    shape.quadraticCurveTo(innerRadius - 15, 20, innerRadius - 10, 25); // Smooth curve for flow-cut/scroll
    shape.lineTo(innerRadius - 10, 35);
    shape.lineTo(innerRadius, 35);
    shape.lineTo(innerRadius, thickness);
    shape.lineTo(outerRadius, thickness);
    shape.lineTo(outerRadius, 0);
    shape.lineTo(innerRadius, 0);

    return new THREE.LatheGeometry(shape.getPoints(32), 64);
  }, [outerRadius, innerRadius, thickness]);

  // Dowel holes: 3 on outer face
  const dowelHoles = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => {
      const angle = (i / 3) * Math.PI * 2;
      return {
        position: [Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius, thickness / 2],
        rotation: [Math.PI / 2, 0, angle],
      };
    });
  }, [outerRadius, thickness]);

  // Bolt holes with bosses: 4
  const boltHoles = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const angle = (i / 4) * Math.PI * 2;
      const bossRadius = 7.5; // 15mm diameter
      const holeRadius = 4; // 8mm diameter
      return {
        bossPosition: [Math.cos(angle) * (outerRadius - 5), Math.sin(angle) * (outerRadius - 5), thickness / 2],
        holePosition: [Math.cos(angle) * (outerRadius - 5), Math.sin(angle) * (outerRadius - 5), thickness / 2],
        rotation: [Math.PI / 2, 0, angle],
        bossRadius,
        holeRadius,
      };
    });
  }, [outerRadius, thickness]);

  return (
    <group ref={groupRef} name={`StageCasing_${stage}`}>
      {/* Main ring */}
      <mesh geometry={geometry} material={material} name={`StageCasing_${stage}_Ring`} rotation={[0, 0, Math.PI / 2]} />
      {/* Dowel holes */}
      {dowelHoles.map((hole, i) => (
        <mesh
          key={`dowel_${i}`}
          position={hole.position as [number, number, number]}
          rotation={hole.rotation as [number, number, number]}
          material={material}
          name={`StageCasing_${stage}_DowelHole_${i + 1}`}
        >
          <cylinderGeometry args={[2.5, 2.5, 10, 16]} /> {/* Diameter 5mm, depth 10mm */}
        </mesh>
      ))}
      {/* Bolt bosses and holes */}
      {boltHoles.map((bolt, i) => (
        <group key={`bolt_${i}`}>
          <mesh
            position={bolt.bossPosition as [number, number, number]}
            rotation={bolt.rotation as [number, number, number]}
            material={material}
            name={`StageCasing_${stage}_BoltBoss_${i + 1}`}
          >
            <cylinderGeometry args={[bolt.bossRadius, bolt.bossRadius, 5, 16]} /> {/* Boss height 5mm */}
          </mesh>
          <mesh
            position={bolt.holePosition as [number, number, number]}
            rotation={bolt.rotation as [number, number, number]}
            material={material}
            name={`StageCasing_${stage}_BoltHole_${i + 1}`}
          >
            <cylinderGeometry args={[bolt.holeRadius, bolt.holeRadius, thickness, 16]} /> {/* Hole through thickness */}
          </mesh>
        </group>
      ))}
    </group>
  );
}
