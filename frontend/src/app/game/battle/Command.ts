import Piece from "../pieces/piece";
import { AttackCommand, CommandArgs, MoveCommand } from "../types";

export default class Command {
  args: AttackCommand | MoveCommand;

  constructor(_func: Function, _args: AttackCommand | MoveCommand) {
    this.args = _args;
  }

  public exec() {
    console.log(this.args);
    switch (this.args.type) {
      case "attack":
        this.args.from.attack();
        break;
      case "move":
        // temp
        break;
      default:
        break;
    }
  }
}
