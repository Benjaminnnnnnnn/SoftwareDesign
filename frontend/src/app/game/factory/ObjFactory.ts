import { DummyItem } from "../items";
import { DummyPiece, WarriorPiece, ArcherPiece } from "../pieces";
import Piece from "../pieces/piece";
import item from "../items/item";
import { Stats } from "../types";

export class ObjFactory {
  public producePiece(
    id: string,
    allied: boolean,
    statpackage: Stats | undefined = undefined,
    itemstr: string = "",
  ): Piece {
    let prodPiece: Piece;
    let item: item | undefined = undefined;
    if (itemstr) {
      item = this.produceItem(itemstr, allied);
    }
    switch (id) {
      case "u001":
        prodPiece = new WarriorPiece(allied, statpackage, item);
        break;
      case "u002":
        prodPiece = new ArcherPiece(allied, statpackage, item);
        break;
      default:
        prodPiece = new DummyPiece(allied, statpackage, item);
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
