import { readFileSync } from 'fs';

//helper class for PriorityQueue
class Node {
  val: any;
  priority: any;
  constructor(val: any, priority: any) {
    this.val = val;
    this.priority = priority;
  }
}

class PriorityQueue {
  values: any[];
  constructor() {
    this.values = [];
  }
  enqueue(val: string, priority: number) {
    const newNode = new Node(val, priority);
    this.values.push(newNode);
    this.bubbleUp();
  }
  bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.values[parentIdx];
      if (element.priority >= parent.priority) break;
      this.values[parentIdx] = element;
      this.values[idx] = parent;
      idx = parentIdx;
    }
  }
  dequeue() {
    const min = this.values[0];
    const end = this.values.pop();
    if (this.values.length > 0) {
      this.values[0] = end;
      this.sinkDown();
    }
    return min;
  }
  sinkDown() {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const leftChildIdx = 2 * idx + 1;
      const rightChildIdx = 2 * idx + 2;
      let leftChild: any, rightChild: any;
      let swap: any = null;

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swap = leftChildIdx;
        }
      }
      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          (swap === null && rightChild.priority < element.priority) ||
          (swap !== null && rightChild.priority < leftChild.priority)
        ) {
          swap = rightChildIdx;
        }
      }
      if (swap === null) break;
      this.values[idx] = this.values[swap];
      this.values[swap] = element;
      idx = swap;
    }
  }
}

//Dijkstra's algorithm only works on a weighted graph.

class WeightedGraph {
  adjacencyList: any;
  constructor() {
    this.adjacencyList = {};
  }
  addVertex(vertex: any) {
    if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
  }
  addEdge(vertex1: any, vertex2: any, weight: any) {
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    // this.adjacencyList[vertex2].push({ node: vertex1, weight });
  }
  Dijkstra(start: any, finish: any) {
    const nodes = new PriorityQueue();
    const distances: any = {};
    const previous: any = {};
    const path: any = []; //to return at end
    let smallest: any;
    //build up initial state
    for (const vertex in this.adjacencyList) {
      if (vertex === start) {
        distances[vertex] = 0;
        nodes.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
        nodes.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
    }
    // as long as there is something to visit
    while (nodes.values.length) {
      smallest = nodes.dequeue().val;
      if (smallest === finish) {
        //WE ARE DONE
        //BUILD UP PATH TO RETURN AT END
        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }
        break;
      }
      if (smallest || distances[smallest] !== Infinity) {
        for (const neighbor in this.adjacencyList[smallest]) {
          //find neighboring node
          const nextNode: any = this.adjacencyList[smallest][neighbor];
          //calculate new distance to neighboring node
          const candidate: any = distances[smallest] + nextNode.weight;
          const nextNeighbor: any = nextNode.node;
          if (candidate < distances[nextNeighbor]) {
            //updating new smallest distance to neighbor
            distances[nextNeighbor] = candidate;
            //updating previous - How we got to neighbor
            previous[nextNeighbor] = smallest;
            //enqueue in priority queue with new priority
            nodes.enqueue(nextNeighbor, candidate);
          }
        }
      }
    }
    return path.concat(smallest).reverse();
  }
}


// Compare if char a is bigger than char b
const charComp = (a:string, b:string) => {
  console.log(a.charCodeAt(0), b.charCodeAt(0), a.charCodeAt(0) - b.charCodeAt(0) + 1)
  return a.charCodeAt(0) - b.charCodeAt(0) + 1;
}


const day12 = () => {
  const input = readFileSync('day12/day12-input', 'utf8').split('\n').map((line) => line.replace(/\n|\r/g, '').split(''));
  let start = "";
  let end = "";
  console.log(input)
  const graph = new WeightedGraph();
  input.map((row, rowI) => {
    row.map((col, colI) => {
      graph.addVertex(`${rowI}-${colI}`);
      if (col === 'S'){
        start = `${rowI}-${colI}`;
        col = 'a';
      }
      if (col === 'E') {
        end = `${rowI}-${colI}`;
        col = 'z';
      }
      if (input[rowI-1] && charComp(col, input[rowI-1][colI])) {
        graph.addEdge(`${rowI}-${colI}`, `${rowI-1}-${colI}`, 1);
      }
      if (input[rowI+1] && charComp(col, input[rowI+1][colI])) {
        graph.addEdge(`${rowI}-${colI}`, `${rowI+1}-${colI}`, 1);
      }
      if (input[rowI][colI-1] && charComp(col, input[rowI][colI-1])) {
        graph.addEdge(`${rowI}-${colI}`, `${rowI}-${colI-1}`, 1);
      }
      if (input[rowI][colI+1] && charComp(col, input[rowI][colI+1])) {
        graph.addEdge(`${rowI}-${colI}`, `${rowI}-${colI+1}`, 1);
      }
    });
  })

  console.log(start, end, graph.adjacencyList, graph.Dijkstra(start, end));
}
day12();