const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const { Scene, Mesh, MeshStandardMaterial, CylinderGeometry, BoxGeometry } = require('three');
const fs = require('fs');

// Create scene
const scene = new Scene();

// Dimensions for Coupling Guard (scaled, e.g., 1 unit = 10mm)
const totalLength = 35; // ~350mm along X-axis
const outerDiameter = 20; // ~200mm outer diameter
const innerDiameter = 18; // ~180mm inner diameter
const wallThickness = 1; // ~10mm wall thickness
const bracketWidth = 3; // ~30mm bracket width

// Material: Stainless steel (matte finish)
const material = new MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8, roughness: 0.2 });
const boltMaterial = new MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1 });

// Semi-cylindrical guard (half cylinder)
const guardGeometry = new CylinderGeometry(outerDiameter / 2, outerDiameter / 2, totalLength, 32, 1, false, 0, Math.PI);
const guard = new Mesh(guardGeometry, material);
scene.add(guard);

// Mounting flanges at both ends
const flangeGeometry = new BoxGeometry(bracketWidth, outerDiameter / 2, wallThickness);
const flange1 = new Mesh(flangeGeometry, material);
flange1.position.set(-totalLength / 2 + bracketWidth / 2, 0, 0);
scene.add(flange1);
const flange2 = new Mesh(flangeGeometry, material);
flange2.position.set(totalLength / 2 - bracketWidth / 2, 0, 0);
scene.add(flange2);

// Bolts on flanges (small hex bolts)
const boltGeometry = new CylinderGeometry(0.2, 0.2, 0.5, 6);
for (let i = 0; i < 4; i++) {
  const bolt = new Mesh(boltGeometry, boltMaterial);
  bolt.position.set(
    flange1.position.x,
    (i % 2 === 0 ? outerDiameter / 4 : -outerDiameter / 4),
    (i < 2 ? wallThickness / 2 + 0.25 : -wallThickness / 2 - 0.25)
  );
  scene.add(bolt);
}
for (let i = 0; i < 4; i++) {
  const bolt = new Mesh(boltGeometry, boltMaterial);
  bolt.position.set(
    flange2.position.x,
    (i % 2 === 0 ? outerDiameter / 4 : -outerDiameter / 4),
    (i < 2 ? wallThickness / 2 + 0.25 : -wallThickness / 2 - 0.25)
  );
  scene.add(bolt);
}

// Perforations: Create holes along the surface
const holeRadius = 0.5; // ~5mm holes
const holeGeometry = new CylinderGeometry(holeRadius, holeRadius, wallThickness + 0.1, 16);
const holeMaterial = new MeshStandardMaterial({ color: 0x000000, transparent: true, opacity: 0.1 });
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 5; j++) {
    const hole = new Mesh(holeGeometry, holeMaterial);
    hole.position.set(
      (totalLength / 2 - i * 3.5) - totalLength / 2,
      (outerDiameter / 2 - j * 3) - outerDiameter / 4,
      0
    );
    hole.rotation.z = Math.PI / 2;
    scene.add(hole);
  }
}

// Export to GLTF (JSON format)
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (result) => {
    const gltf = JSON.stringify(result, null, 2);
    fs.writeFileSync('public/coupling_guard.gltf', gltf);
    console.log('Model exported to public/coupling_guard.gltf');
  },
  { binary: false }
);
