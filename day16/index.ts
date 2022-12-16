import { readFileSync } from 'fs';
import { split } from 'lodash';

const input = readFileSync('day16/input', 'utf-8').trim().split('\n');
const RE =
  /^Valve (?<valve>[A-Z]{2}) has flow rate=(?<flow>\d+); tunnels? leads? to valves? (?<otherValves>.*)$/;

interface Valve {
  valve: string;
  flow: number;
  otherValves: string[];
  paths: { [key: string]: number };
}

interface Graph {
  [key: string]: Valve;
}

function bfs(graph: any, root: any) {
  const queue: any[] = [];
  root.paths = {};
  const explored = new Set();
  queue.push(root);
  explored.add(root.valve);

  while (queue.length) {
    const current = queue.shift();
    const neighbours = current.otherValves;
    neighbours.forEach((neighbour: string) => {
      if (!explored.has(neighbour)) {
        explored.add(neighbour);
        queue.push(graph[neighbour]);
        root.paths[neighbour] = (root.paths[current.valve] || 0) + 1;
      }
    });
  }
}

function getInput(): Graph {
  const array: Valve[] = input.map((line) => {
    const { valve, flow, otherValves }: any = line?.match(RE)?.groups as any;
    return {
      valve,
      flow: Number(flow),
      otherValves: otherValves ? otherValves.split(', ') : [],
      paths: {},
    };
  });

  const graph = Object.fromEntries(array.map((x) => [x.valve, x]));

  for (const node of array) {
    bfs(graph, node);
  }

  return graph;
}

function addFlow(graph: Graph, openValves: object) {
  let totalFlow = 0;
  for (const valve of Object.keys(openValves)) {
    totalFlow += graph[valve].flow;
  }
  return totalFlow;
}

const part1 = (t = 30) => {
  // const data: Valve = input
  //   .map((line) => RE.exec(line))
  //   .filter(Boolean)
  //   .reduce((acc, [, valve, flow, , , , tunnels]: any) => {
  //     const tunnelsArr = tunnels ? tunnels.split(', ') : [];
  //     return {
  //       ...acc,
  //       [valve]: { flow: Number(flow), tunnels: tunnelsArr, paths: {} },
  //     };
  //   }, {} as Valve);

  const time = t;
  const graph = getInput();
  const queue: any[] = [];
  const root = {
    node: 'AA',
    time,
    flow: 0,
    openValves: {},
  };
  queue.push(root);
  const possibles: { path: string[]; flow: number }[] = [];

  let maxFlow = 0;

  while (queue.length) {
    const current = queue.shift();

    if (current.time <= 0) {
      throw new Error('Should not happen');
    }

    const options = Object.values(graph).filter(
      (x) => x.flow > 0 && !current.openValves[x.valve],
    );
    if (options.length === 0) {
      const ending =
        current.flow + current.time * addFlow(graph, current.openValves);
      if (ending > maxFlow) {
        maxFlow = ending;
      }
    }

    for (const { valve } of options) {
      const steps = graph[current.node].paths[valve] + 1;
      if (current.time - steps <= 0) {
        const ending =
          current.flow + current.time * addFlow(graph, current.openValves);
        possibles.push({
          path: [...Object.keys(current.openValves), current.node],
          flow: ending,
        });
        if (ending > maxFlow) {
          maxFlow = ending;
        }
      } else {
        queue.push({
          node: valve,
          time: current.time - steps,
          flow: current.flow + steps * addFlow(graph, current.openValves),
          openValves: {
            ...current.openValves,
            [valve]: current.time - steps,
          },
        });
      }
    }
  }

  return { possibles: possibles.sort((a, b) => b.flow - a.flow), maxFlow };
};

const part2 = () => {
  const { possibles } = part1(26);
  console.log(possibles[0].flow, possibles.length);
  let max = 0;
  // this needs some memoization / speed-up / rethinking. Runs approx for 2 minutes ;/
  for (let i = 0; i < possibles.length; i++)
    for (let j = i + 1; j < possibles.length; j++)
      if (possibles[i].path.every((s) => !possibles[j].path.includes(s)))
        if (possibles[i].flow + possibles[j].flow > max) {
          console.log(
            'we have a new p2 max',
            possibles[i].flow + possibles[j].flow,
          );
          max = possibles[i].flow + possibles[j].flow;
        }
  console.log(max);
};

console.log(part1().maxFlow);
part2();
