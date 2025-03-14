import { DummyItem } from "../items";
import { DummyPiece, WarriorPiece, ArcherPiece } from "../pieces";
import { IPiece } from "../types";
import { Iitem } from "../types";

export class ObjFactory {
  public producePiece(id: string, allied: boolean): IPiece {
    let prodPiece: IPiece;

    switch (id) {
      case "u001":
        prodPiece = new WarriorPiece(allied);
      case "u002":
        prodPiece = new ArcherPiece(allied);
      default:
        prodPiece = new DummyPiece(allied);
    }

    return prodPiece;
  }

  public produceItem(id: string, allied: boolean): Iitem {
    let prodItem: Iitem;

    switch (id) {
      default:
        prodItem = new DummyItem(allied);
    }

    return prodItem;
  }
}
