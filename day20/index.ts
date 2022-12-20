import { readFileSync } from 'fs';

interface Node {
  value: number;
}

const mix = (input: Node[], times = 1) => {
  const mixed = [...input];
  for (let i = 0; i < times; i++) {
    for (const number of input) {
      const mixedIndex = mixed.indexOf(number);
      mixed.splice(mixedIndex, 1);
      const newIndex = (mixedIndex + number.value) % mixed.length;
      mixed.splice(newIndex, 0, number);
    }
  }
  return mixed;
};

const getCoordinates = (mixed: Node[]) => {
  const theZeroIndex = mixed.findIndex(({ value }) => value === 0);
  return (
    mixed[(theZeroIndex + 1000) % mixed.length].value +
    mixed[(theZeroIndex + 2000) % mixed.length].value +
    mixed[(theZeroIndex + 3000) % mixed.length].value
  ).toString();
};

const part1 = () => {
  const input = readFileSync('day20/input', 'utf-8')
    .split('\n')
    .map((num) => {
      return { value: parseInt(num) };
    });
  const mixed = mix(input, 1);
  console.log(getCoordinates(mixed));
};

part1();

const part2 = () => {
  const input = readFileSync('day20/input', 'utf-8')
    .split('\n')
    .map((num) => {
      return { value: parseInt(num) * 811589153 };
    });
  const mixed = mix(input, 10);
  console.log(getCoordinates(mixed));
  // Lol that was easy
};

part2();
