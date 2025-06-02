import * as THREE from 'three';

const walls = [];
let exitDoor = null;

export function createMaze(scene, mazeLayout, tileSize = 2) {
  const wallTexture = new THREE.TextureLoader().load('/assets/textures/wall.jpg');
  const doorTexture = new THREE.TextureLoader().load('/assets/textures/door.jpg');

  const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });
  const doorMaterial = new THREE.MeshStandardMaterial({ map: doorTexture });

  const height = 4;
  const width = mazeLayout[0].length;
  const depth = mazeLayout.length;

  mazeLayout.forEach((row, z) => {
    row.forEach((cell, x) => {
      const isExit = x === width - 1 && z === depth - 2;

      if (cell === 1) {
        const geometry = new THREE.BoxGeometry(tileSize, height, tileSize);
        const material = isExit ? doorMaterial : wallMaterial;
        const wall = new THREE.Mesh(geometry, material);
        wall.position.set(x * tileSize, height / 2, z * tileSize);
        scene.add(wall);
        walls.push(wall);

        if (isExit) {
          exitDoor = wall;
        }
      }
    });
  });

  console.log('Walls created:', walls.length);
}

export { walls, exitDoor };