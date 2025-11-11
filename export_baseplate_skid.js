const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const { Scene, Group, Mesh, MeshStandardMaterial, BoxGeometry, CylinderGeometry } = require('three');
const fs = require('fs');

// Create scene
const scene = new Scene();

// Materials
const steelMaterial = new MeshStandardMaterial({ color: 0x666666, metalness: 0.7, roughness: 0.3 });
const padMaterial = new MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });

// Frame Structure
const frameStructure = new Group();
frameStructure.name = 'frame_structure';

// Longitudinal base beams (I-beam approximation)
const beam1 = new Mesh(new BoxGeometry(2.5, 0.15, 0.1), steelMaterial);
beam1.position.set(0, -0.1, 0.35);
frameStructure.add(beam1);

const beam2 = new Mesh(new BoxGeometry(2.5, 0.15, 0.1), steelMaterial);
beam2.position.set(0, -0.1, -0.35);
frameStructure.add(beam2);

// Web of I-beam
const web1 = new Mesh(new BoxGeometry(2.5, 0.05, 0.05), steelMaterial);
web1.position.set(0, -0.1, 0.35);
frameStructure.add(web1);

const web2 = new Mesh(new BoxGeometry(2.5, 0.05, 0.05), steelMaterial);
web2.position.set(0, -0.1, -0.35);
frameStructure.add(web2);

scene.add(frameStructure);

// Cross-members
const crossMembers = new Group();
crossMembers.name = 'cross_members';

// Flat bars as cross-members
const cross1 = new Mesh(new BoxGeometry(0.1, 0.1, 0.8), steelMaterial);
cross1.position.set(1.1, -0.05, 0);
crossMembers.add(cross1);

const cross2 = new Mesh(new BoxGeometry(0.1, 0.1, 0.8), steelMaterial);
cross2.position.set(-1.1, -0.05, 0);
crossMembers.add(cross2);

const cross3 = new Mesh(new BoxGeometry(0.1, 0.1, 0.8), steelMaterial);
cross3.position.set(0, -0.05, 0);
crossMembers.add(cross3);

scene.add(crossMembers);

// Mounting Pads
const mountingPads = new Group();
mountingPads.name = 'mounting_pads';

// Pump mounting pad
const pumpPad = new Mesh(new BoxGeometry(0.6, 0.05, 0.4), padMaterial);
pumpPad.position.set(0.8, 0, 0);
mountingPads.add(pumpPad);

// Motor mounting pad
const motorPad = new Mesh(new BoxGeometry(0.6, 0.05, 0.4), padMaterial);
motorPad.position.set(-0.8, 0, 0);
mountingPads.add(motorPad);

scene.add(mountingPads);

// Bolt Holes
const boltHoles = new Group();
boltHoles.name = 'bolt_holes';

// Holes on pump pad
const hole1 = new Mesh(new CylinderGeometry(0.03, 0.03, 0.05, 8), steelMaterial);
hole1.position.set(0.8, 0.025, 0.15);
boltHoles.add(hole1);

const hole2 = new Mesh(new CylinderGeometry(0.03, 0.03, 0.05, 8), steelMaterial);
hole2.position.set(0.8, 0.025, -0.15);
boltHoles.add(hole2);

const hole3 = new Mesh(new CylinderGeometry(0.03, 0.03, 0.05, 8), steelMaterial);
hole3.position.set(0.95, 0.025, 0);
boltHoles.add(hole3);

const hole4 = new Mesh(new CylinderGeometry(0.03, 0.03, 0.05, 8), steelMaterial);
hole4.position.set(0.65, 0.025, 0);
boltHoles.add(hole4);

// Holes on motor pad
const hole5 = new Mesh(new CylinderGeometry(0.03, 0.03, 0.05, 8), steelMaterial);
hole5.position.set(-0.8, 0.025, 0.15);
boltHoles.add(hole5);

const hole6 = new Mesh(new CylinderGeometry(0.03, 0.03, 0.05, 8), steelMaterial);
hole6.position.set(-0.8, 0.025, -0.15);
boltHoles.add(hole6);

const hole7 = new Mesh(new CylinderGeometry(0.03, 0.03, 0.05, 8), steelMaterial);
hole7.position.set(-0.95, 0.025, 0);
boltHoles.add(hole7);

const hole8 = new Mesh(new CylinderGeometry(0.03, 0.03, 0.05, 8), steelMaterial);
hole8.position.set(-0.65, 0.025, 0);
boltHoles.add(hole8);

scene.add(boltHoles);

// Lifting Lugs
const liftingLugs = new Group();
liftingLugs.name = 'lifting_lugs';

// Eye-bolts at corners
const lug1 = new Mesh(new CylinderGeometry(0.05, 0.05, 0.2, 8), steelMaterial);
lug1.position.set(1.2, 0.1, 0.4);
liftingLugs.add(lug1);

const lug2 = new Mesh(new CylinderGeometry(0.05, 0.05, 0.2, 8), steelMaterial);
lug2.position.set(1.2, 0.1, -0.4);
liftingLugs.add(lug2);

const lug3 = new Mesh(new CylinderGeometry(0.05, 0.05, 0.2, 8), steelMaterial);
lug3.position.set(-1.2, 0.1, 0.4);
liftingLugs.add(lug3);

const lug4 = new Mesh(new CylinderGeometry(0.05, 0.05, 0.2, 8), steelMaterial);
lug4.position.set(-1.2, 0.1, -0.4);
liftingLugs.add(lug4);

scene.add(liftingLugs);

// Export to GLTF
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (result) => {
    const gltf = JSON.stringify(result, null, 2);
    fs.writeFileSync('public/baseplate_skid.gltf', gltf);
    console.log('Model exported to public/baseplate_skid.gltf');
  },
  { binary: false }
);
