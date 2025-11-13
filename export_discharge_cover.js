
const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const { Scene, Group, Mesh, MeshStandardMaterial, CylinderGeometry, TorusGeometry, RingGeometry, BoxGeometry } = require('three');
const fs = require('fs');

// Create scene
const scene = new Scene();

// Dimensions (mm)
const outerDiameter = 200;
const thickness = 50;
const boltCircleDiameter = 180;
const numBolts = 8;
const boltHoleDiameter = 16;
const shaftDiameter = 40;
const nozzleOD = 88.9; // DN80
const nozzleLength = 100;
const flangeOD = 127;
const flangeThickness = 20;
const numFlangeBolts = 8;
const flangeBoltHoleDiameter = 14;
const flangeBoltCircleDiameter = 110;
const ribThickness = 10;
const numRibs = 6;

// Material: Cast steel
const material = new MeshStandardMaterial({
  color: 0x666666,
  metalness: 0.5,
  roughness: 0.5,
});

// Create group for discharge cover
const dischargeCoverGroup = new Group();
dischargeCoverGroup.name = 'DischargeCover';

// DischargeCoverBody
const bodyGroup = new Group();
bodyGroup.name = 'DischargeCoverBody';
const mainBody = new Mesh(new CylinderGeometry(outerDiameter / 2, outerDiameter / 2, thickness, 64), material);
mainBody.name = 'DischargeCoverBody_Main';
bodyGroup.add(mainBody);
const shaftBore = new Mesh(new CylinderGeometry(shaftDiameter / 2, shaftDiameter / 2, thickness + 1, 32), material);
shaftBore.name = 'DischargeCoverBody_ShaftBore';
bodyGroup.add(shaftBore);
const flowChamber = new Mesh(new TorusGeometry(outerDiameter / 4, outerDiameter / 8, 16, 32, Math.PI), material);
flowChamber.name = 'DischargeCoverBody_FlowChamber';
bodyGroup.add(flowChamber);
dischargeCoverGroup.add(bodyGroup);

// BoltHoles
const boltHolesGroup = new Group();
boltHolesGroup.name = 'BoltHoles';
for (let i = 0; i < numBolts; i++) {
  const angle = (i / numBolts) * Math.PI * 2;
  const x = Math.cos(angle) * (boltCircleDiameter / 2);
  const z = Math.sin(angle) * (boltCircleDiameter / 2);
  const boltHole = new Mesh(new CylinderGeometry(boltHoleDiameter / 2, boltHoleDiameter / 2, thickness + 1, 16), material);
  boltHole.position.set(x, 0, z);
  boltHole.name = `BoltHole_${i + 1}`;
  boltHolesGroup.add(boltHole);
}
dischargeCoverGroup.add(boltHolesGroup);

// DischargeNozzle
const nozzleGroup = new Group();
nozzleGroup.name = 'DischargeNozzle';
const nozzle = new Mesh(new CylinderGeometry(nozzleOD / 2, nozzleOD / 2, nozzleLength, 32), material);
nozzle.position.set(outerDiameter / 2 + nozzleLength / 2, 0, 0);
nozzle.name = 'DischargeNozzle_Pipe';
nozzleGroup.add(nozzle);
dischargeCoverGroup.add(nozzleGroup);

// Flange
const flangeGroup = new Group();
flangeGroup.name = 'Flange';
const flange = new Mesh(new CylinderGeometry(flangeOD / 2, flangeOD / 2, flangeThickness, 32), material);
flange.position.set(outerDiameter / 2 + nozzleLength + flangeThickness / 2, 0, 0);
flange.name = 'Flange_Body';
flangeGroup.add(flange);
for (let i = 0; i < numFlangeBolts; i++) {
  const angle = (i / numFlangeBolts) * Math.PI * 2;
  const x = Math.cos(angle) * (flangeBoltCircleDiameter / 2);
  const z = Math.sin(angle) * (flangeBoltCircleDiameter / 2);
  const flangeBoltHole = new Mesh(new CylinderGeometry(flangeBoltHoleDiameter / 2, flangeBoltHoleDiameter / 2, flangeThickness + 1, 16), material);
  flangeBoltHole.position.set(outerDiameter / 2 + nozzleLength + flangeThickness / 2 + x, 0, z);
  flangeBoltHole.name = `FlangeBoltHole_${i + 1}`;
  flangeGroup.add(flangeBoltHole);
}
dischargeCoverGroup.add(flangeGroup);

// SealingGroove
const sealingGrooveGroup = new Group();
sealingGrooveGroup.name = 'SealingGroove';
const sealingGroove = new Mesh(new RingGeometry(outerDiameter / 2 - 1, outerDiameter / 2, 64), material);
sealingGroove.position.set(0, -thickness / 2 - 0.2, 0);
sealingGroove.name = 'SealingGroove_Ring';
sealingGrooveGroup.add(sealingGroove);
dischargeCoverGroup.add(sealingGrooveGroup);

// ReinforcementRibs
const ribsGroup = new Group();
ribsGroup.name = 'ReinforcementRibs';
for (let i = 0; i < numRibs; i++) {
  const angle = (i / numRibs) * Math.PI * 2;
  const rib = new Mesh(new BoxGeometry(outerDiameter / 2, thickness, ribThickness), material);
  rib.position.set(Math.cos(angle) * (outerDiameter / 4), 0, Math.sin(angle) * (outerDiameter / 4));
  rib.rotation.set(0, angle, 0);
  rib.name = `ReinforcementRib_${i + 1}`;
  ribsGroup.add(rib);
}
dischargeCoverGroup.add(ribsGroup);

scene.add(dischargeCoverGroup);

// Export to GLTF (JSON format for Node.js compatibility)
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (result) => {
    const gltf = JSON.stringify(result, null, 2);
    fs.writeFileSync('DischargeCover.gltf', gltf);
    console.log('Model exported to DischargeCover.gltf');
  },
  { binary: false }
);
