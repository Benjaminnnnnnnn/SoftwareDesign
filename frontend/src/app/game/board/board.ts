import Hex from "./hex";
import { HexCoordinate } from "../types";

export default class Board {
  tiles: Map<string, Hex> = new Map(); // A map to store hex tiles, keyed by their IDs.
  size: number; // The size (radius) of the hexagonal board.

  constructor(size: number = 3) {
    this.size = size; 
    this.generateBoard();
  }
  // Generate hexagonal tiles and populate the board.
  private generateBoard() {
    for (let q = -this.size + 1; q < this.size; q++) {
      for (let r = -this.size + 1; r < this.size; r++) {
        // Only include tiles where the sum of q and r is within valid bounds.
        if (Math.abs(q + r) < this.size) {
          const tile = new Hex(q, r);
          this.tiles.set(tile.id, tile);
        }
      }
    }

    this.linkNeighbors(); // Link neighboring tiles.
  }
  // Link tiles to their neighbors based on hexagonal grid rules.
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
        const neighborId = `${tile.coord.q + q},${tile.coord.r + r}`; // Calculate neighbor ID.
        if (this.tiles.has(neighborId)) {
          tile.neighbors.push(this.tiles.get(neighborId)!);
        }
      });
    });
  }
    // Print a text-based representation of the board.
  public printBoard() {
    const sortedTiles = Array.from(this.tiles.values()).sort(
      (a, b) => a.coord.r - b.coord.r || a.coord.q - b.coord.q,
    );
    const rows: Map<number, Hex[]> = new Map();
    sortedTiles.forEach((tile) => {
      if (!rows.has(tile.coord.r)) {
        rows.set(tile.coord.r, []);
      }
      rows.get(tile.coord.r)!.push(tile); // Group tiles by row.
    });

    let rowIndex = 0;
    rows.forEach((row, r) => {
      const indent = " ".repeat((this.size - Math.abs(r)) * 3); // Indent rows for alignment.
      console.log(indent + row.map((tile) => `[${tile.id}]`).join("   ")); // Print the row.
      rowIndex++;
    });
  }
}


const b = new Board(3);
b.printBoard();