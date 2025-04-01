import { DummyPiece, WarriorPiece, ArcherPiece, NinjaPiece, MummyPiece, GlitterPiece, DudePiece } from "../pieces";
import { DummyItem, CaterpillarItem, ButterflyItem, GunItem } from "../items";
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
      case "u003":
        prodPiece = new NinjaPiece(allied, statpackage, item);
        break;
      case "u004":
        prodPiece = new MummyPiece(allied, statpackage, item);
        break;
      case "u005":
        prodPiece = new GlitterPiece(allied, statpackage, item);
        break;
      case "u006":
        prodPiece = new DudePiece(allied, statpackage, item);
        break;
      default:
        prodPiece = new DummyPiece(allied, statpackage, item);
    }
    return prodPiece;
  }

  public produceItem(id: string, allied: boolean): item {
    let prodItem: item;

    switch (id) {
      case "i001":
        prodItem = new CaterpillarItem(allied);
        break;
      case "i002":
        prodItem = new ButterflyItem(allied);
        break;
      case "i003":
        prodItem = new GunItem(allied);
        break;
      default:
        prodItem = new DummyItem(allied);
    }

    return prodItem;
  }
}
