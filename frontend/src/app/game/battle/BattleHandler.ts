import { Board } from "../board";
import Piece from "../pieces/piece";
import { Hex } from "../board";
import { findNearestEnemy } from "./battleFunctions";
import { decodeStringToBoard } from "../codification";
import { fetchBoard } from "@/app/requests/requests";
import { pieceAsObj } from "../types";
import { Stats, TargetInfo } from "../types";



export default class BattleHandler {
  boardReference: Board;
  alliedPieces: Map<string, Piece>;
  enemyPieces: Map<string, Piece>;
  commandStack: Array<Function>;

  constructor(b: Board) {
    this.boardReference = b;
    this.alliedPieces = new Map<string, Piece>();
    this.enemyPieces = new Map<string, Piece>();
    this.commandStack = [];



  }

  // recieve an enemy board, and assign initial targets before commencing combat;
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
      // iterate through the board and then split pieces into two groups, also assign their initial targets
      this.boardReference.tiles.forEach((tile) => {
        if (tile.piece) {
          if (tile.piece.allied) {
            this.alliedPieces.set(tile.id, tile.piece);
            const {target, path} = this.assignTargets(tile, true);
            tile.piece.target = target;
            tile.piece.path = path;
          } else {
            this.enemyPieces.set(tile.id, tile.piece);
            const {target, path} = this.assignTargets(tile, false);
            tile.piece.target = target;
            tile.piece.path = path;
          }
        }
      });
    }
  }

  // assign targets for pieces.
  private assignTargets(h: Hex, allied: boolean): TargetInfo {
    return findNearestEnemy(h, allied);
  }

  public run() {}

  // vague but this will be the main driver
  private action() {}

  // cleanup function
  public end() {}
}
