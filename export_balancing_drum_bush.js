const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const THREE = require('three');
const fs = require('fs');

// Create scene
const scene = new THREE.Scene();

// Dimensions (scaled, e.g., 1 unit = 10mm)
const outerRadius = 7; // ~70mm outer radius (OD ~140mm)
const innerRadius = 5; // ~50mm inner radius (ID ~100mm)
const length = 8; // ~80mm length

// Material: Bronze (golden-bronze metallic surface)
const material = new THREE.MeshStandardMaterial({ color: 0xcd7f32, metalness: 0.8, roughness: 0.2 });
const boreMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, transparent: true, opacity: 0.1 });
const grooveMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513, metalness: 0.7, roughness: 0.3 });

// Main bush: Hollow cylinder (outer sleeve)
const bushGeometry = new THREE.CylinderGeometry(outerRadius, outerRadius, length, 64);
const bush = new THREE.Mesh(bushGeometry, material);
scene.add(bush);

// Inner bore: Transparent cylinder for hollow effect
const boreGeometry = new THREE.CylinderGeometry(innerRadius, innerRadius, length + 0.1, 64);
const bore = new THREE.Mesh(boreGeometry, boreMaterial);
scene.add(bore);

// Chamfers at both ends
const chamferGeometry = new THREE.CylinderGeometry(outerRadius + 0.1, outerRadius - 0.5, 0.5, 64);
const chamfer1 = new THREE.Mesh(chamferGeometry, material);
chamfer1.position.y = length / 2 - 0.25;
scene.add(chamfer1);
const chamfer2 = new THREE.Mesh(chamferGeometry, material);
chamfer2.position.y = - (length / 2 - 0.25);
chamfer2.rotation.z = Math.PI;
scene.add(chamfer2);

// Grooves/ridges on outer surface
const grooveGeometry = new THREE.TorusGeometry(outerRadius + 0.1, 0.2, 8, 32);
const groove1 = new THREE.Mesh(grooveGeometry, grooveMaterial);
groove1.position.y = length / 4;
scene.add(groove1);
const groove2 = new THREE.Mesh(grooveGeometry, grooveMaterial);
groove2.position.y = - length / 4;
scene.add(groove2);

// Align along X-axis
scene.rotation.z = Math.PI / 2;

// Export to GLTF (JSON format, as GLB binary has Node.js compatibility issues)
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (result) => {
    const gltf = JSON.stringify(result, null, 2);
    fs.writeFileSync('public/balancing_drum_bush.gltf', gltf);
    console.log('Model exported to public/balancing_drum_bush.gltf');
  },
  { binary: false }
);
