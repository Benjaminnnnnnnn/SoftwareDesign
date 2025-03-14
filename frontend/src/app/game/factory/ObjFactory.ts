import DummyItem from "../items/dummyItem";
import DummyPiece from "../pieces/dummyPiece";
import { IPiece } from "../types";
import { Iitem } from "../types";

class ObjFactory {
  public producePiece(id: string, allied: boolean): IPiece {
    let prodPiece: IPiece;

    switch (id) {
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
