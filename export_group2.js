const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const THREE = require('three');
const fs = require('fs');

// Import component creation functions (simulate by creating meshes directly)
function createPumpShaft() {
  const shaftMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
  const points = [
    new THREE.Vector2(0, -200), new THREE.Vector2(22.5, -200), new THREE.Vector2(22.5, -190), new THREE.Vector2(22.5, -70),
    new THREE.Vector2(22.5, -68), new THREE.Vector2(27.5, -68), new THREE.Vector2(27.5, -66), new THREE.Vector2(27.5, 54),
    new THREE.Vector2(27.5, 56), new THREE.Vector2(30, 56), new THREE.Vector2(30, 58), new THREE.Vector2(30, 98),
    new THREE.Vector2(30, 100), new THREE.Vector2(26, 100), new THREE.Vector2(26, 102), new THREE.Vector2(26, 172),
    new THREE.Vector2(26, 174), new THREE.Vector2(40, 174), new THREE.Vector2(40, 176), new THREE.Vector2(40, 226),
    new THREE.Vector2(40, 228), new THREE.Vector2(25, 228), new THREE.Vector2(25, 230), new THREE.Vector2(25, 330),
    new THREE.Vector2(25, 332), new THREE.Vector2(20, 332), new THREE.Vector2(20, 334), new THREE.Vector2(20, 390),
    new THREE.Vector2(19, 392), new THREE.Vector2(0, 392),
  ];
  const latheGeometry = new THREE.LatheGeometry(points, 64);
  const shaft = new THREE.Mesh(latheGeometry, shaftMaterial);
  shaft.name = 'Shaft';
  shaft.rotation.z = Math.PI / 2;
  shaft.scale.set(0.167, 1.673, 0.167);
  return shaft;
}

function createImpellerKey(index) {
  const material = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.4 });
  const geometry = new THREE.BoxGeometry(3, 0.5, 0.8);
  const key = new THREE.Mesh(geometry, material);
  key.name = `Key_${index}`;
  return key;
}

function createShaftSleeveSeal(index) {
  const material = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
  const shape = new THREE.Shape();
  shape.moveTo(2.5, 0); shape.lineTo(2.9, 0); shape.lineTo(3, 0.1); shape.lineTo(3, 6.9); shape.lineTo(2.9, 6.9); shape.lineTo(2.5, 6.9); shape.lineTo(2.5, 7); shape.lineTo(2.5, 0.1); shape.lineTo(2.5, 0.1); shape.lineTo(2.5, 0);
  const geometry = new THREE.LatheGeometry(shape.getPoints(16), 64);
  const sleeve = new THREE.Mesh(geometry, material);
  sleeve.name = `Sleeve_Seal_${index}`;
  sleeve.rotation.z = Math.PI / 2;
  return sleeve;
}

function createImpeller1stStage() {
  const material = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 4, 32), material);
  hub.name = 'Impeller_1stStage_Hub';
  const blades = [];
  for (let i = 0; i < 3; i++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.5, 8, 0.5), material);
    blade.position.set(Math.cos((i / 3) * Math.PI * 2) * 4, Math.sin((i / 3) * Math.PI * 2) * 4, 0);
    blade.rotation.z = (i / 3) * Math.PI * 2;
    blade.name = `Impeller_1stStage_Blade_${i + 1}`;
    blades.push(blade);
  }
  const group = new THREE.Group();
  group.name = 'Impeller_1stStage';
  group.add(hub, ...blades);
  return group;
}

function createImpellerNStage(stage) {
  const material = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 4, 32), material);
  hub.name = `Impeller_NStage_${stage}_Hub`;
  const blades = [];
  for (let i = 0; i < 3; i++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.5, 8, 0.5), material);
    blade.position.set(Math.cos((i / 3) * Math.PI * 2) * 4, Math.sin((i / 3) * Math.PI * 2) * 4, 0);
    blade.rotation.z = (i / 3) * Math.PI * 2;
    blade.name = `Impeller_NStage_${stage}_Blade_${i + 1}`;
    blades.push(blade);
  }
  const group = new THREE.Group();
  group.name = `Impeller_NStage_${stage}`;
  group.add(hub, ...blades);
  return group;
}

