'use client';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface ShaftSleeveInterstageModelProps {
  wireframe?: boolean;
  index: number; // 1 to 7 for ShaftSleeve_Interstage_1 to 7
}

export default function ShaftSleeveInterstageModel({ wireframe = false, index }: ShaftSleeveInterstageModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Material: Stainless steel SS316
  const sleeveMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc, // Stainless steel gray
    metalness: 0.9,
    roughness: 0.2,
    wireframe,
  });

  // Geometry: Hollow cylindrical sleeve (similar to seal sleeve but for interstage)
  // OD 60mm, ID 50mm, length 70mm, chamfer 1mm on both ends
  const sleeveGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(2.5, 0); // Inner bottom chamfer start
    shape.lineTo(2.9, 0); // Outer bottom chamfer start
    shape.lineTo(3, 0.1); // Outer after bottom chamfer
    shape.lineTo(3, 6.9); // Outer before top chamfer
    shape.lineTo(2.9, 6.9); // Outer top chamfer start
    shape.lineTo(2.5, 6.9); // Inner top chamfer start
    shape.lineTo(2.5, 7); // Inner after top chamfer
    shape.lineTo(2.5, 0.1); // Inner before bottom chamfer
    shape.lineTo(2.5, 0.1); // Inner bottom after chamfer
    shape.lineTo(2.5, 0); // Close shape

    return new THREE.LatheGeometry(shape.getPoints(16), 64);
  }, []);

  return (
    <group ref={groupRef} name={`ShaftSleeve_Interstage_${index}`}>
      <mesh geometry={sleeveGeometry} material={sleeveMaterial} name={`ShaftSleeve_Interstage_${index}`} rotation={[0, 0, Math.PI / 2]} />
    </group>
  );
}
