import * as PIXI from "pixi.js";

export class PieceRenderer {
  sprite: PIXI.Sprite;

  constructor(texture: PIXI.Texture, x: number, y: number) {
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(x, y);
  }
}