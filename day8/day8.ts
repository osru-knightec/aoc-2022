import { readFileSync } from 'fs';

const day8 = () => {
  const input = readFileSync('day8/day8-input', 'utf8');

  const visibleTrees = input
    .split('\n')
    .reduce((acc, line) => {
      return [...acc, line.split('').map(Number)];
    }, [] as number[][])
    .reduce((visibleTrees, row, colIndex, allTrees) => {
      const trees = row.filter((height, rowIndex) => {
        if (!row.slice(0, rowIndex).filter((n) => n >= height).length)
          return true;
        if (!row.slice(rowIndex + 1).filter((n) => n >= height).length)
          return true;
        if (
          !allTrees
            .slice(0, colIndex)
            .map((row) => row[rowIndex])
            .filter((n) => n >= height).length
        )
          return true;

        if (
          !allTrees
            .slice(colIndex + 1)
            .map((row) => row[rowIndex])
            .filter((n) => n >= height).length
        )
          return true;
        return false;
      });
      return [...visibleTrees, trees];
    }, [] as number[][]);

  const part1 = visibleTrees.reduce((acc, trees) => acc + trees.length, 0);
  console.log('Part 1: ', part1);

  /** Part 2 */
  const scenicScores = input
    .split('\n')
    .reduce((acc, line) => {
      return [...acc, line.split('').map(Number)];
    }, [] as number[][])
    .reduce((visibleTrees, row, colIndex, allTrees) => {
      const rowOfScores = row.map((height, rowIndex) => {
        if (rowIndex === 0 || rowIndex === row.length - 1) return 0;
        if (colIndex === 0 || colIndex === allTrees.length - 1) return 0;
        return (
          row
            .slice(0, rowIndex)
            .reverse()
            .reduce(
              (acc, n) => {
                // left
                if (!acc.continue) return acc;
                if (n >= height) {
                  return {
                    score: acc.score + 1,
                    continue: false,
                  };
                }
                return {
                  score: acc.score + 1,
                  continue: true,
                };
              },
              { score: 0, continue: true } as {
                score: number;
                continue: boolean;
              },
            ).score *
          row.slice(rowIndex + 1).reduce(
            (acc, n) => {
              // right
              if (!acc.continue) return acc;
              if (n >= height) {
                return {
                  score: acc.score + 1,
                  continue: false,
                };
              }
              return {
                score: acc.score + 1,
                continue: true,
              };
            },
            { score: 0, continue: true } as {
              score: number;
              continue: boolean;
            },
          ).score *
          allTrees
            .slice(0, colIndex)
            .map((row) => row[rowIndex])
            .reverse()
            .reduce(
              (acc, n) => {
                // up
                if (!acc.continue) return acc;
                if (n >= height) {
                  return {
                    score: acc.score + 1,
                    continue: false,
                  };
                }
                return {
                  score: acc.score + 1,
                  continue: true,
                };
              },
              { score: 0, continue: true } as {
                score: number;
                continue: boolean;
              },
            ).score *
          allTrees
            .slice(colIndex + 1)
            .map((row) => row[rowIndex])
            .reduce(
              (acc, n) => {
                // down
                if (!acc.continue) return acc;
                if (n >= height) {
                  return {
                    score: acc.score + 1,
                    continue: false,
                  };
                }
                return {
                  score: acc.score + 1,
                  continue: true,
                };
              },
              { score: 0, continue: true } as {
                score: number;
                continue: boolean;
              },
            ).score
        );
      });
      return [...visibleTrees, rowOfScores];
    }, [] as number[][])
    .reduce((acc, row) => {
      const rowSorted = row.sort((a, b) => b - a);
      return rowSorted[0] > acc ? rowSorted[0] : acc;
    }, 0);

  console.log('Part 2:', scenicScores);
};
day8();
