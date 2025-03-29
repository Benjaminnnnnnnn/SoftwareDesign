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
        if (this.args.pieceToMove?.path && this.args.pieceToMove.tile_id) {
          this.args.board.move(
            this.args.pieceToMove.tile_id,
            this.args.pieceToMove.path[0],
          );
          this.args.pieceToMove.path = this.args.pieceToMove.path.slice(1);
        }

        break;
      default:
        break;
    }
  }
}
