export function generateMaze(width, height) {
  // Turi būti nelyginiai
  if (width % 2 === 0) width++;
  if (height % 2 === 0) height++;

  const maze = Array.from({ length: height }, (_, z) =>
    Array.from({ length: width }, (_, x) => 1)
  );

  const directions = [
    [0, -2], // north
    [2, 0],  // east
    [0, 2],  // south
    [-2, 0]  // west
  ];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function carve(x, z) {
    maze[z][x] = 0;

    shuffle(directions).forEach(([dx, dz]) => {
      const nx = x + dx;
      const nz = z + dz;

      if (
        nz > 0 && nz < height &&
        nx > 0 && nx < width &&
        maze[nz][nx] === 1
      ) {
        maze[z + dz / 2][x + dx / 2] = 0;
        carve(nx, nz);
      }
    });
  }

  carve(1, 1); // start at (1,1)

  return maze;
}