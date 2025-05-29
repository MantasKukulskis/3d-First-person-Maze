import * as THREE from 'three';

export function createMaze(scene) {
  const wallHeight = 3;
  const wallThickness = 0.5;
  const cellSize = 4;

  const loader = new THREE.TextureLoader();
  const wallTexture = loader.load('/assets/textures/wall.jpg');
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(1, 1);

  const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });

  const mazeMap = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ];

  for (let row = 0; row < mazeMap.length; row++) {
    for (let col = 0; col < mazeMap[row].length; col++) {
      if (mazeMap[row][col] === 1) {
        const wallGeometry = new THREE.BoxGeometry(cellSize, wallHeight, wallThickness);
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(col * cellSize, wallHeight / 2, row * cellSize);
        scene.add(wall);
      }
    }
  }
}