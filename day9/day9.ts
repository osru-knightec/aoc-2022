import { readFileSync } from 'fs';

const day9 = () => {
  console.log('Part 1: ', part1());
  console.log('Part 2: ', part2());
};

const part1 = () => {
  const visited: any = [{ x: 0, y: 4 }];
  const startPos = { x: 0, y: 4 };
  const head = { x: 0, y: 4 },
    tail = { x: 0, y: 4 };
  const input = readFileSync('day9/day9-input', 'utf8');

  input.split('\n').forEach((move) => {
    const [direction, distance] = move.split(' ');
    for (let d = 0; d < parseInt(distance); d++) {
      switch (direction) {
        case 'U':
          head.y++;
          break;
        case 'D':
          head.y--;
          break;
        case 'L':
          head.x--;
          break;
        case 'R':
          head.x++;
          break;
      }
      // If distance between head and tail is greater than 1, move tail
      if (Math.abs(head.x - tail.x) > 1) {
        head.x > tail.x ? tail.x++ : tail.x--;
        head.y !== tail.y ? (head.y > tail.y ? tail.y++ : tail.y--) : null;
      }
      if (Math.abs(head.y - tail.y) > 1) {
        head.y > tail.y ? tail.y++ : tail.y--;
        head.x !== tail.x ? (head.x > tail.x ? tail.x++ : tail.x--) : null;
      }

      if (!visited.find((node: any) => node.x === tail.x && node.y === tail.y))
        visited.push({ x: tail.x, y: tail.y });
    }
  });
  return visited.length;
};

const part2 = () => {
  const visited: any = [{ x: 0, y: 4 }];
  const startPos = { x: 0, y: 4 };
  const head = { x: 0, y: 4 };
  const knots = [
    { x: 0, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 4 },
    { x: 0, y: 4 },
  ];
  const input = readFileSync('day9/day9-input', 'utf8');

  input.split('\n').forEach((move) => {
    const [direction, distance] = move.split(' ');
    for (let d = 0; d < parseInt(distance); d++) {
      switch (direction) {
        case 'U':
          head.y++;
          break;
        case 'D':
          head.y--;
          break;
        case 'L':
          head.x--;
          break;
        case 'R':
          head.x++;
          break;
      }

      let headCopy = head;
      for (let i = 0; i < knots.length; i++) {
        const tail = knots[i];
        // If distance between head and tail is greater than 1, move tail
        if (Math.abs(headCopy.x - tail.x) > 1) {
          headCopy.x > tail.x ? tail.x++ : tail.x--;
          headCopy.y !== tail.y
            ? headCopy.y > tail.y
              ? tail.y++
              : tail.y--
            : null;
        }
        if (Math.abs(headCopy.y - tail.y) > 1) {
          headCopy.y > tail.y ? tail.y++ : tail.y--;
          headCopy.x !== tail.x
            ? headCopy.x > tail.x
              ? tail.x++
              : tail.x--
            : null;
        }

        if (
          i === knots.length - 1 &&
          !visited.find((node: any) => node.x === tail.x && node.y === tail.y)
        )
          visited.push({ x: tail.x, y: tail.y });

        headCopy = tail;
      }
    }
  });
  return visited.length;
};
day9();
