import Piece from "./piece";

// Ensure "export default" is used
export default class DummyPiece extends Piece {
  // TODO : Finish Implementation
  constructor(allied: boolean) {
    super(allied);
    this.id = "u000";
    this.max_health = 5;
    this.ad = 2;
    this.range = 1;
    this.speed = 1;
  }
}
