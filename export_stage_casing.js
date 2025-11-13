const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const { Scene, Group, Mesh, MeshStandardMaterial, LatheGeometry, Shape, CylinderGeometry } = require('three');
const fs = require('fs');

// Create scene
const scene = new Scene();

// Dimensions (mm)
const OD = 170;
const ID = 120;
const thickness = 40;
const outerRadius = OD / 2;
const innerRadius = ID / 2;

// Material: Cast steel
const material = new MeshStandardMaterial({
  color: 0x666666, // Cast steel gray
  metalness: 0.5,
  roughness: 0.5,
});

// Geometry: Thick ring with internal features
const shape = new Shape();
shape.moveTo(innerRadius, 0);
shape.lineTo(innerRadius, 5); // Start of locating shoulder
shape.lineTo(innerRadius - 10, 5); // Step in for diffuser seat
shape.lineTo(innerRadius - 10, 15);
shape.quadraticCurveTo(innerRadius - 15, 20, innerRadius - 10, 25); // Smooth curve for flow-cut/scroll
shape.lineTo(innerRadius - 10, 35);
shape.lineTo(innerRadius, 35);
shape.lineTo(innerRadius, thickness);
shape.lineTo(outerRadius, thickness);
shape.lineTo(outerRadius, 0);
shape.lineTo(innerRadius, 0);

const geometry = new LatheGeometry(shape.getPoints(32), 64);

// Create group for stage casing
const casingGroup = new Group();
casingGroup.name = 'StageCasing';

// Main ring
const mainRing = new Mesh(geometry, material);
mainRing.name = 'StageCasing_Ring';
mainRing.rotation.set(0, 0, Math.PI / 2);
casingGroup.add(mainRing);

// Dowel holes: 3 on outer face
for (let i = 0; i < 3; i++) {
  const angle = (i / 3) * Math.PI * 2;
  const dowelHole = new Mesh(new CylinderGeometry(2.5, 2.5, 10, 16), material);
  dowelHole.position.set(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius, thickness / 2);
  dowelHole.rotation.set(Math.PI / 2, 0, angle);
  dowelHole.name = `StageCasing_DowelHole_${i + 1}`;
  casingGroup.add(dowelHole);
}

// Bolt holes with bosses: 4
for (let i = 0; i < 4; i++) {
  const angle = (i / 4) * Math.PI * 2;
  const bossRadius = 7.5; // 15mm diameter
  const holeRadius = 4; // 8mm diameter

  // Boss
  const boss = new Mesh(new CylinderGeometry(bossRadius, bossRadius, 5, 16), material);
  boss.position.set(Math.cos(angle) * (outerRadius - 5), Math.sin(angle) * (outerRadius - 5), thickness / 2);
  boss.rotation.set(Math.PI / 2, 0, angle);
  boss.name = `StageCasing_BoltBoss_${i + 1}`;
  casingGroup.add(boss);

  // Hole
  const hole = new Mesh(new CylinderGeometry(holeRadius, holeRadius, thickness, 16), material);
  hole.position.set(Math.cos(angle) * (outerRadius - 5), Math.sin(angle) * (outerRadius - 5), thickness / 2);
  hole.rotation.set(Math.PI / 2, 0, angle);
  hole.name = `StageCasing_BoltHole_${i + 1}`;
  casingGroup.add(hole);
}

scene.add(casingGroup);

// Export to GLTF (JSON format for Node.js compatibility)
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (result) => {
    const gltf = JSON.stringify(result, null, 2);
    fs.writeFileSync('StageCasing_1.gltf', gltf);
    console.log('Model exported to StageCasing_1.gltf');
  },
  { binary: false }
);
