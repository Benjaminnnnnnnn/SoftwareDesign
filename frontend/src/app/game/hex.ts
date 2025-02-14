import Piece from "./piece";
import { HexCoordinate } from "./types";

export default class Hex {
  id: string;
  coord: HexCoordinate;
  peice?: Piece;
  neighbors: Hex[];

  constructor(q: number, r: number) {
    this.coord = { q, r };
    this.id = `${q},${r}`;
    this.peice = undefined;
    this.neighbors = [];
  }
}
