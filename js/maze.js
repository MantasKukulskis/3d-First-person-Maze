import * as THREE from 'three';

export function createMaze(scene) {
  const wallHeight = 3;
  const wallThickness = 0.5;
  const cellSize = 4;

  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

  // Labirintas 5x5, 1 - siena, 0 - erdvė
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

        // sienas su labirinto struktura 
        

        // Vertikalios sienos
        wall.position.x = col * cellSize;
        wall.position.y = wallHeight / 2;
        wall.position.z = row * cellSize;


        scene.add(wall);
      }
    }
  }
}