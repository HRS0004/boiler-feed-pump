'use client';
import { useRef } from 'react';
import * as THREE from 'three';

interface BalanceLeakoffPipeModelProps {
  wireframe?: boolean;
}

export default function BalanceLeakoffPipeModel({ wireframe = false }: BalanceLeakoffPipeModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Materials: Stainless steel (polished metallic surface)
  const material = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    metalness: 0.9,
    roughness: 0.1,
    wireframe,
  });

  // Dimensions (scaled for visualization, e.g., 1 unit = 10mm)
  const outerRadius = 1; // ~10mm outer radius (OD ~20mm)
  const innerRadius = 0.75; // ~7.5mm inner radius (ID ~15mm)
  const totalLength = 20; // ~200mm total unfolded length
  const bendRadius = 5; // ~50mm bend radius
  const flangeThickness = 0.5; // ~5mm flange thickness
  const flangeDiameter = 3; // ~30mm flange diameter

  // Create curved path for the pipe (90° bend)
  const path = new THREE.CurvePath<THREE.Vector3>();
  const straight1 = new THREE.LineCurve3(
    new THREE.Vector3(-totalLength / 2 + bendRadius, 0, 0),
    new THREE.Vector3(0, 0, 0)
  );
  const arc = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(bendRadius, bendRadius, 0),
    new THREE.Vector3(bendRadius, bendRadius * 2, 0)
  );
  const straight2 = new THREE.LineCurve3(
    new THREE.Vector3(bendRadius, bendRadius * 2, 0),
    new THREE.Vector3(totalLength / 2 - bendRadius, bendRadius * 2, 0)
  );
  path.add(straight1);
  path.add(arc);
  path.add(straight2);

  // Outer tube geometry
  const tubeGeometry = new THREE.TubeGeometry(path, 64, outerRadius, 16, false);
  const tube = new THREE.Mesh(tubeGeometry, material);

  // Inner tube for hollow effect (transparent)
  const innerTubeGeometry = new THREE.TubeGeometry(path, 64, innerRadius, 16, false);
  const innerMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.1,
    wireframe,
  });
  const innerTube = new THREE.Mesh(innerTubeGeometry, innerMaterial);

  // Flanges at both ends
  const flangeGeometry = new THREE.CylinderGeometry(flangeDiameter / 2, flangeDiameter / 2, flangeThickness, 32);
  const flange1 = new THREE.Mesh(flangeGeometry, material);
  flange1.position.set(-totalLength / 2 + bendRadius, 0, 0);
  flange1.rotation.z = Math.PI / 2;
  const flange2 = new THREE.Mesh(flangeGeometry, material);
  flange2.position.set(totalLength / 2 - bendRadius, bendRadius * 2, 0);
  flange2.rotation.z = Math.PI / 2;

  // Weld beads/fillets (small cylinders at joints)
  const weldGeometry = new THREE.CylinderGeometry(outerRadius + 0.1, outerRadius + 0.1, 0.2, 16);
  const weldMaterial = new THREE.MeshStandardMaterial({
    color: 0xddddaa, // Slight gold tint for weld
    metalness: 0.8,
    roughness: 0.2,
    wireframe,
  });
  const weld1 = new THREE.Mesh(weldGeometry, weldMaterial);
  weld1.position.set(-totalLength / 2 + bendRadius, 0, 0);
  weld1.rotation.z = Math.PI / 2;
  const weld2 = new THREE.Mesh(weldGeometry, weldMaterial);
  weld2.position.set(totalLength / 2 - bendRadius, bendRadius * 2, 0);
  weld2.rotation.z = Math.PI / 2;

  return (
    <group ref={groupRef}>
      {/* Main pipe */}
      <primitive object={tube} />
      <primitive object={innerTube} />
      {/* Flanges */}
      <primitive object={flange1} />
      <primitive object={flange2} />
      {/* Weld beads */}
      <primitive object={weld1} />
      <primitive object={weld2} />
    </group>
  );
}
