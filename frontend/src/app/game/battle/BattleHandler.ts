import { Board } from "../board";
import Piece from "../pieces/piece";
import { Hex } from "../board";
import { findNearestEnemy } from "./battleFunctions";

export default class BattleHandler {
  boardReference: Board;
  alliedPieces: Set<Piece>;
  enemyPieces: Set<Piece>;

  constructor(b: Board) {
    this.boardReference = b;
    this.alliedPieces = new Set<Piece>();
    this.enemyPieces = new Set<Piece>();

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

  public start() {}

  private assignTargets(h: Hex) {
    findNearestEnemy(h);
  }

  private actions() {}
}
