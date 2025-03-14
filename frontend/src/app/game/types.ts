import { Board } from "./board";
import item from "./items/item";
import * as PIXI from "pixi.js";
export type HexCoordinate = { q: number; r: number };

export enum States {
  Shop,
  Battle,
  Network,
}
export type state = {
  loggedin: boolean;
  current_user: string;
  current_boardstr: string;
  imBuying: boolean;
  pieceImBuying: string;
  current_game_stage: number;
  game_state: string;
  currency: number;
};

export interface IPiece {
  id: string;
  cost: number;
  max_health: number;
  current_health: number;
  ad: number;
  range: number;
  speed: number;
  allied: boolean;
  alive: boolean;

  attack(): number;

  takeDamage(damage: number): void;

  resetPiece(): void;

  giveItem(_item: item): void;

  getSprite(): Promise<PIXI.Sprite | null>;
}

export interface Iitem {
  id: string;
  cost: number;
  max_health_amp: number[];
  ad_amp: number[];
  range_amp: number[];
  speed_amp: number[];
  allied: boolean;
  getSprite(): Promise<PIXI.Sprite | null>;
}
