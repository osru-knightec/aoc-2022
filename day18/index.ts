import { readFileSync } from 'fs';
import { range } from 'lodash';

const input = readFileSync('day18/input', 'utf-8')
  .trim()
  .split('\n')
  .map((row) => row.split(',').map((cord) => parseInt(cord)));

const part1 = (cubes: number[][]) => {
  // Count the sides of each cube
  const sides = cubes.reduce((acc, cube) => {
    const [x, y, z] = cube;
    // Check if there are any cube in any direction
    const neighbours = cubes.filter((c) => {
      const [x2, y2, z2] = c;
      const xDiff = Math.abs(x - x2);
      const yDiff = Math.abs(y - y2);
      const zDiff = Math.abs(z - z2);
      return xDiff + yDiff + zDiff === 1;
    });
    return acc + (6 - neighbours.length);
  }, 0);
  console.log(sides);
};
part1(input);

const part2 = () => {
  const squarePositions = new Set<string>();
  readFileSync('day18/input', 'utf-8')
    .trim()
    .split('\n')
    .map((row) => {
      const [x, y, z] = row.split(',').map((cord) => parseInt(cord));
      squarePositions.add(`${x},${y},${z}`);
    });
  let MIN = Infinity;
  let MAX = -Infinity;

  for (const cube of squarePositions) {
    const [x, y, z] = cube.split(',').map((n) => parseInt(n));
    MIN = Math.min(MIN, x, y, z);
    MAX = Math.max(MAX, x, y, z);
  }

  const visited = new Set();

  let surfaceArea = 0;
  const queue: { x: number; y: number; z: number }[] = [{ x: 0, y: 0, z: 0 }];

  const countAffectedCubes = (x: number, y: number, z: number) => {
    let count = 0;
    if (squarePositions.has(`${x + 1},${y},${z}`)) count++;
    if (squarePositions.has(`${x - 1},${y},${z}`)) count++;
    if (squarePositions.has(`${x},${y + 1},${z}`)) count++;
    if (squarePositions.has(`${x},${y - 1},${z}`)) count++;
    if (squarePositions.has(`${x},${y},${z + 1}`)) count++;
    if (squarePositions.has(`${x},${y},${z - 1}`)) count++;
    return count;
  };

  while (queue.length > 0) {
    const { x, y, z }: any = queue.shift();
    if (visited.has(`${x},${y},${z}`)) continue;
    if (squarePositions.has(`${x},${y},${z}`)) continue;
    if (x < MIN - 1 || y < MIN - 1 || z < MIN - 1) continue;
    if (x > MAX + 1 || y > MAX + 1 || z > MAX + 1) continue;
    visited.add(`${x},${y},${z}`);

    surfaceArea += countAffectedCubes(x, y, z);

    queue.push({ x: x + 1, y, z });
    queue.push({ x: x - 1, y, z });
    queue.push({ x, y: y + 1, z });
    queue.push({ x, y: y - 1, z });
    queue.push({ x, y, z: z + 1 });
    queue.push({ x, y, z: z - 1 });
  }

  console.log(surfaceArea);
};

part2();
