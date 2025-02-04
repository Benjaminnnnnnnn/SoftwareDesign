import Hex from './hex'

const directions = [
  { dq: 1, dr: 0 }, // Right
  { dq: 0, dr: 1 }, // Top-right
  { dq: -1, dr: 1 }, // Top-left
  { dq: -1, dr: 0 }, // Left
  { dq: 0, dr: -1 }, // Bottom-left
  { dq: 1, dr: -1 }, // Bottom-right
];

class Board {

  graph: Map<string, Hex>;
  size: number;

  constructor() {
    this.size = 19;
    this.graph = this.resetBoard(this.size);
  }

  public resetBoard(num=this.size) : Map<string, Hex> {

    const newBoard = new Map<string, Hex>();

    let q = 0;
    let r = 0;
    let generated_hexes = 0;
    let ring = 1;

    const middle_hex = new Hex(0, 0);

    newBoard.set(middle_hex.coord, middle_hex);
    
    while (num > generated_hexes) {

      directions.forEach(direction => {

      })
    }
    
    return newBoard;
  }
}