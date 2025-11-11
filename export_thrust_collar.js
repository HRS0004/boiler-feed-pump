const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const THREE = require('three');
const fs = require('fs');

// Create scene
const scene = new THREE.Scene();

// Dimensions (scaled, e.g., 1 unit = 10mm)
const outerRadius = 7.5; // ~75mm outer radius (OD ~150mm)
const innerRadius = 3; // ~30mm inner radius (bore ID ~60mm)
const thickness = 1.5; // ~15mm thickness

// Material: Hardened steel or chrome-plated alloy (mirror-polished surface)
const material = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.1 });
const boreMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, transparent: true, opacity: 0.1 });

// Main collar: Solid cylinder with central bore
const collarGeometry = new THREE.CylinderGeometry(outerRadius, outerRadius, thickness, 64);
const collar = new THREE.Mesh(collarGeometry, material);
scene.add(collar);

// Inner bore: Transparent cylinder for hollow effect
const boreGeometry = new THREE.CylinderGeometry(innerRadius, innerRadius, thickness + 0.1, 64);
const bore = new THREE.Mesh(boreGeometry, boreMaterial);
scene.add(bore);

// Two small axial grooves/notches (approximated as small cuts on the outer rim)
const notchGeometry = new THREE.BoxGeometry(0.5, thickness + 0.1, 0.5);
const notch1 = new THREE.Mesh(notchGeometry, boreMaterial);
notch1.position.set(outerRadius - 0.25, 0, 0);
scene.add(notch1);
const notch2 = new THREE.Mesh(notchGeometry, boreMaterial);
notch2.position.set(- (outerRadius - 0.25), 0, 0);
scene.add(notch2);

// Export to GLTF (JSON format, as GLB binary has Node.js compatibility issues)
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (result) => {
    const gltf = JSON.stringify(result, null, 2);
    fs.writeFileSync('public/thrust_collar.gltf', gltf);
    console.log('Model exported to public/thrust_collar.gltf');
  },
  { binary: false }
);
