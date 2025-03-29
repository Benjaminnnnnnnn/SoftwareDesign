import { Board } from "../board";
import Piece from "../pieces/piece";
import { Hex } from "../board";
import { decodeStringToBoard } from "../codification";
import { fetchBoard } from "@/app/requests/requests";
import { CommandArgs, pieceAsObj } from "../types";
import { shuffleArray } from "./helperFunctions";
import { Stats, TargetInfo } from "../types";
import Command from "./Command";

export default class BattleHandler {
  boardReference: Board;
  pieces: Array<Piece>;
  commandStack: Array<Command>;

  constructor(b: Board) {
    this.boardReference = b;
    this.pieces = [];
    this.commandStack = [];
  }

  /**
   * Pre : An unitialized board state
   * Post : Enemy Board is loaded, all valid pieces are in this.pieces and each piece has their initial target
   * @param stage
   */
  public async prepare(stage: number) {
    // get the opposing board string;
    const enemyBoardString = await fetchBoard(stage);
    if (enemyBoardString) {
      // Decode it to a list of objects
      const enemyBoardAsObjects = decodeStringToBoard(enemyBoardString, false);
      // Destructure each obj into it's attributes, then pass those attributes to the createPiece function which uses teh factory
      enemyBoardAsObjects.forEach((obj: pieceAsObj) => {
        const stats: Stats = {
          max_health: obj.max_health,
          ad: obj.ad,
          speed: obj.speed,
          range: obj.range,
        };
        this.boardReference.createPiece(
          obj.id,
          String(obj.q) + "," + String(obj.r),
          false,
          stats,
          obj.item,
        );
      });
      // iterate through the board and add all pieces on the board to a list.
      this.boardReference.tiles.forEach((hex) => {
        if (hex.piece) {
          // also set up their initial targets
          console.log(hex.piece, "Start Finding Target");
          const targeting: TargetInfo = this.findNearestEnemy(hex.piece);
          console.log(hex.piece, "Found", targeting);
          hex.piece.target = targeting.target;
          hex.piece.path = targeting.path;
          this.pieces.push(hex.piece);
        }
      });
    }
  }

  /*
  Pre : A valid piece on the board
  Post : that piece will now be targeting either nothing (undefined) or a valid opposing piece
  */
  private findNearestEnemy(startPiece: Piece): TargetInfo {
    let Obj: TargetInfo = {
      target: undefined,
      path: undefined,
    };
    if (!startPiece.tile_id) {
      return Obj;
    }

    // Setup for BFS
    const startingHex = this.boardReference.tiles.get(startPiece.tile_id);
    if (!startingHex) {
      return Obj;
    }

    const queue: Array<{ node: Hex; path: Array<string> }> = [
      { node: startingHex, path: [] },
    ];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { node, path } = queue.shift()!;

      // Skip if already visited
      if (visited.has(node.id)) {
        continue;
      }
      visited.add(node.id);

      // Check if this node contains an enemy piece
      if (node.piece && node.piece.allied !== startPiece.allied) {
        Obj.target = node.piece;
        Obj.path = [...path, node.id];
        return Obj; // Since BFS guarantees shortest path, return immediately
      }

      // Add neighbors to the queue
      node.neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor.id)) {
          queue.push({ node: neighbor, path: [...path, node.id] });
        }
      });
    }

    return Obj; // No enemy found
  }

  /**
   * Will run the whole battle
   */
  public run_combat_loop() {
    // remove dead pieces from combat
    let f_alive = 0;
    let e_alive = 0;
    for (let i = 0; i < this.pieces.length; i++) {
      if (!this.pieces[i].alive) {
        this.pieces.splice(i, 1);
        i--;
      } else {
        if (this.pieces[i].allied) {
          f_alive++;
        } else {
          e_alive++;
        }
      }
    }

    if (e_alive == 0) {
      // do actions related to winning
      return;
    } else if (f_alive == 0) {
      // actions related to losing
      return;
    }

    this.fillCommandStack();

    while (this.commandStack.length > 0) {
      const currCommand = this.commandStack.pop();
      if (currCommand) {
        currCommand.exec();
      }
    }

    // run recursivly
    this.run_combat_loop();
  }

  /**
   * Pre : Called on an empty command stack
   * Post : Will be filled with Commands for actions of every alive piece
   */
  private fillCommandStack() {
    // determine the command each piece will put onto the stack
    this.pieces.forEach((p) => {
      const nextCommand = this.determineAction(p);
      if (nextCommand != undefined) {
        this.commandStack.push(nextCommand);
      }
    });
    // randomize the order so it isn't alwasy the same
    shuffleArray(this.commandStack);
  }

  /**
   * Pre : A valid piece
   * Post : An action from the corrosponding piece to be added to the stack, or an invalid action being undefiend.
   * @param piece
   * @returns
   */
  private determineAction(piece: Piece): Command | undefined {
    let command: Command | undefined = undefined;
    let args: CommandArgs = {
      type: "base",
    };
    if (!piece.target) {
      this.findNearestEnemy(piece);
      // should also assign the move command
    } else if (piece.target && piece.path) {
      if (piece.range <= piece.path.length) {
        // returns a command contaiing an attack and a
        command = new Command(piece.attack, args);
      } else {
        // things to make a piece move
        //command = new Command();
      }
    }

    return command;
  }
  // cleanup function
  public end() {}
}
