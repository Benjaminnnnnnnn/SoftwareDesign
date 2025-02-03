import Hex from "./hex";

const directions = [
  { dq: 1, dr: 0 }, // Right
  { dq: -1, dr: 0 }, // Left
  { dq: 0, dr: 1 }, // Top-right
  { dq: 0, dr: -1 }, // Bottom-left
  { dq: 1, dr: -1 }, // Bottom-right
  { dq: -1, dr: 1 }, // Top-left
];

function generateBoard(num: number): Map<string, Hex> {
  const newBoard = new Map<string, Hex>();
  let generatedHexes = 0;

  let q = 0;
  let r = 0;
  let ring = 1;
  let step = 1;

  while (generatedHexes < num) {}

  return newBoard;
}
class Board {
  masterMap: Map<string, Hex>;
  constructor() {
    this.masterMap = generateBoard(19);
  }

  public resetBoard() {
    this.masterMap = generateBoard(19);
  }
}
