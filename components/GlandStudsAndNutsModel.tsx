'use client';
import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GlandStudsAndNutsModel() {
  const { scene } = useGLTF('/nuts_and_bolts_gltf/scene.gltf');

  useEffect(() => {
    scene.scale.set(1, 1, 1);
    scene.position.set(0, 0, 0);

    // Traverse the scene to set wireframe on all materials
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true,
        });
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    scene.rotation.y += delta * 0.2; // Subtle auto-rotation
  });

  return <primitive object={scene} />;
}
