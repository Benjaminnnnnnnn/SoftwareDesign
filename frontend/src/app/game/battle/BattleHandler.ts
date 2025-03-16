import { Board } from "../board";
import Piece from "../pieces/piece";
import { Hex } from "../board";
import { findNearestEnemy } from "./battleFunctions";
import { decodeStringToBoard } from "../codification";
import { fetchBoard } from "@/app/requests/requests";
import { pieceAsObj } from "../types";
import { ObjFactory } from "../factory/ObjFactory";

export default class BattleHandler {
  factory: ObjFactory;
  boardReference: Board;
  alliedPieces: Set<Piece>;
  enemyPieces: Set<Piece>;

  constructor(b: Board) {
    this.factory = new ObjFactory();
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

  // recieve an enemy board, and assign initial targets before commencing combat;
  public async start(stage: number) {
    // get the opposing board string;
    const enemyBoardString = await fetchBoard(stage);
    if (enemyBoardString) {
      const enemyBoardAsObjects = decodeStringToBoard(enemyBoardString, false);
      enemyBoardAsObjects.forEach((obj: pieceAsObj) => {
        this.boardReference.createPiece(
          obj.id,
          String(obj.q) + "," + String(obj.r),
          false,
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
