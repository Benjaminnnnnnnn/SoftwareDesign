import Piece from "../pieces/piece";
import { CommandArgs } from "../types";

export default class Command {
  func: Function;
  args: CommandArgs;

  constructor(_func: Function, _args: CommandArgs) {
    this.func = _func;
    this.args = _args;
  }

  public exec() {
    switch (this.args.type) {
      case "attack":
        this.func();
    }
  }
}
