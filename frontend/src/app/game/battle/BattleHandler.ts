import { Board } from "../board";
import Piece from "../pieces/piece";
import { Hex } from "../board";
import { decodeStringToBoard } from "../codification";
import { fetchBoard } from "@/app/requests/requests";
import { CommandArgs, pieceAsObj } from "../types";
import { shuffleArray } from "./helperFunctions";
import { Stats, TargetInfo } from "../types";
import Command from "./Command";
import { Dispatch } from "redux";
import {
  setCurrentWins,
  setForceRerender,
  setCurrentLosses,
  setGameState,
} from "@/app/context/gameSlice";

export default class BattleHandler {
  boardReference: Board;
  pieces: Array<Piece>;
  commandStack: Array<Command>;
  dispatch: Dispatch;

  constructor(b: Board, dispatch: Dispatch) {
    this.boardReference = b;
    this.pieces = new Array<Piece>();
    this.commandStack = [];
    this.dispatch = dispatch;
  }

  /**
   * Pre : An unitialized board state
   * Post : Enemy Board is loaded, all valid pieces are in this.pieces and each piece has their initial target
   * @param stage
   */
  public async prepare(stage: number) {
    // get the opposing board string;
    this.pieces = new Array<Piece>();
    const enemyBoardString = await fetchBoard(stage);
    //const enemyBoardString = "#Q-1#R1#Iu001#H7#A3#R1#S1#M";
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
          //console.log(hex.piece, "Start Finding Target");
          const targeting: TargetInfo = this.findNearestEnemy(hex.piece);
          //console.log(hex.piece, "Found", targeting);
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
      if (
        node.piece &&
        node.piece.allied !== startPiece.allied &&
        node.piece.alive
      ) {
        Obj.target = node.piece;
        Obj.path = [...path.slice(1), node.id];
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
    setTimeout(() => {
      let f_alive = 0;
      let e_alive = 0;
      // remove pieces that died, and count the number of pieces on each side
      this.pieces = this.pieces.filter((p) => {
        if (p.alive) {
          if (p.allied) {
            f_alive++;
          } else {
            e_alive++;
          }
          return true; // Keep alive pieces
        } else if (p.current_health <= 0) {
          const tile = p.tile_id;
          if (tile) {
            const hex = this.boardReference.tiles.get(tile);
            if (hex) {
              hex.piece?.die(); // Let piece know it is dead
              //hex.piece = undefined; // board will do this
            }
          }
          return false; // Remove dead pieces
        }
        return p.alive; // Fallback (though the above conditions should cover all cases)
      });
      this.dispatch(setForceRerender(1));
      if (e_alive == 0) {
        this.dispatch(setForceRerender(1));
        setTimeout(() => {
          this.end(true);
        }, 1500);
        this.dispatch(setForceRerender(1));
        return;
      } else if (f_alive == 0) {
        this.dispatch(setForceRerender(1));
        setTimeout(() => {
          this.end(false);
        }, 1500);
        this.dispatch(setForceRerender(1));
        return;
      }
      this.fillCommandStack();
      while (this.commandStack.length > 0) {
        const currCommand = this.commandStack.pop();
        if (currCommand) {
          currCommand.exec();
        }
      }
      this.pieces.forEach((p) => {
        if (p.target?.alive == false) {
          p.target = undefined;
          p.path = [];
        }
      });

      this.run_combat_loop();
    }, 1500); // delay between combat
    // run recursivly
  }

  /**
   * Pre : Called on an empty command stack
   * Post : Will be filled with Commands for actions of every alive piece
   */
  private fillCommandStack() {
    // determine the command each piece will put onto the stack
    this.pieces.forEach((p) => {
      const nextCommand = this.determineAction(p);
      console.log("next", nextCommand);
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
    if (!piece.target || !piece.path || piece.path.length == 0) {
      const targeting = this.findNearestEnemy(piece);
      piece.target = targeting.target;
      piece.path = targeting.path;
    }
    if (piece.target && piece.path) {
      if (piece.range >= piece.path.length) {
        // returns a command contaiing an attack and a
        args = {
          type: "attack",
          from: piece,
          to: piece.target,
        };
        command = new Command(piece.attack, args);
      } else {
        args = {
          type: "move",
          board: this.boardReference,
          pieceToMove: piece,
        };
        command = new Command(this.boardReference.move, args);
      }
    }
    return command;
  }
  // cleanup function
  public end(win: boolean) {
    if (win) {
      this.dispatch(setCurrentWins(1));
    } else {
      this.dispatch(setCurrentLosses(1));
    }
    this.boardReference.wipe();
    this.dispatch(setGameState("CLEANUP"));
  }
}
