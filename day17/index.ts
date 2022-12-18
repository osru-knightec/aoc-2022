import { readFileSync } from 'fs';
import { slice } from 'lodash';

enum Direction {
  Left = '<',
  Right = '>',
  Down = 'v',
}
const input: Direction[] = readFileSync('day17/input', 'utf-8')
  .trim()
  .split('')
  .flatMap((x) => [x as Direction, Direction.Down]);

type Shape = boolean[][];
interface Rock {
  x: number;
  y: number;
  height: number;
  width: number;
  shape: Shape;
}

const rocks: Rock[] = [
  {
    x: 3,
    y: 0,
    height: 1,
    width: 4,
    shape: [[true, true, true, true]], // ####
  },
  {
    x: 3,
    y: 0,
    height: 3,
    width: 3,
    shape: [
      [false, true, false], // .#.
      [true, true, true], // ###
      [false, true, false], // .#.
    ],
  },
  {
    x: 3,
    y: 0,
    height: 3,
    width: 3,
    shape: [
      [false, false, true], // ..#
      [false, false, true], // ..#
      [true, true, true], // ###
    ],
  },
  {
    x: 3,
    y: 0,
    height: 4,
    width: 1,
    shape: [
      [true], // #
      [true], // #
      [true], // #
      [true], // #
    ],
  },
  {
    x: 3,
    y: 0,
    height: 2,
    width: 2,
    shape: [
      [true, true], // ##
      [true, true], // ##
    ],
  },
];

const collides = (rock: Rock, board: boolean[][], dir: Direction): boolean => {
  const { x, y, height, width, shape } = rock;
  const { Left, Right, Down } = Direction;
  if (dir === Left) {
    for (let yi = 0; yi < height; yi++) {
      for (let xi = 0; xi < width; xi++) {
        if (shape[yi][xi] && board[y + yi][x + xi - 1]) {
          return true;
        }
      }
    }
  } else if (dir === Right) {
    for (let yi = 0; yi < height; yi++) {
      for (let xi = 0; xi < width; xi++) {
        if (shape[yi][xi] && board[y + yi][x + xi + 1]) {
          return true;
        }
      }
    }
  } else if (dir === Down) {
    for (let yi = 0; yi < height; yi++) {
      for (let xi = 0; xi < width; xi++) {
        if (shape[yi][xi] && board[y + yi + 1][x + xi]) {
          return true;
        }
      }
    }
  }
  return false;
};

const printBoard = (board: boolean[][], currRock: Rock) => {
  //Print board and insert currRock at its position
  const { x, y, height, width, shape } = currRock;
  const boardCopy = board.map((row) => row.map((x) => x));
  for (let yi = 0; yi < height; yi++) {
    for (let xi = 0; xi < width; xi++) {
      if (shape[yi][xi]) {
        boardCopy[y + yi][x + xi] = shape[yi][xi];
      }
    }
  }
  console.log(
    boardCopy
      .slice(0, 5)
      .map((row) => row.map((x) => (x ? '#' : ' ')).join(''))
      .join('\n'),
  );
  console.log();
};

const promiseTimeout = (ms: number) =>
  new Promise(
    (resolve) => setTimeout(() => resolve(true), ms),
    // Resolve on key input
    // (resolve) => process.stdin.once('data', () => resolve(true)),
  );

const part1 = async () => {
  let currRockIndex = 0;

  const board: boolean[][] = [
    [true, false, false, false, false, false, false, false, true],
    [true, false, false, false, false, false, false, false, true],
    [true, false, false, false, false, false, false, false, true],
    [true, false, false, false, false, false, false, false, true],
    [true, true, true, true, true, true, true, true, true, true],
  ];
  let currRock = Object.assign({}, rocks[currRockIndex]);
  let resting = false;

  const secLength = input.length * rocks.length * 7;
  for (let i = 0; currRockIndex !== secLength; i++) {
    if (resting) {
      // Place rock in board
      for (let yi = 0; yi < currRock.height; yi++) {
        for (let xi = 0; xi < currRock.width; xi++) {
          if (currRock.shape[yi][xi]) {
            board[currRock.y + yi][currRock.x + xi] = true;
          }
        }
      }
      // Get next rock
      currRockIndex++;
      currRock = Object.assign({}, rocks[currRockIndex % rocks.length]);
      const above = 3 + currRock.height;
      const emptyRows = board.findIndex(
        (row) => row.reduce((acc, curr) => (curr ? acc + 1 : acc), 0) > 2,
      );
      const addRows = above - emptyRows;
      if (addRows > 0) {
        for (let i = 0; i < addRows; i++) {
          board.unshift([true, ...Array(7).fill(false), true]);
        }
      } else if (addRows < 0) {
        for (let i = 0; i < -addRows; i++) {
          board.shift();
        }
      }
      resting = false;
    }

    const dir = input[i % input.length];
    if (collides(currRock, board, dir)) {
      if (dir === Direction.Down) {
        resting = true;
      }
    } else {
      if (dir === Direction.Left) {
        currRock.x--;
      } else if (dir === Direction.Right) {
        currRock.x++;
      } else if (dir === Direction.Down) {
        currRock.y++;
      }
    }

    //printBoard(board, currRock);
    //console.log(dir);
    //await promiseTimeout(100);
  }
  const towerHeight =
    board.length -
    board.findIndex(
      (row) => row.reduce((acc, curr) => (curr ? acc + 1 : acc), 0) > 2,
    ) -
    1;
  console.log(towerHeight, currRockIndex);
};
//part1();

