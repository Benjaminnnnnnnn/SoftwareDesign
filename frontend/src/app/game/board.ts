import Hex from "./hex";

const directions = [
  { dq: 1, dr: 0 }, // Right
  { dq: -1, dr: 0 }, // Left
  { dq: 0, dr: 1 }, // Top-right
  { dq: 0, dr: -1 }, // Bottom-left
  { dq: 1, dr: -1 }, // Bottom-right
  { dq: -1, dr: 1 }, // Top-left
];

class Board {

  masterMap: Map<string, Hex>;
  size: number;

  constructor() {
    this.size = 19;
    this.masterMap = this.generateBoard(this.size);
  }

  public resetBoard() {
    this.masterMap = this.generateBoard(this.size);
  }

  private generateBoard(num: number): Map<string, Hex> {
    const newBoard = new Map<string, Hex>();
    let generatedHexes = 0;

    let q = 0;
    let r = 0;
    let ring = 1;
    let size = 0;
    let step = 1;

    while (generatedHexes < num) {
      for (let i = 0; i < step; i++) {
              q += directions[size].dq;
              r += directions[size].dr;
              newBoard.set(`${q}${r}`, new Hex);
              generatedHexes++;

              if (hexCount >= numHexes) break;
            }
    }

    return newBoard;
}
