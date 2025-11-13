const { OBJExporter } = require('three/examples/jsm/exporters/OBJExporter.js');
const { Scene, Group, Mesh, MeshStandardMaterial, CylinderGeometry, BoxGeometry } = require('three');
const fs = require('fs');

// Create scene
const scene = new Scene();

// Dimensions (scaled for visualization, e.g., 1 unit = 1mm)
const diameter = 250; // 250mm
const length = 300; // 300mm along X-axis
const thickness = 4; // 3-5mm sheet metal, using 4mm
const radius = diameter / 2;

// Ventilation slots: 10mm x 40mm, 50+ slots, arranged in rows, rounded edges, even spacing
const slotWidth = 10;
const slotHeight = 40;
const numRows = 5; // e.g., 5 rows
const slotsPerRow = 10; // 10 slots per row, total 50
const rowSpacing = (length - numRows * slotHeight) / (numRows + 1);
const slotSpacing = (Math.PI * diameter - slotsPerRow * slotWidth) / (slotsPerRow + 1);

// Mounting Brackets: L-shaped, each side, 2-4 bolt holes Ø12mm, spacing 60-80mm
const bracketThickness = 5;
const bracketLength = 50;
const bracketWidth = 30;
const boltRadius = 6; // Ø12mm / 2
const boltSpacing = 70; // 60-80mm, using 70mm

// Joint / Flange: flanges with bolt holes, 6-8 bolts along the length
const flangeThickness = 5;
const flangeWidth = 20;
const numFlangeBolts = 7; // 6-8, using 7
const flangeBoltSpacing = length / (numFlangeBolts + 1);

// Material: Stainless steel (matte finish)
const material = new MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8, roughness: 0.2 });
const boltMaterial = new MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1 });

// Create two halves
const half1Group = new Group();
half1Group.name = 'CouplingGuard_Half1';
const half2Group = new Group();
half2Group.name = 'CouplingGuard_Half2';

// Main Shell: Full cylinder split into two identical halves
const guardGeometry = new CylinderGeometry(radius, radius, length, 32, 1, false, 0, Math.PI);
const guard1 = new Mesh(guardGeometry, material);
const guard2 = new Mesh(guardGeometry, material);
guard2.rotation.y = Math.PI; // Rotate second half to align

// Ventilation slots: Simulate holes with transparent meshes
const slotGeometry = new BoxGeometry(slotWidth, thickness + 0.1, slotHeight);
const slotMaterial = new MeshStandardMaterial({ color: 0x000000, transparent: true, opacity: 0.1 });
for (let row = 0; row < numRows; row++) {
  const yPos = -length / 2 + rowSpacing + (row + 0.5) * slotHeight;
  for (let col = 0; col < slotsPerRow; col++) {
    const angle = (col + 0.5) * slotSpacing / radius;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const slot1 = new Mesh(slotGeometry, slotMaterial);
    slot1.position.set(yPos, x, z);
    slot1.rotation.y = angle;
    half1Group.add(slot1);
    const slot2 = new Mesh(slotGeometry, slotMaterial);
    slot2.position.set(yPos, x, z);
    slot2.rotation.y = angle + Math.PI;
    half2Group.add(slot2);
  }
}

// Mounting Brackets: L-shaped, welded to guard
const bracketGeometry = new BoxGeometry(bracketLength, bracketThickness, bracketWidth);
const bracket1 = new Mesh(bracketGeometry, material);
bracket1.position.set(-length / 2 - bracketLength / 2, radius + bracketThickness / 2, 0);
const bracket2 = new Mesh(bracketGeometry, material);
bracket2.position.set(length / 2 + bracketLength / 2, radius + bracketThickness / 2, 0);
const bracket3 = new Mesh(bracketGeometry, material);
bracket3.position.set(-length / 2 - bracketLength / 2, -radius - bracketThickness / 2, 0);
const bracket4 = new Mesh(bracketGeometry, material);
bracket4.position.set(length / 2 + bracketLength / 2, -radius - bracketThickness / 2, 0);

// Bolt holes on brackets
const boltGeometry = new CylinderGeometry(boltRadius, boltRadius, bracketThickness + 0.1, 16);
const boltPositions = [
  { x: bracket1.position.x, y: bracket1.position.y, z: bracket1.position.z + boltSpacing / 2 },
  { x: bracket1.position.x, y: bracket1.position.y, z: bracket1.position.z - boltSpacing / 2 },
  { x: bracket2.position.x, y: bracket2.position.y, z: bracket2.position.z + boltSpacing / 2 },
  { x: bracket2.position.x, y: bracket2.position.y, z: bracket2.position.z - boltSpacing / 2 },
  { x: bracket3.position.x, y: bracket3.position.y, z: bracket3.position.z + boltSpacing / 2 },
  { x: bracket3.position.x, y: bracket3.position.y, z: bracket3.position.z - boltSpacing / 2 },
  { x: bracket4.position.x, y: bracket4.position.y, z: bracket4.position.z + boltSpacing / 2 },
  { x: bracket4.position.x, y: bracket4.position.y, z: bracket4.position.z - boltSpacing / 2 },
];
boltPositions.forEach(pos => {
  const bolt = new Mesh(boltGeometry, boltMaterial);
  bolt.position.set(pos.x, pos.y, pos.z);
  bolt.rotation.x = Math.PI / 2;
  if (pos.x < 0 || pos.y > 0) {
    half1Group.add(bolt);
  } else {
    half2Group.add(bolt);
  }
});

// Joint Flange: flanges with bolt holes
const flangeGeometry = new BoxGeometry(flangeThickness, diameter, flangeWidth);
const flange1 = new Mesh(flangeGeometry, material);
flange1.position.set(0, 0, radius + flangeWidth / 2);
const flange2 = new Mesh(flangeGeometry, material);
flange2.position.set(0, 0, -radius - flangeWidth / 2);

// Flange bolts
const flangeBoltGeometry = new CylinderGeometry(boltRadius, boltRadius, flangeThickness + 0.1, 16);
for (let i = 0; i < numFlangeBolts; i++) {
  const yPos = -length / 2 + flangeBoltSpacing * (i + 1);
  const bolt1 = new Mesh(flangeBoltGeometry, boltMaterial);
  bolt1.position.set(yPos, 0, flange1.position.z);
  bolt1.rotation.z = Math.PI / 2;
  half1Group.add(bolt1);
  const bolt2 = new Mesh(flangeBoltGeometry, boltMaterial);
  bolt2.position.set(yPos, 0, flange2.position.z);
  bolt2.rotation.z = Math.PI / 2;
  half2Group.add(bolt2);
}

// Add main parts to groups
half1Group.add(guard1);
half1Group.add(bracket1);
half1Group.add(bracket3);
half1Group.add(flange1);

half2Group.add(guard2);
half2Group.add(bracket2);
half2Group.add(bracket4);
half2Group.add(flange2);

// Add groups to scene
scene.add(half1Group);
scene.add(half2Group);

// Export to OBJ
const exporter = new OBJExporter();
const objData = exporter.parse(scene);
fs.writeFileSync('public/coupling_guard.obj', objData);
console.log('Model exported to public/coupling_guard.obj');
