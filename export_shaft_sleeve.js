const THREE = require('three');
const fs = require('fs');

// Create scene
const scene = new THREE.Scene();

// Material: Stainless steel SS316, polished central region (approximated with one material for simplicity)
const sleeveMaterial = new THREE.MeshStandardMaterial({
  color: 0xcccccc, // Stainless steel gray
  metalness: 0.9,
  roughness: 0.2,
});

// Geometry: Hollow cylindrical sleeve with chamfers
// OD 60mm (radius 30mm), ID 50mm (radius 25mm), length 70mm, chamfer 1mm on both ends
const shape = new THREE.Shape();
shape.moveTo(26, 0); // Inner bottom chamfer start
shape.lineTo(29, 0); // Outer bottom chamfer start
shape.lineTo(30, 1); // Outer after bottom chamfer
shape.lineTo(30, 69); // Outer before top chamfer
shape.lineTo(29, 69); // Outer top chamfer start
shape.lineTo(26, 69); // Inner top chamfer start
shape.lineTo(25, 70); // Inner after top chamfer
shape.lineTo(25, 1); // Inner before bottom chamfer
shape.lineTo(26, 1); // Inner bottom after chamfer
shape.lineTo(26, 0); // Close shape

const sleeveGeometry = new THREE.LatheGeometry(shape.getPoints(16), 64);

// Create first sleeve at origin
const shaftSleeve1 = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
shaftSleeve1.name = 'ShaftSleeve_1';
shaftSleeve1.rotation.z = Math.PI / 2; // Align axis along X
shaftSleeve1.position.set(0, 0, 0);
scene.add(shaftSleeve1);

// Create second sleeve shifted +120mm along X
const shaftSleeve2 = shaftSleeve1.clone();
shaftSleeve2.name = 'ShaftSleeve_2';
shaftSleeve2.position.set(120, 0, 0);
scene.add(shaftSleeve2);

// Serialize to JSON (similar to other exports)
const json = {
  name: 'ShaftSleeveSealAreaX2',
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

fs.writeFileSync('shaft_sleeve_seal_area_x2.json', JSON.stringify(json, null, 2));
console.log('Model exported to shaft_sleeve_seal_area_x2.json');
