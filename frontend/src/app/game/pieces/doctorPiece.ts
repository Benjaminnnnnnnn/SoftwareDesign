import { Stats } from "../types";
import Piece from "./piece";
import { statMasterList } from "./statMasterList";
import item from "../items/item";

// Ensure "export default" is used
export default class DoctorPiece extends Piece {
  // TODO : Finish Implementation
  constructor(
    allied: boolean,
    stats: Stats | undefined,
    item: item | undefined,
  ) {
    super(allied);
    this.id = "u008";
    const { max_health, ad, range, speed } = stats
      ? stats
      : statMasterList[this.id];
    this.max_health = max_health;
    this.current_health = max_health;
    this.ad = ad;
    this.range = range;
    this.speed = speed;
    this.item = item;
  }

  public override attack() {
    if (this.target && this.tile_id) {
      if (this.ad + this.current_health > this.max_health) {
        this.current_health = this.max_health;
      } else {
        this.current_health += this.ad;
      }
      this.attackHistory.add(this.tile_id);
      this.target.takeDamage(this.ad);
    }
    console.log(this.target);
    // returns damage that will be deault
  }
}
