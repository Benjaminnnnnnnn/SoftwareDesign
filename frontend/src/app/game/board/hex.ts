import Piece from "../pieces/piece";
import { HexCoordinate } from "../types";

export default class Hex {
  id: string;
  coord: HexCoordinate;
  piece?: Piece;
  neighbors: Hex[];

  constructor(q: number, r: number) {
    this.coord = { q, r };
    this.id = `${q},${r}`;
    this.piece = undefined;
    this.neighbors = [];
  }
}
