import item from "../items/item";
import { Stats } from "../types";
import Piece from "./piece";
import { statMasterList } from "./statMasterList";

// Ensure "export default" is used
export default class DummyPiece extends Piece {
  // TODO : Finish Implementation
  constructor(
    allied: boolean,
    stats: Stats | undefined,
    item: item | undefined,
  ) {
    super(allied);
    this.id = "u000";
    const { max_health, ad, range, speed } = stats
      ? stats
      : statMasterList[this.id];
    this.max_health = max_health;
    this.ad = ad;
    this.range = range;
    this.speed = speed;
    this.item = item;
  }
}
