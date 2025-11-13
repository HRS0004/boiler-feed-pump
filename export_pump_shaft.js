const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const THREE = require('three');
const { CSG } = require('three-csg-ts');
const fs = require('fs');

// Create scene
const scene = new THREE.Scene();

// Material: Stainless steel, smooth finish
const shaftMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });

// Scaling: 1 unit = 10mm
// Define shaft profile points (half-profile for LatheGeometry)
const points = [
  // Segment A: Coupling End (leftmost, chamfered)
  new THREE.Vector2(0, -200), // Bottom
  new THREE.Vector2(22.5, -200), // Chamfer start
  new THREE.Vector2(22.5, -190), // Coupling diameter 45mm
  new THREE.Vector2(22.5, -70), // End of coupling

  // Transition to Segment B with fillet (2mm radius)
  new THREE.Vector2(22.5, -68), // Start fillet
  new THREE.Vector2(27.5, -68), // Fillet arc (approx)
  new THREE.Vector2(27.5, -66), // End fillet

  // Segment B: First Step (diameter 55mm)
  new THREE.Vector2(27.5, -66),
  new THREE.Vector2(27.5, 54), // Length 120mm

  // Transition to Segment C with fillet
  new THREE.Vector2(27.5, 56),
  new THREE.Vector2(30, 56),
  new THREE.Vector2(30, 58),

  // Segment C: Impeller Seat (diameter 60mm, mirror-polished)
  new THREE.Vector2(30, 58),
  new THREE.Vector2(30, 98), // Length 40mm

  // Transition to Segment D with fillet
  new THREE.Vector2(30, 100),
  new THREE.Vector2(26, 100),
  new THREE.Vector2(26, 102),

  // Segment D: Seal Sleeve Region (diameter 52mm, very smooth)
  new THREE.Vector2(26, 102),
  new THREE.Vector2(26, 172), // Length 70mm

  // Transition to Segment E with fillet
  new THREE.Vector2(26, 174),
  new THREE.Vector2(40, 174),
  new THREE.Vector2(40, 176),

  // Segment E: Balancing Drum Seat (diameter 80mm, thickest)
  new THREE.Vector2(40, 176),
  new THREE.Vector2(40, 226), // Length 50mm

  // Transition to Segment F with fillet
  new THREE.Vector2(40, 228),
  new THREE.Vector2(25, 228),
  new THREE.Vector2(25, 230),

  // Segment F: Bearing Seat (diameter 50mm)
  new THREE.Vector2(25, 230),
  new THREE.Vector2(25, 330), // Length 100mm

  // Transition to Segment G with fillet
  new THREE.Vector2(25, 332),
  new THREE.Vector2(20, 332),
  new THREE.Vector2(20, 334),

  // Segment G: Tail End (diameter 40mm, chamfered)
  new THREE.Vector2(20, 334),
  new THREE.Vector2(20, 390), // Length 60mm
  new THREE.Vector2(19, 392), // Chamfer
  new THREE.Vector2(0, 392), // Top
];

// Create LatheGeometry for shaft body
const latheGeometry = new THREE.LatheGeometry(points, 64);

// Create keyway cut: BoxGeometry positioned on top of impeller seat (Segment C)
const keywayGeometry = new THREE.BoxGeometry(40, 3, 8); // Length 40mm, depth 3mm, width 8mm
keywayGeometry.translate(0, 78, 0); // Center on impeller seat (Y=78 approx)

// Create meshes for CSG
const shaftMesh = new THREE.Mesh(latheGeometry);
const keywayMesh = new THREE.Mesh(keywayGeometry);

// Perform boolean subtraction: shaft - keyway
const csg = CSG.subtract(shaftMesh, keywayMesh);

// Create final mesh
const shaft = new THREE.Mesh(csg.geometry, shaftMaterial);
shaft.name = 'PumpShaft';
scene.add(shaft);

// Serialize to JSON (similar to mechanical seal cartridge)
const json = {
  name: 'PumpShaft',
  children: scene.children.map(child => ({
    name: child.name,
    geometry: {
      type: child.geometry.type,
      parameters: child.geometry.parameters
    },
    material: {
      color: child.material.color ? child.material.color.getHex() : null,
      metalness: child.material.metalness,
      roughness: child.material.roughness
    },
    position: child.position.toArray(),
    rotation: child.rotation.toArray(),
    scale: child.scale.toArray()
  })),
  position: scene.position.toArray(),
  rotation: scene.rotation.toArray(),
  scale: scene.scale.toArray()
};

fs.writeFileSync('public/pump_shaft.json', JSON.stringify(json, null, 2));
console.log('Model exported to public/pump_shaft.json');
