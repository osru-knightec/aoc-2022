import { readFileSync } from 'fs';
import { range } from 'lodash';

type Job = number | string[];

const input: { [key: string]: Job } = readFileSync('day21/input', 'utf8')
  .trim()
  .split('\n')
  .reduce((acc, line) => {
    const [monkey, job] = line.split(':').map((i) => i.trim());
    if (job.match(/\d/)) {
      return { ...acc, [monkey]: Number(job) };
    } else {
      return { ...acc, [monkey]: [...job.split(' ')] };
    }
  }, {});

const calculate = (monkey: string): number => {
  const job: Job = input[monkey];
  if (typeof job === 'number') {
    return job;
  }
  const [monkey1, op, monkey2] = job;
  if (op === '+') {
    return calculate(monkey1) + calculate(monkey2);
  }
  if (op === '*') {
    return calculate(monkey1) * calculate(monkey2);
  }
  if (op === '/') {
    return calculate(monkey1) / calculate(monkey2);
  }
  if (op === '-') {
    return calculate(monkey1) - calculate(monkey2);
  }
  throw new Error('Unknown op: ' + op);
  return 0;
};

const part1 = () => {
  console.log(calculate('root'));
};

const part2 = () => {
  input.humn = 1;

  // Manually found the range by starting big with a large step and narrowing it down by 1/1000 a time
  range(3403989691800 - 100, 3403989691800 + 100, 1).some((i) => {
    input.humn = Number(i);
    const calc =
      calculate((input.root as string[])[0]) -
      calculate((input.root as string[])[2]);
    console.log(calc, i);
    if (calc <= 0) {
      console.log('Found:', i);
      return true;
    }
  });
};

part1();
part2();
