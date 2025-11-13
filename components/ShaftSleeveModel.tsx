'use client';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface ShaftSleeveModelProps {
  wireframe?: boolean;
}

export default function ShaftSleeveModel({ wireframe = false }: ShaftSleeveModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Material: Stainless steel SS316, polished central region (approximated with one material for simplicity)
  const sleeveMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc, // Stainless steel gray
    metalness: 0.9,
    roughness: 0.2,
    wireframe,
  });

  // Geometry: Hollow cylindrical sleeve with chamfers
  // OD 60mm (radius 30mm), ID 50mm (radius 25mm), length 70mm, chamfer 1mm on both ends
  const sleeveGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(26, 0); // Inner bottom chamfer start
    shape.lineTo(29, 0); // Outer bottom chamfer start
    shape.lineTo(30, 1); // Outer after bottom chamfer
    shape.lineTo(30, 69); // Outer before top chamfer
    shape.lineTo(29, 69); // Outer top chamfer start
    shape.lineTo(26, 69); // Inner top chamfer start
    shape.lineTo(25, 70); // Inner after top chamfer
    shape.lineTo(25, 1); // Inner before bottom chamfer
    shape.lineTo(26, 1); // Inner bottom after chamfer
    shape.lineTo(26, 0); // Close shape

    return new THREE.LatheGeometry(shape.getPoints(16), 64);
  }, []);

  return (
    <group ref={groupRef} name="shaft_sleeve_seal_area_x2">
      <mesh geometry={sleeveGeometry} material={sleeveMaterial} name="ShaftSleeve_1" rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]} />
      <mesh geometry={sleeveGeometry} material={sleeveMaterial} name="ShaftSleeve_2" rotation={[0, 0, Math.PI / 2]} position={[120, 0, 0]} />
    </group>
  );
}
