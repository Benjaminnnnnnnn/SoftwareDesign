import Piece from "./piece";
import { statMasterList } from "./statMasterList";

// Ensure "export default" is used
export default class DummyPiece extends Piece {
  // TODO : Finish Implementation
  constructor(allied: boolean) {
    super(allied);
    this.id = "u000";
    const { max_health, ad, range, speed } = statMasterList[this.id];
    this.max_health = max_health;
    this.ad = ad;
    this.range = range;
    this.speed = speed;
  }
}
