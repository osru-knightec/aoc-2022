import { readFileSync } from 'fs';

const dummyData = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

const day4 = () => {
  const data = readFileSync('day04/day4-input', 'utf8').trimEnd();

  /** Part 1 */
  const fullOverlaps = data
    .split('\n')
    .map((line) => line.split(','))
    .map((line) => line.map((range) => range.split('-').map(Number)))
    .filter(
      (line) =>
        (line[0][0] < line[1][0]
          ? line[0][1] >= line[1][1]
          : line[0][1] <= line[1][1]) ||
        line[0][0] === line[1][0] ||
        line[0][1] === line[1][1],
    );
  console.log('Part 1: ', fullOverlaps.length);

  /** Part 2 */
  const overlaps = data
    .split('\n')
    .map((line) => line.split(','))
    .map((line) => line.map((range) => range.split('-').map(Number)))
    .filter(
      (line) =>
        (line[0][0] >= line[1][0] && line[0][0] <= line[1][1]) ||
        (line[0][0] <= line[1][0] && line[0][1] >= line[1][0]),
    );
  console.log('Part 2: ', overlaps.length);
};
day4();
