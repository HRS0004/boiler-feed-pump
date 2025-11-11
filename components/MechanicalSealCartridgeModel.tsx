import * as THREE from 'three'
import React, { useMemo, JSX } from 'react'

// Materials
const materials = {
  ss316: new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.3, name: 'ss316' }),
  ceramic: new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.1, name: 'ceramic' }),
  carbon: new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.2, name: 'carbon' }),
  elastomer: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, name: 'elastomer' }),
  steel: new THREE.MeshStandardMaterial({ color: 0xb0b0b0, metalness: 1.0, roughness: 0.2, name: 'steel' }),
};

// Helper function to create helical spring
function createHelicalSpring(radius: number, height: number, coils: number, thickness: number, segments = 32) {
  const points = [];
  for (let i = 0; i <= segments * coils; i++) {
    const t = (i / (segments * coils)) * Math.PI * 2 * coils;
    const x = radius * Math.cos(t);
    const y = (i / (segments * coils)) * height;
    const z = radius * Math.sin(t);
    points.push(new THREE.Vector3(x, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.TubeGeometry(curve, segments * coils, thickness, 8, false);
}

export function MechanicalSealCartridgeModel(props: JSX.IntrinsicElements['group'] & { wireframe?: boolean }) {
  const newMaterials = useMemo(() => {
    const updated = {} as { [key: string]: THREE.MeshStandardMaterial };
    for (const key in materials) {
      updated[key] = materials[key as keyof typeof materials].clone();
      updated[key].wireframe = props.wireframe || false;
    }
    return updated;
  }, [props.wireframe]);

  // Parameters
  const params = {
    flangeOD: 140,
    flangeThickness: 12,
    boreID: 50,
    cartridgeDepth: 80,
    bcd: 160,
    boltHoles: 8,
    boltHoleDia: 18,
    leakoffPortSize: 0.5,
    shaftDia: 50,
  };

  // Geometries
  const cartridgeBodyShape = useMemo(() => {
    const shape = new THREE.Shape();
    const flangeRadius = params.flangeOD / 2;
    const boreRadius = params.boreID / 2 + 15;
    shape.moveTo(boreRadius, 0);
    shape.lineTo(flangeRadius - 5, 0);
    shape.absarc(flangeRadius - 5, 5, 5, -Math.PI / 2, 0, false);
    shape.lineTo(flangeRadius, params.flangeThickness);
    shape.lineTo(boreRadius + 10, params.flangeThickness);
    shape.lineTo(boreRadius + 10, params.cartridgeDepth - 10);
    shape.lineTo(boreRadius, params.cartridgeDepth);
    shape.lineTo(boreRadius, 0);
    return new THREE.LatheGeometry(shape.getPoints(16), 64);
  }, []);

  const shaftSleeveGeometry = useMemo(() => new THREE.CylinderGeometry(params.shaftDia / 2 + 4, params.shaftDia / 2, params.cartridgeDepth, 32), []);
  const rotatingFaceGeometry = useMemo(() => new THREE.RingGeometry(params.shaftDia / 2 + 4, params.shaftDia / 2 + 12, 32), []);
  const stationarySeatGeometry = useMemo(() => new THREE.RingGeometry(params.shaftDia / 2 + 10, params.shaftDia / 2 + 20, 32), []);
  const oRingGeometry = useMemo(() => new THREE.TorusGeometry(params.shaftDia / 2 + 1, 1, 16, 32), []);
  const springGeometry = useMemo(() => createHelicalSpring(params.shaftDia / 2 + 8, 30, 5, 2, 32), []);
  const glandClampGeometry = useMemo(() => new THREE.RingGeometry(params.flangeOD / 2 - 10, params.flangeOD / 2, 64, 1, 0, Math.PI * 2), []);
  const leakoffPortGeometry = useMemo(() => new THREE.CylinderGeometry(params.leakoffPortSize * 12.7, params.leakoffPortSize * 12.7, 20, 16), []);
  const drainChannelGeometry = useMemo(() => new THREE.CylinderGeometry(2, 2, 10, 16), []);
  const boltGeometry = useMemo(() => new THREE.CylinderGeometry(5, 5, params.flangeThickness + 10, 16), []);
  const nutGeometry = useMemo(() => new THREE.CylinderGeometry(8, 8, 5, 6), []);
  const protectiveCoverGeometry = useMemo(() => new THREE.CylinderGeometry(params.shaftDia / 2 + 25, params.shaftDia / 2 + 25, 5, 32), []);
  const setScrewGeometry = useMemo(() => new THREE.CylinderGeometry(3, 3, 10, 16), []);
  const oRingGrooveGeometry = useMemo(() => new THREE.TorusGeometry(params.shaftDia / 2 + 15, 1.5, 16, 32), []);

  return (
    <group {...props} dispose={null} rotation={[0, 0, Math.PI / 2]}>
      <mesh name="cartridge_body" geometry={cartridgeBodyShape} material={newMaterials.ss316} />
      <mesh name="shaft_sleeve" geometry={shaftSleeveGeometry} material={newMaterials.ss316} position={[0, params.cartridgeDepth / 2, 0]} />
      <mesh name="rotating_face" geometry={rotatingFaceGeometry} material={newMaterials.carbon} rotation={[-Math.PI / 2, 0, 0]} position={[0, params.cartridgeDepth - 20, 0]} />
      <mesh name="set_screw" geometry={setScrewGeometry} material={newMaterials.steel} position={[params.shaftDia / 2 + 8, params.cartridgeDepth - 20, 0]} />
      <mesh name="stationary_seat" geometry={stationarySeatGeometry} material={newMaterials.ceramic} rotation={[-Math.PI / 2, 0, 0]} position={[0, params.cartridgeDepth - 22, 0]} />
      <mesh name="o_ring_groove" geometry={oRingGrooveGeometry} material={newMaterials.ss316} rotation={[-Math.PI / 2, 0, 0]} position={[0, params.cartridgeDepth - 22, 0]} />
      <mesh name="o_rings" geometry={oRingGeometry} material={newMaterials.elastomer} rotation={[Math.PI / 2, 0, 0]} position={[0, 10, 0]} />
      <mesh name="o_rings" geometry={oRingGeometry} material={newMaterials.elastomer} rotation={[Math.PI / 2, 0, 0]} position={[0, params.cartridgeDepth - 10, 0]} />
      <mesh name="spring_pack" geometry={springGeometry} material={newMaterials.steel} position={[0, params.cartridgeDepth / 2, 0]} />
      <mesh name="gland_clamp" geometry={glandClampGeometry} material={newMaterials.ss316} rotation={[-Math.PI / 2, 0, 0]} position={[0, params.flangeThickness, 0]} />
      <mesh name="leakoff_port" geometry={leakoffPortGeometry} material={newMaterials.ss316} position={[params.flangeOD / 2 - 20, params.flangeThickness + 10, 0]} rotation={[0, 0, Math.PI / 2]} />
      <mesh name="drain_channel" geometry={drainChannelGeometry} material={newMaterials.ss316} position={[params.flangeOD / 2 - 30, params.flangeThickness + 5, 0]} rotation={[0, 0, Math.PI / 2]} />
      {Array.from({ length: params.boltHoles }, (_, i) => {
        const angle = (i / params.boltHoles) * Math.PI * 2;
        const x = (params.bcd / 2) * Math.cos(angle);
        const z = (params.bcd / 2) * Math.sin(angle);
        return (
          <group key={i}>
            <mesh name={`fastener_bolt_${i}`} geometry={boltGeometry} material={newMaterials.steel} position={[x, params.flangeThickness / 2, z]} />
            <mesh name={`fastener_nut_${i}`} geometry={nutGeometry} material={newMaterials.steel} position={[x, params.flangeThickness + 5, z]} />
          </group>
        );
      })}
      <mesh name="protective_cover" geometry={protectiveCoverGeometry} material={newMaterials.ss316} position={[0, params.cartridgeDepth - 15, 0]} />
      <mesh name="placement_stub" geometry={new THREE.CylinderGeometry(params.flangeOD / 2, params.flangeOD / 2, params.cartridgeDepth, 32)} material={new THREE.MeshBasicMaterial({ visible: false })} position={[0, params.cartridgeDepth / 2, 0]} />
    </group>
  );
}
