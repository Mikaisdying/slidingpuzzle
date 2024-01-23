class PuzzleNode {
    constructor(matrix, pos, parent = null, g = 0, h = 0) {
      this.matrix = matrix;
      this.pos = pos;
      this.parent = parent;
      this.g = g; // Cost from start to current node
      this.h = h; // Heuristic cost from current node to goal
    }
  
    get f() {
      return this.g + this.h; // Total cost
    }
  
    generateChildren() {
      const children = [];
      const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // Possible moves: right, left, down, up
  
      for (const [dx, dy] of directions) {
        const newX = this.pos.x + dx;
        const newY = this.pos.y + dy;
  
        if (this.isValid(newX, newY)) {
          const newMatrix = this.swap(this.pos.x, this.pos.y, newX, newY);
          const newPos = { x: newX, y: newY };
          const g = this.g + 1;
          const h = this.calculateHeuristic(newMatrix);
          const child = new PuzzleNode(newMatrix, newPos, this, g, h);
          children.push(child);
        }
      }
  
      return children;
    }
  
    isValid(x, y) {
      return x >= 0 && x < this.matrix.length && y >= 0 && y < this.matrix[0].length;
    }
  
    swap(x1, y1, x2, y2) {
      const newMatrix = this.copyMatrix();
      const temp = newMatrix[x1][y1];
      newMatrix[x1][y1] = newMatrix[x2][y2];
      newMatrix[x2][y2] = temp;
      return newMatrix;
    }
  
    copyMatrix() {
      return this.matrix.map(row => row.slice());
    }
  
    calculateHeuristic(matrix) {
      // You can use different heuristics here. This one calculates the Manhattan distance.
      let h = 0;
      const n = matrix.length;
  
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const value = matrix[i][j];
          const targetX = Math.floor((value - 1) / n);
          const targetY = (value - 1) % n;
          h += Math.abs(i - targetX) + Math.abs(j - targetY);
        }
      }
  
      return h;
    }
}
  
function solvePuzzle(defaultMatrix, currentMatrix, currentPos, gameSize) {
    console.log("On calculating...");
    const MAX_MOVES = 3000;
    const startNode = new PuzzleNode(currentMatrix, currentPos);
    const goalNode = new PuzzleNode(defaultMatrix, { x: gameSize - 1, y: gameSize - 1 });

    const openSet = [startNode];
    const closedSet = new Set();
    
    while (openSet.length > 0) {
        if (openSet.length >= MAX_MOVES){
          break;
        }
        openSet.sort((a, b) => a.f - b.f);
        const currentNode = openSet.shift();
        if (JSON.stringify(currentNode.matrix) === JSON.stringify(goalNode.matrix)) {
        // Puzzle is solved, reconstruct the path
            return getPath(currentNode);
        }

        closedSet.add(JSON.stringify(currentNode.matrix));

        const children = currentNode.generateChildren();
        for (const child of children) {
            const childKey = JSON.stringify(child.matrix);
            if (!closedSet.has(childKey) && !openSet.some(node => JSON.stringify(node.matrix) === childKey)
                && !openSet.length < MAX_MOVES) {
                openSet.push(child);
            }
        }
    }
    if (openSet.length > 0){
      const currentNode = openSet.shift();
      return getPath(currentNode);
    }
    console.log("Exceeded data")
    return null;
}

function getPath(currentNode){
  const path = [];
  let current = currentNode;
  while (current.parent !== null) {
      let parentPos = current.parent.pos;
      let currentPos = current.pos;

      if (parentPos.x < currentPos.x) {
          path.push('up');
      } else if (parentPos.x > currentPos.x) {
          path.push('down');
      } else if (parentPos.y < currentPos.y) {
          path.push('left');
      } else if (parentPos.y > currentPos.y) {
          path.push('right');
      }
      current = current.parent;
  }
  console.log("Find solution!")
  return path.reverse();
}

  