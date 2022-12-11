import { readFileSync } from 'fs';
const dummyData = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

const day3 = () => {
  const data = readFileSync('day03/day3-input', 'utf8').trimEnd();

  /** Part 1 */
  const part1 = data
    .split('\n')
    .map((line) => [
      line.slice(0, line.length / 2),
      line.slice(line.length / 2),
    ])
    .map(([a, b]) => a.split('').find((i) => b.includes(i)) || 'a')
    .map((i) =>
      i.charCodeAt(0) > 90 ? i.charCodeAt(0) - 96 : i.charCodeAt(0) - 38,
    )
    .reduce((a, b) => a + b, 0);
  console.log('Part 1: ', part1);

  /** Part 2 */
  const part2 = data
    .split('\n')
    .map((line, i, lines) => [line, lines[i + 1], lines[i + 2]])
    .filter((line, index) => index % 3 === 0)
    .map(
      ([a, b, c]) =>
        a.split('').find((i) => b?.includes(i) && c?.includes(i)) || 'a',
    )
    .map((i) =>
      i.charCodeAt(0) > 90 ? i.charCodeAt(0) - 96 : i.charCodeAt(0) - 38,
    )
    .reduce((a, b) => a + b, 0);
  console.log('Part 2: ', part2);
};
day3();
