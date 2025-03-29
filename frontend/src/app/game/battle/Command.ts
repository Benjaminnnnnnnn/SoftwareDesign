import Piece from "../pieces/piece";
import { CommandArgs } from "../types";

export default class Command {
    func: Function;
    args: CommandArgs; 

    constructor(_func: Function, _target: Piece) {
        this.func = _func;
        this.args = {
            type: "base"
        };
    }

    public exec() {
        this.func(this.args);
    }
}