const part2 = async () => {
  let seqTotal = 0;
  let spareHeight = 0;
  const tries = 6;
  for (let j = 1; j <= 10000; j++) {
    seqTotal = 0;
    spareHeight = 0;
    console.log('Testing...', j);
    const patternItem: boolean[][] = [];
    for (let y = 1; y <= tries; y++) {
      let currRockIndex = 0;

      let board: boolean[][] = [
        [true, false, false, false, false, false, false, false, true],
        [true, false, false, false, false, false, false, false, true],
        [true, false, false, false, false, false, false, false, true],
        [true, false, false, false, false, false, false, false, true],
        [true, true, true, true, true, true, true, true, true],
      ];
      let currRock = Object.assign({}, rocks[currRockIndex]);
      let resting = false;
      let slicedHeight = 0;
      let seqHeight = 0;
      let secLength = input.length * j * y;
      if (y === tries) {
        secLength = 1000000000000 % (input.length * j * y);
      }

      for (let i = 0; currRockIndex !== secLength; i++) {
        const dir = input[i % input.length];
        if (collides(currRock, board, dir)) {
          if (dir === Direction.Down) {
            resting = true;
          }
        } else {
          if (dir === Direction.Left) {
            currRock.x--;
          } else if (dir === Direction.Right) {
            currRock.x++;
          } else if (dir === Direction.Down) {
            currRock.y++;
          }
        }
        if (resting) {
          // Place rock in board
          for (let yi = 0; yi < currRock.height; yi++) {
            for (let xi = 0; xi < currRock.width; xi++) {
              if (currRock.shape[yi][xi]) {
                board[currRock.y + yi][currRock.x + xi] = true;
              }
            }
          }
          // Get next rock
          currRockIndex++;
          if (currRockIndex === secLength) {
            const h =
              board.length -
              board.findIndex(
                (row) =>
                  row.reduce((acc, curr) => (curr ? acc + 1 : acc), 0) > 2,
              ) -
              1;
            seqHeight = h + slicedHeight;
          }
          currRock = Object.assign({}, rocks[currRockIndex % rocks.length]);
          const above = 3 + currRock.height;
          const emptyRows = board.findIndex(
            (row) => row.reduce((acc, curr) => (curr ? acc + 1 : acc), 0) > 2,
          );
          const addRows = above - emptyRows;
          if (addRows > 0) {
            for (let i = 0; i < addRows; i++) {
              board.unshift([true, ...Array(5).fill(false), true]);
            }
          } else if (addRows < 0) {
            for (let i = 0; i < -addRows; i++) {
              board.shift();
            }
          }

          const bottomReachedPerCol = [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
          ];

          let maxDepth = 0;
          maxDepth = board.findIndex((row, i) => row.every((col) => col));
          maxDepth = maxDepth < board.length - 1 ? maxDepth : board.length;
          const sliced = board.length - maxDepth;
          if (sliced > 0) {
            slicedHeight += sliced;
            board = board.slice(0, maxDepth + 1);
          }
          resting = false;
        }
      }
      //printBoard(board, currRock);
      const towerHeight =
        board.length -
        board.findIndex(
          (row) => row.reduce((acc, curr) => (curr ? acc + 1 : acc), 0) > 2,
        ) -
        1;
      patternItem.push(board.at(6) as boolean[]);
      if (y === tries - 1) {
        seqTotal = seqHeight * Math.floor(1000000000000 / secLength);
      } else {
        spareHeight = seqHeight;
      }
      //printBoard(board, currRock);
    }
    if (
      patternItem
        .slice(0, tries - 1)
        .every(
          (row) =>
            row.every(
              (col: boolean, i: number) => patternItem?.[0].at(i) === col,
            ) && row.filter((col) => col).length >= 2,
        )
    ) {
      console.log('FOUND IT!', j);
      break;
    }
  }
  console.log(seqTotal + spareHeight);
};
part2();
