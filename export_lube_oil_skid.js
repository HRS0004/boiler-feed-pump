const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const { Scene, Group, Mesh, MeshStandardMaterial, BoxGeometry, CylinderGeometry } = require('three');
const fs = require('fs');

// Create scene
const scene = new Scene();

// Materials
const frameMaterial = new MeshStandardMaterial({ color: 0x666666, metalness: 0.6, roughness: 0.4 });
const tankMaterial = new MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8, roughness: 0.2 });
const pipeMaterial = new MeshStandardMaterial({ color: 0xa0a0a0, metalness: 0.7, roughness: 0.3 });

// Base Frame
const baseFrame = new Group();
baseFrame.name = 'base_frame';

// Main frame beams
const beam1 = new Mesh(new BoxGeometry(4, 0.2, 0.2), frameMaterial);
beam1.position.set(0, -0.5, 0);
baseFrame.add(beam1);

const beam2 = new Mesh(new BoxGeometry(4, 0.2, 0.2), frameMaterial);
beam2.position.set(0, -0.5, 1);
baseFrame.add(beam2);

const beam3 = new Mesh(new BoxGeometry(4, 0.2, 0.2), frameMaterial);
beam3.position.set(0, -0.5, -1);
baseFrame.add(beam3);

// Cross beams
const cross1 = new Mesh(new BoxGeometry(0.2, 0.2, 2), frameMaterial);
cross1.position.set(1.8, -0.5, 0);
baseFrame.add(cross1);

const cross2 = new Mesh(new BoxGeometry(0.2, 0.2, 2), frameMaterial);
cross2.position.set(-1.8, -0.5, 0);
baseFrame.add(cross2);

// Legs
const leg1 = new Mesh(new CylinderGeometry(0.1, 0.1, 1, 8), frameMaterial);
leg1.position.set(1.8, -1, 0.8);
baseFrame.add(leg1);

const leg2 = new Mesh(new CylinderGeometry(0.1, 0.1, 1, 8), frameMaterial);
leg2.position.set(1.8, -1, -0.8);
baseFrame.add(leg2);

const leg3 = new Mesh(new CylinderGeometry(0.1, 0.1, 1, 8), frameMaterial);
leg3.position.set(-1.8, -1, 0.8);
baseFrame.add(leg3);

const leg4 = new Mesh(new CylinderGeometry(0.1, 0.1, 1, 8), frameMaterial);
leg4.position.set(-1.8, -1, -0.8);
baseFrame.add(leg4);

scene.add(baseFrame);

// Oil Tank
const oilTank = new Group();
oilTank.name = 'oil_tank';
oilTank.position.set(0, 0.5, 0);

const tankBody = new Mesh(new CylinderGeometry(0.8, 0.8, 2, 16), tankMaterial);
oilTank.add(tankBody);

const tankTop = new Mesh(new CylinderGeometry(0.9, 0.9, 0.2, 16), tankMaterial);
tankTop.position.set(0, 1.1, 0);
oilTank.add(tankTop);

const tankBottom = new Mesh(new CylinderGeometry(0.9, 0.9, 0.2, 16), tankMaterial);
tankBottom.position.set(0, -1.1, 0);
oilTank.add(tankBottom);

scene.add(oilTank);

// Pump Main
const pumpMain = new Group();
pumpMain.name = 'pump_main';
pumpMain.position.set(1.5, 0, 0);

const pumpBody = new Mesh(new CylinderGeometry(0.4, 0.4, 1, 16), frameMaterial);
pumpMain.add(pumpBody);

const pumpFlange1 = new Mesh(new CylinderGeometry(0.5, 0.5, 0.2, 16), frameMaterial);
pumpFlange1.position.set(0, -0.6, 0);
pumpMain.add(pumpFlange1);

const pumpFlange2 = new Mesh(new CylinderGeometry(0.5, 0.5, 0.2, 16), frameMaterial);
pumpFlange2.position.set(0, 0.6, 0);
pumpMain.add(pumpFlange2);

const shaft = new Mesh(new CylinderGeometry(0.05, 0.05, 1.2, 8), frameMaterial);
pumpMain.add(shaft);

// Impeller
const impeller = new Group();
const impellerHub = new Mesh(new CylinderGeometry(0.15, 0.15, 0.1, 8), frameMaterial);
impeller.add(impellerHub);

// Blades
for (let i = 0; i < 4; i++) {
  const blade = new Mesh(new BoxGeometry(0.05, 0.4, 0.02), frameMaterial);
  blade.position.set(
    Math.cos((i / 4) * Math.PI * 2) * 0.25,
    Math.sin((i / 4) * Math.PI * 2) * 0.25,
    0
  );
  blade.rotation.z = (i / 4) * Math.PI * 2;
  impeller.add(blade);
}

pumpMain.add(impeller);
scene.add(pumpMain);

// Pipes
const pipes = new Group();
pipes.name = 'pipes';

// Suction pipe
const suctionPipe = new Mesh(new CylinderGeometry(0.1, 0.1, 1.4, 8), pipeMaterial);
suctionPipe.position.set(0.7, 0.3, 0);
suctionPipe.rotation.z = Math.PI / 2;
pipes.add(suctionPipe);

// Discharge pipe
const dischargePipe = new Mesh(new CylinderGeometry(0.1, 0.1, 1, 8), pipeMaterial);
dischargePipe.position.set(2.2, 0.3, 0);
dischargePipe.rotation.z = Math.PI / 2;
pipes.add(dischargePipe);

// Return pipe
const returnPipe = new Mesh(new CylinderGeometry(0.08, 0.08, 1.2, 8), pipeMaterial);
returnPipe.position.set(1.5, 0.8, 0.5);
returnPipe.rotation.x = Math.PI / 4;
pipes.add(returnPipe);

scene.add(pipes);

// Motor mount
const motorMount = new Group();
motorMount.name = 'motor_mount';
motorMount.position.set(-1.5, 0.2, 0);

const mount = new Mesh(new BoxGeometry(0.6, 0.4, 0.6), frameMaterial);
motorMount.add(mount);

scene.add(motorMount);

// Valves
const valves = new Group();
valves.name = 'valves';

const valve1 = new Mesh(new CylinderGeometry(0.12, 0.12, 0.3, 8), pipeMaterial);
valve1.position.set(0.7, 0.6, 0.3);
valves.add(valve1);

const valve2 = new Mesh(new CylinderGeometry(0.12, 0.12, 0.3, 8), pipeMaterial);
valve2.position.set(2.2, 0.6, 0.3);
valves.add(valve2);

scene.add(valves);

// Export to GLTF
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (result) => {
    const gltf = JSON.stringify(result, null, 2);
    fs.writeFileSync('public/lube_oil_skid.gltf', gltf);
    console.log('Model exported to public/lube_oil_skid.gltf');
  },
  { binary: false }
);
