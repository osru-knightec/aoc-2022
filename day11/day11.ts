import { readFileSync } from 'fs';

interface Monkey {
  items: number[];
  operation: {
    type: '*' | '+';
    number: number | 'OLD';
  };
  test: {
    divBy: number;
    false: number;
    true: number;
  };
  inspects: number;
}

const day11 = () => {
  const inspections: number[] = [];

  const input = readFileSync('day11/day11-input', 'utf8').split('\n');

  const m: Monkey[] = input.reduce((acc, line, index) => {
    if (index % 7 === 1) {
      return [
        ...acc,
        {
          items: line
            .split(':')[1]
            .split(',')
            .map((s) => Number(s.replace(/[^0-9]/g, ''))),
          operation: { type: '+', number: 0 },
          test: { divBy: 0, false: 0, true: 0 },
          inspects: 0,
        },
      ];
    }
    if (index % 7 === 2) {
      const opLine = line.split(':')[1];
      const operation = {
        type: opLine.includes('*') ? ('*' as const) : ('+' as const),
        number: opLine.includes('old * old')
          ? ('OLD' as const)
          : Number(opLine.replace(/[^0-9]/g, '')),
      };
      return [
        ...acc.slice(0, acc.length - 1),
        { ...acc[acc.length - 1], operation },
      ];
    }
    if (index % 7 === 3) {
      const testLine = line.split(':')[1];
      const test = {
        divBy: Number(testLine.replace(/[^0-9]/g, '')),
        false: 0,
        true: 0,
      };
      return [
        ...acc.slice(0, acc.length - 1),
        { ...acc[acc.length - 1], test },
      ];
    }
    if (index % 7 === 4) {
      const testLine = line.split(':')[1];
      const test = {
        divBy: acc[acc.length - 1].test.divBy,
        true: Number(testLine.replace(/[^0-9]/g, '')),
        false: 0,
      };
      return [
        ...acc.slice(0, acc.length - 1),
        { ...acc[acc.length - 1], test },
      ];
    }
    if (index % 7 === 5) {
      const testLine = line.split(':')[1];
      const test = {
        divBy: acc[acc.length - 1].test.divBy,
        true: acc[acc.length - 1].test.true,
        false: Number(testLine.replace(/[^0-9]/g, '')),
      };
      return [
        ...acc.slice(0, acc.length - 1),
        { ...acc[acc.length - 1], test },
      ];
    }
    return acc;
  }, [] as Monkey[]);

  let monkeys: Monkey[] = JSON.parse(JSON.stringify(m)); // Lousy way of cloning
  for (let i = 0; i / monkeys.length < 20; i++) {
    const curr: Monkey = monkeys[i % monkeys.length];

    curr.items.forEach((item) => {
      curr.inspects++;
      if (curr.operation.type === '*') {
        if (curr.operation.number === 'OLD') {
          item = item * item;
        } else {
          item = item * curr.operation.number;
        }
      } else {
        if (curr.operation.number === 'OLD') {
          item = item + item;
        } else {
          item = item + curr.operation.number;
        }
      }
      item = Math.floor(item / 3);

      if (item % curr.test.divBy === 0) {
        monkeys[curr.test.true].items.push(item);
      } else {
        monkeys[curr.test.false].items.push(item);
      }
    });
    curr.items = [];
  }
  console.log(
    'Part 1:',
    monkeys
      .map((m) => m.inspects)
      .sort((a, b) => a - b)
      .splice(-2)
      .reduce((a, b) => a * b),
  );

  /** Part 2 */
  monkeys = m;
  const lcm = monkeys.reduce((acc, curr) => {
    let a = acc;
    let b = curr.test.divBy;
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return (acc * curr.test.divBy) / a;
  }, 1);
  for (let i = 0; i / monkeys.length < 10000; i++) {
    const curr: Monkey = monkeys[i % monkeys.length];

    curr.items.forEach((item) => {
      curr.inspects++;
      if (curr.operation.type === '*') {
        if (curr.operation.number === 'OLD') {
          item = item * item;
        } else {
          item = item * curr.operation.number;
        }
      } else {
        if (curr.operation.number === 'OLD') {
          item = item + item;
        } else {
          item = item + curr.operation.number;
        }
      }

      item %= lcm;

      if (item % curr.test.divBy === 0) {
        monkeys[curr.test.true].items.push(item);
      } else {
        monkeys[curr.test.false].items.push(item);
      }
    });
    curr.items = [];
  }
  console.log(
    'Part 2:',
    monkeys
      .map((m) => m.inspects)
      .sort((a, b) => a - b)
      .splice(-2)
      .reduce((a, b) => a * b),
  );
};

day11();
