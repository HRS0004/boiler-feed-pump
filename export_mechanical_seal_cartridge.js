const THREE = require('three');
const fs = require('fs');

// --- Parameters (default values) ---
const params = {
    flangeOD: 140,
    flangeThickness: 12,
    boreID: 50,
    cartridgeDepth: 80,
    bcd: 160,
    boltHoles: 8,
    boltHoleDia: 18,
    leakoffPortSize: 0.5, // NPT in inches
    shaftDia: 50,
};

// --- Materials ---
const materials = {
    ss316: new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.3, name: 'ss316' }),
    ceramic: new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.1, name: 'ceramic' }),
    carbon: new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.2, name: 'carbon' }),
    elastomer: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, name: 'elastomer' }),
    steel: new THREE.MeshStandardMaterial({ color: 0xb0b0b0, metalness: 1.0, roughness: 0.2, name: 'steel' }),
};

// Helper function to create helical spring
function createHelicalSpring(radius, height, coils, thickness, segments = 32) {
    const points = [];
    const coilHeight = height / coils;
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

function createMechanicalSealCartridge(isLOD = false) {
    const group = new THREE.Group();
    group.name = 'MechanicalSealCartridge';

    // --- Geometries ---

    // 1. Cartridge Body
    const bodyShape = new THREE.Shape();
    const flangeRadius = params.flangeOD / 2;
    const boreRadius = params.boreID / 2 + 15; // Body inner radius
    bodyShape.moveTo(boreRadius, 0);
    bodyShape.lineTo(flangeRadius - 5, 0);
    bodyShape.absarc(flangeRadius - 5, 5, 5, -Math.PI / 2, 0, false);
    bodyShape.lineTo(flangeRadius, params.flangeThickness);
    bodyShape.lineTo(boreRadius + 10, params.flangeThickness);
    bodyShape.lineTo(boreRadius + 10, params.cartridgeDepth - 10);
    bodyShape.lineTo(boreRadius, params.cartridgeDepth);
    bodyShape.lineTo(boreRadius, 0);
    const bodyGeometry = new THREE.LatheGeometry(bodyShape.getPoints(isLOD ? 8: 16), isLOD ? 32 : 64);
    const cartridge_body = new THREE.Mesh(bodyGeometry, materials.ss316);
    cartridge_body.name = 'cartridge_body';
    group.add(cartridge_body);

    // 2. Shaft Sleeve
    const sleeveGeometry = new THREE.CylinderGeometry(params.shaftDia / 2 + 4, params.shaftDia / 2, params.cartridgeDepth, isLOD ? 16 : 32);
    const shaft_sleeve = new THREE.Mesh(sleeveGeometry, materials.ss316);
    shaft_sleeve.name = 'shaft_sleeve';
    shaft_sleeve.position.y = params.cartridgeDepth / 2;
    group.add(shaft_sleeve);

    // 3. Rotating Seal Face (with set-screw clamp)
    const rotatingFaceGeometry = new THREE.RingGeometry(params.shaftDia / 2 + 4, params.shaftDia / 2 + 12, isLOD ? 16 : 32);
    const rotating_face = new THREE.Mesh(rotatingFaceGeometry, materials.carbon);
    rotating_face.name = 'rotating_face';
    rotating_face.rotation.x = -Math.PI / 2;
    rotating_face.position.y = params.cartridgeDepth - 20;
    group.add(rotating_face);

    // Set-screw clamp on rotating face
    const setScrewGeometry = new THREE.CylinderGeometry(3, 3, 10, isLOD ? 8 : 16);
    const setScrew = new THREE.Mesh(setScrewGeometry, materials.steel);
    setScrew.name = 'set_screw';
    setScrew.position.set(params.shaftDia / 2 + 8, params.cartridgeDepth - 20, 0);
    group.add(setScrew);

    // 4. Stationary Seat (with O-ring groove)
    const stationarySeatGeometry = new THREE.RingGeometry(params.shaftDia / 2 + 10, params.shaftDia / 2 + 20, isLOD ? 16 : 32);
    const stationary_seat = new THREE.Mesh(stationarySeatGeometry, materials.ceramic);
    stationary_seat.name = 'stationary_seat';
    stationary_seat.rotation.x = -Math.PI / 2;
    stationary_seat.position.y = params.cartridgeDepth - 22;
    group.add(stationary_seat);

    // O-ring groove on stationary seat
    const grooveGeometry = new THREE.TorusGeometry(params.shaftDia / 2 + 15, 1.5, isLOD ? 8 : 16, isLOD ? 16 : 32);
    const o_ring_groove = new THREE.Mesh(grooveGeometry, materials.ss316);
    o_ring_groove.name = 'o_ring_groove';
    o_ring_groove.rotation.x = -Math.PI / 2;
    o_ring_groove.position.y = params.cartridgeDepth - 22;
    group.add(o_ring_groove);

    // 5. O-Rings
    const oRingGeometry = new THREE.TorusGeometry(params.shaftDia / 2 + 1, 1, isLOD ? 8 : 16, isLOD ? 16 : 32);
    const o_ring_1 = new THREE.Mesh(oRingGeometry, materials.elastomer);
    o_ring_1.name = 'o_rings';
    o_ring_1.rotation.x = Math.PI / 2;
    o_ring_1.position.y = 10;
    group.add(o_ring_1);
    const o_ring_2 = o_ring_1.clone();
    o_ring_2.position.y = params.cartridgeDepth - 10;
    group.add(o_ring_2);

    // 6. Spring Assembly (helical coil springs)
    const springRadius = params.shaftDia / 2 + 8;
    const springHeight = 30;
    const coils = 5;
    const springThickness = 2;
    const springGeometry = createHelicalSpring(springRadius, springHeight, coils, springThickness, isLOD ? 16 : 32);
    const spring_pack = new THREE.Mesh(springGeometry, materials.steel);
    spring_pack.name = 'spring_pack';
    spring_pack.position.y = params.cartridgeDepth / 2;
    group.add(spring_pack);

    // 7. Gland Clamp
    const glandClampGeometry = new THREE.RingGeometry(flangeRadius - 10, flangeRadius, isLOD ? 32 : 64, 1, 0, Math.PI * 2);
    const gland_clamp = new THREE.Mesh(glandClampGeometry, materials.ss316);
    gland_clamp.name = 'gland_clamp';
    gland_clamp.rotation.x = -Math.PI / 2;
    gland_clamp.position.y = params.flangeThickness;
    group.add(gland_clamp);

    // 8. Leak-off Port (threaded NPT port)
    const portRadius = params.leakoffPortSize * 12.7; // Approximate NPT OD in mm
    const portGeometry = new THREE.CylinderGeometry(portRadius, portRadius, 20, isLOD ? 8 : 16);
    const leakoff_port = new THREE.Mesh(portGeometry, materials.ss316);
    leakoff_port.name = 'leakoff_port';
    leakoff_port.position.set(flangeRadius - 20, params.flangeThickness + 10, 0);
    leakoff_port.rotation.z = Math.PI / 2;
    group.add(leakoff_port);

    // Small drain channel
    const channelGeometry = new THREE.CylinderGeometry(2, 2, 10, isLOD ? 8 : 16);
    const drain_channel = new THREE.Mesh(channelGeometry, materials.ss316);
    drain_channel.name = 'drain_channel';
    drain_channel.position.set(flangeRadius - 30, params.flangeThickness + 5, 0);
    drain_channel.rotation.z = Math.PI / 2;
    group.add(drain_channel);

    // 9. Fasteners
    const boltGeometry = new THREE.CylinderGeometry(5, 5, params.flangeThickness + 10, isLOD ? 8 : 16);
    const nutGeometry = new THREE.CylinderGeometry(8, 8, 5, 6);
    for (let i = 0; i < params.boltHoles; i++) {
        const angle = (i / params.boltHoles) * Math.PI * 2;
        const bolt = new THREE.Mesh(boltGeometry, materials.steel);
        const nut = new THREE.Mesh(nutGeometry, materials.steel);
        const x = (params.bcd / 2) * Math.cos(angle);
        const z = (params.bcd / 2) * Math.sin(angle);
        bolt.position.set(x, params.flangeThickness / 2, z);
        nut.position.set(x, params.flangeThickness + 5, z);
        bolt.name = `fastener_bolt_${i}`;
        nut.name = `fastener_nut_${i}`;
        group.add(bolt);
        group.add(nut);
    }

    // 10. Protective Cover (removable dust/shield cap)
    const coverGeometry = new THREE.CylinderGeometry(params.shaftDia / 2 + 25, params.shaftDia / 2 + 25, 5, isLOD ? 16 : 32);
    const protective_cover = new THREE.Mesh(coverGeometry, materials.ss316);
    protective_cover.name = 'protective_cover';
    protective_cover.position.y = params.cartridgeDepth - 15;
    group.add(protective_cover);

    // 11. Placement Stub
    const stubGeometry = new THREE.CylinderGeometry(params.flangeOD / 2, params.flangeOD / 2, params.cartridgeDepth, 32);
    const placement_stub = new THREE.Mesh(stubGeometry, new THREE.MeshBasicMaterial({ visible: false }));
    placement_stub.name = 'placement_stub';
    placement_stub.position.y = params.cartridgeDepth / 2;
    group.add(placement_stub);

    // Set origin to the center of the flange, X-axis = shaft axis
    group.rotation.z = Math.PI / 2;

    return group;
}

// --- Export as JSON (since GLTF export has issues in Node.js) ---
const highPolyModel = createMechanicalSealCartridge(false);
const lowPolyModel = createMechanicalSealCartridge(true);

// Serialize to JSON
const highPolyJSON = {
    name: 'MechanicalSealCartridge',
    children: highPolyModel.children.map(child => ({
        name: child.name,
        geometry: {
            type: child.geometry.type,
            parameters: child.geometry.parameters
        },
        material: {
            name: child.material.name,
            color: child.material.color ? child.material.color.getHex() : null,
            metalness: child.material.metalness,
            roughness: child.material.roughness
        },
        position: child.position.toArray(),
        rotation: child.rotation.toArray(),
        scale: child.scale.toArray()
    })),
    position: highPolyModel.position.toArray(),
    rotation: highPolyModel.rotation.toArray(),
    scale: highPolyModel.scale.toArray()
};

const lowPolyJSON = {
    name: 'MechanicalSealCartridge_LOD',
    children: lowPolyModel.children.map(child => ({
        name: child.name,
        geometry: {
            type: child.geometry.type,
            parameters: child.geometry.parameters
        },
        material: {
            name: child.material.name,
            color: child.material.color ? child.material.color.getHex() : null,
            metalness: child.material.metalness,
            roughness: child.material.roughness
        },
        position: child.position.toArray(),
        rotation: child.rotation.toArray(),
        scale: child.scale.toArray()
    })),
    position: lowPolyModel.position.toArray(),
    rotation: lowPolyModel.rotation.toArray(),
    scale: lowPolyModel.scale.toArray()
};

fs.writeFileSync('public/mechanical_seal_cartridge.json', JSON.stringify(highPolyJSON, null, 2));
console.log('High-poly model exported to public/mechanical_seal_cartridge.json');

fs.writeFileSync('public/mechanical_seal_cartridge_LOD.json', JSON.stringify(lowPolyJSON, null, 2));
console.log('Low-poly model exported to public/mechanical_seal_cartridge_LOD.json');

// --- Metadata ---
const metadata = {
    dimensions: {
        flangeOD: params.flangeOD,
        flangeThickness: params.flangeThickness,
        cartridgeDepth: params.cartridgeDepth,
        boreID: params.boreID,
    },
    boltPattern: {
        bcd: params.bcd,
        holes: params.boltHoles,
        holeDia: params.boltHoleDia,
    },
    recommendedShaftDiameter: params.shaftDia,
    materials: {
        cartridge_body: 'ss316',
        seal_faces: ['ceramic', 'carbon'],
        springs_fasteners: 'steel',
        o_rings: 'elastomer',
    }
};

fs.writeFileSync('public/mechanical_seal_cartridge_meta.json', JSON.stringify(metadata, null, 2));
console.log('Metadata exported to public/mechanical_seal_cartridge_meta.json');
