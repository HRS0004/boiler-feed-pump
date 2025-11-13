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

  // Dimensions (scaled for visualization, e.g., 1 unit = 1mm)
  const diameter = 250; // 250mm
  const length = 300; // 300mm along X-axis
  const thickness = 4; // 3-5mm sheet metal, using 4mm
  const radius = diameter / 2;

  // Ventilation slots: 10mm x 40mm, 50+ slots, arranged in rows, rounded edges, even spacing
  const slotWidth = 10;
  const slotHeight = 40;
  const numRows = 5; // e.g., 5 rows
  const slotsPerRow = 10; // 10 slots per row, total 50
  const rowSpacing = (length - numRows * slotHeight) / (numRows + 1);
  const slotSpacing = (Math.PI * diameter - slotsPerRow * slotWidth) / (slotsPerRow + 1);

  // Mounting Brackets: L-shaped, each side, 2-4 bolt holes Ø12mm, spacing 60-80mm
  const bracketThickness = 5;
  const bracketLength = 50;
  const bracketWidth = 30;
  const boltRadius = 6; // Ø12mm / 2
  const boltSpacing = 70; // 60-80mm, using 70mm

  // Joint / Flange: flanges with bolt holes, 6-8 bolts along the length
  const flangeThickness = 5;
  const flangeWidth = 20;
  const numFlangeBolts = 7; // 6-8, using 7
  const flangeBoltSpacing = length / (numFlangeBolts + 1);

  // Create two halves
  const half1Group = new THREE.Group();
  half1Group.name = 'CouplingGuard_Half1';
  const half2Group = new THREE.Group();
  half2Group.name = 'CouplingGuard_Half2';

  // Main Shell: Full cylinder split into two identical halves
  const guardGeometry = new THREE.CylinderGeometry(radius, radius, length, 32, 1, false, 0, Math.PI);
  const guard1 = new THREE.Mesh(guardGeometry, material);
  const guard2 = new THREE.Mesh(guardGeometry, material);
  guard2.rotation.y = Math.PI; // Rotate second half to align

  // Ventilation slots: Use CSG or subtract geometry, but for simplicity, create slot geometries and subtract
  // For visualization, we'll create the slots as separate meshes with transparent material to simulate holes
  const slotGeometry = new THREE.BoxGeometry(slotWidth, thickness + 0.1, slotHeight);
  const slotMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.1,
    wireframe,
  });
  const slots1: THREE.Mesh[] = [];
  const slots2: THREE.Mesh[] = [];
  for (let row = 0; row < numRows; row++) {
    const yPos = -length / 2 + rowSpacing + (row + 0.5) * slotHeight;
    for (let col = 0; col < slotsPerRow; col++) {
      const angle = (col + 0.5) * slotSpacing / radius;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      const slot = new THREE.Mesh(slotGeometry, slotMaterial);
      slot.position.set(yPos, x, z);
      slot.rotation.y = angle;
      slots1.push(slot);
      const slot2 = new THREE.Mesh(slotGeometry, slotMaterial);
      slot2.position.set(yPos, x, z);
      slot2.rotation.y = angle + Math.PI;
      slots2.push(slot2);
    }
  }

  // Mounting Brackets: L-shaped, welded to guard
  const bracketGeometry = new THREE.BoxGeometry(bracketLength, bracketThickness, bracketWidth);
  const bracket1 = new THREE.Mesh(bracketGeometry, material);
  bracket1.position.set(-length / 2 - bracketLength / 2, radius + bracketThickness / 2, 0);
  const bracket2 = new THREE.Mesh(bracketGeometry, material);
  bracket2.position.set(length / 2 + bracketLength / 2, radius + bracketThickness / 2, 0);
  const bracket3 = new THREE.Mesh(bracketGeometry, material);
  bracket3.position.set(-length / 2 - bracketLength / 2, -radius - bracketThickness / 2, 0);
  const bracket4 = new THREE.Mesh(bracketGeometry, material);
  bracket4.position.set(length / 2 + bracketLength / 2, -radius - bracketThickness / 2, 0);

  // Bolt holes on brackets
  const boltGeometry = new THREE.CylinderGeometry(boltRadius, boltRadius, bracketThickness + 0.1, 16);
  const boltMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1, wireframe });
  const bolts: THREE.Mesh[] = [];
  const boltPositions = [
    { x: bracket1.position.x, y: bracket1.position.y, z: bracket1.position.z + boltSpacing / 2 },
    { x: bracket1.position.x, y: bracket1.position.y, z: bracket1.position.z - boltSpacing / 2 },
    { x: bracket2.position.x, y: bracket2.position.y, z: bracket2.position.z + boltSpacing / 2 },
    { x: bracket2.position.x, y: bracket2.position.y, z: bracket2.position.z - boltSpacing / 2 },
    { x: bracket3.position.x, y: bracket3.position.y, z: bracket3.position.z + boltSpacing / 2 },
    { x: bracket3.position.x, y: bracket3.position.y, z: bracket3.position.z - boltSpacing / 2 },
    { x: bracket4.position.x, y: bracket4.position.y, z: bracket4.position.z + boltSpacing / 2 },
    { x: bracket4.position.x, y: bracket4.position.y, z: bracket4.position.z - boltSpacing / 2 },
  ];
  boltPositions.forEach(pos => {
    const bolt = new THREE.Mesh(boltGeometry, boltMaterial);
    bolt.position.set(pos.x, pos.y, pos.z);
    bolt.rotation.x = Math.PI / 2;
    bolts.push(bolt);
  });

  // Joint Flange: flanges with bolt holes
  const flangeGeometry = new THREE.BoxGeometry(flangeThickness, diameter, flangeWidth);
  const flange1 = new THREE.Mesh(flangeGeometry, material);
  flange1.position.set(0, 0, radius + flangeWidth / 2);
  const flange2 = new THREE.Mesh(flangeGeometry, material);
  flange2.position.set(0, 0, -radius - flangeWidth / 2);

  // Flange bolts
  const flangeBoltGeometry = new THREE.CylinderGeometry(boltRadius, boltRadius, flangeThickness + 0.1, 16);
  const flangeBolts: THREE.Mesh[] = [];
  for (let i = 0; i < numFlangeBolts; i++) {
    const yPos = -length / 2 + flangeBoltSpacing * (i + 1);
    const bolt1 = new THREE.Mesh(flangeBoltGeometry, boltMaterial);
    bolt1.position.set(yPos, 0, flange1.position.z);
    bolt1.rotation.z = Math.PI / 2;
    flangeBolts.push(bolt1);
    const bolt2 = new THREE.Mesh(flangeBoltGeometry, boltMaterial);
    bolt2.position.set(yPos, 0, flange2.position.z);
    bolt2.rotation.z = Math.PI / 2;
    flangeBolts.push(bolt2);
  }

  // Add to half1
  half1Group.add(guard1);
  slots1.forEach(slot => half1Group.add(slot));
  half1Group.add(bracket1);
  half1Group.add(bracket3);
  bolts.slice(0, 4).forEach(bolt => half1Group.add(bolt));
  half1Group.add(flange1);
  flangeBolts.filter((_, i) => i % 2 === 0).forEach(bolt => half1Group.add(bolt));

  // Add to half2
  half2Group.add(guard2);
  slots2.forEach(slot => half2Group.add(slot));
  half2Group.add(bracket2);
  half2Group.add(bracket4);
  bolts.slice(4).forEach(bolt => half2Group.add(bolt));
  half2Group.add(flange2);
  flangeBolts.filter((_, i) => i % 2 === 1).forEach(bolt => half2Group.add(bolt));

  return (
    <group ref={groupRef}>
      <primitive object={half1Group} />
      <primitive object={half2Group} />
    </group>
  );
}
