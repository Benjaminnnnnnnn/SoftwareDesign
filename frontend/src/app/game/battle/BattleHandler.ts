import { Board } from "../board";
import Piece from "../pieces/piece";
import { Hex } from "../board";
import { findNearestEnemy } from "./battleFunctions";
import { decodeStringToBoard } from "../codification";
import { fetchBoard } from "@/app/requests/requests";
import { pieceAsObj } from "../types";
import { ObjFactory } from "../factory/ObjFactory";
import { Stats } from "../types";

export default class BattleHandler {
  boardReference: Board;
  alliedPieces: Set<Piece>;
  enemyPieces: Set<Piece>;
  commandStack: Array<Function>;

  constructor(b: Board) {
    this.boardReference = b;
    this.alliedPieces = new Set<Piece>();
    this.enemyPieces = new Set<Piece>();
    this.commandStack = [];

    // iterate through the board and then split pieces into two groups
    this.boardReference.tiles.forEach((tile) => {
      if (tile.piece) {
        if (tile.piece.allied) {
          this.alliedPieces.add(tile.piece);
        } else {
          this.enemyPieces.add(tile.piece);
        }
      }
    });
  }

  // recieve an enemy board, and assign initial targets before commencing combat;
  public async start(stage: number) {
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
    }
  }

  // assign targets for pieces.
  private assignTargets(h: Hex) {
    findNearestEnemy(h);
  }

  public run() {}

  // vague but this will be the main driver
  private actions() {}

  // cleanup function
  public end() {}
}
