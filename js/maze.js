import * as THREE from 'three';

const walls = [];
let exitPosition = null;

export function createMaze(scene, mazeLayout, tileSize = 2) {
  const wallTexture = new THREE.TextureLoader().load('/assets/textures/wall.jpg');
  const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });

  const height = 4;

  mazeLayout.forEach((row, z) => {
    row.forEach((cell, x) => {
      // Praleidžiam vieną langelį išėjimui (pvz., apatinėje dešinėje)
      if (x === mazeLayout[0].length - 1 && z === mazeLayout.length - 2) {
        exitPosition = new THREE.Vector3(x * tileSize, 2, z * tileSize);
        return;
      }

      if (cell === 1) {
        const wallGeometry = new THREE.BoxGeometry(tileSize, height, tileSize);
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(x * tileSize, height / 2, z * tileSize);
        scene.add(wall);
        walls.push(wall);
      }
    });
  });

  console.log('Walls created:', walls.length);
}

export { walls, exitPosition };