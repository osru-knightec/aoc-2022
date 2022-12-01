const dummyData = `
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
`;
import { readFileSync } from 'fs';

const parseInputToArray = (input: string): string[][] => {
  return input
    .trim()
    .split('\n\n')
    .map((calString) => calString.split('\n'));
};

const sumInventory = (inventory: string[][]): number[] => {
  return inventory.map((cals) =>
    cals.reduce((sum, curr) => sum + parseInt(curr), 0),
  );
};

// O(n) :O
const fetchTop3 = (elfSum: number[]) => {
  return elfSum.reduce(
    (top3, curr) => {
      if (curr > top3[0]) {
        top3[2] = top3[1];
        top3[1] = top3[0];
        top3[0] = curr;
      } else if (curr > top3[1]) {
        top3[2] = top3[1];
        top3[1] = curr;
      } else if (curr > top3[2]) {
        top3[2] = curr;
      }
      return top3;
    },
    [0, 0, 0],
  );
};

const day1 = () => {
  const data = readFileSync('day-1/day1-input', 'utf8');

  /** Part 1 */
  const elfInventory: string[][] = parseInputToArray(data);
  const elfSum: number[] = sumInventory(elfInventory);
  const maxCalories = Math.max(...elfSum);
  console.log('Max calories: ', maxCalories);

  /** Part 2 */
  const top3: number[] = fetchTop3(elfSum);
  const top3Total = top3.reduce((total, curr) => total + curr, 0);
  console.log('Top 3 total: ', top3Total);
};

day1();
