import * as PIXI from "pixi.js";

export default abstract class Piece {
  id: string;
  cost: number;
  max_health: number;
  current_health: number;
  ad: number;
  range: number;
  speed: number;
  item_id?: string;
  allied: boolean;

  constructor(_allied: boolean) {
    this.id = "00";
    this.cost = 1;
    this.max_health = 1;
    this.current_health = this.max_health;
    this.ad = 1;
    this.range = 1;
    this.speed = 1;
    this.item_id = undefined;
    this.allied = _allied;
  }

  public abstract attack(): number;

  public abstract takeDamage(): void;

  public resetPiece(): void {
    this.current_health = this.max_health;
  }

  public abstract applyItemModifier(): number;

  public abstract getSprite(): Promise<PIXI.Sprite | null>;
}
