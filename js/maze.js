import * as THREE from 'three';

export function createMaze(scene, mazeLayout, tileSize = 2) {
  const wallTexture = new THREE.TextureLoader().load('/assets/textures/wall.jpg');
  const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });

  mazeLayout.forEach((row, z) => {
    row.forEach((cell, x) => {
      if (cell === 1) {
        const wallGeometry = new THREE.BoxGeometry(tileSize, 4, tileSize);
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(x * tileSize, 2, z * tileSize);
        scene.add(wall);
      }
    });
  });
}