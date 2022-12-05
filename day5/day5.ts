import { readFileSync } from 'fs';

const day5 = () => {
  const input = readFileSync('day5/day5-input', 'utf8');
  const inputParts = input.split('\n\n');

  const crateLines = inputParts[0].split('\n');
  crateLines.pop();
  const c: string[][] = [];
  crateLines.reverse().map((line) =>
    line.split('').forEach((char, index) => {
      if (index % 4 === 1) {
        c[index] ? c[index].push(char) : (c[index] = [char]);
      }
    }),
  );

  /** Part 1 */
  const crates = c
    .map((crate) => crate.filter((c) => c !== ' '))
    .filter(Boolean);
  inputParts[1]
    .split('\n')
    .map((line) =>
      line
        .replace(/[^0-9.]/g, ' ')
        .split(' ')
        .filter(Boolean),
    )
    .map((move) => {
      const amount = parseInt(move[0]);
      const from = parseInt(move[1]) - 1;
      const to = parseInt(move[2]) - 1;
      for (let i = 0; i < amount; i++) {
        const target = crates[from].pop();
        crates[to].push(target as string);
      }
    });
  console.log(
    'Part 1: ',
    crates.reduce((acc, crate) => acc + crate.pop(), ''),
  );

  /** Part 2 */
  const crates2 = c
    .map((crate) => crate.filter((c) => c !== ' '))
    .filter(Boolean);
  inputParts[1]
    .split('\n')
    .map((line) =>
      line
        .replace(/[^0-9.]/g, ' ')
        .split(' ')
        .filter(Boolean),
    )
    .map((move) => {
      const amount = parseInt(move[0]);
      const from = parseInt(move[1]) - 1;
      const to = parseInt(move[2]) - 1;
      const target: string[] = [];
      for (let i = 0; i < amount; i++) {
        target.push(crates2[from].pop() as string);
      }
      target.reverse().forEach((t) => crates2[to].push(t));
    });

  console.log(
    'Part 2: ',
    crates2.reduce((acc, crate) => acc + crate.pop(), ''),
  );
};
day5();
