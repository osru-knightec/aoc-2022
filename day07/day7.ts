import { readFileSync } from 'fs';

const sumSizes = (dir: any) => {
  let sum = dir?.size <= 100000 ? dir?.size : 0;
  console.log(sum, dir?.size);
  for (const key in dir?.dirs) {
    const childSum = sumSizes(dir.dirs[key]);
    console.log(key, childSum <= 100000 ? childSum : 0, sum);
    sum += childSum <= 100000 ? childSum : 0;
  }
  return sum;
};

const day7 = () => {
  const input = readFileSync('day07/day7-input', 'utf8');

  /** Part 1 */
  const sizes: any = { '/': 0 };
  const paths = ['/'];
  const lines = input.split('\n');
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('$ cd')) {
      const dir = line.split(' ')[2];
      if (dir === '..') {
        paths.pop();
      } else {
        paths.push(`${paths.at(-1)}${dir}/`);
      }
    } else if (!line.startsWith('dir') && !line.startsWith('$')) {
      for (const path of paths) {
        sizes[path] = (sizes[path] ?? 0) + +line.split(' ')[0];
      }
    }
  }
  console.log(
    'Part 1: ',
    Object.values(sizes)
      .filter((s: any) => s <= 100000)
      .reduce((a: any, b: any) => a + b),
  );

  /** Part 2 */
  const unused = 70000000 - sizes['/'];
  const needed = 30000000 - unused;
  console.log(
    'Part 2: ',
    Object.entries(sizes).reduce(
      (acc: any, [key, value]: any) => {
        console.log(key, value);
        return value >= needed && value < acc.size
          ? { path: key, size: value }
          : acc;
      },
      { path: '/', size: sizes['/'] } as any,
    ),
  );
};

day7();
