import { readFileSync } from 'fs';
import { range } from 'lodash';

type Item = number | any[];
const ensureArray = (a: Item) => (Array.isArray(a) ? a : [a]);

const compare = (a: Item, b: Item): number => {
  if (a === null || a === undefined) return -1;
  else if (b === null || b === undefined) return 1;
  else if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  a = ensureArray(a);
  b = ensureArray(b);

  return range(Math.max(a.length, b.length)).reduce(
    (acc, _, i) =>
      acc !== 0 ? acc : compare((a as any[])[i], (b as any[])[i]),
    0,
  );
};

const day13 = () => {
  const input: any[] = readFileSync('day13/day13-input', 'utf8')
    .split('\n\n')
    .map((group) =>
      group.split('\n').map((arrString) => JSON.parse(arrString)),
    );

  console.log(
    'Part 1: ',
    input.reduce(
      (sum, pair, i) => sum + (compare(pair[0], pair[1]) < 0 ? i + 1 : 0),
      0,
    ),
  );

  const decoders = [[[2]], [[6]]];
  const sorted = input.flat().concat(decoders).sort(compare);
  console.log(
    'Part 2: ',
    (sorted.indexOf(decoders[0]) + 1) * (sorted.indexOf(decoders[1]) + 1),
  );
};

day13();
