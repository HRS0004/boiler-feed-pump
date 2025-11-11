const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const { Scene, Group, Mesh, MeshStandardMaterial, BoxGeometry, CylinderGeometry } = require('three');
const fs = require('fs');

// Create scene
const scene = new Scene();

// Dimensions (scaled, e.g., 1 unit = 10mm)
const length = 3.0; // 30mm along X-axis
const width = 0.8; // 8mm along Z-axis
const height = 0.5; // 5mm along Y-axis
const chamfer = 0.03; // ~0.3mm chamfer

// Material: Hardened stainless steel or alloy steel (AISI 4140), brushed or matte metallic gray
const material = new MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.4 });

// Create group for impeller key
const keyGroup = new Group();
keyGroup.name = 'impeller_key_body';

// Main rectangular key body
const keyGeometry = new BoxGeometry(length, height, width);
const keyMesh = new Mesh(keyGeometry, material);
keyMesh.name = 'impeller_key_body';
keyGroup.add(keyMesh);

// Alignment reference marks (small notches on top)
const alignmentGroup = new Group();
alignmentGroup.name = 'alignment_slot';
const notchGeometry = new BoxGeometry(0.1, 0.02, width * 0.8);
const notch1 = new Mesh(notchGeometry, material);
notch1.position.set(length / 4, height / 2 + 0.01, 0);
alignmentGroup.add(notch1);
const notch2 = new Mesh(notchGeometry, material);
notch2.position.set(-length / 4, height / 2 + 0.01, 0);
alignmentGroup.add(notch2);
keyGroup.add(alignmentGroup);

// Small retaining groove for set screw demonstration
const grooveGeometry = new BoxGeometry(length * 0.8, 0.05, width * 0.9);
const groove = new Mesh(grooveGeometry, material);
groove.position.set(0, height / 2 - 0.05, 0);
groove.name = 'retaining_groove';
keyGroup.add(groove);

// Reference axis (invisible helper)
const axisGeometry = new CylinderGeometry(0.01, 0.01, length);
const axis = new Mesh(axisGeometry, material);
axis.visible = false;
axis.name = 'reference_axis';
keyGroup.add(axis);

scene.add(keyGroup);

// Export to GLTF (JSON format for Node.js compatibility)
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (result) => {
    const gltf = JSON.stringify(result, null, 2);
    fs.writeFileSync('public/ImpellerKeyModel.gltf', gltf);
    console.log('Model exported to public/ImpellerKeyModel.gltf');
  },
  { binary: false }
);
