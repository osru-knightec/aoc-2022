import { readFileSync } from 'fs';
import { range } from 'lodash';

const promiseTimeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface Coordinates {
  x: number;
  y: number;
}
enum Status {
  Empty = 0,
  Rock = 1,
  Sand = 2,
}
type Graph = Status[][];

const solve = async (part2 = false) => {
  const input: any[] = readFileSync('day14/day14-input', 'utf8')
    .split('\n')
    .map((line) =>
      line.split(' -> ').map((item) => {
        const x = parseInt(item.split(',')[0]);
        const y = parseInt(item.split(',')[1]);
        // x > bounds.right ? (bounds.right = x + 1) : null;
        // x < bounds.left ? (bounds.left = x - 1) : null;
        // y > bounds.down ? (bounds.down = y + 2) : null;
        return { x, y };
      }),
    );
  const maxY =
    Math.max(...input.flat().map((path) => path.y)) +
    (part2 as unknown as number) * 2;
  const maxX = Math.max(...input.flat().map((path) => path.x));
  const minX = Math.min(...input.flat().map((path) => path.x));

  const bounds: { left: number; right: number; up: number; down: number } = {
    left: minX,
    right: maxX + 1,
    up: 0,
    down: maxY + 1,
  };

  if (part2) {
    bounds.left = 500 - maxY - 1;
    bounds.right = 500 + maxY + 1;
  }
  const source = { x: 500 - bounds.left, y: 0 - bounds.up };

  const currentSand = Object.assign({}, source);

  const calculateGraph = (rocks: Coordinates[]): Status[][] => {
    const graph = range(bounds.up, bounds.down).map((rowId) => {
      return range(bounds.left, bounds.right).map((colId) => {
        const found =
          rocks.filter(
            (rock: Coordinates) => rock.x === colId && rock.y === rowId,
          ).length > 0;
        return found ? Status.Rock : Status.Empty;
      });
    });
    if (part2) {
      // Push a row of Stones in bottom
      graph.pop();
    }
    graph.push(range(bounds.left, bounds.right).map(() => Status.Rock));
    return graph;
  };

  const printGraph = (graph: Graph) => {
    const stringGraph = graph
      .map((row, rowId) => {
        return row
          .map((col, colId) =>
            col === Status.Sand
              ? colId === currentSand.x && rowId === currentSand.y
                ? '+'
                : 'o'
              : col === Status.Rock
              ? '#'
              : '.',
          )
          .join('');
      })
      .join('\n');
    process.stdout.write('\033c');
    console.log(stringGraph);
  };

  const rocks: Coordinates[] = input.reduce((acc, path) => {
    const p = path.reduce(
      (acc: Coordinates[], point: Coordinates, i: number) => {
        if (i === 0) {
          return acc;
        }
        const prevPoint = path[i - 1];
        const maxX = Math.max(prevPoint.x, point.x);
        const minX = Math.min(prevPoint.x, point.x);
        const maxY = Math.max(prevPoint.y, point.y);
        const minY = Math.min(prevPoint.y, point.y);

        const xRange = range(minX, maxX + 1);
        const yRange = range(minY, maxY + 1);

        const points =
          prevPoint.y === point.y
            ? xRange.map((x) => ({ x, y: prevPoint.y })).flat()
            : yRange.map((y) => ({ x: prevPoint.x, y })).flat();

        return [...acc, ...points];
      },
      [] as Coordinates[],
    );
    return [...acc, ...p];
  }, [] as Coordinates[]);

  const graph = calculateGraph(rocks);
  printGraph(graph);

  while (
    currentSand.x > 0 &&
    currentSand.x < bounds.right - bounds.left &&
    currentSand.y + 1 !== bounds.down
  ) {
    graph[currentSand.y][currentSand.x] = Status.Empty;
    // Down
    if (!graph[currentSand.y + 1][currentSand.x]) {
      currentSand.y++;
    } else if (
      // Down Left
      !graph[currentSand.y + 1][currentSand.x - 1]
    ) {
      currentSand.x--;
      currentSand.y++;
    } else if (
      // Down Right
      !graph[currentSand.y + 1][currentSand.x + 1]
    ) {
      currentSand.y++;
      currentSand.x++;
    } else {
      // Can move no more, return to source
      graph[currentSand.y][currentSand.x] = Status.Sand;
      printGraph(graph);
      await promiseTimeout(10);
      if (currentSand.x === source.x && currentSand.y === source.y) {
        break;
      }
      currentSand.x = source.x;
      currentSand.y = source.y;
      continue;
    }
    graph[currentSand.y][currentSand.x] = Status.Sand;
    //printGraph(graph);
  }
  return (
    graph.reduce(
      (acc, row) => acc + row.filter((col) => col === Status.Sand).length,
      -1,
    ) + (part2 as unknown as number)
  );
};

const day14 = async () => {
  console.log('Part 1: ', await solve());
  console.log('Part 2: ', await solve(true));
};
day14();
