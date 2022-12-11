import { readFileSync } from 'fs';

interface Game {
  opponent: number;
  move: number;
  outcome: Outcome;
}

interface Game2 {
  opponent: number;
  outcome: number;
}

type Outcome = 'win' | 'lose' | 'draw';

const evaluateOutcome = (opponent: number, myMove: number): Outcome => {
  if (opponent === myMove) return 'draw';
  opponent += 1;
  if (opponent > 3) opponent = 1;
  if (opponent === myMove) return 'win';
  return 'lose';
};

const parseMoveToNumber = (move: string): number => {
  if (move === 'A' || move === 'X') return 1;
  if (move === 'B' || move === 'Y') return 2;
  if (move === 'C' || move === 'Z') return 3;
  return 0;
};

const day2 = () => {
  const data = readFileSync('day02/day2-input', 'utf8').trimEnd();

  /** Part 1 */
  const games: Game[] = data.split('\n').map((line) => {
    const opponent = parseMoveToNumber(line.split(' ')[0]);
    const myMove = parseMoveToNumber(line.split(' ')[1]);
    return {
      opponent: opponent,
      move: myMove,
      outcome: evaluateOutcome(opponent, myMove),
    };
  });

  const totalScore = games.reduce(
    (acc, game) =>
      acc +
      game.move +
      (game.outcome === 'win' ? 6 : game.outcome === 'draw' ? 3 : 0),
    0,
  );

  console.log('Part1: ', totalScore);

  /** Part 2 */
  const games2: Game2[] = data.split('\n').map((line) => {
    const opponent = parseMoveToNumber(line.split(' ')[0]);
    const outcome = line.split(' ')[1];

    return {
      opponent: opponent,
      outcome: (parseMoveToNumber(outcome) - 1) * 3,
    };
  });

  const totalScore2 = games2.reduce((acc, game) => {
    let score = 0;
    if (game.outcome === 0)
      score = game.opponent - 1 === 0 ? 3 : game.opponent - 1;
    if (game.outcome === 6)
      score = game.opponent + 1 === 4 ? 1 : game.opponent + 1;
    if (game.outcome === 3) score = game.opponent;
    return acc + score + game.outcome;
  }, 0);

  console.log('Part 2: ', totalScore2);
};

day2();
