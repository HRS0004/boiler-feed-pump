'use client';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface SuctionGuideModelProps {
  wireframe?: boolean;
}

export default function SuctionGuideModel({ wireframe = false }: SuctionGuideModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Material: Cast steel
  const material = new THREE.MeshStandardMaterial({
    color: 0x666666, // Cast steel gray
    metalness: 0.5,
    roughness: 0.5,
    wireframe,
  });

  // Geometry: Funnel shape (cone with chamfered ends)
  // OD top 100mm, OD bottom 60mm, length 50mm
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(3, 0); // Bottom OD 60mm
    shape.lineTo(5, 0); // Top OD 100mm
    shape.lineTo(5, 5); // Length 50mm
    shape.lineTo(3, 5);
    shape.lineTo(3, 0);

    return new THREE.LatheGeometry(shape.getPoints(16), 64);
  }, []);

  return (
    <group ref={groupRef} name="SuctionGuide">
      <mesh geometry={geometry} material={material} name="SuctionGuide" rotation={[0, 0, Math.PI / 2]} />
    </group>
  );
}
