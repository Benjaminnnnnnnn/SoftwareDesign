import Piece from "./piece";

// Ensure "export default" is used
export default class ArcherPiece extends Piece {
  // TODO : Finish Implementation
  constructor(allied: boolean) {
    super(allied);
    this.id = "u002";
    this.max_health = 4;
    this.ad = 4;
    this.range = 2;
    this.speed = 1;
  }
}
