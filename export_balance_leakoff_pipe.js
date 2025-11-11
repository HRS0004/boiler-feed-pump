const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');
const THREE = require('three');
const fs = require('fs');

// Create scene
const scene = new THREE.Scene();

// Dimensions (scaled, e.g., 1 unit = 10mm)
const outerRadius = 1; // ~10mm outer radius (OD ~20mm)
const innerRadius = 0.75; // ~7.5mm inner radius (ID ~15mm)
const totalLength = 20; // ~200mm total unfolded length
const bendRadius = 5; // ~50mm bend radius
const flangeThickness = 0.5; // ~5mm flange thickness
const flangeDiameter = 3; // ~30mm flange diameter

// Material: Stainless steel (polished metallic surface)
const material = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.1 });
const innerMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, transparent: true, opacity: 0.1 });
const weldMaterial = new THREE.MeshStandardMaterial({ color: 0xddddaa, metalness: 0.8, roughness: 0.2 });

// Create curved path for the pipe (90° bend)
const path = new THREE.CurvePath();
const straight1 = new THREE.LineCurve3(
  new THREE.Vector3(-totalLength / 2 + bendRadius, 0, 0),
  new THREE.Vector3(0, 0, 0)
);
const arc = new THREE.QuadraticBezierCurve3(
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(bendRadius, bendRadius, 0),
  new THREE.Vector3(bendRadius, bendRadius * 2, 0)
);
const straight2 = new THREE.LineCurve3(
  new THREE.Vector3(bendRadius, bendRadius * 2, 0),
  new THREE.Vector3(totalLength / 2 - bendRadius, bendRadius * 2, 0)
);
path.add(straight1);
path.add(arc);
path.add(straight2);

// Outer tube
const tubeGeometry = new THREE.TubeGeometry(path, 64, outerRadius, 16, false);
const tube = new THREE.Mesh(tubeGeometry, material);
scene.add(tube);

// Inner tube for hollow effect
const innerTubeGeometry = new THREE.TubeGeometry(path, 64, innerRadius, 16, false);
const innerTube = new THREE.Mesh(innerTubeGeometry, innerMaterial);
scene.add(innerTube);

// Flanges at both ends
const flangeGeometry = new THREE.CylinderGeometry(flangeDiameter / 2, flangeDiameter / 2, flangeThickness, 32);
const flange1 = new THREE.Mesh(flangeGeometry, material);
flange1.position.set(-totalLength / 2 + bendRadius, 0, 0);
flange1.rotation.z = Math.PI / 2;
scene.add(flange1);
const flange2 = new THREE.Mesh(flangeGeometry, material);
flange2.position.set(totalLength / 2 - bendRadius, bendRadius * 2, 0);
flange2.rotation.z = Math.PI / 2;
scene.add(flange2);

// Weld beads/fillets
const weldGeometry = new THREE.CylinderGeometry(outerRadius + 0.1, outerRadius + 0.1, 0.2, 16);
const weld1 = new THREE.Mesh(weldGeometry, weldMaterial);
weld1.position.set(-totalLength / 2 + bendRadius, 0, 0);
weld1.rotation.z = Math.PI / 2;
scene.add(weld1);
const weld2 = new THREE.Mesh(weldGeometry, weldMaterial);
weld2.position.set(totalLength / 2 - bendRadius, bendRadius * 2, 0);
weld2.rotation.z = Math.PI / 2;
scene.add(weld2);

// Export to GLTF (JSON format, as GLB binary has Node.js compatibility issues)
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (result) => {
    const gltf = JSON.stringify(result, null, 2);
    fs.writeFileSync('public/balance_leakoff_pipe.gltf', gltf);
    console.log('Model exported to public/balance_leakoff_pipe.gltf');
  },
  { binary: false }
);
