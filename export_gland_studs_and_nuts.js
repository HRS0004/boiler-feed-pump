const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const THREE = require('three');
const fs = require('fs');

// Create scene
const scene = new THREE.Scene();

// Scaling: 1 unit = 10mm
// Stud dimensions (approx M16, 150mm length)
const studLength = 15; // 150mm
const studDiameter = 1.6; // 16mm
const threadLength = 3; // 30mm each end
const midLength = studLength - 2 * threadLength; // 90mm plain
const nutHeight = 1.5; // 15mm
const nutAcrossFlats = 2.4; // 24mm (hex)

// Material: Stainless steel
const material = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8, roughness: 0.2 });

// Number of studs: 6 in a circle
const numStuds = 6;
const radius = 8; // 80mm circle

for (let i = 0; i < numStuds; i++) {
  const angle = (i / numStuds) * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  // Stud shaft: cylinder
  const studGeometry = new THREE.CylinderGeometry(studDiameter / 2, studDiameter / 2, studLength, 16);
  const stud = new THREE.Mesh(studGeometry, material);
  stud.position.set(x, 0, z);
  stud.rotation.z = Math.PI / 2; // Align along Y-axis
  scene.add(stud);

  // Nuts: hex cylinders at both ends
  const nutGeometry = new THREE.CylinderGeometry(nutAcrossFlats / 2, nutAcrossFlats / 2, nutHeight, 6);
  const nut1 = new THREE.Mesh(nutGeometry, material);
  nut1.position.set(x, studLength / 2 + nutHeight / 2, z);
  nut1.rotation.z = Math.PI / 2;
  scene.add(nut1);

  const nut2 = new THREE.Mesh(nutGeometry, material);
  nut2.position.set(x, -studLength / 2 - nutHeight / 2, z);
  nut2.rotation.z = Math.PI / 2;
  scene.add(nut2);
}

// Export to GLTF (JSON format, as GLB binary has Node.js compatibility issues)
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (result) => {
    const gltf = JSON.stringify(result, null, 2);
    fs.writeFileSync('public/gland_studs_and_nuts.gltf', gltf);
    console.log('Model exported to public/gland_studs_and_nuts.gltf');
  },
  { binary: false }
);
