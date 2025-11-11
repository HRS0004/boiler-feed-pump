'use client';
import { useRef } from 'react';
import * as THREE from 'three';

interface CouplingGuardModelProps {
  wireframe?: boolean;
}

export default function CouplingGuardModel({ wireframe = false }: CouplingGuardModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Materials: Stainless steel or aluminum (matte finish)
  const material = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    metalness: 0.8,
    roughness: 0.2,
    wireframe,
  });

  // Dimensions (scaled for visualization, e.g., 1 unit = 10mm)
  const totalLength = 35; // ~350mm along X-axis
  const outerDiameter = 20; // ~200mm outer diameter
  const innerDiameter = 18; // ~180mm inner diameter (wall thickness ~10mm)
  const wallThickness = 1; // ~10mm wall thickness
  const bracketWidth = 3; // ~30mm bracket width

  // Semi-cylindrical guard (half cylinder)
  const guardGeometry = new THREE.CylinderGeometry(outerDiameter / 2, outerDiameter / 2, totalLength, 32, 1, false, 0, Math.PI);
  const guard = new THREE.Mesh(guardGeometry, material);

  // Inner cylinder for hollow effect (optional, for visualization)
  const innerGeometry = new THREE.CylinderGeometry(innerDiameter / 2, innerDiameter / 2, totalLength, 32, 1, false, 0, Math.PI);
  const innerMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.1,
    wireframe,
  });
  const inner = new THREE.Mesh(innerGeometry, innerMaterial);

  // Perforations: Create holes along the surface
  const holeRadius = 0.5; // ~5mm holes
  const holes = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 5; j++) {
      const holeGeometry = new THREE.CylinderGeometry(holeRadius, holeRadius, wallThickness + 0.1, 16);
      const hole = new THREE.Mesh(holeGeometry, innerMaterial);
      hole.position.set(
        (totalLength / 2 - i * 3.5) - totalLength / 2,
        (outerDiameter / 2 - j * 3) - outerDiameter / 4,
        0
      );
      hole.rotation.z = Math.PI / 2;
      holes.push(hole);
    }
  }

  // Mounting flanges at both ends
  const flangeGeometry = new THREE.BoxGeometry(bracketWidth, outerDiameter / 2, wallThickness);
  const flange1 = new THREE.Mesh(flangeGeometry, material);
  flange1.position.set(-totalLength / 2 + bracketWidth / 2, 0, 0);
  const flange2 = new THREE.Mesh(flangeGeometry, material);
  flange2.position.set(totalLength / 2 - bracketWidth / 2, 0, 0);

  // Bolts on flanges (small hex bolts)
  const boltGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 6);
  const boltMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1, wireframe });
  const bolts = [];
  for (let i = 0; i < 4; i++) {
    const bolt = new THREE.Mesh(boltGeometry, boltMaterial);
    bolt.position.set(
      flange1.position.x,
      (i % 2 === 0 ? outerDiameter / 4 : -outerDiameter / 4),
      (i < 2 ? wallThickness / 2 + 0.25 : -wallThickness / 2 - 0.25)
    );
    bolts.push(bolt);
  }
  for (let i = 0; i < 4; i++) {
    const bolt = new THREE.Mesh(boltGeometry, boltMaterial);
    bolt.position.set(
      flange2.position.x,
      (i % 2 === 0 ? outerDiameter / 4 : -outerDiameter / 4),
      (i < 2 ? wallThickness / 2 + 0.25 : -wallThickness / 2 - 0.25)
    );
    bolts.push(bolt);
  }

  return (
    <group ref={groupRef}>
      {/* Main guard */}
      <primitive object={guard} />
      <primitive object={inner} />
      {/* Perforations */}
      {holes.map((hole, index) => (
        <primitive key={index} object={hole} />
      ))}
      {/* Flanges */}
      <primitive object={flange1} />
      <primitive object={flange2} />
      {/* Bolts */}
      {bolts.map((bolt, index) => (
        <primitive key={index} object={bolt} />
      ))}
    </group>
  );
}