function createSuctionGuide() {
  const material = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.5, roughness: 0.5 });
  const shape = new THREE.Shape();
  shape.moveTo(3, 0); shape.lineTo(5, 0); shape.lineTo(5, 5); shape.lineTo(3, 5); shape.lineTo(3, 0);
  const geometry = new THREE.LatheGeometry(shape.getPoints(16), 64);
  const guide = new THREE.Mesh(geometry, material);
  guide.name = 'SuctionGuide';
  guide.rotation.z = Math.PI / 2;
  return guide;
}

function createDiffuser(stage) {
  const material = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.5, roughness: 0.5 });
  const shape = new THREE.Shape();
  shape.moveTo(4, 0); shape.lineTo(6, 0); shape.lineTo(6, 3); shape.lineTo(4, 3); shape.lineTo(4, 0);
  const geometry = new THREE.LatheGeometry(shape.getPoints(16), 64);
  const ring = new THREE.Mesh(geometry, material);
  ring.name = `Diffuser_${stage}_Ring`;
  ring.rotation.z = Math.PI / 2;
  const vanes = [];
  for (let i = 0; i < 6; i++) {
    const vane = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3, 0.2), material);
    vane.position.set(Math.cos((i / 6) * Math.PI * 2) * 5, Math.sin((i / 6) * Math.PI * 2) * 5, 0);
    vane.rotation.z = (i / 6) * Math.PI * 2;
    vane.name = `Diffuser_${stage}_Vane_${i + 1}`;
    vanes.push(vane);
  }
  const group = new THREE.Group();
  group.name = `Diffuser_${stage}`;
  group.add(ring, ...vanes);
  return group;
}

function createStageCasing(stage) {
  const material = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.5, roughness: 0.5 });
  const shape = new THREE.Shape();
  shape.moveTo(6, 0); shape.lineTo(7, 0); shape.lineTo(7, 4); shape.lineTo(6, 4); shape.lineTo(6, 0);
  const geometry = new THREE.LatheGeometry(shape.getPoints(16), 64);
  const ring = new THREE.Mesh(geometry, material);
  ring.name = `StageCasing_${stage}_Ring`;
  ring.rotation.z = Math.PI / 2;
  const holes = [];
  for (let i = 0; i < 8; i++) {
    const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 16), material);
    hole.position.set(Math.cos((i / 8) * Math.PI * 2) * 6.5, Math.sin((i / 8) * Math.PI * 2) * 6.5, 0);
    hole.name = `StageCasing_${stage}_BoltHole_${i + 1}`;
    holes.push(hole);
  }
  const group = new THREE.Group();
  group.name = `StageCasing_${stage}`;
  group.add(ring, ...holes);
  return group;
}

function createWearRingImpeller(index) {
  const material = new THREE.MeshStandardMaterial({ color: 0x8B4513, metalness: 0.8, roughness: 0.3 });
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.1, 1, 32), material);
  ring.name = `IRing_${index}`;
  return ring;
}

function createWearRingCasing(index) {
  const material = new THREE.MeshStandardMaterial({ color: 0x8B4513, metalness: 0.8, roughness: 0.3 });
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(6.1, 6.1, 1, 32), material);
  ring.name = `CRing_${index}`;
  return ring;
}

function createShaftSleeveInterstage(index) {
  const material = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
  const shape = new THREE.Shape();
  shape.moveTo(2.5, 0); shape.lineTo(2.9, 0); shape.lineTo(3, 0.1); shape.lineTo(3, 6.9); shape.lineTo(2.9, 6.9); shape.lineTo(2.5, 6.9); shape.lineTo(2.5, 7); shape.lineTo(2.5, 0.1); shape.lineTo(2.5, 0.1); shape.lineTo(2.5, 0);
  const geometry = new THREE.LatheGeometry(shape.getPoints(16), 64);
  const sleeve = new THREE.Mesh(geometry, material);
  sleeve.name = `Sleeve_IS_${index}`;
  sleeve.rotation.z = Math.PI / 2;
  return sleeve;
}

// Create scene
const scene = new THREE.Scene();

