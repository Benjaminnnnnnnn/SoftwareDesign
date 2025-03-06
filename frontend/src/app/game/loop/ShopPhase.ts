import Phase from "./Phase";
import { States } from "../types";

export default class ShopPhase extends Phase {
  flies: number;
  //ShopObj: Shop;

  constructor() {
    super();
    this.flies = 10;
  }

  nextPhase(): States {
    return States.Network;
  }

  start() {}

  update() {}

  end() {}
}
