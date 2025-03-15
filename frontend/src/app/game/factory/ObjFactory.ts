import { DummyItem } from "../items";
import { DummyPiece, WarriorPiece, ArcherPiece } from "../pieces";
import Piece from "../pieces/piece";
import item from "../items/item";

export class ObjFactory {
  public producePiece(id: string, allied: boolean): Piece {
    let prodPiece: Piece;

    switch (id) {
      case "u001":
        prodPiece = new WarriorPiece(allied);
        break;
      case "u002":
        prodPiece = new ArcherPiece(allied);
        break;
      default:
        prodPiece = new DummyPiece(allied);
    }

    return prodPiece;
  }

  public produceItem(id: string, allied: boolean): item {
    let prodItem: item;

    switch (id) {
      default:
        prodItem = new DummyItem(allied);
    }

    return prodItem;
  }
}
