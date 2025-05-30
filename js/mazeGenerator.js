export function generateMaze(width, height) {
  if (width % 2 === 0) width++;
  if (height % 2 === 0) height++;

  const maze = Array.from({ length: height }, (_, z) =>
    Array.from({ length: width }, () => 1)
  );

  const directions = [
    [0, -2], [2, 0], [0, 2], [-2, 0]
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

  // Paverskim išeitį į tuščią plytelę (jei reikės kelis kartus generuoti iš naujo)
  const exitX = width - 2;
  const exitZ = height - 2;

  // Jei išėjimas yra nepasiekiamas (apsuptas sienų) – generuojam iš naujo
  const isSurrounded = () => {
    const neighbors = [
      [0, -1], [1, 0], [0, 1], [-1, 0]
    ];
    return neighbors.every(([dx, dz]) => {
      const nx = exitX + dx;
      const nz = exitZ + dz;
      return maze[nz]?.[nx] === 1;
    });
  };

  // Bandome kelis kartus sugeneruoti tinkamą labirintą
  let attempts = 0;
  while (isSurrounded() && attempts < 10) {
    console.warn("Exit unreachable, regenerating maze...");
    return generateMaze(width, height);
  }

  maze[exitZ][exitX] = 0; // Užtikrinam, kad išėjimas tikrai atviras

  return maze;
}