// Spacing: 150mm = 15 units (1 unit = 10mm)
const spacing = 15;

// Positions along X-axis
const positions = [
  { component: 'PumpShaft', x: 0, create: createPumpShaft },
  { component: 'Key_1', x: spacing * 1, create: () => createImpellerKey(1) },
  { component: 'Sleeve_Seal_1', x: spacing * 2, create: () => createShaftSleeveSeal(1) },
  { component: 'Impeller_1stStage', x: spacing * 3, create: createImpeller1stStage },
  { component: 'IRing_1', x: spacing * 4, create: () => createWearRingImpeller(1) },
  { component: 'CRing_1', x: spacing * 5, create: () => createWearRingCasing(1) },
  { component: 'SuctionGuide', x: spacing * 6, create: createSuctionGuide },
  { component: 'Diffuser_1', x: spacing * 7, create: () => createDiffuser(1) },
  { component: 'Key_2', x: spacing * 9, create: () => createImpellerKey(2) },
  { component: 'Sleeve_IS_1', x: spacing * 10, create: () => createShaftSleeveInterstage(1) },
  { component: 'Impeller_NStage_1', x: spacing * 11, create: () => createImpellerNStage(1) },
  { component: 'IRing_2', x: spacing * 12, create: () => createWearRingImpeller(2) },
  { component: 'CRing_2', x: spacing * 13, create: () => createWearRingCasing(2) },
  { component: 'Diffuser_2', x: spacing * 14, create: () => createDiffuser(2) },
  { component: 'Key_3', x: spacing * 16, create: () => createImpellerKey(3) },
  { component: 'Sleeve_IS_2', x: spacing * 17, create: () => createShaftSleeveInterstage(2) },
  { component: 'Impeller_NStage_2', x: spacing * 18, create: () => createImpellerNStage(2) },
  { component: 'IRing_3', x: spacing * 19, create: () => createWearRingImpeller(3) },
  { component: 'CRing_3', x: spacing * 20, create: () => createWearRingCasing(3) },
  { component: 'Diffuser_3', x: spacing * 21, create: () => createDiffuser(3) },
  { component: 'Key_4', x: spacing * 23, create: () => createImpellerKey(4) },
  { component: 'Sleeve_IS_3', x: spacing * 24, create: () => createShaftSleeveInterstage(3) },
  { component: 'Impeller_NStage_3', x: spacing * 25, create: () => createImpellerNStage(3) },
  { component: 'IRing_4', x: spacing * 26, create: () => createWearRingImpeller(4) },
  { component: 'CRing_4', x: spacing * 27, create: () => createWearRingCasing(4) },
  { component: 'Diffuser_4', x: spacing * 28, create: () => createDiffuser(4) },
  { component: 'Key_5', x: spacing * 30, create: () => createImpellerKey(5) },
  { component: 'Sleeve_IS_4', x: spacing * 31, create: () => createShaftSleeveInterstage(4) },
  { component: 'Impeller_NStage_4', x: spacing * 32, create: () => createImpellerNStage(4) },
  { component: 'IRing_5', x: spacing * 33, create: () => createWearRingImpeller(5) },
  { component: 'CRing_5', x: spacing * 34, create: () => createWearRingCasing(5) },
  { component: 'Diffuser_5', x: spacing * 35, create: () => createDiffuser(5) },
  { component: 'Key_6', x: spacing * 37, create: () => createImpellerKey(6) },
  { component: 'Sleeve_IS_5', x: spacing * 38, create: () => createShaftSleeveInterstage(5) },
  { component: 'Impeller_NStage_5', x: spacing * 39, create: () => createImpellerNStage(5) },
  { component: 'IRing_6', x: spacing * 40, create: () => createWearRingImpeller(6) },
  { component: 'CRing_6', x: spacing * 41, create: () => createWearRingCasing(6) },
  { component: 'Diffuser_6', x: spacing * 42, create: () => createDiffuser(6) },
  { component: 'Key_7', x: spacing * 44, create: () => createImpellerKey(7) },
  { component: 'Sleeve_IS_6', x: spacing * 45, create: () => createShaftSleeveInterstage(6) },
  { component: 'Impeller_NStage_6', x: spacing * 46, create: () => createImpellerNStage(6) },
  { component: 'IRing_7', x: spacing * 47, create: () => createWearRingImpeller(7) },
  { component: 'CRing_7', x: spacing * 48, create: () => createWearRingCasing(7) },
  { component: 'Diffuser_7', x: spacing * 49, create: () => createDiffuser(7) },
  { component: 'Key_8', x: spacing * 51, create: () => createImpellerKey(8) },
  { component: 'Sleeve_IS_7', x: spacing * 52, create: () => createShaftSleeveInterstage(7) },
  { component: 'Impeller_NStage_7', x: spacing * 53, create: () => createImpellerNStage(7) },
  { component: 'IRing_8', x: spacing * 54, create: () => createWearRingImpeller(8) },
  { component: 'CRing_8', x: spacing * 55, create: () => createWearRingCasing(8) },
  { component: 'Diffuser_8', x: spacing * 56, create: () => createDiffuser(8) },
  { component: 'IRing_9', x: spacing * 58, create: () => createWearRingImpeller(9) },
  { component: 'IRing_10', x: spacing * 59, create: () => createWearRingImpeller(10) },
  { component: 'IRing_11', x: spacing * 60, create: () => createWearRingImpeller(11) },
  { component: 'IRing_12', x: spacing * 61, create: () => createWearRingImpeller(12) },
  { component: 'IRing_13', x: spacing * 62, create: () => createWearRingImpeller(13) },
  { component: 'IRing_14', x: spacing * 63, create: () => createWearRingImpeller(14) },
  { component: 'IRing_15', x: spacing * 64, create: () => createWearRingImpeller(15) },
  { component: 'IRing_16', x: spacing * 65, create: () => createWearRingImpeller(16) },
  { component: 'Sleeve_Seal_2', x: spacing * 66, create: () => createShaftSleeveSeal(2) },
];

