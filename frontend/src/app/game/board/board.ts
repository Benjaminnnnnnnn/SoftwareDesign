import Hex from "./hex";
import { HexCoordinate } from "../types";
import dummyPiece from "../pieces/dummyPiece";
import React from "react";
import Piece from "../pieces/piece";

type setStateFunc = (func: React.SetStateAction<boolean>) => void; // define type for state functions

export default class Board {
  tiles: Map<string, Hex> = new Map(); // A map to store hex tiles, keyed by their IDs.
  size: number; // The size (radius) of the hexagonal board.
  updateImHolding : setStateFunc;
  updateIPlaced : setStateFunc;
  imHolding : boolean;
  whatImHolding : Piece | undefined;
  whereItsFrom : Hex | undefined;
  


  constructor(size: number = 3, _updateImHolding: setStateFunc, _updateIPlaced: setStateFunc, _imHolding: boolean) { 
    this.size = size;
    this.generateBoard();
    this.updateImHolding = _updateImHolding;
    this.updateIPlaced = _updateIPlaced;
    this.imHolding = _imHolding;
    this.whatImHolding = undefined;
    this.whereItsFrom = undefined;

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

  // TODO: CREATE PIECE METHOD TO THAT USES FACTORY

  private placePiece(target_id: string ){
    // method for interaction
    const touched_tile = this.tiles.get(target_id);
    if(!this.imHolding || !touched_tile || !this.whereItsFrom || touched_tile.piece){} 
      // if user is not holding a piece 
      // if touched tile doesnt exist 
      // if theres already a piece 
      // if there is no info about where the piece is from
    else{
        touched_tile.piece = this.whatImHolding;
        this.whatImHolding = undefined;
        this.whereItsFrom.piece = undefined;
        this.whereItsFrom = undefined;
        this.updateImHolding(false)
        this.updateIPlaced(true)
          } 
        }
  private grabPiece(target_id: string){
    // method for interaction
    const touched_tile = this.tiles.get(target_id);
    if(this.imHolding || !touched_tile || !touched_tile.piece){} 
    // if already holding a piece 
    // if there is no touched tile 
    // if there is no piece on the touched tile
    else{
      this.updateImHolding(true);
      this.whatImHolding = touched_tile.piece;
      this.whereItsFrom = touched_tile;
      }
    }

  public interactWithTile(target_id: string){
    const touched_tile = this.tiles.get(target_id);
    if (!touched_tile){}
    else{
      if (!touched_tile.piece){
        this.placePiece(target_id);
      }
      else{
        this.grabPiece(target_id);
      }
    }
  }
}
