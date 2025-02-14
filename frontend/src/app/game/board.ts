import Hex from "./hex";
import { HexCoordinate } from "./types";

class Board {
  tiles: Map<string, Hex> = new Map();
  size: number;

  constructor(size: number = 3) {
    this.size = size;
    this.generateBoard();
  }

  private generateBoard() {
    for (let q = -this.size + 1; q < this.size; q++) {
      for (let r = -this.size + 1; r < this.size; r++) {
        if (Math.abs(q + r) < this.size) {
          const tile = new Hex(q, r);
          this.tiles.set(tile.id, tile);
        }
      }
    }

    this.linkNeighbors();
  }

  private linkNeighbors() {
    const directions: HexCoordinate[] = [
      { q: 1, r: 0 },
      { q: -1, r: 0 },
      { q: 0, r: 1 },
      { q: 0, r: -1 },
      { q: 1, r: -1 },
      { q: -1, r: 1 },
    ];

    this.tiles.forEach((tile) => {
      directions.forEach(({ q, r }) => {
        const neighborId = `${tile.coord.q + q},${tile.coord.r + r}`;
        if (this.tiles.has(neighborId)) {
          tile.neighbors.push(this.tiles.get(neighborId)!);
        }
      });
    });
  }

  public printBoard() {
    const sortedTiles = Array.from(this.tiles.values()).sort(
      (a, b) => a.coord.r - b.coord.r || a.coord.q - b.coord.q,
    );
    const rows: Map<number, Hex[]> = new Map();
    sortedTiles.forEach((tile) => {
      if (!rows.has(tile.coord.r)) {
        rows.set(tile.coord.r, []);
      }
      rows.get(tile.coord.r)!.push(tile);
    });

    let rowIndex = 0;
    rows.forEach((row, r) => {
      const indent = " ".repeat((this.size - Math.abs(r)) * 3);
      console.log(indent + row.map((tile) => `[${tile.id}]`).join("   "));
      rowIndex++;
    });
  }
}

const board = new Board(3);
board.printBoard();
