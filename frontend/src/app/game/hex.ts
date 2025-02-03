export default class Hex {
  row: Number;
  col: Number;
  edges: Map<string, Hex>;
  occupied: boolean;

  constructor(_row: Number, _col: Number, _edges: Hex[]) {
    this.row = _row;
    this.col = _col;
    this.occupied = false;
    this.edges = new Map<string, Hex>();
  }
}
