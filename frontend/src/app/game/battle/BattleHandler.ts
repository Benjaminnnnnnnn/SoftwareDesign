import { Board } from "../board";
import Piece from "../pieces/piece";
import { Hex } from "../board";
import { decodeStringToBoard } from "../codification";
import { fetchBoard } from "@/app/requests/requests";
import { CommandArgs, pieceAsObj } from "../types";
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
          const targeting : TargetInfo = this.findNearestEnemy(hex.piece);
          hex.piece.target = targeting.target;
          hex.piece.path = targeting.path;
          this.pieces.push(hex.piece);
        }
      })
  }
  }

  /*
  Pre : A valid piece on the board
  Post : that piece will now be targeting either nothing (undefined) or a valid opposing piece
  */
  private findNearestEnemy(startPiece: Piece) : TargetInfo {
    // This should return the path to the nearest enemy as well as the enemy

    let Obj: TargetInfo = {
      target: undefined,
      path: undefined,
    }
    if (!startPiece.tile_id) {
      return Obj
    }

    // setup for the dfs
    const visited = new Set<string>();
    const startingHex = this.boardReference.tiles.get(startPiece.tile_id);
    if (!startingHex) {
        return Obj;
      }
    let lowest = 99999;

  
    function dfs(node: Hex, depth: Array<string>) {
      // if we have already visited this node or it is further than the shortest length already found then stop recurring
      if (visited.has(node.id) || depth.length > lowest) {
        return;
      }
      // add the current node to the lsit of visited
      visited.add(node.id);
      // if the current node has a piece, and it has the opposite "allied" than the starting piece
      if (node.piece && (node.piece.allied !== startPiece.allied)) {
        // if it's actually closer then update it
        if (depth.length < lowest) {
          lowest = depth.length;
          Obj.target = node.piece;
          Obj.path = depth;
        }
      }
      // repeat for every adjacent node with tail recursion
      node.neighbors.forEach((v) => {
        dfs(v, [...depth, node.id]);
      });
    }
    
    // start the recursion
    dfs(startingHex, []);
    return Obj;
  }

  public run() {
    // fill the action stack

  }

  // vague but this will be the main driver
  private action() {

  }

  /**
   * Pre : Called on an empty command stack
   * Post : Willbe filled with Commands for actions of every alive piece
   */
  private fillCommandStack() {}

  /**
   * Pre : A valid piece
   * Post : An action from the corrosponding piece to be added to the stack, or an invalid action being undefiend.
   * @param piece 
   * @returns 
   */
  private determineAction(piece: Piece) : Command | undefined {
    let command: Command | undefined = undefined;
    let args: CommandArgs;
    if (piece.target && piece.path) {
      if (piece.range <= piece.path.length) {
        // returns a command contaiing an attack and a
          command = new Command(piece.attack);
      }
      else {
        command = new Command
      }
    }

    return command;
  }
  // cleanup function
  public end() {}
}
