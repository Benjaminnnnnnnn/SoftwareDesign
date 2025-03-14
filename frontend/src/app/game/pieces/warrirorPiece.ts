import Piece from "./piece";

// Ensure "export default" is used
export default class WarriorPiece extends Piece {
  // TODO : Finish Implementation
  constructor(allied: boolean) {
    super(allied);
    this.id = "u001";
    this.max_health = 7;
    this.ad = 3;
    this.range = 1;
    this.speed = 1;
  }
}
