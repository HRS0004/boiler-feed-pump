'use client';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { CSG } from 'three-csg-ts';

interface PumpShaftModelProps {
  wireframe?: boolean;
}

export default function PumpShaftModel({ wireframe = false }: PumpShaftModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Material: Stainless steel, smooth finish, seal regions mirror-polished
  const shaftMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc, // Stainless steel gray
    metalness: 0.9,
    roughness: 0.2,
    wireframe,
  });

  // Scaling: 1 unit = 10mm
  const shaftGeometry = useMemo(() => {
    // Define shaft profile points (half-profile for LatheGeometry)
    // Total length: 860 mm (86 units)
    const points = [
      // Segment A: Base diameter 48mm (4.8 units), length portion
      new THREE.Vector2(0, -430), // Bottom
      new THREE.Vector2(2.4, -430), // Chamfer start
      new THREE.Vector2(2.4, -425), // Smooth chamfer
      new THREE.Vector2(2.4, -200), // Base section

      // Step down to 42mm (4.2 units)
      new THREE.Vector2(2.4, -198),
      new THREE.Vector2(2.1, -198),
      new THREE.Vector2(2.1, -196),

      new THREE.Vector2(2.1, -100), // Transition section

      // Step down to 38mm (3.8 units)
      new THREE.Vector2(2.1, -98),
      new THREE.Vector2(1.9, -98),
      new THREE.Vector2(1.9, -96),

      new THREE.Vector2(1.9, 0), // Middle section

      // Step down to 32mm (3.2 units)
      new THREE.Vector2(1.9, 2),
      new THREE.Vector2(1.6, 2),
      new THREE.Vector2(1.6, 4),

      new THREE.Vector2(1.6, 200), // Seal area

      // Step down to 28mm (2.8 units)
      new THREE.Vector2(1.6, 202),
      new THREE.Vector2(1.4, 202),
      new THREE.Vector2(1.4, 204),

      new THREE.Vector2(1.4, 430), // End section
      new THREE.Vector2(1.3, 432), // Chamfer
      new THREE.Vector2(0, 432), // Top
    ];

    // Create LatheGeometry for shaft body
    const latheGeometry = new THREE.LatheGeometry(points, 64);

    // Create keyway cut for mechanical seal area: 6mm width, 3mm depth at 32mm diameter section
    const keywayGeometry = new THREE.BoxGeometry(60, 3, 6); // Length 60mm, depth 3mm, width 6mm
    keywayGeometry.translate(0, 200, 0); // Position at seal area (Y=200 approx, 32mm section)

    // Create meshes for CSG
    const shaftMesh = new THREE.Mesh(latheGeometry);
    const keywayMesh = new THREE.Mesh(keywayGeometry);

    // Perform boolean subtraction: shaft - keyway
    const csg = CSG.subtract(shaftMesh, keywayMesh);
    return csg.geometry;
  }, []);

  return (
    <group ref={groupRef} name="pump_shaft">
      <mesh geometry={shaftGeometry} material={shaftMaterial} name="PumpShaft" rotation={[0, 0, Math.PI / 2]} scale={[0.1, 0.1, 0.1]} />
    </group>
  );
}
