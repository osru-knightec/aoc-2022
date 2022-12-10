import { readFileSync } from 'fs';

const operations = {
  addx: {
    cycles: 2,
  },
};

interface State {
  x: number;
  cycle: number;
  signal: number;
}

interface State2 {
  x: number;
  cycle: number;
  sprite: string;
  crt: string;
}

const addCycle = ({
  x,
  cycle,
  signal,
}: State): { cycle: number; signal: number } => {
  cycle += 1;
  if (cycle === 20 || cycle % 40 === 0) {
    signal += Math.floor(x) * cycle;
  }
  return {
    cycle,
    signal,
  };
};

const day10 = () => {
  const input = readFileSync('day10/day10-input', 'utf8').split('\n');

  const part1 = input.reduce(
    (acc, opp) => {
      const [op, val] = opp.split(' ');
      let cycle = acc.cycle + 1;
      let signal = acc.signal;
      let x = acc.x;

      if (op === 'addx') {
        if (cycle === 20 || (cycle - 20) % 40 === 0) {
          signal += x * cycle;
        }
        x += parseInt(val);

        // Edge case
        if (cycle === 220)
          return {
            x,
            cycle,
            signal,
          };
        cycle += 1;
      }
      if (cycle === 20 || (cycle - 20) % 40 === 0) {
        signal += x * cycle;
      }
      return {
        x,
        cycle,
        signal,
      };
    },
    { x: 1, cycle: 1, signal: 0 } as State,
  );
  console.log('Part 1: ', part1.signal);

  const defaultSprite = '###.....................................';
  const part2 = input.reduce(
    (acc, opp) => {
      const [op, val] = opp.split(' ');
      let cycle = acc.cycle + 1;
      let x = acc.x;
      let sprite = acc.sprite;
      let crt = acc.crt + (sprite.charAt(cycle % 40) === '#' ? '#' : '.');

      if (op === 'addx') {
        if (cycle % 40 === 0) {
          crt += '\n';
        }
        x += parseInt(val);
        sprite = '.'.repeat(40);
        sprite = sprite.substring(0, x - 2) + '###' + sprite.substring(x + 1);

        cycle += 1;
        crt += sprite.charAt(cycle % 40) === '#' ? '#' : '.';
      }
      if (cycle % 40 === 0) {
        crt += '\n';
      }
      return {
        x,
        cycle,
        crt,
        sprite,
      };
    },
    { x: 1, cycle: -1, sprite: defaultSprite, crt: '' } as State2,
  );
  console.log('Part 2:\n', part2.crt);
};

day10();