// Add components to scene
positions.forEach(pos => {
  const obj = pos.create();
  obj.position.x = pos.x;
  scene.add(obj);
});

// Merge all meshes into a single mesh
const meshes = [];
scene.traverse((child) => {
  if (child.isMesh) meshes.push(child);
});

const geometries = meshes.map(mesh => {
  mesh.updateMatrixWorld();
  const geometry = mesh.geometry.clone();
  geometry.applyMatrix4(mesh.matrixWorld);
  return geometry;
});

// Manual merge geometries
const mergedGeometry = new THREE.BufferGeometry();
const mergedPositions = [];
const normals = [];
const uvs = [];

geometries.forEach(geometry => {
  const pos = geometry.attributes.position.array;
  const norm = geometry.attributes.normal ? geometry.attributes.normal.array : [];
  const uv = geometry.attributes.uv ? geometry.attributes.uv.array : [];

  mergedPositions.push(...pos);
  normals.push(...norm);
  uvs.push(...uv);
});

mergedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(mergedPositions, 3));
if (normals.length > 0) mergedGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
if (uvs.length > 0) mergedGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

const material = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.5, roughness: 0.5 }); // Default material
const singleMesh = new THREE.Mesh(mergedGeometry, material);
singleMesh.name = 'Group2_InnerCartridge';
singleMesh.scale.set(0.1, 0.1, 0.1); // Scale down to fix size inconsistency

// Clear scene and add single mesh
scene.clear();
scene.add(singleMesh);

// Metadata
const metadata = {
  components: [{ name: 'Group2_InnerCartridge', position: [0, 0, 0], dimensions: 'Merged geometry' }],
  totalMeshes: 1,
  spacing: '150mm (15 units)',
};

// Export to OBJ
const { OBJExporter } = require('three/examples/jsm/exporters/OBJExporter.js');
const exporter = new OBJExporter();
const objData = exporter.parse(scene);
fs.writeFileSync('Group2_InnerCartridge.obj', objData);
console.log('OBJ exported to Group2_InnerCartridge.obj');

// Export metadata
fs.writeFileSync('Group2_InnerCartridge_metadata.json', JSON.stringify(metadata, null, 2));
console.log('Metadata exported to Group2_InnerCartridge_metadata.json');
