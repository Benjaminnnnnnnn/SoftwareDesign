import { Board } from "./board";
import item from "./items/item";
import * as PIXI from "pixi.js";
import { Hex } from "./board";
import Piece from "./pieces/piece";
import { Sprite } from "pixi.js";
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
  pre_combat_string: string;
  imBuying: boolean;
  pieceImBuying: string;
  current_game_stage: number;
  game_state: string;
  currency: number;
  imHolding: boolean;
  forceRerender: number;
  wins: number;
  losses: number;
  currentPieces: number;
  recentResult: string;
  currentTrophies: number;
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

  attack(): void;

  takeDamage(damage: number): void;

  resetPiece(): void;

  giveItem(_item: item): void;

  getSprite(): Promise<PIXI.Sprite | null>;
}

export interface IAnimate {
  // animation interface for pieces
  slideTo(x: number, y: number): Promise<void>;
  shake(): Promise<void>;
}

export interface IAnimatedPiece {
  getSprite(): Promise<{
  // interface for a animated piece
    sprite: Sprite,
    animate: IAnimate
  } | null>;
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

export type pieceAsObj = {
  q: number;
  r: number;
  id: string;
  max_health: number;
  ad: number;
  item: string | undefined;
  range: number;
  speed: number;
};

export type Stats = {
  max_health: number;
  ad: number;
  range: number;
  speed: number;
  level?: [number, number];
};

export type TargetInfo = {
  target?: Piece;
  path?: Array<string>;
};

interface BaseCommand {
  type: string;
}

// Specific command interfaces
export interface MoveCommand extends BaseCommand {
  type: "move";
  board: Board;
  pieceToMove: Piece;
}

export interface AttackCommand extends BaseCommand {
  type: "attack";
  from: Piece;
  to: Piece;
}

export type CommandArgs = MoveCommand | AttackCommand | BaseCommand;
