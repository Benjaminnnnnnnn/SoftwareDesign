import Hex from "./hex";
import { HexCoordinate, Stats } from "../types";
import React from "react";
import Piece from "../pieces/piece";
import { ObjFactory } from "../factory/ObjFactory";
import item from "../items/item";
import { Dispatch } from "redux";
import {
  setImHolding,
  setCurrency,
  setForceRerender,
} from "../../context/gameSlice";
import { UnknownAction } from "redux";

type setStateFunc = (func: React.SetStateAction<boolean>) => void; // define type for state functions

export default class Board {
  // responsible for the creation of the board
  tiles: Map<string, Hex> = new Map(); // A map to store hex tiles, keyed by their IDs.
  size: number; // The size (radius) of the hexagonal board.

  updateIPlaced: setStateFunc;
  dispatch: Dispatch;
  unitImHolding: Piece | undefined;
  itemImHolding: item | undefined;
  whereItsFrom: Hex | undefined;
  factory: ObjFactory;
  public movementHistory: {fromId: string, toId: string, piece: Piece | undefined}[] = [];

  constructor(
    size: number = 3,
    _updateIPlaced: setStateFunc,
    _dispatch: Dispatch<UnknownAction>,
  ) {
    this.size = size;
    this.generateBoard();
    this.updateIPlaced = _updateIPlaced;
    this.dispatch = _dispatch; // used to access game state
    this.unitImHolding = undefined;
    this.whereItsFrom = undefined;
    this.itemImHolding = undefined;
    this.factory = new ObjFactory();
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
      const indent = " ".repeat((this.size - Math.abs(r)) * 3); // Indent rows for alignment.x
      rowIndex++;
    });
  }

  // For when a piece is purchased , or created to be placed on the opponents side
  public createPiece(
    piece_id: string,
    target_id: string,
    allied: boolean,
    stats: Stats | undefined = undefined,
    item: string = "",
    override=false
  ) {
    if (allied && !override) {
      console.log("creating allied piece");
      console.log(piece_id);
      if (piece_id.startsWith("u")) {
        // if its a unit
        const newUnit = this.factory.producePiece(
          piece_id,
          allied,
          stats,
          item,
        );
        this.unitImHolding = newUnit;
        this.dispatch(setImHolding(true));
      } else if (piece_id.startsWith("i")) {
        // if its an item
        const newItem = this.factory.produceItem(piece_id, allied);
        this.itemImHolding = newItem;
        this.dispatch(setImHolding(true));
      }
    } else {
      if (allied && override) {
      const newPiece = this.factory.producePiece(piece_id, allied, stats, item);
      console.log("new piece:", newPiece);
      const target_tile = this.tiles.get(target_id);
        if (!target_tile) {
          console.log("target tile not found");
        } else {
          console.log("piece assigned to:", target_tile);
          target_tile.piece = newPiece;
          target_tile.piece.tile_id = target_id;
          this.updateIPlaced(true); // re-render board
        }} else 
      {
        console.log("creating enemy piece");
      const newPiece = this.factory.producePiece(piece_id, allied, stats, item);
      const target_tile = this.tiles.get(target_id);
      if (!target_tile) {
      } else {
        target_tile.piece = newPiece;
        target_tile.piece.tile_id = target_id;
        this.updateIPlaced(true); // re-render board
      }}
    }
  }

  // when an item is in hand and you want to give it to a unit
  private placeItem(target_id: string) {
    const target_tile = this.tiles.get(target_id);
    if (!target_tile || !target_tile.piece || this.itemImHolding == undefined) {
    } else {
      target_tile.piece.giveItem(this.itemImHolding);
      this.itemImHolding = undefined;
      this.updateIPlaced(true);
      this.dispatch(setImHolding(false));
    }
  }

  // when a unit is in hand and you want to place it on a tile
  private placeUnit(target_id: string) {
    const touched_tile = this.tiles.get(target_id);

    // Check if the piece can be placed
    if (
      this.unitImHolding == undefined ||
      !touched_tile ||
      touched_tile.piece
    ) {
      return;
    }
    // animate movement of piece
    touched_tile.piece = this.unitImHolding;
    touched_tile.piece.tile_id = target_id;
    // Clear the piece from its previous location
    if (this.whereItsFrom != undefined) {
      this.whereItsFrom.piece = undefined;
    }
    // Reset the holding state
    
    this.unitImHolding = undefined;
    this.whereItsFrom = undefined;
    this.dispatch(setImHolding(false));
    this.updateIPlaced(true);
  }

  // places piece in hand on given tile, if allowed
  private placePiece(target_id: string) {
    const touched_tile = this.tiles.get(target_id);
    if (
      this.itemImHolding != undefined &&
      touched_tile != undefined &&
      touched_tile.piece
    ) {
      this.placeItem(target_id);
    } else if (
      this.unitImHolding != undefined &&
      touched_tile != undefined &&
      !touched_tile.piece
    ) {
      this.placeUnit(target_id);
    }
  }

  // grabs unit from the selected tile
  private grabPiece(target_id: string) {
    // method for interaction
    const touched_tile = this.tiles.get(target_id);
    if (this.unitImHolding || !touched_tile || !touched_tile.piece) {
    }
    // if already holding a piece
    // if there is no touched tile
    // if there is no piece on the touched tile
    else {
      this.unitImHolding = touched_tile.piece;
      this.whereItsFrom = touched_tile;
      this.dispatch(setImHolding(true));
    }
  }

  // interacts with clicked tile, either grabs or places
  public interactWithTile(target_id: string) {
    const touched_tile = this.tiles.get(target_id);
    if (!touched_tile) {
    } else {
      if (touched_tile.piece && this.itemImHolding == undefined) {
        this.grabPiece(target_id);
      } else {
        this.placePiece(target_id);
      }
    }
  }
  // interacts with trash can, sells a piece ans updates your money if you are holding
  public interactWithTrash() {
    if (this.unitImHolding != undefined) {
      // if selling a piece
      this.dispatch(setCurrency(+1));
      // Clear the piece from its previous location
      if (this.whereItsFrom != undefined) {
        this.whereItsFrom.piece = undefined;
      }
      // Reset the holding state
      this.unitImHolding = undefined;
      this.whereItsFrom = undefined;
      this.dispatch(setImHolding(false));
      this.updateIPlaced(true);
    } else if (this.itemImHolding != undefined) {
      // if selling an item
      this.dispatch(setCurrency(+3));
      this.itemImHolding = undefined;
      this.dispatch(setImHolding(false));
    }
  }

  /**
   * Pre : A valid start and end hex ID
   * Post : The piece on the given start hex is moved to the given end hex
   */
  public move(start: string, end: string) {
    console.log("MOVEMENT",start, end);
    const moving_piece = this.tiles.get(start)?.piece;
    const target_hex = this.tiles.get(end);
    if (moving_piece && target_hex) {
      if (!target_hex.piece) {
        this.movementHistory.push({
          fromId: start,
          toId: end,
          piece: moving_piece,
      });
        target_hex.piece = moving_piece;
        moving_piece.tile_id = target_hex.id;
        const cleanup = this.tiles.get(start);
        if (cleanup) {
          cleanup.piece = undefined;
        }
      }
    }
  }

  /**
   * Pre : A valid board
   * Post : Remove all units for a fresh start
   */
  public wipe() {
    this.tiles.forEach((hex) => {
      hex.piece = undefined;
    })
  }
}
