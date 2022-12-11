import { readFileSync } from 'fs';

const day6 = () => {
  const input = readFileSync('day06/day6-input', 'utf8');

  /** Part 1 */
  const part1 = input.split('').reduce(
    ({ acc, i }, curr, index) => {
      if (
        index > 4 &&
        !acc.split('').find((c) => acc.lastIndexOf(c) !== acc.indexOf(c))
      ) {
        return { acc, i };
      }
      return {
        acc: index < 4 ? acc + curr : acc.substring(1) + curr,
        i: index + 1,
      };
    },
    { acc: '', i: 0 },
  );

  console.log('Part 1: ', part1);

  /** Part 2 */
  const part2 = input.split('').reduce(
    ({ acc, i }, curr, index) => {
      if (
        index > 14 &&
        !acc.split('').find((c) => acc.lastIndexOf(c) !== acc.indexOf(c))
      ) {
        return { acc, i };
      }
      return {
        acc: index < 14 ? acc + curr : acc.substring(1) + curr,
        i: index + 1,
      };
    },
    { acc: '', i: 0 },
  );
  console.log('Part 2: ', part2);
};

day6();
